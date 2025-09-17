# SEO Enhancement Checklist (Next.js on Vercel)

- Canonical domain: Set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to the production domain in Vercel Project Settings. Previews inherit noindex automatically.
- Robots and sitemap: `robots.ts` emits noindex for preview; `sitemap.ts` uses `SITE_URL`. Verify both render with the correct host.
- Metadata: `src/app/layout.tsx` sets canonical, Open Graph, and Twitter metadata using `SITE_URL`. Replace placeholder verification codes when ready.
- Images: Prefer `next/image` with width/height and descriptive `alt`. Use `public/og` endpoint for social share preview.
- Headings: One `<h1>` per page; logical hierarchy of headings (H2/H3) for sections.
- Internal linking: Link service pages from home and relevant pages; use descriptive anchor text.
- Performance: Ensure LCP element is visible and optimized; avoid layout shifts; lazy-load non-critical 3D and heavy assets.
- Accessibility: Error/status messages use `role="alert"`; forms use labels; maintain color contrast; provide keyboard focus styles.
- Tracking: Use Plausible via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; ensure consent where required.
- Structured data: Keep `SEOSchema`/`LocalBusinessSchema` up to date with accurate business info.

Quick validation commands
```bash
# Build and test locally
npm run build
npm test -- --run

# Run dev and check http://localhost:3000/robots.txt and /sitemap.xml
npm run dev
```
