'use client';
// src/three/ParallaxRig.tsx
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type Props = { children: React.ReactNode; factor?: number };

export default function ParallaxRig({ children, factor = 0.18 }: Props) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * factor,
      0.06,
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -pointer.y * factor,
      0.06,
    );
  });
  return <group ref={ref}>{children}</group>;
}
