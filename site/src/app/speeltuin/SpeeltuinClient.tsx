'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import TechPlaygroundScene from '@/components/TechPlaygroundScene';

export default function SpeeltuinClient() {
  // Enhanced state management for the 3D scene
  const [material, setMaterial] = useState<'crystal' | 'energy'>('crystal');
  const [palette, setPalette] = useState<'anwar' | 'sunfire'>('anwar');
  const [animationState, setAnimationState] = useState<
    'idle' | 'active' | 'perpetual'
  >('idle');
  const [interactionHeat, setInteractionHeat] = useState(0);

  // Enhanced interaction tracking
  useEffect(() => {
    const cooldown = setInterval(() => {
      setInteractionHeat((prev) => Math.max(0, prev - 0.1));
    }, 100);
    return () => clearInterval(cooldown);
  }, []);

  const handleMaterialToggle = useCallback(() => {
    setMaterial((prev) => (prev === 'crystal' ? 'energy' : 'crystal'));
    setInteractionHeat((prev) => Math.min(1, prev + 0.3));
  }, []);

  const handlePaletteToggle = useCallback(() => {
    setPalette((prev) => (prev === 'anwar' ? 'sunfire' : 'anwar'));
    setInteractionHeat((prev) => Math.min(1, prev + 0.3));
  }, []);

  const handleAnimationToggle = useCallback(() => {
    setAnimationState((prev) => {
      if (prev === 'idle') {
        setInteractionHeat(1);
        return 'active';
      } else if (prev === 'active') {
        return 'perpetual';
      } else {
        return 'idle';
      }
    });
  }, []);

  // Dynamic button text based on animation state
  const getAnimationButtonText = () => {
    switch (animationState) {
      case 'idle':
        return 'Start Animatie';
      case 'active':
        return 'Eeuwige Modus';
      case 'perpetual':
        return 'Stop Animatie';
      default:
        return 'Start Animatie';
    }
  };

  // Dynamic button styling based on interaction heat
  const getInteractionStyling = (baseClasses: string) => {
    const heatLevel = Math.floor(interactionHeat * 3);
    const heatStyles = [
      '',
      'ring-2 ring-cyan-400/30',
      'ring-2 ring-cyan-400/60 shadow-cyan-400/20',
      'ring-4 ring-cyan-400 shadow-lg shadow-cyan-400/40 scale-105',
    ];
    return `${baseClasses} ${heatStyles[heatLevel]} transition-all duration-500`;
  };

  return (
    <main className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 glow-text leading-tight max-w-5xl mx-auto animate-fade-in">
            Onze Expertise in Actie
          </h1>
          <p className="text-xl text-cyan-400 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Waarom u foto&apos;s laten zien als we de magie live kunnen
            demonstreren? Dit is geen portfolio; dit is onze interactieve
            tech-speeltuin. Hier heeft u de controle. Ervaar zelf de kracht van
            de technologie waarmee wij unieke digitale ervaringen bouwen.
          </p>
        </section>

        {/* Enhanced Interactive Controls */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 p-6 glass rounded-xl max-w-3xl mx-auto relative overflow-hidden">
            {/* Interaction heat visualization */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-fuchsia-500/5 opacity-0 transition-opacity duration-1000"
              style={{ opacity: interactionHeat * 0.3 }}
            />

            <button
              onClick={handleMaterialToggle}
              className={getInteractionStyling(
                'px-6 py-3 text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 relative group',
              )}
            >
              <span className="relative z-10">
                {material === 'crystal' ? '🔮 Crystal Mode' : '⚡ Energy Mode'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>

            <button
              onClick={handlePaletteToggle}
              className={getInteractionStyling(
                'px-6 py-3 text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 relative group',
              )}
            >
              <span className="relative z-10">
                {palette === 'anwar'
                  ? '🌊 Anwar Palette'
                  : '🌅 Sunfire Palette'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>

            <button
              onClick={handleAnimationToggle}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                animationState === 'idle'
                  ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25'
                  : animationState === 'active'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg hover:shadow-2xl hover:shadow-green-500/25'
                    : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:shadow-red-500/25'
              }`}
            >
              <span className="relative z-10">{getAnimationButtonText()}</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {animationState === 'perpetual' && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </button>

            {/* Interaction feedback indicator */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < Math.floor(interactionHeat * 3) + 1
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'bg-gray-600/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Dynamic status message */}
          <div className="text-center mt-4">
            <p
              className={`text-sm transition-all duration-500 ${
                interactionHeat > 0.7
                  ? 'text-cyan-300 glow-text'
                  : interactionHeat > 0.3
                    ? 'text-cyan-400'
                    : 'text-gray-400'
              }`}
            >
              {animationState === 'perpetual'
                ? '🌟 Scene eternally alive with endless motion'
                : animationState === 'active'
                  ? '✨ Animation sequence active'
                  : interactionHeat > 0.5
                    ? '🔥 High interaction energy detected'
                    : interactionHeat > 0.2
                      ? '⚡ Scene responding to your touch'
                      : '🎭 Scene ready for your interaction'}
            </p>
          </div>
        </section>

        {/* Enhanced Interactive Canvas */}
        <section className="mb-24 h-[700px]">
          <div className="relative h-full bg-cosmic-900 rounded-xl border border-cosmic-700/60 overflow-hidden shadow-2xl">
            {/* Canvas performance overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-xs text-green-300 font-medium">
                Live Rendering
              </span>
            </div>

            <TechPlaygroundScene
              materialMode={material}
              palette={palette}
              animationState={animationState}
              interactionHeat={interactionHeat}
              autoRotate={true}
            />

            {/* Enhanced interaction hints */}
            <div className="absolute bottom-4 right-4 z-10 text-right">
              <p className="text-xs text-cyan-300/70 mb-1">
                🖱️ Drag to rotate • 🖱️ Scroll to zoom
              </p>
              <p className="text-xs text-cyan-300/50">
                ⚡ Real-time interaction response
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              De Technologie Achter de Magie
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                WebGL/Three.js
              </h3>
              <p className="text-gray-300">
                De basis voor hardware-versnelde 3D-graphics in de browser,
                waardoor complexe en vloeiende visuele ervaringen mogelijk zijn
                zonder plugins.
              </p>
            </div>
            <div className="glass p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                React Three Fiber
              </h3>
              <p className="text-gray-300">
                Een krachtige React-renderer voor Three.js. Het stelt ons in
                staat om declaratieve, herbruikbare 3D-componenten te bouwen die
                naadloos integreren in onze webapplicaties.
              </p>
            </div>
            <div className="glass p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                Real-time Lighting
              </h3>
              <p className="text-gray-300">
                Dynamische belichting en schaduwen die in real-time reageren op
                uw interactie, wat zorgt voor een diepere en meer meeslepende
                visuele ervaring.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 bg-cosmic-900 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
              Klaar om uw eigen ervaring te bouwen?
            </h2>
            <p className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Wat u hier ziet is slechts een glimp van wat we kunnen realiseren.
              Laten we bespreken hoe we deze technologie kunnen inzetten om uw
              bedrijfsdoelen te bereiken.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              Plan een strategiesessie
            </Link>
          </div>
        </section>
      </div>

      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Speeltuin: 3D Webtechnologie in de Praktijk</h1>
        <p>
          Deze interactieve speeltuin demonstreert onze praktijkervaring in het
          creëren van hoogperformante, meeslepende 3D-webervaringen. Als React
          Three Fiber bureau Nederland specialiseren wij ons in WebGL
          ontwikkeling die niet alleen visueel indrukwekkend is, maar ook
          technisch geoptimaliseerd voor alle apparaten. Hier kunt u ervaren hoe
          geavanceerde webtechnologie uw digitale aanwezigheid kan
          transformeren.
        </p>

        <h2>Wat Kunt U Hier Ervaren?</h2>
        <ul>
          <li>
            <strong>Interactieve Productconfiguratoren:</strong> Perfect voor
            e-commerce en verkoop, waarbij klanten producten in real-time kunnen
            aanpassen en visualiseren. Deze technologie verhoogt betrokkenheid
            en converteert bezoekers effectiever naar kopers.
          </li>
          <li>
            <strong>Real-time 3D-visualisaties:</strong> Ideaal voor
            datavisualisatie, architecturale presentaties, of het toegankelijk
            maken van complexe concepten. Wij maken abstract concreet door
            middel van interactieve 3D website ervaringen.
          </li>
          <li>
            <strong>Scroll-gebaseerde Animaties:</strong> Voor boeiende
            storytelling en merkbeleving die gebruikers meeneemt op een visuele
            reis. Deze animaties verbeteren de gebruikerservaring en zorgen voor
            langere sessietijden.
          </li>
          <li>
            <strong>Parallax &amp; Diepte-effecten:</strong> Creëer dimensie en
            beweging die uw content tot leven brengt, met subtiele effecten die
            professioneel ogen en technisch geoptimaliseerd zijn.
          </li>
        </ul>

        <h2>Onze Aanpak: Performance First</h2>
        <p>
          Performance optimalisatie staat centraal in onze
          ontwikkelingsfilosofie. Wij gebruiken lichtgewicht 3D-modellen,
          geavanceerde instancing technieken, slimme lazy loading strategieën en
          robuuste fallbacks voor verschillende hardwareconfiguraties. Deze
          aanpak garandeert dat uw interactieve 3D website soepel draait op alle
          apparaten – van high-end desktops tot mobiele telefoons. Dit is
          cruciaal voor SEO, gebruikersbehoud en conversie, omdat snelheid en
          toegankelijkheid direct bijdragen aan uw ranking in Google en de
          algehele gebruikerservaring.
        </p>
        <p>
          <a href="/contact" className="inline-block mt-4">
            Bespreek een 3D‑use‑case voor uw merk
          </a>
        </p>
      </section>
    </main>
  );
}
