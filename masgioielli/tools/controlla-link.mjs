// Dopo la build: ogni link e risorsa interna (href="/...", src="/...") di dist/ deve
// esistere. Se qualcosa manca esce con 1, cosi' una build rotta non va online.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'dist');
const htmls = [];
(function giro(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) giro(p);
    else if (f.endsWith('.html')) htmls.push(p);
  }
})(DIST);

const esiste = (url) => {
  const pulito = url.split('#')[0].split('?')[0];
  if (pulito === '' || pulito === '/') return true;
  const rel = decodeURIComponent(pulito.replace(/^\//, ''));
  return fs.existsSync(path.join(DIST, rel)) || fs.existsSync(path.join(DIST, rel, 'index.html'));
};

let rotti = 0;
for (const f of htmls) {
  const html = fs.readFileSync(f, 'utf8');
  for (const u of new Set([...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]))) {
    if (u.startsWith('//')) continue;
    // le foto caricate dal negozio esistono solo sul server
    if (u.startsWith('/uploads/')) continue;
    if (!esiste(u)) { console.error(`ROTTO  ${u}  ←  ${path.relative(DIST, f)}`); rotti++; }
  }
}
// l'API deve esserci tutta
for (const p of ['api/dati.php', 'api/accesso.php', 'api/pezzi.php', 'api/orari.php', 'api/marchi.php', 'api/messaggio.php', 'api/messaggi.php', 'api/installa.php', 'api/lib/base.php', '.htaccess', 'api/.htaccess', 'uploads/.htaccess']) {
  if (!fs.existsSync(path.join(DIST, p))) { console.error('MANCA  ' + p); rotti++; }
}
// e la configurazione con le password NON deve esserci
if (fs.existsSync(path.join(DIST, 'api/config.php'))) { console.error('PERICOLO  dist/api/config.php: le credenziali finirebbero sul server con il deploy'); rotti++; }

console.log(rotti ? `\n${rotti} problemi su ${htmls.length} pagine` : `Link interni a posto (${htmls.length} pagine), API completa, nessuna credenziale in dist/`);
process.exit(rotti ? 1 : 0);
