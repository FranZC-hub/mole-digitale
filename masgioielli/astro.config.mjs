// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sito di MasGioielli. Le pagine sono statiche (HTML/CSS/JS); i dati che il negozio
// cambia da solo (selezione, orari, chiusure, marchi) arrivano da public/api/ (PHP + MySQL).
//
// SITO_URL: il dominio definitivo, usato per canonical, sitemap e anteprime dei link.
// Si cambia senza toccare il codice:  SITO_URL=https://www.masgioielli.it npm run build
const SITO = process.env.SITO_URL || 'https://www.masgioielli.it';

export default defineConfig({
  site: SITO,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  integrations: [
    sitemap({
      // l'area riservata e la pagina 404 non vanno su Google
      filter: (page) => !/\/(area-riservata|404)\//.test(new URL(page).pathname),
    }),
  ],
});
