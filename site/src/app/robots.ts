import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
  const base = SITE_URL.replace(/\/+$/, '');
  const isPreview = process.env.VERCEL_ENV === 'preview';
  
  return {
    rules: isPreview
      ? [{ userAgent: '*', disallow: ['/'] }]
      : [{ userAgent: '*', allow: ['/'] }],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
