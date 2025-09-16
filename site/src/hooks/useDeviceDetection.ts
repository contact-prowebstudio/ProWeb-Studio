'use client';

import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  pixelRatio: number;
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'unknown';
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    pixelRatio: 1,
    screenSize: 'unknown'
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window;
      
      setDeviceInfo({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        hasTouch,
        pixelRatio: window.devicePixelRatio || 1,
        screenSize: width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceInfo;
}