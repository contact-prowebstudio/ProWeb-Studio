import Script from 'next/script';
import { siteConfig } from '@/config/site.config';

interface SEOSchemaProps {
  pageType?: 'homepage' | 'service' | 'contact' | 'about';
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export default function SEOSchema({
  pageType = 'homepage',
  pageTitle,
  pageDescription,
  breadcrumbs = [],
}: SEOSchemaProps) {
  const baseUrl = siteConfig.url;

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: siteConfig.name,
    alternateName: [
      'ProWeb Studio Nederland',
      'ProWeb Studio NL',
      'Website laten maken Nederland',
    ],
    description: siteConfig.description,
    url: baseUrl,
    inLanguage: 'nl-NL',
    copyrightYear: new Date().getFullYear(),
    creator: {
      '@type': 'Organization',
      '@id': `${baseUrl}#business`,
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#business`,
      name: siteConfig.name,
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/zoeken?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
  };

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#business`,
    name: siteConfig.name,
    alternateName: 'ProWeb Studio Nederland',
    description: siteConfig.description,
    url: baseUrl,
    logo: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
    image: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    foundingDate: '2024',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 10,
    },
    naics: '541511', // Custom Computer Programming Services
    isicV4: '6201', // Computer programming activities
    knowsAbout: [
      'Website ontwikkeling',
      'Webdesign',
      'SEO optimalisatie',
      '3D websites',
      'React ontwikkeling',
      'Next.js',
      'TypeScript',
      'E-commerce ontwikkeling',
      'Webshop laten maken',
      'Digital marketing',
      'UI/UX Design',
      'Mobile-first design',
      'Responsive webdesign',
      'Progressive Web Apps',
      'JavaScript ontwikkeling',
      'Frontend ontwikkeling',
      'Backend ontwikkeling',
      'API ontwikkeling',
      'Database ontwerp',
      'Cloud hosting',
      'Website beveiliging',
      'Performance optimalisatie',
      'Toegankelijkheid (WCAG)',
      'GDPR compliance',
      'Google Analytics',
      'Conversion optimalisatie',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Nederland',
      sameAs: 'https://en.wikipedia.org/wiki/Netherlands',
    },
    serviceArea: [
      'Nederland',
      'Amsterdam',
      'Rotterdam',
      'Den Haag',
      'Utrecht',
      'Eindhoven',
      'Tilburg',
      'Groningen',
      'Almere',
      'Breda',
      'Nijmegen',
      'Enschede',
      'Haarlem',
      'Arnhem',
      'Zaanstad',
      'Haarlemmermeer',
      'Amersfoort',
      'Apeldoorn',
      'Hoofddorp',
      'Maastricht',
      'Leiden',
      'Dordrecht',
      'Zoetermeer',
      'Zwolle',
      'Deventer',
      'Delft',
      'Alkmaar',
      'Leeuwarden',
      'Roosendaal',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website Ontwikkeling Diensten',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Website laten maken',
            description:
              'Professionele websites op maat voor Nederlandse bedrijven',
            category: 'Webdevelopment',
            provider: {
              '@id': `${baseUrl}#business`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'EUR',
            price: '2500',
            minPrice: '2500',
            maxPrice: '15000',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Website ontwikkeling',
            description: 'Innovatieve 3D websites met Three.js en WebGL',
            category: 'Advanced Webdevelopment',
            provider: {
              '@id': `${baseUrl}#business`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'EUR',
            price: '7500',
            minPrice: '5000',
            maxPrice: '25000',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO optimalisatie',
            description: 'Zoekmachine optimalisatie voor Nederlandse markt',
            category: 'Digital Marketing',
            provider: {
              '@id': `${baseUrl}#business`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'EUR',
            price: '1500',
            minPrice: '1000',
            maxPrice: '5000',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Webshop laten maken',
            description: 'E-commerce websites met Nederlandse betaalmethoden',
            category: 'E-commerce Development',
            provider: {
              '@id': `${baseUrl}#business`,
            },
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'EUR',
            price: '5000',
            minPrice: '3500',
            maxPrice: '20000',
          },
        },
      ],
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: 'Customer Service',
        areaServed: 'NL',
        availableLanguage: ['Dutch', 'English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'Sales',
        areaServed: 'NL',
        availableLanguage: ['Dutch', 'English'],
      },
      {
        '@type': 'ContactPoint',
        email: siteConfig.email,
        contactType: 'Technical Support',
        areaServed: 'NL',
        availableLanguage: ['Dutch', 'English'],
      },
    ],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
  };

  // Breadcrumb schema (if breadcrumbs are provided)
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': `${baseUrl}#breadcrumb`,
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        }
      : null;

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}#webpage`,
    name: pageTitle || `${siteConfig.name} - ${siteConfig.tagline}`,
    description: pageDescription || siteConfig.description,
    url: baseUrl,
    inLanguage: 'nl-NL',
    isPartOf: {
      '@id': `${baseUrl}#website`,
    },
    about: {
      '@id': `${baseUrl}#business`,
    },
    publisher: {
      '@id': `${baseUrl}#business`,
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${baseUrl}/assets/logo/logo-proweb-lockup.svg`,
    },
    ...(pageType === 'homepage' && {
      mainEntity: {
        '@id': `${baseUrl}#business`,
      },
    }),
    ...(pageType === 'service' && {
      mainEntity: {
        '@type': 'Service',
        name: pageTitle || 'Website Development Services',
        provider: {
          '@id': `${baseUrl}#business`,
        },
      },
    }),
    ...(pageType === 'contact' && {
      mainEntity: {
        '@type': 'ContactPage',
        name: 'Contact ProWeb Studio',
      },
    }),
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [baseUrl],
      },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.lead', '.intro'],
    },
  };

  // Combine all schemas into a graph
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteSchema,
      organizationSchema,
      webPageSchema,
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ],
  };

  return (
    <Script
      id="comprehensive-seo-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaGraph, null, 2),
      }}
    />
  );
}
