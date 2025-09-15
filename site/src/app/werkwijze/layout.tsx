import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Werkwijze — website laten maken: stappenplan van intake tot launch | ProWeb Studio',
  description:
    'Ons stappenplan voor website laten maken: intake, strategie, UX/UI design, build (Next.js), content & SEO, launch en optimalisatie.',
  alternates: {
    canonical: '/werkwijze',
  },
  openGraph: {
    title: 'Werkwijze — zo maken we jouw website',
    description:
      'Duidelijk stappenplan en voorspelbare doorlooptijd. Van strategie en design tot razendsnelle build.',
    url: 'https://prowebstudio.nl/werkwijze',
    type: 'website',
  },
  keywords: [
    'werkwijze website laten maken',
    'stappenplan website maken',
    'website maken proces',
    'website laten maken',
    'werkwijze webdesign',
  ],
};

export default function WerkwijzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
