# Studio Anwar — Prelaunch Stage 1.1 (RECOVER UI)

Herstelde UI en inhoud op basis van originele 3D-site. Geen visuele redesign; alleen merknaam, logo's en NL-copy aangepast. Integraties: Plausible (cookieless), Cal.com embed, Brevo SMTP.

## Snelstart
1. `cp ops/.env.example site/.env.local`
2. `cd site && npm install && npm run dev`
3. Open http://localhost:3000

## Privacy-first
- Plausible cookieless
- Geen cookie-banner tenzij niet-essentiële trackers worden toegevoegd

## Legal
Zie `/privacy` en `/voorwaarden`. Placeholder velden (KvK, Btw, adres) invullen bij lancering.

## Rapportage
Scripts voor Lighthouse en a11y zijn opgenomen in `reports/README.md`. Uitvoerlocaties: `reports/lighthouse/` en `reports/a11y/`.
