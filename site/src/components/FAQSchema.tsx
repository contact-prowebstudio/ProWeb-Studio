import Script from 'next/script';
import { siteConfig } from '@/config/site.config';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs?: FAQItem[];
}

export default function FAQSchema({
  faqs = [
    {
      question: 'Wat kost het om een website te laten maken?',
      answer:
        'De kosten voor een website variëren tussen €2.500 en €10.000+, afhankelijk van complexiteit, functionaliteiten en design. Wij bieden transparante prijzen en maken altijd eerst een offerte op maat.',
    },
    {
      question: 'Hoe lang duurt het om een website te ontwikkelen?',
      answer:
        'Een standaard website duurt 4-8 weken om te ontwikkelen. Complexere projecten met 3D elementen of uitgebreide functionaliteiten kunnen 8-16 weken duren. Wij houden u tijdens het hele proces op de hoogte.',
    },
    {
      question: 'Leveren jullie ook SEO services?',
      answer:
        'Ja, alle onze websites worden standaard geoptimaliseerd voor zoekmachines. Wij zorgen voor snelle laadtijden, mobiele optimalisatie, en correcte technische SEO implementatie om goed te scoren in Google.',
    },
    {
      question: 'Kunnen jullie ook webshops maken?',
      answer:
        'Absoluut! Wij ontwikkelen professionele webshops met moderne e-commerce functionaliteiten, veilige betalingsmethoden en integratie met Nederlandse payment providers zoals iDEAL, Mollie en Stripe.',
    },
    {
      question: 'Wat maakt jullie 3D websites uniek?',
      answer:
        'Onze 3D websites gebruiken cutting-edge technologieën zoals Three.js en WebGL om interactieve ervaringen te creëren die bezoekers engageren en uw merk onderscheiden van de concurrentie.',
    },
    {
      question: 'Bieden jullie onderhoud en support na oplevering?',
      answer:
        'Ja, wij bieden verschillende onderhoudsabonnementen voor hosting, updates, backups en technische support. Zo blijft uw website altijd veilig, snel en up-to-date.',
    },
    {
      question: 'Werken jullie ook met bestaande systemen?',
      answer:
        'Wij kunnen uw nieuwe website integreren met bestaande systemen zoals CRM, ERP, marketingtools en externe APIs. Wij zorgen voor naadloze koppelingen en data-uitwisseling.',
    },
    {
      question: 'Is mijn website mobiel geoptimaliseerd?',
      answer:
        'Alle onze websites zijn volledig responsive en geoptimaliseerd voor alle apparaten - van smartphone tot desktop. Wij testen uitgebreid op verschillende schermformaten en browsers.',
    },
  ],
}: FAQSchemaProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteConfig.url}#faq`,
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `${siteConfig.url}#faq-${index + 1}`,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    })),
    about: {
      '@type': 'Thing',
      name: 'Website ontwikkeling Nederland',
      description:
        'Veelgestelde vragen over website laten maken, webdevelopment, SEO en 3D websites in Nederland',
    },
    inLanguage: 'nl-NL',
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}#business`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
