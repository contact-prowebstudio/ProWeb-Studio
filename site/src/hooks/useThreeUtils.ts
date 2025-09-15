'use client';

import { useEffect, useRef, useState, RefObject } from 'react';
import * as THREE from 'three';

/**
 * Hook for proper disposal of Three.js resources on unmount
 * This helps prevent memory leaks by ensuring proper cleanup
 */
export function useDisposal() {
  const disposables = useRef<Array<{ dispose: () => void }>>([]);

  const addDisposable = (object: { dispose: () => void }) => {
    disposables.current.push(object);
  };

  const disposeAll = () => {
    disposables.current.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        console.warn('Error disposing object:', error);
      }
    });
    disposables.current = [];
  };

  useEffect(() => {
    return () => {
      disposeAll();
    };
  }, []);

  return { addDisposable, disposeAll };
}

/**
 * Hook for automatic disposal of Three.js resources
 * Handles disposable objects like geometries, materials, textures
 */
export function useThreeDisposal(resources: ({ dispose: () => void } | null | undefined)[]) {
  const resourcesRef = useRef(resources);
  resourcesRef.current = resources;

  useEffect(() => {
    return () => {
      resourcesRef.current.forEach((resource) => {
        if (resource && 'dispose' in resource && typeof resource.dispose === 'function') {
          resource.dispose();
        }
      });
    };
  }, []);
}

/**
 * Hook for automatic disposal of Three.js Object3D instances
 */
export function useObject3DDisposal(objects: (THREE.Object3D | null | undefined)[]) {
  const objectsRef = useRef(objects);
  objectsRef.current = objects;

  useEffect(() => {
    return () => {
      objectsRef.current.forEach((object) => {
        if (!object) return;
        
        // Dispose of geometry
        if ('geometry' in object && object.geometry) {
          const geometry = object.geometry as THREE.BufferGeometry;
          if ('dispose' in geometry && typeof geometry.dispose === 'function') {
            geometry.dispose();
          }
        }
        // Dispose of material(s)
        if ('material' in object) {
          const material = object.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose?.());
          } else if (material?.dispose) {
            material.dispose();
          }
        }
        // Remove from parent
        object.removeFromParent();
      });
    };
  }, []);
}

/**
 * Hook for handling WebGL context events (context loss/restoration)
 * Essential for mobile stability and GPU pressure management
 */
export function useWebGLContextHandler(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [canvasRef]);
}

/**
 * Hook for mobile detection with proper cleanup
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile viewport
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}