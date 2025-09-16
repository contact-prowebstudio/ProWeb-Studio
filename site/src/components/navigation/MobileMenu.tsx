'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Portal from '@/components/ui/Portal';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import Magnetic from '@/components/ui/Magnetic';
import AuroraBG from '@/components/decoration/AuroraBG';

type Item = { href: string; label: string };

export default function MobileMenu({
  open, 
  onClose, 
  items
}: { 
  open: boolean; 
  onClose: () => void; 
  items: Item[] 
}) {
  useLockBodyScroll(open);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  // close on route change
  useEffect(() => { 
    if (open) onClose(); 
    /* eslint-disable-next-line */
  }, [pathname]);

  // esc to close + initial focus
  useEffect(() => {
    if (!open) return;
    
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose(); 
    };
    
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    
    return () => { 
      window.removeEventListener('keydown', onKey); 
      clearTimeout(t); 
    };
  }, [open, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" 
            aria-modal
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] h-[100svh]"
          >
            {/* backdrop */}
            <button 
              aria-label="Close menu" 
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm focus:outline-none" 
            />
            
            {/* panel */}
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                transition: { duration: .25, ease: 'easeOut' } 
              }}
              exit={{ 
                y: -24, 
                opacity: 0, 
                transition: { duration: .18, ease: 'easeIn' } 
              }}
              className="absolute inset-x-3 top-[max(12px,env(safe-area-inset-top))] bottom-[max(12px,env(safe-area-inset-bottom))] 
                         mx-auto max-w-xl overflow-hidden rounded-2xl border border-white/10 
                         bg-white/6 ring-1 ring-white/15 backdrop-blur-xl shadow-2xl"
            >
              <AuroraBG />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)' }} 
              />
              
              <nav className="relative h-full overflow-y-auto px-5 sm:px-7 py-5">
                <ul className="mt-2 space-y-1.5">
                  {items.map((it, i) => (
                    <motion.li
                      key={it.href}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1, 
                        transition: { 
                          delay: 0.05 + i * 0.06, 
                          duration: .25 
                        } 
                      }}
                    >
                      <Magnetic className="will-change-transform">
                        <Link
                          ref={i === 0 ? firstRef : undefined}
                          href={it.href}
                          onClick={onClose}
                          className="block w-full rounded-xl px-4 py-4 text-[17px] font-medium tracking-wide
                                     text-white/95 hover:text-white min-h-[44px] flex items-center
                                     hover:bg-white/6 focus:bg-white/8 focus:outline-none
                                     ring-1 ring-transparent hover:ring-white/10 focus:ring-white/15
                                     transition-colors"
                        >
                          {it.label}
                        </Link>
                      </Magnetic>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}