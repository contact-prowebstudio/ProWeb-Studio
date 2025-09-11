import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website laten maken — Diensten | ProWeb Studio',
  description:
    'Onze diensten voor website laten maken, website maken met begeleiding en 3D websites. Strategie, design en build — razendsnel en conversiegericht.',
  alternates: {
    canonical: '/diensten',
  },
  openGraph: {
    title: 'Diensten — website laten maken & 3D websites | ProWeb Studio',
    description:
      'Van strategie en design tot pixel‑perfecte build. Razendsnelle, schaalbare websites die converteren.',
    url: 'https://prowebstudio.nl/diensten',
    type: 'website',
  },
  keywords: [
    'website laten maken',
    'website maken',
    'maken van een website',
    '3D website',
    'webdesign diensten',
  ],
};

export default function DienstenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
