// /src/three/PortalScene.tsx
'use client';

import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

type Props = { scale?: number; effects?: boolean };

/**
 * Cosmic Aperture:
 * - دائرة من "الشفرات" (أجنحة ضوئية) تُكوَّن بعدسة تتنفس.
 * - كل شفرة تُرسَم عبر ShaderMaterial على بلاين كامل ثم تُقص بالاستنسل القطري داخل الشيدر (أداء جيد وعديم الحواف السوداء).
 * - مزج Additive + عمق غير كاتب => توهج نظيف بلا تغطية على الخلفية أو النص.
 */

function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

const bladeFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uAngle;     // زاوية الشفرة
  uniform float uWidth;     // نصف عرض الزاوية (راديان)
  uniform float uInnerR;    // نصف القطر الداخلي
  uniform float uOuterR;    // نصف القطر الخارجي
  uniform vec3  uC1;        // لون 1
  uniform vec3  uC2;        // لون 2

  // زوايا ملفوفة إلى [-PI, PI]
  float angDiff(float a, float b) {
    float d = a - b;
    return atan(sin(d), cos(d));
  }

  void main(){
    // تحويل إلى إحداثيات قطبية حول (0,0)
    vec2 p = vPos.xy;               // موضع بنطاق [-1,1] تقريباً
    float r = length(p);
    float a = atan(p.y, p.x);

    // أقنعة نصف القطر (حلقة بين inner و outer)
    float inner = smoothstep(uInnerR, uInnerR + 0.01, r);
    float outer = 1.0 - smoothstep(uOuterR, uOuterR - 0.01, r);
    float ringMask = inner * outer;

    // قناع الزاوية (شكل إسفين) مع نعومة على الحواف
    float d = abs(angDiff(a, uAngle));
    float angleMask = smoothstep(uWidth, uWidth - 0.06, d);

    // شيدر تدرّج لوني نابض
    float puls = 0.5 + 0.5 * sin(uTime*1.1 + a*3.0 + r*8.0);
    vec3 col = mix(uC1, uC2, 0.35 + 0.65 * puls);

    // شدّة تُعلي الحواف وتُخفف مركز الإسفين
    float edge = smoothstep(0.0, 0.02, abs(d - (uWidth*0.98)));
    float intensity = 0.6 + 0.4 * edge;

    float m = ringMask * angleMask;
    float alpha = m * intensity;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * m, alpha);
  }
