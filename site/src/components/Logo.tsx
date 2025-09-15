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
    sm: 'h-11 w-auto', // 44px - slightly larger from 40px
    md: 'h-14 w-auto', // 56px - slightly larger from 48px
    lg: 'h-16 w-auto', // 64px - slightly larger from 56px
    xl: 'h-18 w-auto', // 72px - slightly larger from 64px
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
