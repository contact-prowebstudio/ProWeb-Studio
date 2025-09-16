'use client';

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  isLowEndDevice: boolean;
  isHighPerformanceDevice: boolean;
  connectionType: string;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  preferReducedMotion: boolean;
}

interface OptimizedSettings {
  dpr: [number, number];
  cameraFov: number;
  enableShadows: boolean;
  particleCount: number;
  enablePostProcessing: boolean;
  bloomIntensity: number;
  maxLights: number;
  shadowMapSize: number;
  antialias: boolean;
  effectsQuality: 'low' | 'medium' | 'high';
}

/**
 * Comprehensive hook for detecting device capabilities and providing
 * optimized Three.js settings for mobile, tablet, and desktop devices.
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1,
    hardwareConcurrency: 4,
    deviceMemory: 4,
    isLowEndDevice: false,
    isHighPerformanceDevice: true,
    connectionType: '4g',
    supportsWebGL2: true,
    maxTextureSize: 4096,
    preferReducedMotion: false,
  });

  const [optimizedSettings, setOptimizedSettings] = useState<OptimizedSettings>({
    dpr: [1, 2],
    cameraFov: 50,
    enableShadows: true,
    particleCount: 1000,
    enablePostProcessing: true,
    bloomIntensity: 1.0,
    maxLights: 6,
    shadowMapSize: 2048,
    antialias: true,
    effectsQuality: 'high',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectCapabilities = async () => {
      // Screen dimensions and basic device detection
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Device type detection
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;

      // Hardware capabilities
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      // @ts-expect-error - deviceMemory is experimental but widely supported
      const deviceMemory = navigator.deviceMemory || 4;

      // Connection detection
      // @ts-expect-error - connection is experimental
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || '4g';

      // WebGL capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const supportsWebGL2 = !!canvas.getContext('webgl2');
      const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048;

      // Performance heuristics
      const isLowEndDevice = 
        isMobile && (
          deviceMemory < 4 || 
          hardwareConcurrency < 4 || 
          connectionType === '2g' || 
          connectionType === 'slow-2g' ||
          !supportsWebGL2
        );

      const isHighPerformanceDevice = 
        isDesktop && 
        deviceMemory >= 8 && 
        hardwareConcurrency >= 8 && 
        maxTextureSize >= 8192;

      // Motion preference
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const detectedCapabilities: DeviceCapabilities = {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        screenHeight,
        devicePixelRatio,
        hardwareConcurrency,
        deviceMemory,
        isLowEndDevice,
        isHighPerformanceDevice,
        connectionType,
        supportsWebGL2,
        maxTextureSize,
        preferReducedMotion,
      };

      setCapabilities(detectedCapabilities);

      // Generate optimized settings based on capabilities
      const settings = generateOptimizedSettings(detectedCapabilities);
      setOptimizedSettings(settings);
    };

    // Initial detection
    detectCapabilities();

    // Re-detect on resize
    const handleResize = () => {
      detectCapabilities();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { capabilities, optimizedSettings };
}

/**
 * Generate optimized Three.js settings based on device capabilities
 */
function generateOptimizedSettings(capabilities: DeviceCapabilities): OptimizedSettings {
  const {
    isMobile,
    isTablet,
    isLowEndDevice,
    isHighPerformanceDevice,
    connectionType,
    supportsWebGL2,
    preferReducedMotion,
    deviceMemory,
  } = capabilities;

  // Base settings for different device types
  if (isLowEndDevice || preferReducedMotion) {
    return {
      dpr: [1, 1],
      cameraFov: 65,
      enableShadows: false,
      particleCount: 200,
      enablePostProcessing: false,
      bloomIntensity: 0.3,
      maxLights: 2,
      shadowMapSize: 256,
      antialias: false,
      effectsQuality: 'low',
    };
  }

  if (isMobile) {
    return {
      dpr: [1, 1.5],
      cameraFov: 60,
      enableShadows: deviceMemory >= 4 && supportsWebGL2,
      particleCount: deviceMemory >= 6 ? 500 : 300,
      enablePostProcessing: deviceMemory >= 4 && connectionType !== '2g',
      bloomIntensity: 0.6,
      maxLights: deviceMemory >= 6 ? 4 : 3,
      shadowMapSize: supportsWebGL2 ? 1024 : 512,
      antialias: deviceMemory >= 4,
      effectsQuality: deviceMemory >= 6 ? 'medium' : 'low',
    };
  }

  if (isTablet) {
    return {
      dpr: [1, 1.8],
      cameraFov: 55,
      enableShadows: true,
      particleCount: 750,
      enablePostProcessing: true,
      bloomIntensity: 0.8,
      maxLights: 5,
      shadowMapSize: 1024,
      antialias: true,
      effectsQuality: 'medium',
    };
  }

  if (isHighPerformanceDevice) {
    return {
      dpr: [1, 2.5],
      cameraFov: 45,
      enableShadows: true,
      particleCount: 2000,
      enablePostProcessing: true,
      bloomIntensity: 1.2,
      maxLights: 8,
      shadowMapSize: 4096,
      antialias: true,
      effectsQuality: 'high',
    };
  }

  // Desktop default
  return {
    dpr: [1, 2],
    cameraFov: 50,
    enableShadows: true,
    particleCount: 1000,
    enablePostProcessing: true,
    bloomIntensity: 1.0,
    maxLights: 6,
    shadowMapSize: 2048,
    antialias: true,
    effectsQuality: 'high',
  };
}

/**
 * Simplified hook for just checking if device is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Utility function to get optimized particle count based on device
 */
export function getOptimizedParticleCount(baseCount: number, capabilities?: DeviceCapabilities) {
  if (!capabilities) {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? baseCount * 0.5 : baseCount;
  }

  const { isMobile, isLowEndDevice, deviceMemory } = capabilities;

  if (isLowEndDevice) return Math.round(baseCount * 0.2);
  if (isMobile) {
    if (deviceMemory >= 6) return Math.round(baseCount * 0.6);
    return Math.round(baseCount * 0.4);
  }
  
  return baseCount;
}

/**
 * Utility function to get optimized lighting count based on device
 */
export function getOptimizedLightCount(maxLights: number, capabilities?: DeviceCapabilities) {
  if (!capabilities) {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(maxLights, 3) : maxLights;
  }

  const { isMobile, isLowEndDevice, deviceMemory } = capabilities;

  if (isLowEndDevice) return Math.min(maxLights, 2);
  if (isMobile) return Math.min(maxLights, deviceMemory >= 6 ? 4 : 3);
  
  return maxLights;
}