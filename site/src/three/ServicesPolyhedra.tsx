'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Octahedron,
  Dodecahedron,
  Tetrahedron,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import Scene3D from '@/components/Scene3D';

interface FloatingShapeProps {
  position: [number, number, number];
  Component: React.ComponentType<Record<string, unknown>>;
  color: string;
}

function FloatingShape({ position, Component, color }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      }
    } catch (error) {
      console.warn('FloatingShape animation error:', error);
    }
  });

  return (
    <Component ref={meshRef} position={position} args={[1, 0]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Component>
  );
}

export default function ServicesPolyhedra() {
  return (
    <Scene3D>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloatingShape
        position={[-2, 0, 0]}
        Component={Octahedron}
        color="#00ffff"
      />
      <FloatingShape
        position={[2, 0, 0]}
        Component={Dodecahedron}
        color="#ff00ff"
      />
      <FloatingShape
        position={[0, 2, -1]}
        Component={Tetrahedron}
        color="#4da6ff"
      />
    </Scene3D>
  );
}
