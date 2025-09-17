'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  adaptive?: boolean; // enable AdaptiveDpr & PerformanceMonitor (defaults to true)
}

export default function Scene3D({ children, className, adaptive = true }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={className || "absolute inset-0"}>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance' 
        }}
        camera={{ 
          position: [0, 0, 6], 
          fov: 50, 
          near: 0.1, 
          far: 100 
        }}
        onCreated={(state) => {
          // Set transparent clear color
          state.gl.setClearColor('#000000', 0);
        }}
      >
        <Suspense fallback={null}>
          {children}
          {adaptive && <AdaptiveDpr />}
          {adaptive && <PerformanceMonitor />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
