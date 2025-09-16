import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import { Suspense } from 'react';
import Image from 'next/image';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { siteConfig } from '@/config/site.config';
import FAQSchema from '@/components/FAQSchema';

export const metadata: Metadata = {
  title: 'Diensten – Webdesign, 3D websites, SEO & performance optimalisatie',
  description:
    'Maatwerk webdesign & development met 3D-ervaringen, technische SEO, Core Web Vitals en headless CMS. Gericht op groei en resultaat.',
  alternates: {
    canonical: '/diensten',
    languages: { 'nl-NL': '/diensten' },
  },
  openGraph: {
    title: 'Diensten – Webdesign, 3D websites, SEO & performance optimalisatie',
    description:
      'Maatwerk webdesign & development met 3D-ervaringen, technische SEO, Core Web Vitals en headless CMS. Gericht op groei en resultaat.',
    url: 'https://prowebstudio.nl/diensten',
    type: 'website',
    locale: 'nl_NL',
  },
};

const ServicesPolyhedra = dynamicImport(() => import('@/three/ServicesPolyhedra'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-cosmic-900/50 animate-pulse rounded-lg" />
  ),
});

const services = [
  {
    title: 'Fundamenten voor Digitale Dominantie',
    description:
      'Uw website is het hart van uw digitale ecosysteem. Wij bouwen razendsnelle, veilige en schaalbare platformen die niet alleen vandaag indruk maken, maar ook klaar zijn voor de ambities van morgen. Dit is de technologische ruggengraat voor uw online groei.',
    features: [
      'Next.js & React Ontwikkeling',
      'Headless CMS Integratie',
      'Core Web Vitals Optimalisatie',
      'Responsive Design',
    ],
    icon: '🚀',
  },
  {
    title: 'Meeslepende Ervaringen die Onderscheiden',
    description:
      'In een overvolle markt is differentiatie cruciaal. Wij gebruiken interactieve 3D-technologie niet als gimmick, maar als een krachtig middel om uw producten tot leven te brengen, uw merkverhaal te vertellen en een onvergetelijke, diepe connectie met uw publiek te smeden.',
    features: [
      'WebGL & Three.js Experiences',
      'Interactieve Product Configurators',
      'Real-time 3D Visualisaties',
      'Performance Optimalisatie',
    ],
    icon: '🎯',
  },
  {
    title: 'Data-gedreven Groei en Optimalisatie',
    description:
      'Een prachtige website is slechts het begin. Wij zetten data om in actie. Door continu te analyseren, te testen en te optimaliseren, transformeren we uw bezoekers in klanten en maximaliseren we de return on investment (ROI) van uw digitale platform.',
    features: [
      'Gebruikersdata Analyse',
      'A/B Testing & Conversie Optimalisatie',
      'SEO & Content Strategie',
      'Analytics & Tracking',
    ],
    icon: '📈',
  },
];

const dienstenFaqs = [
  { 
    question: 'Wat kost een moderne 3D-website ongeveer?', 
    answer: 'We bieden pakketten vanaf €2.500, afhankelijk van 3D-complexiteit, content en integraties. Complexere projecten met uitgebreide 3D-ervaringen en maatwerk functionaliteiten starten vanaf €5.000.' 
  },
  { 
    question: 'Werken jullie met KvK en BTW in Nederland?', 
    answer: 'Ja, wij zijn in Nederland gevestigd, met KvK en BTW-registratie. Facturen zijn 100% zakelijk bruikbaar en voldoen aan alle Nederlandse administratieve eisen.' 
  },
  { 
    question: 'Hoe snel kunnen jullie opleveren?', 
    answer: 'Een MVP kan binnen 2–4 weken, projecten groter 6–10 weken afhankelijk van scope en assets. We werken in sprints en houden u wekelijks op de hoogte van de voortgang.' 
  },
  { 
    question: 'Bieden jullie onderhoud en SLA?', 
    answer: 'Ja, we bieden onderhoudsplannen met updates, beveiligingspatches en performance monitoring op moderne hosting platforms zoals Vercel en Netlify.' 
  },
  { 
    question: 'Is SEO inbegrepen?', 
    answer: 'Ja, technische SEO, sitemaps, OG images, en laadsnelheid optimalisatie zijn standaard inbegrepen. We zorgen voor optimale Core Web Vitals en zoekmachine vriendelijke code.' 
  },
];

