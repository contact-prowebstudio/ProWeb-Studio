'use client';
// src/three/HelixKnot.tsx
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

type Props = {
  color?: string;
  speed?: number;
};

export default function HelixKnot({ color = '#8b5cf6', speed = 0.25 }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  const geom = useMemo(
    () => new THREE.TorusKnotGeometry(0.95, 0.22, 220, 32, 2, 3),
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.35;
  });

  return (
    <mesh ref={ref} geometry={geom} position={[0, 0, 0.1]}>
      <MeshTransmissionMaterial
        transmission={1}
        thickness={0.8}
        roughness={0.18}
        anisotropy={0.2}
        chromaticAberration={0.015}
        distortion={0.06}
        distortionScale={0.4}
        temporalDistortion={0.1}
        ior={1.28}
        attenuationColor={color}
        attenuationDistance={1.15}
        samples={8}
        backside
      />
    </mesh>
  );
}
