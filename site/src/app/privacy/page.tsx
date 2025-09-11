import type { Metadata } from 'next';
import LegalContentLayout from '@/components/LegalContentLayout';
import { siteConfig } from '@/config/site.config';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title: 'Privacybeleid – ProWeb Studio',
  description:
    'Lees hoe wij met persoonsgegevens omgaan: welke data we verzamelen, waarom, bewaartermijnen en uw rechten.',
  alternates: { 
    canonical: '/privacy',
    languages: { 'nl-NL': '/privacy' },
  },
  openGraph: {
    title: 'Privacybeleid – ProWeb Studio',
    description:
      'Lees hoe wij met persoonsgegevens omgaan: welke data we verzamelen, waarom, bewaartermijnen en uw rechten.',
    url: 'https://prowebstudio.nl/privacy',
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function PrivacyPage() {
  const name = siteConfig.name;
  const baseUrl = siteConfig.url.replace(/\/+$/, '');
  const contactEmail = siteConfig.contact?.inbox ?? 'contact@prowebstudio.nl';
  const today = new Date().toISOString().slice(0, 10);

  return (
    <LegalContentLayout>
      <h1>Privacybeleid</h1>

      <p>
        Dit privacybeleid beschrijft hoe <strong>{name}</strong>{' '}
        (&quot;wij&quot;, &quot;ons&quot; of &quot;onze&quot;) uw
        persoonsgegevens verwerkt in overeenstemming met de Algemene Verordening
        Gegevensbescherming (AVG/GDPR) en toepasselijke Nederlandse wetgeving.
      </p>

      <h2>1. Verwerkingsverantwoordelijke</h2>
      <p>
        <strong>{name}</strong> is de verwerkingsverantwoordelijke. Voor vragen
        over dit beleid of uw rechten kunt u ons bereiken via{' '}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>2. Welke gegevens verwerken wij?</h2>
      <ul>
        <li>
          <strong>Contactgegevens</strong>: naam, e-mailadres, telefoonnummer
          (indien opgegeven) via het contactformulier.
        </li>
        <li>
          <strong>Zakelijke gegevens</strong>: bedrijfsnaam, functie,
          projectinformatie die u vrijwillig doorgeeft.
        </li>
        <li>
          <strong>Gebruik/analytics</strong>: geaggregeerde,
          niet-identificeerbare gegevens via Plausible Analytics
          (privacy-vriendelijk, cookieloos).
        </li>
        <li>
          <strong>Technisch</strong>: geanonimiseerde loggegevens (bijv. IP in
          serverlogs, foutmeldingen) voor beveiliging en foutanalyse.
        </li>
      </ul>

      <h2>3. Doeleinden en rechtsgronden</h2>
      <ul>
        <li>
          <strong>Contact en offertes</strong> (uitvoering van overeenkomst of
          precontractuele maatregelen): om uw aanvraag te verwerken en met u te
          communiceren.
        </li>
        <li>
          <strong>Dienstverlening</strong> (uitvoering van overeenkomst): om
          projecten te plannen, te leveren en te onderhouden.
        </li>
        <li>
          <strong>Verbetering en beveiliging</strong> (gerechtvaardigd belang):
          om prestaties, veiligheid en stabiliteit te verbeteren.
        </li>
        <li>
          <strong>Wettelijke verplichtingen</strong>: om te voldoen aan fiscale
          en administratieve verplichtingen.
        </li>
        <li>
          <strong>Marketing met toestemming</strong> (indien van toepassing):
          alleen na uw expliciete opt-in.
        </li>
      </ul>

      <h2>4. Cookies en analytics</h2>
      <p>
        Wij gebruiken Plausible Analytics, een privacyvriendelijke, cookieloze
        analytische dienst. Er worden geen persoonsgegevens geprofileerd en er
        is geen cross-site tracking. Meer informatie:{' '}
        <a
          href="https://plausible.io/data-policy"
          target="_blank"
          rel="noreferrer"
        >
          Plausible Data Policy
        </a>
        .
      </p>

      <h2>5. Bewaartermijnen</h2>
      <ul>
        <li>
          <strong>Contactaanvragen</strong>: maximaal 24 maanden na het laatste
          contactmoment, tenzij een zakelijke relatie ontstaat.
        </li>
        <li>
          <strong>Project/contractuele gegevens</strong>: conform wettelijke
          (fiscale) bewaarplichten (meestal 7 jaar).
        </li>
        <li>
          <strong>Loggegevens</strong>: zo kort als technisch en
          beveiligingsmatig noodzakelijk.
        </li>
      </ul>

      <h2>6. Delen met derden</h2>
      <p>
        Wij delen geen persoonsgegevens met derden, tenzij noodzakelijk voor de
        dienstverlening (verwerkers) of wettelijk verplicht. Met verwerkers
        sluiten wij verwerkersovereenkomsten conform art. 28 AVG. Voorbeelden:
        hostingprovider, e-mailprovider, analytics (Plausible).
      </p>

      <h2>7. Doorgifte buiten de EER</h2>
      <p>
        Indien doorgifte buiten de Europese Economische Ruimte noodzakelijk is,
        zorgen wij voor passende waarborgen (art. 46 AVG), zoals
        EU-standaardcontractbepalingen. Details op verzoek beschikbaar.
      </p>

      <h2>8. Beveiliging</h2>
      <p>
        Wij nemen passende technische en organisatorische maatregelen om
        persoonsgegevens te beveiligen (o.a. TLS, toegangsbeheer, logging,
        back-ups). Geen enkele methode is 100% veilig; wij evalueren en
        verbeteren continu.
      </p>

      <h2>9. Uw rechten</h2>
      <ul>
        <li>Recht op inzage, rectificatie, verwijdering en beperking.</li>
        <li>Recht op gegevensoverdraagbaarheid (portabiliteit).</li>
        <li>
          Recht van bezwaar tegen verwerking op basis van gerechtvaardigd belang
          of direct marketing.
        </li>
        <li>
          Recht om uw toestemming in te trekken (indien de verwerking daarop
          berust).
        </li>
      </ul>
      <p>
        U kunt uw rechten uitoefenen via{' '}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Wij reageren
        binnen 30 dagen. U heeft ook het recht om een klacht in te dienen bij de
        Autoriteit Persoonsgegevens in Nederland.
      </p>

      <h2>10. Minderjarigen</h2>
      <p>
        Onze diensten zijn niet gericht op kinderen onder de 16 jaar. Indien u
        denkt dat wij onterecht gegevens hebben verzameld, neem contact op.
      </p>

      <h2>11. Wijzigingen</h2>
      <p>
        Wij kunnen dit beleid aanpassen. De meest recente versie is altijd
        beschikbaar op <a href={`${baseUrl}/privacy`}>{baseUrl}/privacy</a>.
      </p>

      <h2>12. Contact</h2>
      <p>
        Vragen of verzoeken? Mail ons via{' '}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <hr />
      <p className="text-sm opacity-70">Versie: {today}</p>

      {/* SEO Content Section */}
      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Privacybeleid</h1>
        <h2>Inleiding</h2>
        <p>
          We nemen uw privacy serieus en gaan zorgvuldig om met
          persoonsgegevens.
        </p>
        <h2>Welke gegevens verzamelen we?</h2>
        <p>
          Contactgegevens (naam, e‑mail, telefoon), projectinformatie,
          gebruiksdata (analytics).
        </p>
        <h2>Waarvoor gebruiken we uw gegevens?</h2>
        <p>
          Contact, offertes, dienstverlening en verbetering van onze services.
        </p>
        <h2>Rechtsgrond</h2>
        <p>Toestemming, uitvoering van overeenkomst, gerechtvaardigd belang.</p>
        <h2>Bewaartermijnen</h2>
        <p>Niet langer dan noodzakelijk.</p>
        <h2>Delen met derden</h2>
        <p>
          Alleen met verwerkers die aan onze normen voldoen (hosting, analytics,
          e‑mail).
        </p>
        <h2>Cookies &amp; tracking</h2>
        <p>
          Privacy‑vriendelijke analytics (bijv. Plausible) zonder cookies waar
          mogelijk.
        </p>
        <h2>Uw rechten</h2>
        <p>
          Inzage, correctie, verwijdering, beperking, bezwaar,
          dataportabiliteit.
        </p>
        <h2>Beveiliging</h2>
        <p>Passende technische en organisatorische maatregelen.</p>
        <h2>Contact</h2>
        <p>privacy@prowebstudio.nl of contact@prowebstudio.nl</p>
      </section>
    </LegalContentLayout>
  );
}
