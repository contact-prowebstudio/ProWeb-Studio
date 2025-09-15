# HUMAN_STEPS — Studio Anwar Stage 1.1

1) Kopieer env: `cp ops/.env.example site/.env.local`
2) Installeer: `cd site && npm install`
3) Start dev: `npm run dev`
4) Controleer integraties:
   - Plausible laadt zonder cookies
   - Cal.com embed opent in overlay
   - Contactformulier POST naar /api/contact (console: 200 OK)
5) Kwaliteit:
   - Voer Lighthouse en a11y scripts uit (zie reports/README.md)
   - Pixeldiff: run `npm run visual-diff` (zie docs/VisualDiff.md)
