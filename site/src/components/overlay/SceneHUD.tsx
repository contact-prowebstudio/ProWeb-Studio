'use client';
import * as React from 'react';

type SceneHUDProps = {
  topLeft?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  className?: string;
};

export default function SceneHUD({ topLeft, bottomLeft, bottomRight, className }: SceneHUDProps) {
  return (
    <div className={`absolute inset-0 z-20 pointer-events-none ${className ?? ''}`}>
      {/* Top-left badge */}
      {topLeft && (
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/7 backdrop-blur-md ring-1 ring-white/15 px-2.5 py-1
                          text-[clamp(10px,2.7vw,12px)] leading-[1.1] text-white/90 pointer-events-auto select-none
                          shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,.8)]" />
            {topLeft}
          </div>
        </div>
      )}

      {/* Bottom area: responsive, never overlaps */}
      {(bottomLeft || bottomRight) && (
        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Left stack */}
            {bottomLeft && (
              <div className="min-w-0 rounded-xl bg-white/6 backdrop-blur-md ring-1 ring-white/10 px-3 py-2
                              text-[clamp(9px,2.3vw,11px)] leading-snug text-white/85 pointer-events-auto
                              shadow-[inset_0_1px_0_rgba(255,255,255,.08)] whitespace-normal">
                {bottomLeft}
              </div>
            )}
            {/* Right stack */}
            {bottomRight && (
              <div className="min-w-0 rounded-xl bg-white/6 backdrop-blur-md ring-1 ring-white/10 px-3 py-2
                              text-[clamp(9px,2.3vw,11px)] leading-snug text-white/85 pointer-events-auto
                              sm:justify-self-end shadow-[inset_0_1px_0_rgba(255,255,255,.08)] whitespace-normal">
                {bottomRight}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}