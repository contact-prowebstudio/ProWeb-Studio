'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';

interface Scene3DProps {
  children: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={(state) => {
          // Ensure canvas is properly initialized
          state.gl.setClearColor('#000000', 0);
        }}
      >
        <Suspense fallback={null}>
          {children}
          <AdaptiveDpr pixelated />
          <PerformanceMonitor />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
