'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import Logo from '@/components/Logo';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [is3DEnabled, setIs3DEnabled] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const stored3D = localStorage.getItem('3d-enabled');
    if (stored3D !== null) setIs3DEnabled(stored3D === 'true');

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggle3D = () => {
    const newValue = !is3DEnabled;
    setIs3DEnabled(newValue);
    localStorage.setItem('3d-enabled', String(newValue));
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-4 backdrop-blur-xl border-b border-cosmic-700/30'
          : 'py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center">
        <div className="absolute left-6">
          <Link
            href="/"
            className="group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900 rounded-lg p-1 -m-1"
            aria-label="ProWeb Studio Homepage"
          >
            <Logo
              variant="full"
              size={isScrolled ? 'sm' : 'md'}
              withGlow={true}
              className="transition-all duration-300"
            />
          </Link>
        </div>

        <nav
          className="hidden md:flex items-center gap-8 mx-auto"
          aria-label="Primary navigation"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-gray-300 hover:text-white transition-all duration-300 relative group py-2 px-3 rounded-lg hover:bg-cyan-400/5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              <span className="relative z-10">{item.name}</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
          <button
            onClick={toggle3D}
            className="px-4 py-2.5 text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            aria-label={`3D-graphics ${is3DEnabled ? 'uitschakelen' : 'inschakelen'}`}
            aria-pressed={is3DEnabled}
          >
            <span className="relative z-10 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  is3DEnabled
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-lg shadow-cyan-400/50'
                    : 'bg-gray-400/60'
                }`}
              />
              3D {is3DEnabled ? 'Uit' : 'Aan'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden absolute right-6 flex flex-col gap-1 p-2 hover:bg-cosmic-800/50 rounded-lg transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden absolute top-full left-0 w-full glass backdrop-blur-xl border-t border-cosmic-700/60 animate-fade-in"
        >
          <div className="px-6 py-6 space-y-4">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block font-medium text-gray-300 hover:text-white transition-all duration-300 py-3 hover:bg-cyan-500/5 rounded-lg px-3 relative group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
            <button
              onClick={toggle3D}
              className="w-full text-left px-4 py-3.5 text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
              aria-pressed={is3DEnabled}
              aria-label={`3D-graphics ${is3DEnabled ? 'uitschakelen' : 'inschakelen'}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    is3DEnabled
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-lg shadow-cyan-400/50'
                      : 'bg-gray-400/60'
                  }`}
                />
                3D {is3DEnabled ? 'Uit' : 'Aan'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
