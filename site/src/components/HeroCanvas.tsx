'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';

type Props = { children: React.ReactNode; className?: string };

export default function HeroCanvas({ children, className }: Props) {
  return (
    <div
      className={className ?? ''}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        frameloop="always"
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Fully transparent background
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
