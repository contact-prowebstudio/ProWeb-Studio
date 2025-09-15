'use client';

import * as THREE from 'three';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThreeDisposal } from '@/hooks/useThreeUtils';
import React from 'react';

// Custom shader for the glowing ribbon effect
const ribbonVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ribbonFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    float strength = (sin(vUv.x * 20.0 + uTime * 2.0) + 1.0) * 0.5;
    strength = pow(strength, 3.0);
    float alpha = smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
    gl_FragColor = vec4(uColor, alpha * strength * 0.7);
  }
`;

interface RibbonProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  scrollRatio: number;
}

function Ribbon({ curve, color, scrollRatio }: RibbonProps) {
  const geom = useMemo(() => new THREE.TubeGeometry(curve, 128, 0.01, 8, false), [curve]);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  // Dispose geometry on unmount
  useThreeDisposal([geom]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime + scrollRatio * 5.0;
    }
  });

  return (
    <mesh geometry={geom}>
      <shaderMaterial
        ref={matRef}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Scene() {
  const reduced = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null!);
  const [scrollRatio, setScrollRatio] = useState(0);

  // Create complex, intertwined curves for the ribbons
  const curves = useMemo(() => {
    const points1 = [];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 4;
      points1.push(new THREE.Vector3(Math.sin(angle) * 1.5, Math.cos(angle * 1.5) * 0.8, Math.cos(angle) * 1.5));
    }

    const points2 = [];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 6;
      points2.push(new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle * 0.8) * 1.0, Math.sin(angle) * 1.2));
    }
    
    const points3 = [];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 8;
      points3.push(new THREE.Vector3(Math.cos(angle * 0.5) * 1.8, Math.sin(angle) * 1.2, Math.cos(angle) * 1.0));
    }

    return [
      new THREE.CatmullRomCurve3(points1, true),
      new THREE.CatmullRomCurve3(points2, true),
      new THREE.CatmullRomCurve3(points3, true),
    ];
  }, []);

  useEffect(() => {
    if (reduced) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollRatio(scrollTop / docHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduced]);


  useFrame((_, delta) => {
    if (groupRef.current) {
      const baseRotationSpeed = reduced ? 0.05 : 0.1;
      const scrollRotationSpeed = reduced ? 0 : scrollRatio * 2.0;
      groupRef.current.rotation.y += delta * (baseRotationSpeed + scrollRotationSpeed);
      groupRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Ribbon curve={curves[0]} color="#22d3ee" scrollRatio={scrollRatio} />
      <Ribbon curve={curves[1]} color="#8b5cf6" scrollRatio={scrollRatio} />
      <Ribbon curve={curves[2]} color="#a5f3fc" scrollRatio={scrollRatio} />
    </group>
  );
}

export default function FlowingRibbons() {
    const [isMobile, setIsMobile] = React.useState(false);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        // Detect mobile viewport
        setIsMobile(window.innerWidth < 768);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // WebGL context event handlers
    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('WebGL context lost, preventing default behavior');
        };

        const handleContextRestored = () => {
            console.info('WebGL context restored, reinitializing...');
            // Force re-render by triggering a resize event
            window.dispatchEvent(new Event('resize'));
        };

        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, []);

    // Route cleanup - dispose resources on route change
    React.useEffect(() => {
        const handleBeforeUnload = () => {
            // Clean up any manual resources if needed
            // R3F handles most cleanup automatically
        };

        const handleRouteChange = () => {
            // Route change cleanup
            handleBeforeUnload();
        };

        // Listen for page unload and route changes
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleRouteChange);
            handleBeforeUnload();
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas 
                ref={canvasRef}
                dpr={[1, 1.5]} // Clamp DPR for mobile stability
                camera={{ position: [0, 0, 3], fov: 75 }}
                gl={{ 
                    alpha: true, 
                    antialias: !isMobile, // Disable antialias on mobile
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                    stencil: false,
                    depth: true,
                }}
                onCreated={({ gl }) => {
                    gl.setClearAlpha(0);
                    
                    // Clamp pixel ratio for mobile stability
                    if (isMobile) {
                        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                    }
                }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <Scene />
            </Canvas>
        </div>
    )
}
