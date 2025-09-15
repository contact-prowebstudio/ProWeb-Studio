'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { Preload } from '@react-three/drei';

type Props = { children: React.ReactNode; className?: string };

export default function HeroCanvas({ children, className }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Detect mobile viewport
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebGL context event handlers
  useEffect(() => {
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
  }, [isMounted]);

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className ?? ''}`}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none ${className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas
        ref={canvasRef}
        frameloop="always"
        dpr={isMobile ? [1, 1.5] : [1, 1.6]} // Clamp DPR on mobile
        gl={{
          antialias: !isMobile, // Disable antialias on mobile
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false, // Avoid preserveDrawingBuffer
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Fully transparent background
          
          // Clamp pixel ratio for mobile stability
          if (isMobile) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