export default function Diensten() {
  // Generate JSON-LD schema for services
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Netherlands',
        },
        serviceType: service.features.join(', '),
      },
    })),
  };

  return (
    <main className="pt-20 md:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema),
        }}
      />
      <FAQSchema faqs={dienstenFaqs} />

      {/* Hero section with 3D elements */}
      <section className="relative min-h-[75svh] md:min-h-[70vh] overflow-hidden flex items-center content-safe-top">
        <Image
          src="/assets/nebula_services_background.png"
          alt="Nebula achtergrond met zwevende geometrische vormen"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-900/40 to-cosmic-900/80" />

        <Suspense
          fallback={<div className="absolute inset-0 bg-cosmic-900/50" />}
        >
          <ErrorBoundary>
            <ServicesPolyhedra />
          </ErrorBoundary>
        </Suspense>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 glow-text leading-tight max-w-5xl mx-auto animate-fade-in">
              Meer dan Code. Oplossingen die Groeien.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyan-400 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              Elke dienst die we aanbieden is een samensmelting van strategie,
              creativiteit en technologische excellentie. We bouwen geen
              websites; we bouwen groeimotoren. Ontdek hoe onze expertise uw
              visie kan omzetten in een meetbaar digitaal succes.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="glass p-6 sm:p-7 md:p-8 rounded-xl hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                <div className="relative z-10">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 group-hover:text-cyan-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <h4 className="font-semibold text-cyan-300 mb-4">
                    Inclusief:
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-sm">
                        <span className="text-cyan-400 mr-3 font-bold text-lg">
                          ✓
                        </span>
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cosmic-800/20 border-t border-cosmic-700/60">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Onze Technologische Kern
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Wij geloven in het kiezen van het juiste gereedschap voor elke
              uitdaging. Onze expertise ligt in een moderne, performante en
              schaalbare technologiestack, ontworpen om u een
              concurrentievoordeel te geven.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Next.js</li>
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>GSAP</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 mb-4">
                3D & Animatie
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>WebGL</li>
                <li>Three.js</li>
                <li>React Three Fiber</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 mb-4">
                Backend & CMS
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>Headless CMS (o.a. Sanity, Contentful)</li>
                <li>Node.js</li>
                <li>Vercel Serverless Functions</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 mb-4">
                Deployment & Infrastructuur
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>Vercel</li>
                <li>Netlify</li>
                <li>AWS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cosmic-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Op maat gemaakte oplossingen
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Elk project is uniek. Laten we samen jouw perfecte oplossing bouwen
            die jouw verwachtingen overtreft.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="/contact"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Plan een intake</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="/speeltuin"
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border border-cyan-400/60 text-cyan-100 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 hover:border-cyan-400/80 hover:shadow-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ervaar onze technologie
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5-5 5M6 12h12"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Diensten die groei versnellen</h1>
        <h2>Webdesign &amp; Development</h2>
        <p>
          Een professionele website laten maken begint bij een ijzersterk
          fundament. Wij bouwen maatwerk websites met een scherp oog voor
          snelheid, gebruiksvriendelijkheid en een conversiegericht ontwerp dat
          bezoekers omzet in klanten. Of u nu ZZP&apos;er bent of een groeiend
          MKB-bedrijf runt, uw online groei is onze prioriteit.
        </p>
        <h2>3D Web Experiences (WebGL/Three.js)</h2>
        <p>
          Onderscheid uw merk met interactieve 3D-ervaringen die uw producten en
          diensten tot leven brengen. Door WebGL en Three.js technologie slim in
          te zetten, creëren we meeslepende gebruikerservaringen die langer op
          uw website blijven hangen. Perfect voor bedrijven die hun merkverhaal
          op een unieke manier willen vertellen en een blijvende indruk willen
          maken.
        </p>
        <h2>Performance Optimalisatie</h2>
        <p>
          Een snelle website is essentieel voor een hogere ranking in Google en
          betere gebruikerservaring. Wij optimaliseren uw Core Web Vitals,
          implementeren geavanceerde caching strategieën en gebruiken moderne
          beeldformaten zoals AVIF en WebP. Het resultaat: een bliksemsnelle
          website die zowel gebruikers als zoekmachines tevreden houdt.
        </p>
        <h2>SEO &amp; Content Strategie</h2>
        <p>
          Zichtbaarheid in Google begint met een solide SEO-strategie. Wij
          voeren diepgaand zoekwoordenonderzoek uit, optimaliseren technische
          aspecten en ontwikkelen een contentplan dat uw doelgroep aanspreekt.
          Van lokale SEO voor Nederlandse bedrijven tot internationale groei –
          wij zorgen ervoor dat uw website gevonden wordt door de juiste
          klanten.
        </p>
        <h2>Headless CMS &amp; Integraties</h2>
        <p>
          Flexibel contentbeheer is de sleutel tot efficiënte online
          communicatie. Met headless CMS-oplossingen zoals Sanity of Contentful
          krijgt u volledige controle over uw content, zonder technische
          beperkingen. Wij integreren naadloos met uw bestaande systemen en
          zorgen voor een workflow die aansluit bij uw bedrijfsprocessen.
        </p>
        <h2>CRO (Conversion Rate Optimization)</h2>
        <p>
          Meer bezoekers is mooi, maar meer klanten is beter. Door systematische
          A/B-testing, gebruikersanalyse en UX-verbeteringen transformeren we uw
          website van een digitale brochure naar een krachtige verkoopmotor.
          Elke aanpassing is data-gedreven en gericht op het verhogen van uw
          conversie en omzet.
        </p>
        <p>
          <a href="/contact" className="inline-block mt-4">
            Vraag een groeiscan aan
          </a>
        </p>
      </section>
    </main>
  );
}
