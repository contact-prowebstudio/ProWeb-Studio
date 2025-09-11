'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import ThreeErrorBoundary from './ThreeErrorBoundary';

interface Dynamic3DWrapperProps {
  children: React.ReactNode;
  variant?: 'hero' | 'scene' | 'canvas';
  className?: string;
  enablePerformanceMonitoring?: boolean;
}

// Lazy load Three.js components only when needed
const Scene3D = lazy(() => import('./Scene3D'));

export default function Dynamic3DWrapper({ 
  children, 
  variant = 'scene',
  className = '',
  enablePerformanceMonitoring = true
}: Dynamic3DWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGLSupport = !!gl;
    setHasWebGL(hasWebGLSupport);
    
    // Check device capabilities and user preferences
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Always enable 3D when WebGL is supported, unless user prefers reduced motion or low-end device
    setShouldRender3D(hasWebGLSupport && !prefersReducedMotion && !isLowEndDevice);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !shouldRender3D) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('three')) {
          console.log(`3D Performance: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, [shouldRender3D, enablePerformanceMonitoring]);

  if (!isMounted) {
    return <LoadingSkeleton variant={variant} className={className} />;
  }

  if (!hasWebGL || !shouldRender3D) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}>
        <div className="text-center p-8">
          <p className="text-gray-400">
            {!hasWebGL ? 'WebGL is not supported on this device' : '3D content is disabled due to performance or accessibility settings'}
          </p>
          <p className="text-sm text-gray-500 mt-2">3D content has been disabled</p>
        </div>
      </div>
    );
  }

  return (
    <ThreeErrorBoundary variant={variant}>
      <Suspense fallback={<LoadingSkeleton variant={variant} className={className} />}>
        <Scene3D>
          {children}
        </Scene3D>
      </Suspense>
    </ThreeErrorBoundary>
  );
}
