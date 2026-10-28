// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

// <lastmod> della sitemap: l'ultima volta che è cambiato il file da cui nasce la pagina (o i suoi
// dati), letta da git. Non la data della build: Google usa lastmod solo se è affidabile, e la stessa
// data su tutte le pagine a ogni pubblicazione la renderebbe inutile. File modificati e non ancora
// in un commit = oggi. Senza git o con una copia parziale (es. GitHub Actions) lastmod resta fuori.
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const adesso = new Date().toISOString();
let gitCompleto = false;
try { gitCompleto = git('rev-parse', '--is-shallow-repository') === 'false'; } catch {}
const sorgenti = (pathname) => {
  if (pathname === '/') return ['src/pages/index.astro'];
  if (pathname === '/blog/') return ['src/pages/blog/index.astro', 'src/content/blog'];
  const guida = pathname.match(/^\/blog\/([^/]+)\/$/);
  if (guida) return [`src/content/blog/${guida[1]}.md`, `src/content/blog/${guida[1]}.mdx`];
  const nome = pathname.replace(/^\/|\/$/g, '');
  const pagina = [`src/pages/${nome}.astro`, `src/pages/${nome}/index.astro`].filter((f) => fs.existsSync(f));
  if (pagina.length) return nome === 'siti-web-torino' ? [...pagina, 'src/data/settori.js'] : pagina;
  if (/^siti-web-.+-torino$/.test(nome)) return ['src/pages/[settore].astro', 'src/data/settori.js'];
  return [];
};
const ultimaModifica = (pathname) => {
  if (!gitCompleto) return undefined;
  const file = sorgenti(pathname).filter((f) => fs.existsSync(f));
  if (!file.length) return undefined;
  if (git('status', '--porcelain', '--', ...file)) return adesso;
  const data = git('log', '-1', '--format=%cI', '--', ...file);
  return data ? new Date(data).toISOString() : undefined;
};

// https://astro.build/config
// Sito 100% statico: si carica via FTP nella root del sito (es. Aruba) come file HTML/CSS/JS.
// L'invio email è gestito da /contact.php (PHP + SMTP Aruba), non da Node.
export default defineConfig({
  // ⚠️ Dominio reale del sito (usato per sitemap, canonical e OG)
  site: 'https://www.moledigitale.it',
  build: { inlineStylesheets: 'auto' },
  // I font restano sempre file a parte: sotto i 4 KB Vite li incorporerebbe nel CSS come
  // data:, e la CSP del server (font-src 'self', in public/.htaccess) li bloccherebbe.
  vite: { build: { assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/i.test(file) ? false : undefined) } },
  // Sitemap: dentro solo le pagine che vogliamo su Google.
  // Fuori: le singole demo (/demo/bar/, /demo/sushi/…), le bozze dei clienti
  // (/demoFarmaciaAusiliatrice/, /demoElWarike/, /demoPuntoPane/, /demoClienti/), le versioni reali in sviluppo
  // (/demoClientiDev/ e i siti /<cliente>Dev/, es. /masgioielliDev/) e le pagine di servizio.
  // La galleria /demo/ resta indicizzabile.
  integrations: [
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname;
        if (p.startsWith('/demo/') && p !== '/demo/') return false;
        if (/^\/demo[A-Z]/.test(p)) return false;
        if (/^\/[a-zA-Z]+Dev\//.test(p)) return false;
        return !['/privacy', '/dypa', '/crediti'].some((x) => p.startsWith(x));
      },
      serialize: (item) => {
        const lastmod = ultimaModifica(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
