'use client';

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Factory function to create optimized dynamic imports for Three.js components
export function createDynamic3DComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  return lazy(async () => {
    // Add artificial delay in development to test loading states
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
      const loadedModule = await importFn();
      return loadedModule;
    } catch (error) {
      console.error('Failed to load 3D component:', error);
      throw error;
    }
  });
}

// Pre-configured dynamic components for common Three.js components
export const DynamicHeroScene = lazy(() => import('../three/HeroScene'));

export const DynamicPortalScene = lazy(() => import('../three/PortalScene'));

export const DynamicHexagonalPrism = lazy(() => import('../three/HexagonalPrism'));

export const DynamicTechPlaygroundScene = lazy(() => import('../components/TechPlaygroundScene'));

export const DynamicScene3D = lazy(() => import('./Scene3D'));

export const DynamicHeroCanvas = lazy(() => import('./HeroCanvas'));

// Performance monitoring wrapper
export function withPerformanceMonitoring<T extends Record<string, unknown>>(
  Component: ComponentType<T>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: T) {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = performance.now();
      
      return (
        <Component 
          {...props} 
          ref={(ref: unknown) => {
            if (ref) {
              const endTime = performance.now();
              const renderTime = endTime - startTime;
              
              // Log performance metrics
              console.log(`3D Component ${componentName} render time: ${renderTime}ms`);
              
              // Send to analytics if needed
              if (renderTime > 100) {
                console.warn(`Slow 3D component render: ${componentName} took ${renderTime}ms`);
              }
            }
          }}
        />
      );
    }
    
    return <Component {...props} />;
  };
}

// Bundle size analyzer - helps identify heavy components
export const get3DComponentInfo = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return {
      loadedChunks: performance.getEntriesByType('navigation'),
      threeJSSize: 'Check Network tab for three.js bundle size',
      suggestions: [
        'Use tree-shaking to reduce Three.js imports',
        'Consider lazy loading heavy 3D scenes',
        'Optimize geometry and textures',
        'Use LOD (Level of Detail) for distant objects'
      ]
    };
  }
  return null;
};

// Preload critical 3D components
export const preload3DComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload critical components on idle
    requestIdleCallback(() => {
      import('../three/HeroScene');
      import('./Scene3D');
    });
  }
};
