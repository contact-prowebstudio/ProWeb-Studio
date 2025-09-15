import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — website laten maken | ProWeb Studio',
  description:
    'Neem contact op om een website te laten maken. We plannen direct een korte call; prijzen bepalen we telefonisch na de intake.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact — website laten maken',
    description:
      'Bel of mail ons — we plannen direct een korte call en bespreken prijs en planning.',
    url: 'https://prowebstudio.nl/contact',
    type: 'website',
  },
  keywords: [
    'contact website laten maken',
    'offerte website',
    'website maken contact',
    'webdesign contact',
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
