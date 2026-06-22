// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Sito 100% statico: si carica via FTP nella root del sito (es. Aruba) come file HTML/CSS/JS.
// L'invio email è gestito da /contact.php (PHP + SMTP Aruba), non da Node.
export default defineConfig({
  // ⚠️ Dominio reale del sito (usato per sitemap, canonical e OG)
  site: 'https://www.moledigitale.it',
  build: { inlineStylesheets: 'auto' },
  // Sitemap automatica, escludendo le demo (noindex) dall'indice
  // Sitemap: escludo le singole demo (noindex) ma tengo la galleria /demo; escludo /privacy.
  integrations: [sitemap({ filter: (page) => !/\/demo\/.+/.test(page) && !page.includes('/privacy') })],
});
