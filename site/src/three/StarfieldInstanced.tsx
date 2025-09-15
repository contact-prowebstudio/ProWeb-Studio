'use client';
// src/three/StarfieldInstanced.tsx
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

type StarfieldProps = {
  count?: number;
  radius?: number;
  opacity?: number;
};

export function StarfieldInstanced({
  count = 1200,
  radius = 14,
  opacity = 0.75,
}: StarfieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color('#b0eaff'), []);
  const geom = useMemo(() => new THREE.SphereGeometry(0.03, 6, 6), []);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    [color, opacity],
  );

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * (0.6 + Math.random() * 0.4);
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
      dummy.scale.setScalar(0.6 + Math.random() * 1.4);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, radius, dummy]);

  return <instancedMesh ref={meshRef} args={[geom, mat, count]} />;
}
