'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type Props = {
  count?: number;
  radius?: number;
  opacity?: number;
  size?: number;
};

export default function StarsShell({
  count = 1600,
  radius = 18,
  opacity = 0.85,
  size = 0.015,
}: Props) {
  const points = useRef<THREE.Points>(null!);

  const { positions, colors, sizes } = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);

    // Color palette for stars
    const starColors = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#a5f3fc'), // Cyan
      new THREE.Color('#c4b5fd'), // Purple
      new THREE.Color('#fbbf24'), // Yellow
    ];

    for (let i = 0; i < count; i++) {
      // Improved distribution with clustering
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();

      // Variable radius for depth
      const r = radius * (0.5 + Math.random() * 0.5);

      // Add some clustering for more realistic star field
      const cluster = Math.random() > 0.8 ? 2 : 1;

      posArr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta) * cluster;
      posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * cluster;
      posArr[i * 3 + 2] = r * Math.cos(phi) * cluster;

      // Varied star colors
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colArr[i * 3 + 0] = color.r;
      colArr[i * 3 + 1] = color.g;
      colArr[i * 3 + 2] = color.b;

      // Varied star sizes for depth perception
      sizeArr[i] = size * (0.5 + Math.random() * 1.5);
    }

    return {
      positions: posArr,
      colors: colArr,
      sizes: sizeArr,
    };
  }, [count, radius, size]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, colors, sizes]);

  // Shader material for enhanced star rendering
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: opacity },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec3 pos = position;
          
          // Subtle rotation over time
          float angle = time * 0.05;
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          pos.xy = rot * pos.xy;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation with distance
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        uniform float opacity;
        uniform float time;
        
        void main() {
          // Circular star shape with soft edges
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft edge falloff
          float alpha = smoothstep(0.5, 0.0, dist) * opacity;
          
          // Twinkling effect
          float twinkle = sin(time * 3.0 + vSize * 100.0) * 0.2 + 0.8;
          
          gl_FragColor = vec4(vColor * twinkle, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }, [opacity]);

  useFrame((state) => {
    if (!points.current) return;

    // Update time uniform for shader animations
    material.uniforms.time.value = state.clock.elapsedTime;

    // Very slow overall rotation for subtle movement
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry attach="geometry" {...(geo as THREE.BufferGeometry)} />
      <primitive attach="material" object={material} />
    </points>
  );
}
