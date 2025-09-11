'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import Logo from '@/components/Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Voer een geldig e-mailadres in.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan.');
      }

      setStatus('success');
      setEmail(''); // Clear input on success
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Onbekende fout.');
    }
  };

  return (
    <footer className="bg-cosmic-800/20 border-t border-cosmic-700 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-3 transform hover:scale-105 transition-transform duration-300">
              <Logo variant="full" size="lg" withGlow={true} animated={true} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed -mt-1">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigatie</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {siteConfig.navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-cyan-400 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-cyan-400"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-cyan-400"
                >
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-cyan-400">
              Digitale Innovatie in je Inbox
            </h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Blijf op de hoogte van de nieuwste trends in webontwikkeling,
              3D-technologie en digitale transformatie. Exclusieve inzichten van
              onze experts.
            </p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  E-mailadres voor nieuwsbrief
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  placeholder="jouw@email.nl"
                  className="flex-1 px-4 py-3 bg-cosmic-800/60 border border-cosmic-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 placeholder-gray-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'sending'}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Bezig...' : 'Inschrijven'}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-xs text-green-400">Bedankt voor je inschrijving!</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-400">{errorMessage}</p>
              )}
              {status === 'idle' && (
                <p className="text-xs text-gray-500">
                  Geen spam, alleen waardevolle content. Uitschrijven kan altijd.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
          <Link
            href="/privacy"
            aria-label="Privacybeleid"
            className="hover:text-white transition-colors"
          >
            Privacybeleid
          </Link>
          <span aria-hidden>•</span>
          <Link
            href="/voorwaarden"
            aria-label="Algemene voorwaarden"
            className="hover:text-white transition-colors"
          >
            Algemene voorwaarden
          </Link>
          <span aria-hidden>•</span>
          <a
            href="/sitemap.xml"
            aria-label="Sitemap"
            className="hover:text-white transition-colors"
          >
            Sitemap
          </a>
          <span aria-hidden>•</span>
          <a
            href={`mailto:${siteConfig.contact?.inbox ?? 'contact@prowebstudio.nl'}`}
            aria-label="Contact per e-mail"
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
          {process.env.NEXT_PUBLIC_KVK && (
            <>
              <span aria-hidden>•</span>
              <span className="text-white/70">KVK: {process.env.NEXT_PUBLIC_KVK}</span>
            </>
          )}
          {process.env.NEXT_PUBLIC_BTW && (
            <>
              <span aria-hidden>•</span>
              <span className="text-white/70">BTW: {process.env.NEXT_PUBLIC_BTW}</span>
            </>
          )}
        </div>

        <div className="border-t border-cosmic-700 pt-8 mt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
