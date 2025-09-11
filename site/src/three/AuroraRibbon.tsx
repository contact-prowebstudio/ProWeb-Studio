'use client';
// src/three/AuroraRibbon.tsx
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type AuroraProps = {
  colorA?: string;
  colorB?: string;
  colorC?: string;
  speed?: number;
  amplitude?: number;
  opacity?: number;
};

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec2 vUv;
  varying float vBand;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin((pos.x * 2.4) + uTime * 0.8) * 0.25
               + sin((pos.x * 4.2) - uTime * 0.6) * 0.15;
    pos.y += wave * uAmp;
    pos.z += cos((pos.x * 1.8) + uTime * 0.5) * 0.4 * uAmp;
    vBand = smoothstep(0.2, 0.8, vUv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;
  varying float vBand;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
  }

  void main() {
    float n = noise(vUv * 4.0 + uTime * 0.05);
    vec3 base = mix(uColorA, uColorB, vUv.y);
    base = mix(base, uColorC, n * 0.6);
    float alpha = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
    float glow = smoothstep(0.45, 0.55, vUv.y);
    vec3 col = base + glow * 0.25;
    gl_FragColor = vec4(col, alpha * uOpacity * (0.7 + vBand * 0.3));
  }
`;

export function AuroraRibbon({
  colorA = '#5ef0ff',
  colorB = '#a855f7',
  colorC = '#ff2da1',
  speed = 1.0,
  amplitude = 1.0,
  opacity = 0.9,
}: AuroraProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const geom = useMemo(() => new THREE.PlaneGeometry(10, 3, 400, 40), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amplitude },
      uOpacity: { value: opacity },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
    }),
    [amplitude, opacity, colorA, colorB, colorC],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * speed;
  });

  return (
    <mesh geometry={geom} position={[0, 0, -1]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
