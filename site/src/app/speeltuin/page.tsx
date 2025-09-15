export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: 'Tech Playground – ProWeb Studio',
  description: 'Experimenteer met WebGL, Three.js en 3D-interfaces. Onze speeltuin voor performance en UX-onderzoek.',
  alternates: { 
    canonical: '/speeltuin',
    languages: { 'nl-NL': '/speeltuin' },
  },
  openGraph: {
    title: 'Tech Playground – ProWeb Studio',
    description: 'Experimenteer met WebGL, Three.js en 3D-interfaces. Onze speeltuin voor performance en UX-onderzoek.',
    url: 'https://prowebstudio.nl/speeltuin',
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
} as const;

import SpeeltuinClient from './SpeeltuinClient';

export default function Page() {
  return <SpeeltuinClient />;
}
