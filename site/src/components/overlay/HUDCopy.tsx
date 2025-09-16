'use client';

export function LiveBadge() {
  return <span className="font-medium tracking-wide">Live Rendering</span>;
}

export function FooterLeft() {
  return (
    <div className="space-y-1">
      <p className="font-semibold tracking-wide text-white/90">PROWEB STUDIO</p>
      <p className="text-white/75">Waar licht kunst wordt</p>
    </div>
  );
}

export function FooterRight() {
  return (
    <div className="space-y-1">
      <p className="text-white/80">🖱️ Drag to rotate</p>
      <p className="text-white/70">🖱️ Scroll to zoom</p>
    </div>
  );
}