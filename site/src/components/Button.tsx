import Link from 'next/link';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'large';
}

export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'normal',
}: ButtonProps) {
  const baseClasses =
    'inline-block font-semibold rounded-lg transition-all duration-300 magnetic-hover relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-cosmic-900';
  const sizeClasses = size === 'large' ? 'px-10 py-4 text-lg' : 'px-8 py-3';
  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-500 to-magenta-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 text-black'
      : 'border border-cyan-500/60 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-100 hover:shadow-lg hover:shadow-cyan-500/20';

  return (
    <Link
      href={href}
      className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
    >
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-magenta-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
        </>
      )}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
        {children}
      </span>
    </Link>
  );
}
