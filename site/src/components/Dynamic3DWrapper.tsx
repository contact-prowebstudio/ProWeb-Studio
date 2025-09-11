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
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGLSupport = !!gl;
    setHasWebGL(hasWebGLSupport);
    
    // Check user preference and device capabilities
    const enabled = localStorage.getItem('3d-enabled') !== 'false';
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIs3DEnabled(enabled && hasWebGLSupport && !prefersReducedMotion && !isLowEndDevice);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !is3DEnabled) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('three')) {
          console.log(`3D Performance: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, [is3DEnabled, enablePerformanceMonitoring]);

  if (!isMounted) {
    return <LoadingSkeleton variant={variant} className={className} />;
  }

  if (!hasWebGL) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}>
        <div className="text-center p-8">
          <p className="text-gray-400">WebGL is not supported on this device</p>
          <p className="text-sm text-gray-500 mt-2">3D content has been disabled</p>
        </div>
      </div>
    );
  }

  if (!is3DEnabled) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}>
        <div className="text-center p-8">
          <p className="text-gray-400">3D content is disabled</p>
          <button
            onClick={() => {
              localStorage.setItem('3d-enabled', 'true');
              setIs3DEnabled(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Enable 3D Content
          </button>
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
