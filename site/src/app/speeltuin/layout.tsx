import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speeltuin – 3D webexperiences in de browser (WebGL/Three.js)',
  description:
    'Experimenteer met 3D-scènes, licht en interactie. Onze R&D voor performance-vriendelijke 3D op het web.',
  alternates: { canonical: '/speeltuin' },
  openGraph: {
    title: 'Speeltuin | ProWeb Studio',
    description:
      'Interactieve 3D-voorbeelden, real-time visualisaties en performance-vriendelijke animaties.',
    url: 'https://prowebstudio.nl/speeltuin',
    locale: 'nl_NL',
  },
};

export default function SpeeltuinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
