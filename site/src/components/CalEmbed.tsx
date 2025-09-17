'use client';
import { useState } from 'react';
import { siteConfig } from '@/config/site.config';

export default function CalEmbed() {
  const [open, setOpen] = useState(false);
  const url = siteConfig.links.calcom;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900"
      >
        Plan een call
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4">
          <div className="bg-cosmic-900 rounded-xl border border-cosmic-700/60 w-full max-w-3xl h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-3 border-b border-cosmic-700">
              <h2 className="text-lg font-semibold">Plan een call</h2>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 border border-cosmic-700 bg-cosmic-800/60 hover:bg-cosmic-700/80 transition-colors duration-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Sluiten
              </button>
            </div>
            <iframe src={url} className="w-full h-full" loading="lazy" />
          </div>
        </div>
      )}
    </>
  );
}
