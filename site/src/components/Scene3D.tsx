'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, RootState } from '@react-three/fiber';
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useWebGLContextHandler } from '@/hooks/useThreeUtils';

interface Scene3DProps {
  children: React.ReactNode;
  onR3FReady?: (state: RootState) => void;
}

export default function Scene3D({ children, onR3FReady }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Use centralized WebGL context handling
  useWebGLContextHandler(canvasRef);

  // Legacy context handlers for compatibility
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
      <div className="absolute inset-0 z-0 pointer-events-none" />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Clamp DPR on mobile
        gl={{
          antialias: !isMobile, // Disable antialias on mobile
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false, // Avoid preserveDrawingBuffer
          stencil: false,
          depth: true,
        }}
        onCreated={(state) => {
          // Ensure canvas is properly initialized
          state.gl.setClearColor('#000000', 0);
          
          // Clamp pixel ratio for mobile stability
          if (isMobile) {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }

          // Call the onR3FReady callback to signal R3F is ready
          onR3FReady?.(state);
        }}
      >
        <Suspense fallback={null}>
          {children}
          <AdaptiveDpr pixelated />
          <PerformanceMonitor />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
