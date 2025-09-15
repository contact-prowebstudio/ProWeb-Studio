'use client';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'hero' | 'scene' | 'canvas';
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'scene' 
}: LoadingSkeletonProps) {
  const variants = {
    hero: 'h-screen w-full',
    scene: 'h-64 w-full',
    canvas: 'h-full w-full'
  };

  return (
    <div className={`${variants[variant]} ${className} relative overflow-hidden bg-gradient-to-br from-gray-900 to-black`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400/60 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Central loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-blue-400/80 text-sm font-medium animate-pulse">
            Loading 3D Experience...
          </p>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}
