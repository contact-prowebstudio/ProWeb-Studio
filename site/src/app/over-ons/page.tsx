import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import { Suspense } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Over Ons – Architecten van de Digitale Toekomst | ProWeb Studio',
  description: 'Ontdek de visie en missie van ProWeb Studio. Wij combineren geavanceerde technologie met creatief design om de digitale grenzen te verleggen voor Nederlandse bedrijven.',
  alternates: {
    canonical: '/over-ons',
    languages: { 'nl-NL': '/over-ons' },
  },
  openGraph: {
    title: 'Over Ons – ProWeb Studio',
    description: 'Leer ons team en onze filosofie kennen. Wij bouwen de websites van morgen, vandaag.',
    url: 'https://prowebstudio.nl/over-ons',
    type: 'website',
    locale: 'nl_NL',
  },
};

const FlowingRibbons = dynamicImport(() => import('@/three/FlowingRibbons'), {
  ssr: false,
  loading: () => <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full bg-cosmic-900/50 animate-pulse rounded-lg" />,
});

export default function OverOnsPage() {
  return (
    <main className="content-safe-top pt-20 md:pt-24">
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 glow-text">
            Architecten van de Digitale Toekomst
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-400 max-w-3xl mx-auto">
            Wij zijn ProWeb Studio. We zijn een team van strategen, ontwerpers en ontwikkelaars met een gedeelde passie: het bouwen van buitengewone digitale ervaringen.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="prose prose-invert max-w-none">
            <h2>Onze Filosofie: Voorbij het Traditionele</h2>
            <p>
              Natuurlijk kunnen we een standaard website bouwen in een week. Maar onze passie ligt niet in het herhalen van wat al bestaat. Wij geloven in vooruitgang. In het verleggen van grenzen.
            </p>
            <p>
              Waarom vasthouden aan traditionele oplossingen als de technologie van morgen vandaag al binnen handbereik is? ProWeb Studio is opgericht om die toekomst te bouwen. Wij kiezen bewust voor de meest geavanceerde, performante en meeslepende technologieën, niet omdat het kan, maar omdat het uw merk de voorsprong geeft die het verdient.
            </p>
          </div>
          <div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-cosmic-700/60 bg-cosmic-800/20 relative">
            <Suspense fallback={<div className="h-full w-full bg-cosmic-900/50 animate-pulse" />}>
              <ErrorBoundary>
                <FlowingRibbons />
              </ErrorBoundary>
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-cosmic-800/20">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Onze Missie</h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Onze missie is het empoweren van Nederlandse bedrijven door het creëren van digitale ervaringen die niet alleen technisch superieur zijn, maar ook een diepe, blijvende indruk achterlaten. We transformeren complexe ideeën in intuïtieve, snelle en meeslepende websites die groei stimuleren.
            </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Klaar om samen te bouwen?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Uw visie verdient de beste technologie en een team dat uw ambitie deelt. Laten we het gesprek starten.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
          >
            Neem Contact Op
          </Link>
        </div>
      </section>
    </main>
  );
}
