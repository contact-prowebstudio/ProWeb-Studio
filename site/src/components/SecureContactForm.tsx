'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { siteConfig } from '@/config/site.config';
import CalEmbed from '@/components/CalEmbed';
import Image from 'next/image';

// Enhanced validation schema matching the API
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Naam moet minimaal 2 karakters zijn')
    .max(100, 'Naam mag niet langer zijn dan 100 karakters')
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Naam bevat ongeldige karakters'),
  email: z.string()
    .email('Ongeldig e-mailadres')
    .max(254, 'E-mailadres te lang')
    .refine(email => {
      const disposableProviders = ['10minutemail', 'tempmail', 'guerrillamail', 'mailinator'];
      return !disposableProviders.some(provider => email.includes(provider));
    }, 'Tijdelijke e-mailadressen zijn niet toegestaan'),
  phone: z.string()
    .optional()
    .refine(phone => !phone || /^[\+]?[0-9\s\-\(\)]+$/.test(phone), 'Ongeldig telefoonnummer formaat'),
  projectTypes: z
    .array(z.string())
    .min(1, 'Selecteer minimaal één projecttype')
    .max(10, 'Te veel projecttypes geselecteerd'),
  message: z.string()
    .min(10, 'Bericht moet minimaal 10 karakters zijn')
    .max(5000, 'Bericht te lang'),
  // Honeypot field (should remain empty)
  website: z.string().max(0).optional(),
});

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

