// robots.txt generato con il dominio configurato (SITO_URL in astro.config.mjs).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *
Disallow: /area-riservata/
Disallow: /api/

Sitemap: ${sitemap}
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
