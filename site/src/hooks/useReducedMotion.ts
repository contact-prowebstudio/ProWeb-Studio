'use client';
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(m.matches);
    handler();
    m.addEventListener?.('change', handler);
    return () => m.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}
