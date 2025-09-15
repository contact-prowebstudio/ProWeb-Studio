'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Octahedron,
  Dodecahedron,
  Tetrahedron,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import Scene3D from '@/components/Scene3D';

interface FloatingShapeProps {
  position: [number, number, number];
  Component: React.ComponentType<Record<string, unknown>>;
  color: string;
}

function FloatingShape({ position, Component, color }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      }
    } catch (error) {
      console.warn('FloatingShape animation error:', error);
    }
  });

  return (
    <Component ref={meshRef} position={position} args={[1, 0]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Component>
  );
}

// Utility to wait for scene readiness
function awaitReady(
  containerElement: HTMLElement | null,
  onR3FReady: boolean
): Promise<void> {
  return new Promise((resolve) => {
    if (!containerElement) {
      resolve();
      return;
    }

    let frameCount = 0;
    const maxFrames = 24; // ~400ms at 60fps
    const maxTime = 500; // 500ms max wait
    const startTime = performance.now();
    let lastRect: DOMRect | null = null;

    const checkReady = () => {
      const currentTime = performance.now();
      
      // Timeout check
      if (currentTime - startTime > maxTime || frameCount >= maxFrames) {
        resolve();
        return;
      }

      // Check if element is connected and has non-zero rect
      if (!containerElement.isConnected) {
        frameCount++;
        requestAnimationFrame(checkReady);
        return;
      }

      const rect = containerElement.getBoundingClientRect();
      
      // Check for non-zero dimensions
      if (rect.width <= 0 || rect.height <= 0) {
        frameCount++;
        requestAnimationFrame(checkReady);
        return;
      }

      // Check if R3F is ready
      if (!onR3FReady) {
        frameCount++;
        requestAnimationFrame(checkReady);
        return;
      }

      // Check for rect stability (2 consecutive frames within tolerance)
      if (lastRect) {
        const stable = 
          Math.abs(rect.width - lastRect.width) < 0.5 &&
          Math.abs(rect.height - lastRect.height) < 0.5 &&
          Math.abs(rect.left - lastRect.left) < 0.5 &&
          Math.abs(rect.top - lastRect.top) < 0.5;

        if (stable) {
          // All conditions met, wait for fonts if available
          if (typeof document !== 'undefined' && document.fonts?.ready) {
            document.fonts.ready
              .then(() => resolve())
              .catch(() => resolve()); // Fallback if fonts.ready fails
          } else {
            resolve();
          }
          return;
        }
      }

      lastRect = rect;
      frameCount++;
      requestAnimationFrame(checkReady);
    };

    requestAnimationFrame(checkReady);
  });
}

