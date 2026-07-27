// Verifica i link INTERNI di dist/: ogni href="/..." deve corrispondere a un file esistente.
// Usato in CI dopo la build: se trova link rotti, esce con codice 1 e blocca il deploy.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const htmls = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmls.push(p);
  }
})(DIST);

const exists = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return true;
  const rel = clean.replace(/^\//, '');
  return (
    fs.existsSync(path.join(DIST, rel)) ||
    fs.existsSync(path.join(DIST, rel, 'index.html')) ||
    fs.existsSync(path.join(DIST, rel.replace(/\/$/, '') + '.html'))
  );
};

let broken = 0;
const linkate = new Set(); // pagine raggiunte da almeno un link interno
for (const file of htmls) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const h of new Set(hrefs)) {
    if (h.startsWith('//')) continue; // protocollo-relativo (esterno)
    if (!exists(h)) { console.error(`ROTTO  ${h}  ←  ${file}`); broken++; }
    const pulito = h.split('#')[0].split('?')[0].replace(/\/$/, '');
    if (pulito) linkate.add(pulito);
  }
}

// Pagine ORFANE: indicizzabili ma senza nemmeno un link interno che le raggiunga.
// Google le scopre a fatica e le considera poco importanti: quasi sempre e' una svista.
const orfane = [];
for (const file of htmls) {
  const html = fs.readFileSync(file, 'utf8');
  if (/name="robots"[^>]*noindex/i.test(html)) continue;      // le demo sono noindex: ok
  const url = '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  const chiave = url.replace(/\/$/, '');
  if (chiave === '' || chiave === '/404') continue;            // home e pagina d'errore
  if (!linkate.has(chiave)) orfane.push(url);
}
for (const u of orfane) console.error(`ORFANA  ${u}  (indicizzabile ma nessun link interno la raggiunge)`);

const ok = broken === 0 && orfane.length === 0;
console.log(ok
  ? `✓ Link interni ok (${htmls.length} pagine controllate, nessuna orfana)`
  : `✗ ${broken} link rotti, ${orfane.length} pagine orfane`);
process.exit(ok ? 0 : 1);
