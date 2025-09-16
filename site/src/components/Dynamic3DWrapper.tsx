'use client';

import { Suspense, lazy, useEffect, useState, useRef, createContext, useContext } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import usePerformanceMonitor, { type PerformanceState } from '../hooks/usePerformanceMonitor';

// Performance context for sharing performance state across components
const PerformanceContext = createContext<PerformanceState | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface DeviceCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  performanceTier: 'low' | 'medium' | 'high';
  gpuTier: 'low' | 'medium' | 'high';
  deviceMemory: number;
  hardwareConcurrency: number;
  maxTextureSize: number;
  batteryLevel?: number;
  thermalState?: 'nominal' | 'fair' | 'serious' | 'critical';
}

interface Dynamic3DWrapperProps {
  children: React.ReactNode;
  variant?: 'hero' | 'scene' | 'canvas';
  className?: string;
  enablePerformanceMonitoring?: boolean;
  onDeviceCapabilities?: (capabilities: DeviceCapabilities) => void;
}

// Lazy load Three.js components only when needed
const Scene3D = lazy(() => import('./Scene3D'));

// Device detection utilities
function detectMobileDevice(): { isMobile: boolean; isIOS: boolean; isAndroid: boolean } {
  if (typeof window === 'undefined') return { isMobile: false, isIOS: false, isAndroid: false };
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                   window.innerWidth <= 768;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  return { isMobile, isIOS, isAndroid };
}

function detectGPUCapabilities(): Promise<{ gpuTier: 'low' | 'medium' | 'high'; maxTextureSize: number }> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!gl) {
      resolve({ gpuTier: 'low', maxTextureSize: 512 });
      return;
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string : '';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    
    // GPU tier detection based on renderer and capabilities
    let gpuTier: 'low' | 'medium' | 'high' = 'medium';
    
    const lowEndGPUs = [
      'PowerVR', 'Mali-400', 'Mali-450', 'Adreno 200', 'Adreno 203', 'Adreno 205',
      'Intel HD Graphics 3000', 'Intel HD Graphics 4000'
    ];
    
    const highEndGPUs = [
      'Adreno 6', 'Adreno 7', 'Mali-G7', 'Mali-G5', 'Apple A15', 'Apple A14', 'Apple A13',
      'GeForce RTX', 'GeForce GTX 1060', 'Radeon RX 5', 'Radeon RX 6'
    ];
    
    if (lowEndGPUs.some(gpu => renderer.includes(gpu))) {
      gpuTier = 'low';
    } else if (highEndGPUs.some(gpu => renderer.includes(gpu))) {
      gpuTier = 'high';
    }
    
    // Additional checks
    if (maxTextureSize < 2048) gpuTier = 'low';
    if (maxTextureSize >= 8192) gpuTier = 'high';
    
    resolve({ gpuTier, maxTextureSize });
  });
}

async function getBatteryInfo(): Promise<{ batteryLevel?: number; thermalState?: 'nominal' | 'fair' | 'serious' | 'critical' }> {
  try {
    // @ts-expect-error - Battery API is experimental
    const battery = await navigator.getBattery?.();
    const batteryLevel = battery?.level ? Math.round(battery.level * 100) : undefined;
    
    // Thermal state detection (iOS only)
    let thermalState: 'nominal' | 'fair' | 'serious' | 'critical' | undefined;
    // @ts-expect-error - Thermal API is iOS only
    if (navigator.thermalState) {
      // @ts-expect-error - thermalState API is iOS only, type definitions not available
      thermalState = navigator.thermalState;
    }
    
    return { batteryLevel, thermalState };
  } catch {
    return {};
  }
}

function getPerformanceTier(
  hardwareConcurrency: number,
  deviceMemory: number,
  gpuTier: 'low' | 'medium' | 'high',
  isMobile: boolean
): 'low' | 'medium' | 'high' {
  if (isMobile) {
    if (gpuTier === 'low' || hardwareConcurrency < 4 || deviceMemory < 4) return 'low';
    if (gpuTier === 'high' && hardwareConcurrency >= 6 && deviceMemory >= 6) return 'high';
    return 'medium';
  }
  
  if (gpuTier === 'low' || hardwareConcurrency < 4 || deviceMemory < 8) return 'low';
  if (gpuTier === 'high' && hardwareConcurrency >= 8 && deviceMemory >= 16) return 'high';
  return 'medium';
}

