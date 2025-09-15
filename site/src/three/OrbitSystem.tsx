'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';
import Scene3D from '@/components/Scene3D';

interface PlanetProps {
  radius: number;
  speed: number;
  distance: number;
  color: string;
}

function Planet({ radius, speed, distance, color }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    try {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      }
    } catch (error) {
      console.warn('Planet animation error:', error);
    }
  });

  return (
    <group ref={groupRef}>
      <Trail width={2} length={20} color={color} attenuation={(t) => t * t}>
        <Sphere
          ref={planetRef}
          args={[radius, 32, 16]}
          position={[distance, 0, 0]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Trail>
    </group>
  );
}

export default function OrbitSystem() {
  return (
    <Scene3D>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" />

      <Sphere args={[0.5, 32, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={1}
        />
      </Sphere>

      <Planet radius={0.15} speed={1} distance={1.5} color="#00ffff" />
      <Planet radius={0.2} speed={0.7} distance={2.2} color="#ff00ff" />
      <Planet radius={0.1} speed={1.5} distance={3} color="#4da6ff" />
    </Scene3D>
  );
}
