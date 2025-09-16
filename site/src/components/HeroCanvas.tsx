'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

type Props = { children: React.ReactNode; className?: string };

export default function HeroCanvas({ children, className }: Props) {
  const { optimizedSettings } = useDeviceCapabilities();

  return (
    <div
      className={className ?? ''}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        frameloop="always"
        dpr={optimizedSettings.dpr}
        gl={{
          antialias: optimizedSettings.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ 
          position: [0, 0, 6], 
          fov: optimizedSettings.cameraFov 
        }}
        performance={{ min: 0.5 }}
        shadows={optimizedSettings.enableShadows}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Fully transparent background
          
          // Optimize shadow map settings for mobile
          if (optimizedSettings.enableShadows) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
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
