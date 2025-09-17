import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title:
    'Website laten maken in Nederland | 3D webdesign & hoge performance – ProWeb Studio',
  description:
    'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D-websites die scoren in Google en converteren. Maatwerk met Next.js, React Three Fiber en SEO-first aanpak.',
  alternates: {
    canonical: '/',
    languages: { 'nl-NL': '/' },
  },
  openGraph: {
    images: [
      { url: '/og', width: 1200, height: 630 },
    ],
    title:
      'Website laten maken in Nederland | 3D webdesign & hoge performance – ProWeb Studio',
    description:
      'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D-websites die scoren in Google en converteren. Maatwerk met Next.js, React Three Fiber en SEO-first aanpak.',
    url: 'https://prowebstudio.nl/',
    type: 'website',
    locale: 'nl_NL',
  },
  keywords: [
    'website laten maken',
    'website maken',
    'maken van een website',
    '3D website',
    'webdesign Nederland',
  ],
};

import HeroBackground from '@/components/HeroBackground';
import dynamicImport from 'next/dynamic';

const HeroCanvas = dynamicImport(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

const HeroScene = dynamicImport(() => import('@/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});
import Image from 'next/image';
import Link from 'next/link';

// Dynamic import for 3D hexagonal prism scene with performance optimization
const HexagonalPrism = dynamicImport(() => import('@/three/HexagonalPrism'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" />,
});

interface CaseCardProps {
  title: string;
  metric: string;
  desc: string;
}

function CaseCard({ title, metric, desc }: CaseCardProps) {
  return (
    <article className="rounded-2xl border border-cosmic-700/60 bg-cosmic-800/40 p-6 sm:p-7 md:p-8 hover:bg-cosmic-800/60 transition-all duration-300 hover:border-cosmic-600/80 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
          {title}
        </h3>
        <p className="text-cyan-400 font-semibold text-base sm:text-lg mb-4 group-hover:text-cyan-300 transition-colors duration-300">
          {metric}
        </p>
        <p className="text-gray-300 leading-relaxed text-sm">{desc}</p>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="relative content-safe-top pt-20 md:pt-24">
      {/* HERO SECTION */}
      <section
        aria-label="Hero"
        className="homepage-hero relative min-h-[92vh] grid place-items-center overflow-hidden"
      >
        {/* Background cosmic image */}
        <Image
          src="/assets/hero/nebula_helix.avif"
          alt="Kosmische nevel achtergrond voor webontwikkeling en 3D ervaringen"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover opacity-60"
        />

        {/* 3D Portal Scene */}
        <div className="absolute inset-0">
          <HeroBackground />
          <HeroCanvas>
            <HeroScene />
          </HeroCanvas>
        </div>

        {/* Hero content with enhanced typography */}
        <div className="relative z-10 text-center max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-12 sm:py-16 md:py-20 lg:py-24">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-shadow-sharp tracking-tight leading-tight mb-8 motion-safe:animate-fade-in">
            Laat een website maken die indruk maakt. En converteert.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 mb-12 max-w-4xl mx-auto motion-safe:animate-slide-up">
            Wij transformeren uw idee tot een razendsnelle, interactieve
            ervaring — van corporate sites tot meeslepende 3D-werelden die uw
            bezoekers boeien en uw bedrijf laten groeien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Start uw project
            </Link>
            <Link
              href="/werkwijze"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border-2 border-gray-600 rounded-lg font-semibold text-base sm:text-lg hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Ontdek onze werkwijze →
            </Link>
          </div>

          <p className="mt-12 text-gray-400 text-sm motion-safe:animate-fade-in-delayed">
            Vertrouwd door founders, misb en scale-ups die vooruit willen.
          </p>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      <section aria-label="Cases" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 glass">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
            Meetbare Impact, Elke Keer Weer.
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            We bouwen niet zomaar websites — we leveren digitale groeimotoren
            die presteren.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <CaseCard
              title="Fundament voor Groei"
              metric="Razendsnelle Next.js Websites"
              desc="Wij bouwen op maat gemaakte, veilige en SEO-geoptimaliseerde websites die de kern van uw digitale aanwezigheid vormen en klaar zijn voor de toekomst."
            />
            <CaseCard
              title="Meeslepende 3D Ervaringen"
              metric="Interactieve WebGL & R3F"
              desc="Transformeer uw merk met unieke 3D-productvisualisaties en interactieve ervaringen die bezoekers boeien en een onvergetelijke indruk achterlaten."
            />
            <CaseCard
              title="Complete E-commerce Oplossingen"
              metric="Conversiegerichte Webshops"
              desc="Van ontwerp tot implementatie, wij creëren krachtige webshops die niet alleen prachtig zijn, maar ook ontworpen om uw online verkoop te maximaliseren."
            />
          </div>
        </div>
      </section>

      {/* Process section remains unchanged */}
      <section aria-label="Process" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 text-center leading-tight">
            Van Visie naar Virtuoze Uitvoering
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🎯
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Strategie
              </h3>
              <p className="text-gray-400">
                Deep-dive in uw doelen, markt en gebruikers. We vertalen
                ambities naar een technisch stappenplan.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                ✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Design
              </h3>
              <p className="text-gray-400">
                Van wireframes tot pixel-perfect designs. UI/UX die converteert
                én uw merk versterkt.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🚀
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Build
              </h3>
              <p className="text-gray-400">
                Clean code, moderne stack, 100% maatwerk. Gebouwd voor snelheid,
                schaal en toekomst.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                📈
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Growth
              </h3>
              <p className="text-gray-400">
                Continue optimalisatie op basis van data. A/B testing, SEO, en
                conversion rate optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Tech section with enhanced background */}
      <section
        aria-label="3D Technology"
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
                De Toekomst is 3D. Wij Bouwen Die Vandaag.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Transformeer uw producten in interactieve ervaringen. Van
                configurators tot virtuele showrooms — wij pushen de grenzen van
                het web.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">
                      Real-time 3D Rendering:
                    </strong>{' '}
                    Vloeiende 60+ FPS experiences op elk device
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">WebGL & Three.js:</strong>{' '}
                    Cutting-edge tech, maximale browser support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base sm:text-lg md:text-xl mt-1">→</span>
                  <span className="text-gray-300">
                    <strong className="text-white">Performance First:</strong>{' '}
                    Geoptimaliseerd voor mobile en desktop
                  </span>
                </li>
              </ul>
              <Link
                href="/speeltuin"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 hover:gap-4 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
              >
                Bekijk live demos
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden border border-cosmic-700/60 bg-cosmic-800/20 relative">
              <HexagonalPrism />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section remains unchanged */}
      <section aria-label="Call to action" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Klaar om de Sprong te Maken?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Of u nu een startup bent die wil opschalen, of een enterprise die
            digitaal wil transformeren — wij zijn er om uw visie werkelijkheid
            te maken.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Plan een strategiesessie
            </Link>
            <Link
              href="/diensten"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border-2 border-gray-600 rounded-lg font-semibold text-base sm:text-lg hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
            >
              Bekijk onze diensten
            </Link>
          </div>
        </div>
      </section>

      <section
        id="seo-content"
        className="prose prose-invert max-w-none py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
      >
        <h1>Professionele Website Laten Maken in Nederland</h1>
        <p>
          Bij ProWeb Studio bouwen we resultaatgerichte websites die uw bedrijf
          laten groeien. Van snelle corporate websites voor MKB en startups tot
          meeslepende 3D-ervaringen die uw merk onderscheiden – wij leveren
          maatwerk oplossingen die converteren. Onze websites scoren hoog in
          Google, laden razendsnel en zijn gebouwd voor toekomstige groei.
        </p>

        <h2>Waarom Kiezen voor ProWeb Studio?</h2>
        <ul>
          <li>
            <strong>Snelheid &amp; Core Web Vitals:</strong> Wij zorgen voor
            perfecte Google-scores met Core Web Vitals optimalisatie, waardoor
            uw website niet alleen snel laadt maar ook een uitstekende
            gebruikerservaring biedt die bezoekers behoudt.
          </li>
          <li>
            <strong>Uniek &amp; Creatief Design:</strong> Van professionele
            UI/UX design tot unieke 3D-interacties en WebGL-ervaringen – wij
            creëren websites die opvallen en uw merkverhaal krachtig
            overbrengen.
          </li>
          <li>
            <strong>SEO-First Architectuur:</strong> Elke website bouwen we
            vanaf de grond op met technische SEO in gedachten, zodat u een
            hogere ranking in Google behaalt en meer organisch verkeer
            genereert.
          </li>
          <li>
            <strong>Maatwerk &amp; Schaalbaarheid:</strong> Geen templates of
            standaardoplossingen – wij ontwikkelen volledig op maat met
            toekomstbestendige technologie die meegroeit met uw ambities en
            bedrijfsdoelen.
          </li>
        </ul>

        <h2>Onze Diensten: Van Strategie tot Groei</h2>
        <p>
          Als uw volledige digitale partner begeleiden wij u door het complete
          proces van website ontwikkeling. We starten met een grondige
          strategieanalyse, vertalen deze naar gebruiksvriendelijk design,
          bouwen met de nieuwste technologieën en zorgen voor continue groei
          door data-gedreven optimalisatie. Of u nu een startup bent die online
          wil groeien of een gevestigd bedrijf dat zijn digitale aanwezigheid
          wil vernieuwen – wij maken van uw website een krachtige groeimachine.
        </p>

        <h2>Veelgestelde Vragen (FAQ)</h2>
        <p>
          <strong>Wat kost een website laten maken?</strong> De kosten variëren
          afhankelijk van uw specifieke wensen en functionaliteiten. We werken
          met transparante, vaste prijzen per project en bieden altijd een
          vrijblijvende offerte na een uitgebreide intake.
        </p>
        <p>
          <strong>Hoe lang duurt het proces van website bouwen?</strong> Een
          professionele website ontwikkelen duurt gemiddeld 4-8 weken,
          afhankelijk van de complexiteit en beschikbaarheid van content.
          Tijdens het project houden we u continu op de hoogte van de voortgang.
        </p>
        <p>
          <strong>Zijn jullie websites zoekmachinevriendelijk?</strong>{' '}
          Absoluut! Alle websites bouwen we met SEO-first architectuur,
          inclusief technische optimalisatie, snelheidsoptimalisatie en schema
          markup voor betere zichtbaarheid in Google.
        </p>
        <p>
          <strong>
            Kunnen jullie ook mijn bestaande website optimaliseren?
          </strong>{' '}
          Ja, we voeren uitgebreide technische audits uit en ontwikkelen een op
          maat gemaakt verbeterplan om uw huidige website sneller, veiliger en
          conversiegerichter te maken.
        </p>
        <p>
          <a href="/contact" className="inline-block mt-4">
            Plan een kennismaking
          </a>
        </p>
      </section>

      <section
        id="seo-content"
        className="prose prose-invert max-w-none py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="sr-only">Structured data</h2>
      </section>
    </main>
  );
}
