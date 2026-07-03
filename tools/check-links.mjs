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
for (const file of htmls) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const h of new Set(hrefs)) {
    if (h.startsWith('//')) continue; // protocollo-relativo (esterno)
    if (!exists(h)) { console.error(`ROTTO  ${h}  ←  ${file}`); broken++; }
  }
}
console.log(broken === 0 ? `✓ Link interni ok (${htmls.length} pagine controllate)` : `✗ ${broken} link rotti`);
process.exit(broken === 0 ? 0 : 1);
