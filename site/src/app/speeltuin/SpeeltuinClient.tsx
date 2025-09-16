'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SceneHUD from '@/components/overlay/SceneHUD';
import { LiveBadge, FooterLeft, FooterRight } from '@/components/overlay/HUDCopy';

// Dynamically import the 3D component with loading fallback
const TechPlaygroundScene = dynamic(() => import('@/components/TechPlaygroundScene'), {
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-cyan-400 text-sm">Loading 3D Experience...</p>
        <p className="text-gray-500 text-xs mt-2">Optimizing for your device</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function SpeeltuinClient() {
  // Enhanced state management for the 3D scene
  const [material, setMaterial] = useState<'crystal' | 'energy'>('crystal');
  const [palette, setPalette] = useState<'anwar' | 'sunfire'>('anwar');
  const [animationState, setAnimationState] = useState<
    'idle' | 'active' | 'perpetual'
  >('idle');
  const [interactionHeat, setInteractionHeat] = useState(0);
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  // Performance detection
  useEffect(() => {
    // Detect slow connections or low-end devices
    const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' || 
      connection.effectiveType === '3g'
    );
    
    // Simple performance heuristic
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    
    if (isSlowConnection || isLowEndDevice) {
      setIsLowPerformanceMode(true);
    }
  }, []);

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
    <main className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden w-full max-w-full pt-safe pb-safe content-safe-top pt-20 md:pt-24">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 glow-text leading-tight max-w-5xl mx-auto animate-fade-in break-words">
            Onze Expertise in Actie
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-400 max-w-4xl mx-auto leading-relaxed animate-slide-up break-words">
            Waarom u foto&apos;s laten zien als we de magie live kunnen
            demonstreren? Dit is geen portfolio; dit is onze interactieve
            tech-speeltuin. Hier heeft u de controle. Ervaar zelf de kracht van
            de technologie waarmee wij unieke digitale ervaringen bouwen.
          </p>
        </section>

        {/* Enhanced Interactive Controls */}
        <section className="mb-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 glass rounded-xl max-w-3xl mx-auto relative overflow-hidden backdrop-blur-md">
            {/* Interaction heat visualization */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-fuchsia-500/5 opacity-0 transition-opacity duration-1000"
              style={{ opacity: interactionHeat * 0.3 }}
            />

            <button
              onClick={handleMaterialToggle}
              className={getInteractionStyling(
                'touch-target min-h-[48px] px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 relative group w-full sm:w-auto active:scale-95',
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
                'touch-target min-h-[48px] px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-sm font-medium border-2 border-cyan-400/40 bg-cosmic-800/60 backdrop-blur-sm rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 relative group w-full sm:w-auto active:scale-95',
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
              className={`touch-target min-h-[48px] px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group w-full sm:w-auto ${
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
        <section className="mb-12 md:mb-16 lg:mb-24 px-2 sm:px-0">
          <div className="relative rounded-2xl bg-slate-900/60 ring-1 ring-white/10 overflow-hidden w-full
                          min-h-[50vh] h-[60vh] max-h-[500px] 
                          xs:min-h-[55vh] xs:h-[65vh] xs:max-h-[550px]
                          sm:min-h-[60vh] sm:h-[70vh] sm:max-h-[600px] 
                          md:aspect-[16/9] md:h-auto md:max-h-none
                          landscape:h-[85vh] landscape:max-h-[85vh]">
            {/* 3D Canvas - Base layer */}
            <div className="absolute inset-0 z-0">
              <TechPlaygroundScene
                materialMode={material}
                palette={palette}
                animationState={animationState}
                interactionHeat={interactionHeat}
                autoRotate={!isLowPerformanceMode}
              />
            </div>
            
            {/* UI Overlay - Above canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <SceneHUD
                topLeft={<LiveBadge />}
                bottomLeft={<FooterLeft />}
                bottomRight={<FooterRight />}
              />
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-12 md:mb-16 lg:mb-24 px-2 sm:px-0">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight break-words px-2 sm:px-0">
              De Technologie Achter de Magie
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="glass p-4 sm:p-6 md:p-8 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-cyan-300 break-words">
                WebGL/Three.js
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                De basis voor hardware-versnelde 3D-graphics in de browser,
                waardoor complexe en vloeiende visuele ervaringen mogelijk zijn
                zonder plugins.
              </p>
            </div>
            <div className="glass p-4 sm:p-6 md:p-8 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-cyan-300 break-words">
                React Three Fiber
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                Een krachtige React-renderer voor Three.js. Het stelt ons in
                staat om declaratieve, herbruikbare 3D-componenten te bouwen die
                naadloos integreren in onze webapplicaties.
              </p>
            </div>
            <div className="glass p-4 sm:p-6 md:p-8 rounded-xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-cyan-300 break-words">
                Real-time Lighting
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                Dynamische belichting en schaduwen die in real-time reageren op
                uw interactie, wat zorgt voor een diepere en meer meeslepende
                visuele ervaring.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8 bg-cosmic-900 rounded-lg mx-2 sm:mx-0">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight break-words">
              Klaar om uw eigen ervaring te bouwen?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed break-words">
              Wat u hier ziet is slechts een glimp van wat we kunnen realiseren.
              Laten we bespreken hoe we deze technologie kunnen inzetten om uw
              bedrijfsdoelen te bereiken.
            </p>
            <Link
              href="/contact"
              className="touch-target inline-block px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 text-base sm:text-lg"
            >
              Plan een strategiesessie
            </Link>
          </div>
        </section>
      </div>

      <section
        id="seo-content"
        className="prose prose-sm sm:prose-base prose-invert max-w-prose mx-auto px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 leading-relaxed overflow-x-hidden"
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
