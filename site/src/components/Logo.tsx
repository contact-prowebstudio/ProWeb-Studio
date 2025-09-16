/* eslint-disable @next/next/no-img-element */
// /src/components/Logo.tsx

export interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  withGlow = true, // Defaulting to true for a more luminous feel
  animated = true,
}: LogoProps) {
  const sizes = {
    sm: 'h-10 w-auto md:h-11 md:w-auto', // Mobile: 40px, Desktop: 44px
    md: 'h-12 w-auto md:h-14 md:w-auto', // Mobile: 48px, Desktop: 56px - better mobile visibility
    lg: 'h-14 w-auto md:h-16 md:w-auto', // Mobile: 56px, Desktop: 64px
    xl: 'h-16 w-auto md:h-18 md:w-auto', // Mobile: 64px, Desktop: 72px
  };

  // The new bloom animation is applied conditionally
  const animationEffect =
    animated && withGlow ? 'motion-safe:animate-bloom' : '';

  const baseClasses = `${sizes[size]} transition-all duration-300 ${className}`;

  if (variant === 'icon') {
    return (
      <div className={baseClasses}>
        <img
          src="/assets/logo/logo-proweb-icon.svg"
          alt="ProWeb Studio Icoon"
          className={`h-full w-full ${animationEffect}`}
        />
      </div>
    );
  }

  // 'full' variant uses the lockup design with ProWeb Studio text
  return (
    <div
      className={`inline-flex items-center ${baseClasses}`}
      aria-label="ProWeb Studio Logo"
    >
      <img
        src="/assets/logo/logo-proweb-lockup.svg"
        alt="ProWeb Studio Logo"
        className={`h-full w-auto ${animationEffect}`}
        style={{
          filter: withGlow
            ? 'drop-shadow(0 0 10px rgba(52, 211, 238, 0.3))'
            : 'none',
        }}
      />
    </div>
  );
}
