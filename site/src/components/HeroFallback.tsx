// src/components/HeroFallback.tsx
export default function HeroFallback() {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{
        background:
          'radial-gradient(80% 60% at 50% 40%, rgba(124,58,237,0.25) 0%, rgba(0,0,0,0.0) 60%), linear-gradient(180deg, #0b0b12 0%, #05050a 100%)',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, #5ef0ff22 0%, transparent 60%)',
        }}
      />
      <div className="relative text-center">
        <div
          className="mx-auto h-40 w-40 rounded-full border border-white/15 backdrop-blur-sm"
          style={{ boxShadow: '0 0 80px 10px rgba(167,139,250,0.3) inset' }}
        />
      </div>
    </div>
  );
}
