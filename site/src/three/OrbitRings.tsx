'use client';
// src/three/OrbitRings.tsx
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type Props = { rings?: number; min?: number; max?: number; speed?: number };

export default function OrbitRings({
  rings = 7,
  min = 1.6,
  max = 3.6,
  speed = 0.12,
}: Props) {
  const group = useRef<THREE.Group>(null!);
  const radii = useMemo(
    () =>
      Array.from(
        { length: rings },
        (_, i) => min + (i / (rings - 1)) * (max - min),
      ),
    [rings, min, max],
  );
  const geoms = useMemo(
    () =>
      radii.map(
        (r) => new THREE.TorusGeometry(r, 0.005 + Math.random() * 0.01, 8, 180),
      ),
    [radii],
  );
  const mats = useMemo(
    () =>
      radii.map(
        (_, i) =>
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.62 + i * 0.02, 0.8, 0.7),
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
      ),
    [radii],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * speed * 0.4;
    group.current.rotation.y += delta * speed * 0.25;
  });

  return (
    <group ref={group}>
      {geoms.map((g, i) => (
        <mesh
          key={i}
          geometry={g}
          material={mats[i]}
          rotation={[
            Math.random() * 0.2,
            Math.random() * 0.2,
            Math.random() * 0.2,
          ]}
        />
      ))}
    </group>
  );
}
