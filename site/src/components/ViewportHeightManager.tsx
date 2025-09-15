'use client';

import { useEffect } from 'react';

export default function ViewportHeightManager() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Debounced version to prevent excessive calls and reflow loops
    const debouncedSetVH = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setVH, 100);
    };

    // Set initial value
    setVH();

    // Update on resize and orientation change with debouncing
    window.addEventListener('resize', debouncedSetVH);
    window.addEventListener('orientationchange', debouncedSetVH);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedSetVH);
      window.removeEventListener('orientationchange', debouncedSetVH);
    };
  }, []);

  return null; // This component doesn't render anything
}