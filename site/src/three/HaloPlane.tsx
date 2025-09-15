'use client';
// src/three/HaloPlane.tsx
import * as THREE from 'three';
import { useMemo } from 'react';

export default function HaloPlane() {
  const geom = useMemo(() => new THREE.PlaneGeometry(8, 8, 2, 2), []);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#a78bfa'),
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  return <mesh geometry={geom} material={mat} position={[0, 0, -0.6]} />;
}