// Declare reCAPTCHA global
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function SecureContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectTypes: [] as string[],
    message: '',
    website: '', // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [formStartTime] = useState(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && !window.grecaptcha) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.onload = () => {
          setRecaptchaLoaded(true);
        };
        document.head.appendChild(script);
      } else if (window.grecaptcha) {
        setRecaptchaLoaded(true);
      }
    };

    loadRecaptcha();
  }, []);

  // Basic bot detection - track user interaction patterns
  const [userInteractions, setUserInteractions] = useState({
    mouseMovements: 0,
    keystrokes: 0,
    formFocused: false
  });

  useEffect(() => {
    const handleMouseMove = () => {
      setUserInteractions(prev => ({ ...prev, mouseMovements: prev.mouseMovements + 1 }));
    };

    const handleKeyDown = () => {
      setUserInteractions(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
    };

    const handleFocus = () => {
      setUserInteractions(prev => ({ ...prev, formFocused: true }));
    };

    if (formRef.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyDown);
      formRef.current.addEventListener('focusin', handleFocus);

      // Capture the current ref value for cleanup
      const currentFormRef = formRef.current;

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeyDown);
        if (currentFormRef) {
          currentFormRef.removeEventListener('focusin', handleFocus);
        }
      };
    }
    
    // Return undefined for code paths without cleanup
    return undefined;
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Basic input sanitization on client side
    const sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers

    setForm(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onToggleType = (type: string) => {
    setForm(prev => {
      const set = new Set(prev.projectTypes);
      if (set.has(type)) set.delete(type);
      else set.add(type);
      return { ...prev, projectTypes: Array.from(set) };
    });
  };

  // Get reCAPTCHA token
  const getRecaptchaToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !recaptchaLoaded) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        reject(new Error('reCAPTCHA site key not configured'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action: 'contact_form' })
          .then((token: string) => resolve(token))
          .catch((error: unknown) => reject(error));
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Basic bot detection checks
    const timeSpent = Date.now() - formStartTime;
    const minimumTimeExpected = 5000; // 5 seconds minimum

    if (timeSpent < minimumTimeExpected) {
      console.warn('Form submitted too quickly');
      setErrors({ general: 'Formulier te snel ingezonden. Probeer opnieuw.' });
      setStatus('error');
      return;
    }

    if (userInteractions.mouseMovements < 5 || userInteractions.keystrokes < 10) {
      console.warn('Insufficient user interaction detected');
      setErrors({ general: 'Onvoldoende gebruikersinteractie gedetecteerd.' });
      setStatus('error');
      return;
    }

    // Check honeypot field
    if (form.website && form.website.length > 0) {
      console.warn('Honeypot field filled');
      setErrors({ general: 'Bot gedetecteerd.' });
      setStatus('error');
      return;
    }

    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    setErrors({});

    try {
      // Get reCAPTCHA token
      let recaptchaToken = '';
      try {
        recaptchaToken = await getRecaptchaToken();
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setErrors({ general: 'reCAPTCHA verificatie mislukt. Probeer de pagina te vernieuwen.' });
        setStatus('error');
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
          timestamp: Date.now(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Te veel verzoeken. Probeer later opnieuw.');
        }
        throw new Error(data.error || 'Server responded with an error');
      }

      setStatus('success');
      // Reset form after successful submission
      setForm({
        name: '',
        email: '',
        phone: '',
        projectTypes: [],
        message: '',
        website: '',
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Er is een fout opgetreden. Probeer opnieuw.' 
      });
      setStatus('error');
    }
  };

  return (
    <>
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 min-h-[60vh] grid place-items-center overflow-hidden">
        <Image
          src="/assets/glowing_beacon_contact.png"
          alt="Lichtbaken dat de weg wijst — contact achtergrond"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center opacity-30 pointer-events-none"
        />
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Laten we jouw{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  digitale visie
                </span>{' '}
                realiseren
              </h1>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Klaar om jouw online aanwezigheid naar het volgende niveau te
                tillen? Vertel ons over jouw project en ontdek hoe ProWeb
                Studio jouw digitale doelen kan realiseren.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                  📧
                </div>
                <div>
                  <h3 className="font-semibold text-white">Direct Contact</h3>
                  <p className="text-gray-300">{siteConfig.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-white">Telefonisch</h3>
                  <p className="text-gray-300">{siteConfig.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                  🕒
                </div>
                <div>
                  <h3 className="font-semibold text-white">Beschikbaarheid</h3>
                  <p className="text-gray-300">
                    Ma-Vr: 9:00-18:00
                    <br />
                    Weekend: Op afspraak
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <CalEmbed />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-7 md:p-8 rounded-2xl border border-white/20">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Start jouw project
                </h2>
                <p className="text-gray-300">
                  Vul het onderstaande formulier in en we nemen binnen 24 uur
                  contact met je op.
                </p>
              </div>

              {errors.general && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200">{errors.general}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jouw naam"
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jouw@email.nl"
                    required
                    maxLength={254}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+31686412430"
                  autoComplete="tel"
                />
                {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
              </div>

              {/* Honeypot field - hidden from users */}
              <div style={{ display: 'none' }}>
                <label htmlFor="website">Website (do not fill):</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  inputMode="text"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Welke diensten interesseren je? *
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'website', label: '🌐 Website' },
                    { id: 'webshop', label: '🛒 Webshop' },
                    { id: 'webapp', label: '⚡ Web App' },
                    { id: 'mobile-app', label: '📱 Mobile App' },
                    { id: 'seo', label: '🔍 SEO' },
                    { id: 'hosting', label: '☁️ Hosting' },
                    { id: 'maintenance', label: '🔧 Onderhoud' },
                    { id: 'consulting', label: '💡 Consulting' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => onToggleType(type.id)}
                      className={`p-3 rounded-lg border text-left transition-all min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-cosmic-900 ${
                        form.projectTypes.includes(type.id)
                          ? 'bg-blue-500/30 border-blue-400 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
                {errors.projectTypes && (
                  <p className="text-red-400 text-sm">{errors.projectTypes}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                  Vertel ons over jouw project *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={5}
                  className="w-full px-4 py-3 min-h-[88px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Beschrijf jouw project, doelen, en eventuele specifieke wensen..."
                  required
                  maxLength={5000}
                />
                <div className="flex justify-between items-center">
                  {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
                  <p className="text-gray-400 text-xs ml-auto">
                    {form.message.length}/5000 karakters
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {status === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-4 animate-fade-in">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-200">Bericht succesvol verzonden!</h3>
                      <p className="text-sm text-green-300 mt-1">
                        Bedankt voor je aanvraag. We hebben je bericht in goede orde ontvangen en nemen binnen 24 uur contact met je op.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || !recaptchaLoaded}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 min-h-[44px] touch-target focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-cosmic-900"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Versturen...
                    </span>
                  ) : (
                    'Verstuur bericht'
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Dit formulier is beveiligd met reCAPTCHA v3. Door te versturen ga je akkoord met onze{' '}
                  <a href="/privacy" className="text-blue-400 hover:underline min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded">
                    privacyverklaring
                  </a>{' '}
                  en{' '}
                  <a href="/voorwaarden" className="text-blue-400 hover:underline min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded">
                    algemene voorwaarden
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
