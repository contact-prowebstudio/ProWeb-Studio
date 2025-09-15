import type { Metadata } from 'next';
import LegalContentLayout from '@/components/LegalContentLayout';
import { siteConfig } from '@/config/site.config';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title: 'Algemene voorwaarden – ProWeb Studio',
  description:
    'Voorwaarden voor offertes, overeenkomsten, levering, betaling, intellectuele eigendom en aansprakelijkheid.',
  alternates: { 
    canonical: '/voorwaarden',
    languages: { 'nl-NL': '/voorwaarden' },
  },
  openGraph: {
    title: 'Algemene voorwaarden – ProWeb Studio',
    description:
      'Voorwaarden voor offertes, overeenkomsten, levering, betaling, intellectuele eigendom en aansprakelijkheid.',
    url: 'https://prowebstudio.nl/voorwaarden',
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function VoorwaardenPage() {
  const name = siteConfig.name;
  const contactEmail = siteConfig.contact?.inbox ?? 'contact@prowebstudio.nl';
  const phone = siteConfig.phone;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <LegalContentLayout>
      <h1>Algemene Voorwaarden</h1>

      <p>
        Deze voorwaarden zijn van toepassing op alle offertes en overeenkomsten
        van <strong>{name}</strong>.
      </p>

      <h2>1. Offertes & Geldigheid</h2>
      <p>
        Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen na
        uitgifte, tenzij anders vermeld. Na acceptatie van een offerte wordt
        deze onderdeel van de overeenkomst.
      </p>

      <h2>2. Overeenkomst</h2>
      <p>
        Een overeenkomst komt tot stand door schriftelijke bevestiging van de
        opdracht door beide partijen, of door aanvang van de werkzaamheden door{' '}
        {name}.
      </p>

      <h2>3. Levering & Uitvoering</h2>
      <p>
        Levertermijnen zijn indicatief en worden in overleg vastgesteld.
        Overschrijding van levertermijnen geeft geen recht op schadevergoeding,
        tenzij sprake is van opzet of grove schuld.
      </p>

      <h2>4. Betaling</h2>
      <ul>
        <li>
          <strong>Betalingstermijn</strong>: 14 dagen na factuurdatum, tenzij
          anders overeengekomen.
        </li>
        <li>
          <strong>Vooruitbetaling</strong>: Bij projecten boven €2.500 kan een
          vooruitbetaling van 50% worden gevraagd.
        </li>
        <li>
          <strong>Rente</strong>: Bij te late betaling wordt 1% rente per maand
          berekend over het openstaande bedrag.
        </li>
      </ul>

      <h2>5. Intellectueel eigendom</h2>
      <p>
        Alle intellectuele eigendomsrechten op door {name} ontwikkelde werken
        blijven eigendom van {name} totdat volledige betaling heeft
        plaatsgevonden. Na betaling worden de rechten overgedragen aan de
        opdrachtgever.
      </p>

      <h2>6. Aansprakelijkheid</h2>
      <p>
        De aansprakelijkheid van {name} is beperkt tot het factuurbedrag van de
        betreffende opdracht. {name} is niet aansprakelijk voor indirecte
        schade, gevolgschade, gederfde winst of schade door bedrijfsstagnatie.
      </p>

      <h2>7. Overmacht</h2>
      <p>
        Bij overmacht is {name} gerechtigd de uitvoering op te schorten of de
        overeenkomst te ontbinden zonder schadeplicht. Onder overmacht wordt
        verstaan: ziekte, overheidsmaatregelen, stroomuitval, internetstoring en
        andere omstandigheden buiten onze controle.
      </p>

      <h2>8. Wijzigingen & aanvullingen</h2>
      <p>
        Wijzigingen in de opdracht kunnen leiden tot aanpassing van prijs en
        levertijd. Alle wijzigingen worden schriftelijk bevestigd voordat
        uitvoering plaatsvindt.
      </p>

      <h2>9. Geschillen & toepasselijk recht</h2>
      <p>
        Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen
        worden voorgelegd aan de bevoegde rechter in Nederland.
      </p>

      <h2>10. Contact & Bedrijfsgegevens</h2>
      <div className="bg-neutral-800/30 p-6 rounded-lg border border-neutral-700">
        <p className="mb-2">
          <strong>{name}</strong>
        </p>
        <p className="text-sm space-y-1">
          <span className="block">
            E-mail:{' '}
            <a
              href={`mailto:${contactEmail}`}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {contactEmail}
            </a>
          </span>
          <span className="block">
            Telefoon:{' '}
            <a
              href={`tel:${phone}`}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {phone}
            </a>
          </span>
        </p>
        <p className="text-xs text-neutral-400 mt-4">
          KvK: [KVK-nummer wordt toegevoegd]
          <br />
          BTW: [BTW-nummer wordt toegevoegd]
          <br />
          Adres: [Bedrijfsadres wordt toegevoegd]
        </p>
      </div>

      <hr />
      <p className="text-sm opacity-70">
        Laatst bijgewerkt: {today} | Deze voorwaarden kunnen worden aangepast.
        Raadpleeg altijd de meest recente versie op onze website.
      </p>

      {/* SEO Content Section */}
      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Algemene voorwaarden</h1>
        <ol>
          <li>
            <strong>Toepasselijkheid</strong> – van kracht op alle offertes en
            overeenkomsten.
          </li>
          <li>
            <strong>Overeenkomst</strong> – totstandkoming en verplichtingen.
          </li>
          <li>
            <strong>Levering &amp; uitvoering</strong> – termijnen, testen,
            acceptatie.
          </li>
          <li>
            <strong>Betaling</strong> – termijnen en facturatie.
          </li>
          <li>
            <strong>Intellectuele eigendom</strong> – rechten op design, code en
            licenties.
          </li>
          <li>
            <strong>Aansprakelijkheid</strong> – beperkingen en uitzonderingen.
          </li>
          <li>
            <strong>Geheimhouding</strong> – vertrouwelijke informatie.
          </li>
          <li>
            <strong>Overmacht</strong> – gebeurtenissen buiten redelijke
            controle.
          </li>
          <li>
            <strong>Wijziging &amp; beëindiging</strong> – voorwaarden en
            gevolgen.
          </li>
          <li>
            <strong>Toepasselijk recht</strong> – Nederlands recht, bevoegde
            rechter.
          </li>
        </ol>
      </section>
    </LegalContentLayout>
  );
}
