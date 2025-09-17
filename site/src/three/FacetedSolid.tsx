'use client';
import * as THREE from 'three';
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function FacetedSolid({
  base = '#8b5cf6',
  accent = '#22d3ee',
  metalness = 0.85,
  roughness = 0.15,
  spin = 0.85,
}: {
  base?: string;
  accent?: string;
  metalness?: number;
  roughness?: number;
  spin?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const { geometry, material } = useMemo(() => {
  // Create a more complex geometry with subdivision
  // Ensure we only call toNonIndexed() when necessary to avoid warnings.
  const tempGeom = new THREE.IcosahedronGeometry(1.2, 1);
  const baseGeom = tempGeom.index ? tempGeom.toNonIndexed() : tempGeom;
    const pos = baseGeom.getAttribute('position') as THREE.BufferAttribute;
    const v = new THREE.Vector3();

    // Enhanced beveling for more depth
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize().multiplyScalar(0.08);
      pos.setXYZ(i, pos.getX(i) + v.x, pos.getY(i) + v.y, pos.getZ(i) + v.z);
    }
    baseGeom.computeVertexNormals();

    // Enforce flat shading with improved normal calculation
    const nAttr = baseGeom.getAttribute('normal') as THREE.BufferAttribute;
    const nArr = nAttr.array as Float32Array;
    for (let i = 0; i < nArr.length; i += 9) {
      const nx = (nArr[i] + nArr[i + 3] + nArr[i + 6]) / 3;
      const ny = (nArr[i + 1] + nArr[i + 4] + nArr[i + 7]) / 3;
      const nz = (nArr[i + 2] + nArr[i + 5] + nArr[i + 8]) / 3;

      // Add slight variation to normals for shimmer effect
      const variation = 0.02;
      for (let k = 0; k < 3; k++) {
        nArr[i + 3 * k] = nx + (Math.random() - 0.5) * variation;
        nArr[i + 3 * k + 1] = ny + (Math.random() - 0.5) * variation;
        nArr[i + 3 * k + 2] = nz + (Math.random() - 0.5) * variation;
      }
    }

    // Enhanced vertex colors with more gradient variation
    const colorAttr = new THREE.Float32BufferAttribute(
      new Float32Array(pos.count * 3),
      3,
    );
    const c0 = new THREE.Color(base);
    const c1 = new THREE.Color(accent);
    const c2 = new THREE.Color('#f0abfc'); // Additional magenta accent
    const tmpN = new THREE.Vector3();
    const tmpP = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      tmpN.fromArray(nArr, i * 3);
      tmpP.fromBufferAttribute(pos, i);

      // Multi-axis gradient for more complex coloring
      const ty = THREE.MathUtils.clamp((tmpN.y + 1) * 0.5, 0.0, 1.0);
      const tx = THREE.MathUtils.clamp((tmpP.x + 1.2) / 2.4, 0.0, 1.0);
      const tz = THREE.MathUtils.clamp((tmpP.z + 1.2) / 2.4, 0.0, 1.0);

      // Blend three colors based on position and normal
      const col = c0
        .clone()
        .lerp(c1, ty * 0.7 + tx * 0.3)
        .lerp(c2, tz * 0.2);

      colorAttr.setXYZ(i, col.r, col.g, col.b);
    }
    baseGeom.setAttribute('color', colorAttr);

    // Enhanced material with physical properties
    const mat = new THREE.MeshPhysicalMaterial({
      metalness,
      roughness,
      flatShading: true,
      vertexColors: true,
      transparent: false,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      reflectivity: 0.9,
      envMapIntensity: 1.5,
    });

    return { geometry: baseGeom, material: mat };
  }, [base, accent, metalness, roughness]);

  useFrame((state, dt) => {
    if (!mesh.current) return;

    const time = state.clock.elapsedTime;

    // Complex rotation pattern
    mesh.current.rotation.y += dt * spin;
    mesh.current.rotation.x += dt * (spin * 0.25);
    mesh.current.rotation.z = Math.sin(time * 0.5) * 0.1;

    // Subtle breathing effect
    const scale = 1 + Math.sin(time * 1.5) * 0.02;
    mesh.current.scale.setScalar(scale);

    // Interactive hover effect
    if (hovered) {
      mesh.current.rotation.y += dt * 0.5;
      material.emissive = new THREE.Color('#22d3ee');
      material.emissiveIntensity = 0.2;
    } else {
      material.emissive = new THREE.Color('#000000');
      material.emissiveIntensity = 0;
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      position={[0, 0, 0.2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}
