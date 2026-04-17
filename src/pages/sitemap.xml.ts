import type { APIRoute } from 'astro';
import { getDestinations, getGuides } from '../lib/sanity/content';

export const GET: APIRoute = async ({ url: baseUrl }) => {
  const base = baseUrl.origin;

  const [destinations, guides] = await Promise.all([
    getDestinations(),
    getGuides(),
  ]);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.5', changefreq: 'monthly' },
    { url: '/destinations/', priority: '0.9', changefreq: 'weekly' },
    { url: '/guides/', priority: '0.8', changefreq: 'weekly' },
    { url: '/privacy/', priority: '0.3', changefreq: 'yearly' },
  ];

  const destinationPages = destinations.map((d) => ({
    url: `/destinations/${d.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: d._updatedAt
      ? new Date(d._updatedAt).toISOString().split('T')[0]
      : undefined,
  }));

  const guidePages = guides.map((g) => ({
    url: `/guides/${g.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: g._updatedAt
      ? new Date(g._updatedAt).toISOString().split('T')[0]
      : undefined,
  }));

  const allPages = [...staticPages, ...destinationPages, ...guidePages];

  const urls = allPages
    .map(
      (page) => `
  <url>
    <loc>${base}${page.url}</loc>${
        page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''
      }
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.comschemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
