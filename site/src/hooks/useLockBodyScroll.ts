'use client';
import { useEffect } from 'react';

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    
    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevTouch = style.touchAction;
    
    style.overflow = 'hidden';
    style.touchAction = 'none';
    document.documentElement.classList.add('overflow-hidden');
    
    return () => {
      style.overflow = prevOverflow;
      style.touchAction = prevTouch;
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [locked]);
}