import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import { Suspense } from 'react';
import Image from 'next/image';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

// Get canonical URL from environment with fallback
const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';

export const metadata: Metadata = {
  title: 'Werkwijze – van intake tot launch, transparant en voorspelbaar',
  description:
    'Helder proces: intake & strategie, design, bouwen, launch & groei. Transparante communicatie en meetbare stappen.',
  alternates: {
    canonical: '/werkwijze',
    languages: { 'nl-NL': '/werkwijze' },
  },
  openGraph: {
    title: 'Werkwijze – van intake tot launch, transparant en voorspelbaar',
    description:
      'Helder proces: intake & strategie, design, bouwen, launch & groei. Transparante communicatie en meetbare stappen.',
    url: `${SITE_URL}/werkwijze`,
    type: 'website',
    locale: 'nl_NL',
  },
};

const OrbitSystem = dynamicImport(() => import('@/three/OrbitSystem'), {
  ssr: false,
  loading: () => <div className="h-96 bg-cosmic-900" />,
});

const steps = [
  {
    name: 'Intake',
    description: 'We duiken diep in jouw visie en doelstellingen',
  },
  { name: 'Strategie', description: 'Data-gedreven plan voor maximale impact' },
  { name: 'Design', description: 'Visueel ontwerp dat jouw merk versterkt' },
  { name: 'Development', description: 'Clean code, gebouwd voor de toekomst' },
  { name: 'QA', description: 'Rigoureus testen voor perfecte prestaties' },
  { name: 'Launch', description: 'Soepele deployment en go-live begeleiding' },
  { name: 'Groei', description: 'Continue optimalisatie en ondersteuning' },
];

export default function Werkwijze() {
  return (
    <main className="content-safe-top pt-20 md:pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Werkwijze", url: "/werkwijze" }
        ]}
      />
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 glow-text">
              Werkwijze — website laten maken: van intake tot launch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyan-400 max-w-2xl mx-auto">
              Een bewezen proces dat resultaat garandeert
            </p>
          </div>

          <div className="relative h-96 mb-12">
            {/* Subtle ambient glow behind the composition */}
            <div aria-hidden className="absolute inset-0 pointer-events-none -z-10 portal-gradient opacity-60 blur-3xl" />
            <Image
              src="/assets/team_core_star.png"
              alt="Centrale ster die ons proces symboliseert"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center mix-screen image-soft-glow mask-soft-edges no-pointer z-10 translate-y-[2%] md:translate-y-[1.5%]"
            />
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Suspense fallback={<div className="absolute inset-0" />}> 
                <ErrorBoundary>
                  <OrbitSystem />
                </ErrorBoundary>
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="glass p-6 rounded-lg hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center mb-4">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mr-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">{step.name}</h3>
                </div>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-cosmic-800/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
            Onze Principes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-cyan-400">
                Transparantie
              </h3>
              <p className="text-gray-300">
                Open communicatie tijdens het hele proces. Je weet altijd waar
                we staan.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-magenta-400">
                Innovatie
              </h3>
              <p className="text-gray-300">
                We gebruiken de nieuwste technologieën om je voorsprong te
                geven.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-cyan-400">
                Kwaliteit
              </h3>
              <p className="text-gray-300">
                Geen compromissen. Elk detail wordt geperfectioneerd.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-magenta-400">
                Partnership
              </h3>
              <p className="text-gray-300">
                We zijn niet alleen leverancier, maar strategische partner in
                jouw groei.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="seo-content"
        className="prose prose-invert max-w-none py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
      >
        <h1>Een Duidelijk Proces voor een Succesvolle Website</h1>
        <p>
          Ons bewezen stappenplan website bouwen garandeert resultaat,
          transparantie en een soepele samenwerking van start tot finish. Als
          betrouwbare webbouwer in Nederland hanteren wij een transparante
          werkwijze die zorgt voor voorspelbaar resultaat zonder verrassingen.
          Elk project doorloopt dezelfde zorgvuldige fasen, waardoor u altijd
          weet waar u aan toe bent tijdens het website laten maken proces.
        </p>

        <h2>De Fases van uw Project: Van Idee tot Groei</h2>
        <ul>
          <li>
            <strong>01. Intake:</strong> Tijdens deze cruciale eerste fase
            duiken we diep in uw visie en doelstellingen, zodat we een website
            kunnen bouwen die perfect aansluit bij uw bedrijfsstrategie en
            doelgroep.
          </li>
          <li>
            <strong>02. Strategie:</strong> We ontwikkelen een data-gedreven
            plan voor maximale impact, waardoor uw investering in een nieuwe
            website direct bijdraagt aan uw bedrijfsdoelen en ROI.
          </li>
          <li>
            <strong>03. Design:</strong> Ons team creëert een visueel ontwerp
            dat uw merk versterkt en gebruikers overtuigt, resulterend in een
            professionele uitstraling die vertrouwen en conversie bevordert.
          </li>
          <li>
            <strong>04. Development:</strong> We schrijven clean code en bouwen
            voor de toekomst, zodat uw website niet alleen vandaag perfect
            functioneert maar ook schaalbaar is voor toekomstige groei.
          </li>
          <li>
            <strong>05. QA:</strong> Door rigoureus testen garanderen we
            perfecte prestaties op alle apparaten en browsers, waardoor uw
            bezoekers altijd een optimale gebruikerservaring hebben.
          </li>
          <li>
            <strong>06. Launch:</strong> Onze soepele deployment en go-live
            begeleiding zorgen ervoor dat uw website probleemloos online gaat
            zonder downtime of technische problemen.
          </li>
          <li>
            <strong>07. Groei:</strong> Continue optimalisatie en ondersteuning
            helpen uw website groeien met uw bedrijf, met regelmatige updates en
            prestatieverbeteringen.
          </li>
        </ul>

        <h2>Waarom Onze Werkwijze het Verschil Maakt</h2>
        <p>
          Onze gestructureerde aanpak betekent geen verrassingen: u krijgt
          vooraf duidelijke tijdlijnen, transparante communicatie in elke fase,
          en gegarandeerde kwaliteit door onze bewezen methodiek. Dit
          stappenplan website bouwen heeft al tientallen Nederlandse bedrijven
          geholpen hun online doelen te bereiken. Door deze transparante
          werkwijze weet u precies wat u kunt verwachten en wanneer, waardoor
          het website laten maken proces een stressloze en voorspelbare ervaring
          wordt die altijd tot een succesvol eindresultaat leidt.
        </p>
        <p>
          <a href="/contact" className="inline-block mt-4">
            Start uw project met ons bewezen proces
          </a>
        </p>
      </section>
    </main>
  );
}
