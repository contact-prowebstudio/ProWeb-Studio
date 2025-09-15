'use client';
// src/three/CrystalLogo.tsx
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type CrystalProps = {
  tint?: string;
  roughness?: number;
  thickness?: number;
  rotationSpeed?: number;
};

export function CrystalLogo({
  tint = '#a78bfa',
  roughness = 0.2,
  thickness = 0.6,
  rotationSpeed = 0.25,
}: CrystalProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const geom = useMemo(() => new THREE.IcosahedronGeometry(1.1, 1), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * rotationSpeed;
    ref.current.rotation.x += delta * (rotationSpeed * 0.4);
  });

  return (
    <mesh ref={ref} geometry={geom} position={[0, 0, 0.2]}>
      <MeshTransmissionMaterial
        backside
        samples={8}
        transmission={1}
        roughness={roughness}
        thickness={thickness}
        chromaticAberration={0.02}
        anisotropy={0.2}
        distortion={0.08}
        distortionScale={0.4}
        temporalDistortion={0.2}
        ior={1.3}
        attenuationDistance={1.2}
        attenuationColor={tint}
      />
    </mesh>
  );
}
