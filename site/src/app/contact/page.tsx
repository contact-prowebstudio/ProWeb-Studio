import type { Metadata } from 'next';
import SecureContactForm from '@/components/SecureContactForm';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title: 'Contact – Start het gesprek met ProWeb Studio',
  description:
    'Vertel ons over uw project. Reactie binnen één werkdag. Afspraak via video of op locatie in Nederland.',
  alternates: {
    canonical: '/contact',
    languages: { 'nl-NL': '/contact' },
  },
  openGraph: {
    title: 'Contact – Start het gesprek met ProWeb Studio',
    description:
      'Vertel ons over uw project. Reactie binnen één werkdag. Afspraak via video of op locatie in Nederland.',
    url: 'https://prowebstudio.nl/contact',
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function ContactPage() {
  return (
    <>
      <SecureContactForm />
      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Start het gesprek</h1>
        <p>
          Vertel kort uw doel, doelgroep en gewenste deadline. We denken mee en
          komen met een concreet voorstel.
        </p>
        <h2>Hoe wilt u contact?</h2>
        <ul>
          <li>
            <strong>Formulier:</strong> naam, e‑mail, telefoon (optioneel),
            projecttype, bericht.
          </li>
          <li>
            <strong>Afspraak plannen:</strong> direct via onze agenda.
          </li>
          <li>
            <strong>E‑mail/telefoon:</strong> contact@prowebstudio.nl — +31686412430.
          </li>
        </ul>
        <h2>Wat gebeurt er daarna?</h2>
        <p>
          We bevestigen ontvangst, plannen een call en leveren na de intake een
          duidelijke scope en planning.
        </p>
        <h2>FAQ</h2>
        <p>
          <strong>Hoe snel reageren jullie?</strong> Binnen één werkdag.
        </p>
        <p>
          <strong>Kunnen we NDA tekenen?</strong> Ja, op verzoek.
        </p>
        <p>
          <strong>Werken jullie remote of op locatie?</strong> Beide opties zijn
          mogelijk.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Hoe snel reageren jullie?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Binnen één werkdag.',
                },
              },
              {
                '@type': 'Question',
                name: 'Kunnen we NDA tekenen?',
                acceptedAnswer: { '@type': 'Answer', text: 'Ja, op verzoek.' },
              },
              {
                '@type': 'Question',
                name: 'Werken jullie remote of op locatie?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Beide opties zijn mogelijk.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
