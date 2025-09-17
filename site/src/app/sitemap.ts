import { MetadataRoute } from 'next';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
  const baseUrl = SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  const currentDate = new Date();

  // Define routes with their respective priorities and change frequencies
  const routes: Array<{
    path: string;
    priority: number;
    changeFreq: SitemapEntry['changeFrequency'];
    lastMod?: Date;
  }> = [
    {
      path: '/',
      priority: 1.0,
      changeFreq: 'weekly',
      lastMod: currentDate, // Homepage changes frequently
    },
    {
      path: '/diensten',
      priority: 0.9,
      changeFreq: 'monthly',
      lastMod: new Date('2025-09-01'), // Services page - updated monthly
    },
    {
      path: '/werkwijze',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: new Date('2025-08-15'), // Work process page
    },
    {
      path: '/speeltuin',
      priority: 0.7,
      changeFreq: 'weekly',
      lastMod: new Date('2025-09-15'), // Tech playground - updated with new demos
    },
    {
      path: '/contact',
      priority: 0.9,
      changeFreq: 'monthly',
      lastMod: new Date('2025-08-01'), // Contact page - high priority for conversions
    },
    {
      path: '/privacy',
      priority: 0.3,
      changeFreq: 'yearly',
      lastMod: new Date('2025-05-25'), // GDPR compliance date
    },
    {
      path: '/voorwaarden',
      priority: 0.3,
      changeFreq: 'yearly',
      lastMod: new Date('2025-05-25'), // Terms and conditions
    },
  ];

  // Generate additional dynamic entries for SEO
  const additionalRoutes: Array<{
    path: string;
    priority: number;
    changeFreq: SitemapEntry['changeFrequency'];
    lastMod?: Date;
  }> = [
    // Add specific service pages if they exist
    {
      path: '/diensten/website-laten-maken',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: new Date('2025-09-01'),
    },
    {
      path: '/diensten/3d-website-ontwikkeling',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: new Date('2025-09-01'),
    },
    {
      path: '/diensten/seo-optimalisatie',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: new Date('2025-09-01'),
    },
    {
      path: '/diensten/webshop-laten-maken',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: new Date('2025-09-01'),
    },
    // Blog or portfolio entries could be added here dynamically
    // Example: blog posts, case studies, etc.
  ];

  // Combine all routes
  const allRoutes = [...routes, ...additionalRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastMod || currentDate,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}

// Additional function to generate dynamic sitemap entries
// This could be used if you have a CMS or database with dynamic content
export async function generateDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  // This is where you would fetch from your CMS, database, or API
  // For example:
  // const blogPosts = await fetchBlogPosts();
  // const portfolioItems = await fetchPortfolioItems();

  const dynamicEntries: SitemapEntry[] = [];

  // Example of how to add blog posts
  /*
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
  blogPosts.forEach((post) => {
    dynamicEntries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });
  */

  // Example of how to add portfolio/case study items
  /*
  const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl';
  portfolioItems.forEach((item) => {
    dynamicEntries.push({
      url: `${SITE_URL}/portfolio/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  });
  */

  return dynamicEntries;
}
