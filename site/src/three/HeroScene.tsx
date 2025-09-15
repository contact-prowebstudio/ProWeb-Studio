'use client';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import ParallaxRig from '@/three/ParallaxRig';
import StarsShell from '@/three/StarsShell';
import FacetedSolid from '@/three/FacetedSolid';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Floating light particles
function LightParticles({
  count = 50,
  reduced = false,
}: {
  count?: number;
  reduced?: boolean;
}) {
  const particles = useRef<THREE.Points>(null!);

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sc[i] = Math.random();
    }

    return { positions: pos, scales: sc };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, scales]);

  useFrame((state) => {
    if (!particles.current || reduced) return;

    const time = state.clock.elapsedTime;
    const positions = particles.current.geometry.attributes.position;
    const scales = particles.current.geometry.attributes.scale;

    for (let i = 0; i < count; i++) {
      // Gentle floating motion
      const i3 = i * 3;
      const t = time * 0.5 + i * 0.1;

      positions.array[i3 + 1] += Math.sin(t) * 0.001;

      // Pulsing scale
      scales.array[i] = 0.5 + Math.sin(time * 2 + i) * 0.5;
    }

    positions.needsUpdate = true;
    scales.needsUpdate = true;
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#22d3ee"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Enhanced volumetric light
function VolumetricLight() {
  const light = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!light.current) return;
    const time = state.clock.elapsedTime;
    light.current.rotation.z = time * 0.3;
    const material = light.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.1 + Math.sin(time) * 0.05;
  });

  return (
    <mesh ref={light} position={[2, 2, -1]}>
      <coneGeometry args={[2, 5, 4, 1, true]} />
      <meshBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();
  const spin = reduced ? 0.3 : 0.85;
  const factor = reduced ? 0.05 : 0.14;
  const starCount = reduced ? 600 : 1200;
  const particleCount = reduced ? 0 : 50;

  return (
    <>
      <ParallaxRig factor={factor}>
        <group scale={1.12} position={[0, 0.1, 0]}>
          <FacetedSolid spin={spin} />
        </group>
        <StarsShell count={starCount} radius={20} opacity={0.55} size={0.007} />
        {!reduced && <LightParticles count={particleCount} reduced={reduced} />}
      </ParallaxRig>

      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />

      {/* Key light - main illumination */}
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#ffffff" />

      {/* Fill light - soften shadows */}
      <directionalLight
        position={[-3, 1, -2]}
        intensity={0.6}
        color="#a5f3fc"
      />

      {/* Rim light - edge highlighting */}
      <pointLight
        position={[-5, -2, 1]}
        intensity={0.8}
        color="#f0abfc"
        distance={8}
        decay={2}
      />

      {/* Accent light - color pop */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.5}
        color="#22d3ee"
        distance={10}
        decay={2}
      />

      {/* Volumetric effect */}
      {!reduced && <VolumetricLight />}

      {/* Subtle fog for depth - much lighter */}
      <fog attach="fog" args={['#030015', 15, 35]} />
    </>
  );
}
