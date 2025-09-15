'use client';
import * as THREE from 'three';
import { useRef, useMemo, useState } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';

function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Create a sophisticated dodecahedron with animated facets
function AnimatedDodecahedron() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerMeshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const { geometry, material, innerGeometry, innerMaterial } = useMemo(() => {
    // Create main dodecahedron geometry - enlarged for better presence
    const geo = new THREE.DodecahedronGeometry(1.8, 0);

    // Create inner crystalline structure - proportionally enlarged
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 1);

    // Create sophisticated material with gradient effect
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#8b5cf6',
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      envMapIntensity: 2.5,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });

    // Inner core material
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: '#22d3ee',
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.6,
      emissive: '#22d3ee',
      emissiveIntensity: 0.1,
    });

    return {
      geometry: geo,
      material: mat,
      innerGeometry: innerGeo,
      innerMaterial: innerMat,
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !innerMeshRef.current) return;

    const time = state.clock.elapsedTime;

    // Complex rotation pattern with multiple axes
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.15;

    // Counter-rotating inner structure
    innerMeshRef.current.rotation.y -= delta * 0.6;
    innerMeshRef.current.rotation.x += delta * 0.3;
    innerMeshRef.current.rotation.z = Math.cos(time * 1.2) * 0.2;

    // Multi-frequency scaling for organic feel
    const scale =
      1 +
      Math.sin(time * 1.2) * 0.04 +
      Math.sin(time * 2.4) * 0.02 +
      Math.sin(time * 0.6) * 0.03;
    meshRef.current.scale.setScalar(scale);

    // Inner structure breathing
    const innerScale = 0.9 + Math.sin(time * 2) * 0.1;
    innerMeshRef.current.scale.setScalar(innerScale);

    // Dynamic material effects
    const mat = material as THREE.MeshPhysicalMaterial;
    const innerMat = innerMaterial as THREE.MeshPhysicalMaterial;

    // Color cycling
    const hue = (Math.sin(time * 0.5) + 1) * 0.5;
    const saturation = 0.7 + Math.sin(time * 1.3) * 0.2;
    mat.color.setHSL(0.75 + hue * 0.2, saturation, 0.6);

    // Inner core pulsing
    innerMat.emissiveIntensity = 0.1 + Math.sin(time * 3) * 0.15;

    // Animated clearcoat
    mat.clearcoat = 0.7 + Math.sin(time * 2) * 0.2;

    // Enhanced hover effects
    if (hovered) {
      meshRef.current.rotation.y += delta * 0.6; // Faster rotation
      meshRef.current.rotation.x += delta * 0.3;
      innerMeshRef.current.rotation.y -= delta * 0.8;

      // Shimmer effect
      mat.emissive.setHSL(hue, 0.8, 0.3);
      mat.emissiveIntensity = 0.2 + Math.sin(time * 8) * 0.1;

      // Enhanced reflectivity on hover
      mat.reflectivity = 0.95 + Math.sin(time * 4) * 0.05;

      // Inner core intensifies
      innerMat.emissiveIntensity = 0.3 + Math.sin(time * 6) * 0.2;
    } else {
      mat.emissive.set('#000000');
      mat.emissiveIntensity = 0;
      mat.reflectivity = 0.9;
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <mesh
        ref={innerMeshRef}
        geometry={innerGeometry}
        material={innerMaterial}
      />
    </group>
  );
}

// Orbital rings around the dodecahedron
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 1.2;
      ring1Ref.current.rotation.x = Math.sin(time * 0.8) * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.8;
      ring2Ref.current.rotation.z = Math.cos(time * 0.6) * 0.4;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 1.5;
      ring3Ref.current.rotation.y = Math.sin(time * 1.2) * 0.2;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.025, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.6, 0.02, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4.0, 0.015, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
    </>
  );
}

// Enhanced particle system with geometric patterns
function GeometricParticles() {
  const pointsRef = useRef<THREE.Points>(null!);

  const { geometry, material } = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Create geometric distribution patterns - enlarged for better presence
      const theta = (i / count) * Math.PI * 4;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.2 + Math.random() * 2.8; // Expanded radius range

      positions[i * 3] =
        r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] =
        r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(phi) + (Math.random() - 0.5) * 0.8;

      // Gradient colors
      const colorIndex = i / count;
      colors[i * 3] = 0.2 + colorIndex * 0.6; // R
      colors[i * 3 + 1] = 0.7 + Math.sin(colorIndex * Math.PI) * 0.3; // G
      colors[i * 3 + 2] = 0.9; // B

      sizes[i] = Math.random() * 0.04 + 0.015; // Larger particle sizes
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.035, // Increased base particle size
      vertexColors: true,
      transparent: true,
      opacity: 0.9, // Slightly more opaque for better visibility
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = time * 0.03;

    // Animate particle sizes
    const sizes = geometry.attributes.size;
    for (let i = 0; i < sizes.count; i++) {
      const originalSize = 0.01 + (i / sizes.count) * 0.02;
      sizes.array[i] = originalSize + Math.sin(time * 3 + i * 0.1) * 0.005;
    }
    sizes.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function HexagonalPrism() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 9] }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
      style={{ background: 'transparent' }}
    >
      <group scale={0.85}>
        <AnimatedDodecahedron />
        {!reduced && <OrbitalRings />}
        {!reduced && <GeometricParticles />}

        {/* Professional lighting setup - enhanced for larger model */}
        <ambientLight intensity={0.25} color="#a5f3fc" />

        {/* Key light - repositioned for larger scale */}
        <directionalLight
          position={[4, 4, 4]}
          intensity={1.8}
          color="#ffffff"
        />

        {/* Fill light - enhanced */}
        <directionalLight
          position={[-3, 1.5, 3]}
          intensity={1.0}
          color="#22d3ee"
        />

        {/* Rim lights for dramatic effect - adjusted for larger geometry */}
        <pointLight
          position={[5, 0, -3]}
          intensity={1.5}
          color="#8b5cf6"
          distance={12}
          decay={2}
        />

        <pointLight
          position={[-4, 4, 1.5]}
          intensity={1.1}
          color="#f0abfc"
          distance={10}
          decay={2}
        />

        {/* Accent lights - expanded range */}
        <pointLight
          position={[0, -6, 3]}
          intensity={0.9}
          color="#06b6d4"
          distance={14}
          decay={1.5}
        />
      </group>
    </Canvas>
  );
}