`;

const bladeVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main(){
    vUv = uv;
    // نُطبّع الموضع إلى [-1,1] لاستخدامه كمرجع قطبي في الفراجمنت
    vec3 pos = position;
    vPos = pos / 1.0; // البلاين أصلاً مقاسه 2x2 بعد السكيل في الـgroup
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

function Blade({
  angle,
  width,
  innerR,
  outerR,
  c1,
  c2,
}: {
  angle: number;
  width: number;
  innerR: number;
  outerR: number;
  c1: THREE.Color;
  c2: THREE.Color;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAngle: { value: angle },
          uWidth: { value: width },
          uInnerR: { value: innerR },
          uOuterR: { value: outerR },
          uC1: { value: new THREE.Color(c1) },
          uC2: { value: new THREE.Color(c2) },
        },
        vertexShader: bladeVertex,
        fragmentShader: bladeFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [angle, width, innerR, outerR, c1, c2],
  );

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh>
      {/* بلاين يغطي دائرة قطرها ~2 (سنحجّم المجموعة خارجياً) */}
      <planeGeometry args={[2, 2, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Aperture({
  blades = 12,
  reduced = false,
}: {
  blades?: number;
  reduced?: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame(() => {
    // برالاكس خفيف للمجموعة بالكامل
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.28,
        0.08,
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.y * 0.2,
        0.08,
      );
    }
  });

  // إعدادات لونية
  const c1 = useMemo(() => new THREE.Color('#0bdad6'), []);
  const c2 = useMemo(() => new THREE.Color('#b14df0'), []);

  const bladeNodes = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const TWO_PI = Math.PI * 2;
    for (let i = 0; i < blades; i++) {
      // تذبذب طفيف في الزاوية والعرض لإحساس عضوي
      const baseAngle = (i / blades) * TWO_PI;
      nodes.push(
        <Blade
          key={i}
          angle={baseAngle}
          width={(TWO_PI / blades) * (reduced ? 0.65 : 0.52)}
          innerR={0.42}
          outerR={1.0}
          c1={c1}
          c2={c2}
        />,
      );
    }
    return nodes;
  }, [blades, c1, c2, reduced]);

  // تدوير عام بطيء + فتح/إغلاق بسيط عبر uniform uWidth (بتعديل scaleY للمجموعة لمحاكاة فتح القزحية)
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.12;
    const open = 0.86 + 0.08 * Math.sin(t * 0.9); // 0.78..0.94
    group.current.scale.set(1, open, 1);
  });

  return <group ref={group}>{bladeNodes}</group>;
}

function StarSwarm({
  count = 800,
  radius = 1.8,
  reduced = false,
}: {
  count?: number;
  radius?: number;
  reduced?: boolean;
}) {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: reduced ? 0.008 : 0.014,
        color: '#a5f3fc',
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    [reduced],
  );
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.6 + Math.random() * 0.4);
      const ang = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 0.25;
      arr[i * 3 + 0] = Math.cos(ang) * r;
      arr[i * 3 + 1] = Math.sin(ang) * r;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count, radius]);
  React.useEffect(() => {
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return () => geom.dispose();
  }, [geom, positions]);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.08;
  });
  return <points ref={ref} geometry={geom} material={mat} />;
}

function EnergyRings() {
  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uInner: { value: 0.32 },
        uOuter: { value: 0.48 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uInner;
        uniform float uOuter;
        void main() {
          vec2 p = vUv - 0.5;
          float d = length(p);
          float ring1 = smoothstep(uInner, uInner-0.04, d) * smoothstep(uInner+0.03, uInner, d);
          float ring2 = smoothstep(uOuter, uOuter-0.04, d) * smoothstep(uOuter+0.03, uOuter, d);
          float flicker = 0.75 + 0.25 * sin(uTime*3.0);
          vec3 col1 = vec3(0.3,1.0,1.0);
          vec3 col2 = vec3(1.0,0.3,1.0);
          vec3 col = col1*ring1 + col2*ring2;
          gl_FragColor = vec4(col * flicker, (ring1+ring2) * 0.65);
        }`,
    });
    return m;
  }, []);
  useFrame((_, dt) => (mat.uniforms.uTime.value += dt));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.0, 128]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
function EnergyCore() {
  // قرص نبضي رقيق يحسّن تركيز العين في المركز
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          void main(){
            vec2 p = vUv*2.0-1.0;
            float r = length(p);
            float ring = smoothstep(0.44, 0.40, r) * (1.0 - smoothstep(0.62, 0.58, r));
            float glow = 0.35 * (0.6 + 0.4*sin(uTime*1.3));
            float alpha = ring * 0.9 + smoothstep(0.18, 0.0, r)*0.3;
            vec3 col = mix(vec3(0.02,0.08,0.12), vec3(0.2,0.8,1.0), 0.6) * (ring + glow);
            if (alpha < 0.02) discard;
            gl_FragColor = vec4(col, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

export default function PortalScene({ scale = 0.58, effects = true }: Props) {
  const reduced = useReducedMotion();
  const enableFx = effects && !reduced;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 3.4] }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearAlpha(0)} // خلفية شفافة تمامًا
      style={{ background: 'transparent' }}
    >
      <group scale={scale}>
        {enableFx && <StarSwarm />}
        {enableFx && <EnergyRings />}
        {/* ترتيب: قلب الطاقة ثم القزحية فوقه */}
        <EnergyCore />
        <Aperture blades={enableFx ? 12 : 6} reduced={!enableFx} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={0.9} color={'#a5f3fc'} />
      </group>
    </Canvas>
  );
}
