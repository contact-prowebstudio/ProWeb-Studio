'use client';

import { useEffect, useState } from 'react';

interface PWAInstallProps {
  onInstallPrompt?: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller({ onInstallPrompt }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('Een nieuwe versie van de website is beschikbaar. Vernieuwen?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      onInstallPrompt?.();
    };

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [onInstallPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation declined');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Performance monitoring
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send performance marks to service worker
      const sendPerformanceMark = (name: string, duration: number) => {
        navigator.serviceWorker.controller?.postMessage({
          type: 'PERFORMANCE_MARK',
          name,
          duration
        });
      };

      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          sendPerformanceMark(entry.name, entry.duration);
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });

      return () => observer.disconnect();
    }
    
    return undefined;
  }, []);

  if (isInstalled) {
    return null; // Don't show install prompt if already installed
  }

  if (!isInstallable) {
    return null; // Don't show if not installable
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              App installeren
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Voeg ProWeb Studio toe aan je startscherm voor snelle toegang
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-md transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Installeren
          </button>
          <button
            onClick={() => setIsInstallable(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium py-3 px-4 rounded-md transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
