'use client';

export default function AuroraBG() {
  // Lightweight CSS aurora + grain + twinkles
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div 
        className="absolute -inset-32 blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 10%, rgba(0,255,255,.18), transparent 60%),' +
            'radial-gradient(50% 40% at 80% 0%, rgba(255,0,255,.18), transparent 60%),' +
            'conic-gradient(from 180deg at 50% 50%, rgba(18,113,255,.12), rgba(221,74,255,.08), rgba(100,220,255,.10), rgba(18,113,255,.12))'
        }}
      />
      <div 
        className="absolute inset-0 mix-blend-soft-light opacity-20" 
        style={{
          backgroundImage:
            'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.9) 40%, transparent 41%),' +
            'radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,.7) 40%, transparent 41%),' +
            'radial-gradient(1.8px 1.8px at 40% 80%, rgba(255,255,255,.6) 40%, transparent 41%)',
          backgroundSize: '120px 120px, 160px 160px, 140px 140px',
          animation: 'twinkle 6s linear infinite'
        }} 
      />
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity:.2; }
          50% { opacity:.35; }
          100% { opacity:.2; }
        }
      `}</style>
    </div>
  );
}