function FitToViewManager({ children, isR3FReady }: { children: React.ReactNode; isR3FReady: React.RefObject<boolean> }) {
  const { camera, gl, viewport: { width: vw, height: vh } } = useThree();
  const isMobile = useThree((state) => state.size.width < 768);
  
  // Two-layer group structure
  const fitGroupRef = useRef<THREE.Group>(null);      // Outer: receives scale/position
  const contentGroupRef = useRef<THREE.Group>(null);  // Inner: holds shapes + animations
  
  // Baseline snapshot (stored once after mount)
  const baselineCenterLocal = useRef<THREE.Vector3>(new THREE.Vector3());
  const baselineSizeLocal = useRef<THREE.Vector3>(new THREE.Vector3());
  const baselineRadiusLocal = useRef<number>(0);
  const baselineDiagonalLocal = useRef<number>(0);
  const isBaselineCaptured = useRef(false);

  // Container element reference
  const containerElement = useRef<HTMLElement | null>(null);

  // Get container element reference
  useEffect(() => {
    if (gl.domElement?.parentElement) {
      containerElement.current = gl.domElement.parentElement;
    }
  }, [gl.domElement]);

  // Screen-space fit function using iterative projection (mobile only)
  const fitToViewport = useCallback(() => {
    if (!fitGroupRef.current || !contentGroupRef.current || !isBaselineCaptured.current) {
      return;
    }

    try {
      // a) Reset fitGroup to identity
      fitGroupRef.current.position.set(0, 0, 0);
      fitGroupRef.current.scale.setScalar(1);
      
      if (!isMobile) {
        // Desktop: keep identity transform
        return;
      }

      // b) Iterative approach for mobile
      const margin = 0.15;
      const marginX = margin;
      const marginY = margin;
      const target = Math.min(vw, vh) * (1 - margin);
      
      // Initial scale guess
      let scaleGuess = target / baselineDiagonalLocal.current;
      scaleGuess = Math.max(0.4, Math.min(1.0, scaleGuess));
      
      let finalScale = scaleGuess;
      let maxAbsX = 0;
      let maxAbsY = 0;
      
      // Iterative refinement (max 3 passes)
      for (let iteration = 0; iteration < 3; iteration++) {
        // Apply current scale guess temporarily
        fitGroupRef.current.scale.setScalar(scaleGuess);
        
        // Update matrices
        fitGroupRef.current.updateMatrixWorld(true);
        
        // Build Box3 from scaled content
        const scaledBox = new THREE.Box3().setFromObject(contentGroupRef.current);
        
        if (scaledBox.isEmpty()) break;
        
        // Get 8 corner points in world space
        const corners = [
          new THREE.Vector3(scaledBox.min.x, scaledBox.min.y, scaledBox.min.z),
          new THREE.Vector3(scaledBox.min.x, scaledBox.min.y, scaledBox.max.z),
          new THREE.Vector3(scaledBox.min.x, scaledBox.max.y, scaledBox.min.z),
          new THREE.Vector3(scaledBox.min.x, scaledBox.max.y, scaledBox.max.z),
          new THREE.Vector3(scaledBox.max.x, scaledBox.min.y, scaledBox.min.z),
          new THREE.Vector3(scaledBox.max.x, scaledBox.min.y, scaledBox.max.z),
          new THREE.Vector3(scaledBox.max.x, scaledBox.max.y, scaledBox.min.z),
          new THREE.Vector3(scaledBox.max.x, scaledBox.max.y, scaledBox.max.z),
        ];
        
        // Project each corner to NDC
        maxAbsX = 0;
        maxAbsY = 0;
        
        for (const corner of corners) {
          const pNDC = corner.clone().project(camera);
          maxAbsX = Math.max(maxAbsX, Math.abs(pNDC.x));
          maxAbsY = Math.max(maxAbsY, Math.abs(pNDC.y));
        }
        
        // Check if content fits within margins
        const fitsX = maxAbsX <= (1 - marginX);
        const fitsY = maxAbsY <= (1 - marginY);
        
        if (fitsX && fitsY) {
          // Content fits, we're done
          finalScale = scaleGuess;
          break;
        }
        
        // Reduce scale and try again
        scaleGuess *= 0.92;
        finalScale = scaleGuess;
      }
      
      // c) Apply final scale and recenter with offset
      fitGroupRef.current.scale.setScalar(finalScale);
      
      const yOffset = -0.08 * vh;
      const cx = baselineCenterLocal.current.x * finalScale;
      const cy = baselineCenterLocal.current.y * finalScale;
      fitGroupRef.current.position.set(-cx, yOffset - cy, 0);
      
      // d) Development debug hook
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__fit_info__ = () => ({
          scale: finalScale,
          maxAbsX,
          maxAbsY,
          vw,
          vh,
          baselineDiagonalLocal: baselineDiagonalLocal.current,
        });
      }
    } catch (error) {
      console.warn('FitToViewManager: Error in fitToViewport:', error);
    }
  }, [camera, vw, vh, isMobile]);

  // Capture baseline snapshot only after readiness
  const captureBaseline = useCallback(async () => {
    if (!contentGroupRef.current || isBaselineCaptured.current) return;

    // Wait for scene readiness
    await awaitReady(containerElement.current, isR3FReady.current || false);

    // Retry logic for capturing valid baseline
    let retryCount = 0;
    const maxRetries = 8;

    const tryCapture = () => {
      if (!contentGroupRef.current || isBaselineCaptured.current) return;

      try {
        // Ensure fitGroup is identity during capture
        if (fitGroupRef.current) {
          fitGroupRef.current.position.set(0, 0, 0);
          fitGroupRef.current.scale.setScalar(1);
        }
        
        // Force world matrices update
        contentGroupRef.current.updateWorldMatrix(true, true);
        
        const box = new THREE.Box3().setFromObject(contentGroupRef.current);
        
        // Check if box is valid and has meaningful size
        if (!box.isEmpty()) {
          const size = new THREE.Vector3();
          box.getSize(size);
          
          // Check for meaningful size (epsilon > 0.01)
          if (size.length() > 0.01) {
            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);
            
            // Store baseline in CONTENT LOCAL SPACE
            baselineCenterLocal.current.copy(sphere.center);
            baselineSizeLocal.current.copy(size);
            baselineRadiusLocal.current = sphere.radius;
            baselineDiagonalLocal.current = sphere.radius * 2;
            isBaselineCaptured.current = true;
            
            // Immediately fit after baseline capture
            requestAnimationFrame(() => fitToViewport());
            return;
          }
        }
        
        // If not ready, try again next frame (up to maxRetries)
        retryCount++;
        if (retryCount < maxRetries) {
          requestAnimationFrame(tryCapture);
        }
      } catch (error) {
        console.warn('Error capturing baseline:', error);
      }
    };

    tryCapture();
  }, [fitToViewport, isR3FReady]); // Add dependencies

  // Capture baseline after mount
  useEffect(() => {
    captureBaseline();
  }, [captureBaseline]);

  // Handle resize, orientation change, visibility change, and container resize with debouncing
  useEffect(() => {
    if (!isBaselineCaptured.current) return;
    
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(fitToViewport, 150);
    };

    const handleOrientationChange = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(fitToViewport, 300);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fitToViewport, 150);
      }
    };

    // ResizeObserver for container changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerElement.current) {
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fitToViewport, 150);
      });
      resizeObserver.observe(containerElement.current);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [fitToViewport]);

  return (
    <group ref={fitGroupRef}>
      <group ref={contentGroupRef}>
        {children}
      </group>
    </group>
  );
}

export default function ServicesPolyhedra() {
  const isR3FReady = useRef(false);

  // Handle R3F ready callback
  const handleR3FReady = useCallback(() => {
    isR3FReady.current = true;
  }, []);

  return (
    <Scene3D onR3FReady={handleR3FReady}>
      {/* Lights outside the fitted group */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Only shapes inside the fitted group */}
      <FitToViewManager isR3FReady={isR3FReady}>
        <ShapesContent />
      </FitToViewManager>
    </Scene3D>
  );
}

// Only the floating shapes that need to be fitted
function ShapesContent() {
  return (
    <>
      <FloatingShape
        position={[-2, 0, 0]}
        Component={Octahedron}
        color="#00ffff"
      />
      <FloatingShape
        position={[2, 0, 0]}
        Component={Dodecahedron}
        color="#ff00ff"
      />
      <FloatingShape
        position={[0, 2, -1]}
        Component={Tetrahedron}
        color="#4da6ff"
      />
    </>
  );
}
