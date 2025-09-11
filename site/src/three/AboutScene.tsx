'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import HelixKnot from '@/three/HelixKnot';
import ParallaxRig from '@/three/ParallaxRig';
import StarsShell from '@/three/StarsShell';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function Scene() {
  const reduced = useReducedMotion();
  
  return (
    <>
      <ParallaxRig factor={reduced ? 0.05 : 0.14}>
        <group scale={1.2} position={[0, 0, 0]}>
          <HelixKnot color="#a78bfa" speed={reduced ? 0.1 : 0.25} />
        </group>
        <StarsShell count={reduced ? 400 : 800} radius={10} opacity={0.4} size={0.005} />
      </ParallaxRig>

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#22d3ee" />
      <fog attach="fog" args={['#0a0b14', 10, 25]} />
    </>
  )
}

export default function AboutScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 45, position: [0, 0, 8] }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
