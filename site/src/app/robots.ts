import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/+$/, '');
  return {
    rules: [
      { userAgent: '*', allow: ['/'], disallow: ['/api/', '/admin/', '/_next/', '/private/', '/temp/'] },
      { userAgent: 'AhrefsBot', disallow: ['/'] },
      { userAgent: 'MJ12bot', disallow: ['/'] },
      { userAgent: 'DotBot', disallow: ['/'] },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
