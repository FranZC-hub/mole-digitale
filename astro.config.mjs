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
  // Sitemap: dentro solo le pagine che vogliamo su Google.
  // Fuori: le singole demo (/demo/bar/, /demo/sushi/…), le bozze dei clienti
  // (/demoFarmaciaAusiliatrice/, /demoMasGioielli/, /demoClienti/) e le pagine di servizio.
  // La galleria /demo/ resta indicizzabile.
  integrations: [
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname;
        if (p.startsWith('/demo/') && p !== '/demo/') return false;
        if (/^\/demo[A-Z]/.test(p)) return false;
        return !['/privacy', '/dypa', '/crediti'].some((x) => p.startsWith(x));
      },
    }),
  ],
});
