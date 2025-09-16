import React, { useEffect, useState } from 'react';

interface PerformanceDebugProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function PerformanceDebug({ 
  enabled = false, 
  position = 'top-left' 
}: PerformanceDebugProps) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    deviceInfo: {
      isMobile: false,
      performanceTier: 'unknown',
      hardwareConcurrency: 0,
      deviceMemory: 0,
    }
  });

  useEffect(() => {
    if (!enabled) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let animationId: number;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      // Update FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const frameTime = (currentTime - lastTime) / frameCount;

        // Get memory usage if available
        let memoryUsage = 0;
        // @ts-expect-error - performance.memory is Chrome-specific
        if (performance.memory) {
          // @ts-expect-error - usedJSHeapSize property not in standard types
          memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }

        // Detect device info
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                         window.innerWidth <= 768;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        // @ts-expect-error - deviceMemory is experimental
        const deviceMemory = navigator.deviceMemory || 4;
        
        let performanceTier: 'low' | 'medium' | 'high' = 'medium';
        if (isMobile) {
          if (hardwareConcurrency < 4 || deviceMemory < 4) performanceTier = 'low';
          else if (hardwareConcurrency >= 6 && deviceMemory >= 6) performanceTier = 'high';
        } else {
          if (hardwareConcurrency < 4 || deviceMemory < 8) performanceTier = 'low';
          else if (hardwareConcurrency >= 8 && deviceMemory >= 16) performanceTier = 'high';
        }

        setMetrics({
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage,
          deviceInfo: {
            isMobile,
            performanceTier,
            hardwareConcurrency,
            deviceMemory,
          }
        });

        lastTime = currentTime;
        frameCount = 0;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const positionStyles = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
  };

  const fpsColor = metrics.fps >= 50 ? '#4ade80' : metrics.fps >= 30 ? '#fbbf24' : '#ef4444';

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        minWidth: '200px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#ffffff' }}>
        Performance Monitor
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: fpsColor, fontWeight: 'bold' }}>
          FPS: {metrics.fps}
        </span>
        <span style={{ color: '#9ca3af', marginLeft: '10px' }}>
          Frame: {metrics.frameTime}ms
        </span>
      </div>
      
      {metrics.memoryUsage > 0 && (
        <div style={{ marginBottom: '4px', color: '#9ca3af' }}>
          Memory: {metrics.memoryUsage}MB
        </div>
      )}
      
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
        Device: {metrics.deviceInfo.isMobile ? 'Mobile' : 'Desktop'}
      </div>
      
      <div style={{ fontSize: '11px', color: '#6b7280' }}>
        Tier: <span style={{ 
          color: metrics.deviceInfo.performanceTier === 'high' ? '#4ade80' : 
                metrics.deviceInfo.performanceTier === 'medium' ? '#fbbf24' : '#ef4444'
        }}>
          {metrics.deviceInfo.performanceTier}
        </span>
      </div>
      
      <div style={{ fontSize: '11px', color: '#6b7280' }}>
        CPU: {metrics.deviceInfo.hardwareConcurrency} cores
      </div>
      
      <div style={{ fontSize: '11px', color: '#6b7280' }}>
        RAM: {metrics.deviceInfo.deviceMemory}GB
      </div>
      
      {metrics.fps < 30 && (
        <div style={{ 
          marginTop: '8px', 
          padding: '4px', 
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#fecaca'
        }}>
          ⚠️ Low FPS detected
        </div>
      )}
    </div>
  );
}