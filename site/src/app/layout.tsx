import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from '@/config/site.config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CursorTrail from '@/components/CursorTrail';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import SEOSchema from '@/components/SEOSchema';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  keywords: [
    'website laten maken nederland',
    'webdevelopment nederland',
    'website bouwen',
    '3D websites',
    'webdesign nederland',
    'professionele websites',
    'react ontwikkeling',
    'next.js developer',
    'seo optimalisatie',
    'webshop laten maken',
    'responsive webdesign',
    'moderne websites',
    'website op maat',
    'digital agency nederland',
    'website laten ontwerpen',
  ],
  authors: [
    { name: 'ProWeb Studio', url: siteConfig.url },
    { name: 'ProWeb Studio Team' },
  ],
  creator: 'ProWeb Studio',
  publisher: 'ProWeb Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
        type: 'image/png',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
    countryName: 'Netherlands',
    emails: [siteConfig.email],
    phoneNumbers: [siteConfig.phone],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@prowebstudio_nl',
    creator: '@prowebstudio_nl',
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'GOOGLE_VERIFICATION_CODE_PLACEHOLDER',
    other: {
      'msvalidate.01': 'BING_VERIFICATION_CODE_PLACEHOLDER',
      'yandex-verification': 'YANDEX_VERIFICATION_CODE_PLACEHOLDER',
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'nl-NL': siteConfig.url,
      'x-default': siteConfig.url,
    },
  },
  category: 'technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
    startupImage: ['/icons/apple-touch-icon-180.png'],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
    'application-name': siteConfig.name,
    'msapplication-TileColor': '#6366f1',
    'msapplication-TileImage': '/icons/icon-192.png',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#6366f1',
    'color-scheme': 'dark light',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    HandheldFriendly: 'True',
    MobileOptimized: '320',
    'revisit-after': '7 days',
    audience: 'all',
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    designer: siteConfig.name,
    owner: siteConfig.name,
    url: siteConfig.url,
    'identifier-URL': siteConfig.url,
    pagename: siteConfig.name,
    category: 'internet',
    'dc.title': siteConfig.name,
    'dc.creator': siteConfig.name,
    'dc.subject': 'Website Development, Web Design, 3D Websites',
    'dc.description': siteConfig.description,
    'dc.publisher': siteConfig.name,
    'dc.contributor': siteConfig.name,
    'dc.date': new Date().toISOString(),
    'dc.type': 'text',
    'dc.format': 'text/html',
    'dc.identifier': siteConfig.url,
    'dc.source': siteConfig.url,
    'dc.language': 'nl-NL',
    'dc.relation': siteConfig.url,
    'dc.coverage': 'Netherlands',
    'dc.rights': `© ${new Date().getFullYear()} ${siteConfig.name}`,
    'geo.region': 'NL',
    'geo.placename': 'Netherlands',
    'geo.position': '52.3676;4.9041',
    ICBM: '52.3676, 4.9041',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read environment variables for Dutch legal IDs and address
  const kvk = process.env.NEXT_PUBLIC_KVK || '93769865';
  const btw = process.env.NEXT_PUBLIC_BTW || 'NL005041113B60';
  const addrStreet = process.env.NEXT_PUBLIC_ADDR_STREET;
  const addrCity = process.env.NEXT_PUBLIC_ADDR_CITY;
  const addrZip = process.env.NEXT_PUBLIC_ADDR_ZIP;
  const hasAddress = Boolean(addrStreet && addrCity && addrZip);
  const nlServiceArea = ['Netherlands', 'Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'] as const;
  return (
    <html lang="nl-NL">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png" />
      </head>
      <body className={inter.className}>
        <a href="#main" className="skip-to-content">
          Ga naar hoofdinhoud
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CursorTrail />

        <LocalBusinessSchema
          kvkNumber={kvk}
          vatID={btw}
          {...(hasAddress ? {
            address: {
              streetAddress: addrStreet!,
              addressLocality: addrCity!,
              postalCode: addrZip!,
              addressRegion: 'NH',
              addressCountry: 'NL',
            }
          } : {
            serviceArea: nlServiceArea,
            areaServed: nlServiceArea,
          })}
          openingHours={['Mo-Fr 09:00-17:00']}
        />
        <SEOSchema pageType="homepage" />

        <Script
          defer
          data-domain={siteConfig.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
