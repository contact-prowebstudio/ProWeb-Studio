import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import { Suspense } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const AboutScene = dynamicImport(() => import('@/three/AboutScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-cosmic-900/50 to-cosmic-800/30 animate-pulse" />,
});

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

export default function AboutPage() {
  return (
    <main data-page="about" className="min-h-screen">
      {/* HERO */}
      <section
        id="about-hero"
        className="
          relative
          min-h-[70dvh] md:min-h-[76vh] lg:min-h-[80vh]
          flex flex-col items-center justify-center text-center
        "
      >
        {/* 3D Background Animation */}
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-cosmic-900/50 to-cosmic-800/30 animate-pulse" />}>
            <ErrorBoundary>
              <AboutScene />
            </ErrorBoundary>
          </Suspense>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <h1
            className="
              text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight
              bg-gradient-to-r from-cyan-400 via-white to-magenta-400 bg-clip-text text-transparent
              drop-shadow-2xl
            "
          >
            Architecten van de Digitale <br className="hidden md:block" />
            Toekomst
          </h1>

          <p
            className="
              mt-6 text-center text-cyan-300/90
              text-base md:text-lg lg:text-xl
              max-w-3xl md:max-w-4xl mx-auto leading-relaxed
            "
          >
            Wij zijn ProWeb Studio. We zijn een team van strategen, ontwerpers en
            ontwikkelaars met een gedeelde passie: het bouwen van buitengewone
            digitale ervaringen.
          </p>
        </div>
      </section>

      {/* FILOSOFIE SECTION: Centered content below hero */}
      <section className="mt-24">
        <div className="container mx-auto px-4 sm:px-6 flex justify-center">
          <div className="max-w-[800px] text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Onze Filosofie: Voorbij het Traditionele
            </h2>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-base md:text-lg">
              <p>
                Natuurlijk kunnen we een standaard website bouwen in een week. Maar onze passie ligt niet in het herhalen van wat al bestaat. Wij geloven in vooruitgang. In het verleggen van grenzen.
              </p>
              <p>
                Waarom vasthouden aan traditionele oplossingen als de technologie van morgen vandaag al binnen handbereik is? ProWeb Studio is opgericht om die toekomst te bouwen. Wij kiezen bewust voor de meest geavanceerde, performante en meeslepende technologieën, niet omdat het kan, maar omdat het uw merk de voorsprong geeft die het verdient.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 md:mt-24 px-4 sm:px-6 py-16 bg-cosmic-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Onze Missie</h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Onze missie is het empoweren van Nederlandse bedrijven door het creëren van digitale ervaringen die niet alleen technisch superieur zijn, maar ook een diepe, blijvende indruk achterlaten. We transformeren complexe ideeën in intuïtieve, snelle en meeslepende websites die groei stimuleren.
          </p>
        </div>
      </section>

      <section className="mt-16 md:mt-24 px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl leading-tight font-bold mb-8 text-white">
            Klaar om samen te bouwen?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Uw visie verdient de beste technologie en een team dat uw ambitie deelt. Laten we het gesprek starten.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
          >
            Neem Contact Op
          </Link>
        </div>
      </section>
    </main>
  );
}
