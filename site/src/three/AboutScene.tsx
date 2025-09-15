'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import HelixKnot from '@/three/HelixKnot';
import ParallaxRig from '@/three/ParallaxRig';
import StarsShell from '@/three/StarsShell';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import React from 'react';

function Scene() {
  const reduced = useReducedMotion();
  
  return (
    <>
      <ParallaxRig factor={reduced ? 0.05 : 0.14}>
        <group scale={1.2} position={[0, 0, 0]}>
          <HelixKnot color="#a78bfa" speed={reduced ? 0.1 : 0.25} />
        </group>
        <StarsShell count={reduced ? 400 : 800} radius={10} opacity={0.4} size={0.005} />
      </ParallaxRig>

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#22d3ee" />
      <fog attach="fog" args={['#0a0b14', 10, 25]} />
    </>
  )
}

export default function AboutScene() {
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
        camera={{ fov: 45, position: [0, 0, 8] }}
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
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