export default function Dynamic3DWrapper({ 
  children, 
  variant = 'scene',
  className = '',
  enablePerformanceMonitoring = true,
  onDeviceCapabilities
}: Dynamic3DWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [progressiveEnhancement, setProgressiveEnhancement] = useState(false);
  
  // Initialize performance monitoring
  const performanceState = usePerformanceMonitor(enablePerformanceMonitoring, 30, 60);
  
  const enhancementTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced device detection
  useEffect(() => {
    setIsMounted(true);
    
    async function detectCapabilities() {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      const hasWebGLSupport = !!gl;
      setHasWebGL(hasWebGLSupport);
      
      if (!hasWebGLSupport) return;
      
      // Device detection
      const { isMobile, isIOS, isAndroid } = detectMobileDevice();
      
      // GPU capabilities
      const { gpuTier, maxTextureSize } = await detectGPUCapabilities();
      
      // System info
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      // @ts-expect-error - deviceMemory is experimental
      const deviceMemory = navigator.deviceMemory || 4;
      
      // Battery and thermal info
      const { batteryLevel, thermalState } = await getBatteryInfo();
      
      // Performance tier
      const performanceTier = getPerformanceTier(hardwareConcurrency, deviceMemory, gpuTier, isMobile);
      
      const capabilities: DeviceCapabilities = {
        isMobile,
        isIOS,
        isAndroid,
        performanceTier,
        gpuTier,
        deviceMemory,
        hardwareConcurrency,
        maxTextureSize,
        batteryLevel,
        thermalState
      };
      
      setDeviceCapabilities(capabilities);
      onDeviceCapabilities?.(capabilities);
      
      // Enhanced decision logic for 3D rendering
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lowBattery = batteryLevel !== undefined && batteryLevel < 20;
      const thermalThrottling = thermalState === 'serious' || thermalState === 'critical';
      
      const shouldEnable = hasWebGLSupport && 
                          !prefersReducedMotion && 
                          !lowBattery && 
                          !thermalThrottling &&
                          performanceTier !== 'low';
      
      setShouldRender3D(shouldEnable);
    }
    
    detectCapabilities();
  }, [onDeviceCapabilities]);

  // Progressive enhancement: start with basic scene, add effects based on performance
  useEffect(() => {
    if (!shouldRender3D || !deviceCapabilities) return;
    
    // Start with basic scene immediately
    setProgressiveEnhancement(false);
    
    // Use requestIdleCallback for non-critical enhancements
    const scheduleEnhancement = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Wait for initial performance stabilization
          if (performanceState.metrics.fps > 35) {
            setProgressiveEnhancement(true);
          }
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        enhancementTimeoutRef.current = setTimeout(() => {
          if (performanceState.metrics.fps > 35) {
            setProgressiveEnhancement(true);
          }
        }, 1000);
      }
    };
    
    // Delay enhancement to let basic scene stabilize
    const initialDelay = setTimeout(scheduleEnhancement, 500);
    
    return () => {
      clearTimeout(initialDelay);
      if (enhancementTimeoutRef.current) {
        clearTimeout(enhancementTimeoutRef.current);
      }
    };
  }, [shouldRender3D, deviceCapabilities, performanceState.metrics.fps]);

  // Monitor performance and adjust progressive enhancement
  useEffect(() => {
    if (!enablePerformanceMonitoring || !shouldRender3D) return;
    
    // If performance drops significantly, disable enhancements
    if (performanceState.metrics.fps < 25 && progressiveEnhancement) {
      console.log('Performance degraded, disabling enhancements');
      setProgressiveEnhancement(false);
    }
    
    // Re-enable enhancements if performance improves and stabilizes
    if (performanceState.metrics.fps > 40 && !progressiveEnhancement && performanceState.qualityLevel !== 'low') {
      console.log('Performance improved, re-enabling enhancements');
      setProgressiveEnhancement(true);
    }
  }, [performanceState.metrics.fps, performanceState.qualityLevel, progressiveEnhancement, enablePerformanceMonitoring, shouldRender3D]);

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
        <div className="text-center p-6 sm:p-7 md:p-8">
          <p className="text-gray-400">
            {!hasWebGL ? 'WebGL is not supported on this device' : '3D content is disabled due to performance or accessibility settings'}
          </p>
          <p className="text-sm text-gray-500 mt-2">3D content has been disabled</p>
        </div>
      </div>
    );
  }

  return (
    <PerformanceContext.Provider value={performanceState}>
      <ThreeErrorBoundary variant={variant}>
        <Suspense fallback={<LoadingSkeleton variant={variant} className={className} />}>
          <Scene3D>
            {children}
          </Scene3D>
        </Suspense>
      </ThreeErrorBoundary>
    </PerformanceContext.Provider>
  );
}
