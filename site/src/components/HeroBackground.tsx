// src/components/HeroBackground.tsx
export default function HeroBackground() {
  return (
    <picture className="fixed inset-0 -z-10 pointer-events-none">
      <source srcSet="/assets/hero/nebula_helix.avif" type="image/avif" />
      <source srcSet="/assets/hero/nebula_helix.webp" type="image/webp" />
      <img
        src="/assets/hero/nebula_helix.jpg"
        alt=""
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
