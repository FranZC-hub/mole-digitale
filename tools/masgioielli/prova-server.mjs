// Collaudo del SERVER (Apache con .htaccess attivo) per MasGioielli dentro moledigitale.it:
// il .htaccess della cartella si aggiunge a quello del sito principale senza romperlo
// (HTTPS obbligato, HSTS), CSP propria, noindex, cache, compressione, 404 del sito, file
// vietati, foto che non eseguono script, API pulita, cookie Secure limitato alla cartella.
// Si usa su un Apache di prova o sul server vero dopo il deploy:
//   MAS_URL=https://www.moledigitale.it MAS_HTTP=http://www.moledigitale.it node tools/masgioielli/prova-server.mjs
// MAS_URL e MAS_HTTP sono l'indirizzo del SERVER, senza la cartella del sito.
// MAS_DIST (facoltativo, solo in locale): la dist/ servita, per creare file di prova
// (script travestiti, file nascosti) e toglierli alla fine.
// MAS_UTENTE e MAS_PASSWORD (facoltativi): controllano anche il cookie di sessione.
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= '0';   // certificato di prova in locale
const CARTELLA = '/masgioielliDev/';
const SERVER = (process.env.MAS_URL || '').replace(/\/$/, '');
const HTTP = (process.env.MAS_HTTP || '').replace(/\/$/, '');
const DIST = process.env.MAS_DIST ? join(process.env.MAS_DIST, ...CARTELLA.split('/').filter(Boolean)) : '';
if (!SERVER) { console.error('Serve MAS_URL (es. https://www.moledigitale.it)'); process.exit(2); }
const H = SERVER + CARTELLA;

let ko = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  KO   ') + m); if (!c) ko++; };
const get = (u, opz = {}) => fetch(u.startsWith('http') ? u : H + u, { redirect: 'manual', ...opz });
const creati = [];
const crea = (rel, testo) => {
  if (!DIST) return false;
  const p = join(DIST, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, testo);
  creati.push(p);
  return true;
};

try {
  console.log('\n[1] HTTPS (regola del sito principale, valida anche qui dentro)');
  if (HTTP) {
    const r = await get(HTTP + CARTELLA + 'perizie/');
    const dove = r.headers.get('location') || '';
    ok(r.status === 301 && dove.startsWith('https://') && dove.endsWith(CARTELLA + 'perizie/'), `http → https (${r.status} ${dove})`);
    const api = await get(HTTP + CARTELLA + 'api/dati.php');
    ok(api.status === 301 && api.headers.get('location')?.startsWith('https://'), `anche l'API passa a https (${api.status})`);
  } else console.log('  (saltato: serve MAS_HTTP)');

  console.log('\n[2] Intestazioni (pagina HTML)');
  let r = await get('');
  const h = (n) => r.headers.get(n) || '';
  const csp = h('content-security-policy');
  ok(r.status === 200, 'home 200');
  ok(/max-age=31536000/.test(h('strict-transport-security')), 'HSTS (dal sito principale)');
  ok(csp.includes("img-src 'self' data: blob:") && csp.includes("object-src 'none'"), 'CSP della cartella (immagini blob: per l’anteprima delle foto)');
  ok(!/script-src[^;]*'unsafe-inline'/.test(csp) && !csp.includes('frame-src https://www.google.com'), 'una sola CSP, la più stretta: quella del sito principale è sostituita, non sommata');
  ok(/noindex/.test(h('x-robots-tag')), 'X-Robots-Tag: noindex (versione in sviluppo)');
  ok(h('x-content-type-options') === 'nosniff', 'nosniff');
  ok(/DENY|SAMEORIGIN/.test(h('x-frame-options')), 'niente incorniciamento da altri siti');
  ok(h('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy');
  ok(!h('x-powered-by'), 'la versione di PHP non viene dichiarata');
  const home = await get(SERVER + '/');
  ok(home.status === 200 && /'unsafe-inline'/.test(home.headers.get('content-security-policy') || '') && !/noindex/.test(home.headers.get('x-robots-tag') || ''),
    'il resto di moledigitale.it non cambia (sua CSP, indicizzabile)');

  console.log('\n[3] Cache e compressione');
  const html = await r.text();
  const asset = html.match(/(?:src|href)="(\/_astro\/[^"]+\.(?:js|css))"/)?.[1];
  if (asset) {
    const a = await get(SERVER + asset);
    ok(/immutable/.test(a.headers.get('cache-control') || ''), `file di Astro in cache per sempre (${asset.split('/').pop()})`);
  }
  r = await get('', { headers: { 'Accept-Encoding': 'gzip' } });
  ok(r.headers.get('content-encoding') === 'gzip', 'HTML compresso (gzip)');
  const img = await get('img/sala.webp');
  ok(img.status === 200 && /webp/.test(img.headers.get('content-type') || '') && (img.headers.get('expires') || /max-age/.test(img.headers.get('cache-control') || '')), 'immagini con scadenza lunga');

  console.log('\n[4] Pagine e errori');
  r = await get('pagina-che-non-esiste/');
  ok(r.status === 404 && (await r.text()).includes('— MasGioielli'), 'indirizzo inesistente: 404 con la pagina di MasGioielli');
  r = await get(SERVER + '/pagina-che-non-esiste-qui/');
  ok(r.status === 404 && /<title>[^<]*Mole Digitale/.test(await r.text()), 'fuori dalla cartella resta la 404 di Mole Digitale');
  r = await get('img/');
  ok(r.status === 403 || r.status === 404, `nessun elenco dei file delle cartelle (img/ → ${r.status})`);

  console.log('\n[5] File che non devono mai uscire');
  for (const [u, nota] of [['api/config.php', 'configurazione con le password'], ['api/config.esempio.php', 'esempio di configurazione'], ['api/lib/base.php', 'librerie interne'], ['api/phpmailer/src/PHPMailer.php', 'libreria email'], ['.htaccess', 'regole del server']]) {
    r = await get(u);
    ok(r.status === 403 || r.status === 404, `${u} (${nota}): ${r.status}`);
  }
  if (crea('.env', 'SEGRETO=1')) { r = await get('.env'); ok((r.status === 403 || r.status === 404) && !(await r.text()).includes('SEGRETO'), `.env (file nascosto): ${r.status}`); }
  if (crea('.git/config', '[core]')) { r = await get('.git/config'); ok((r.status === 403 || r.status === 404) && !(await r.text()).includes('[core]'), `.git/config: ${r.status}`); }

  console.log('\n[6] Cartella delle foto: nessuno script');
  if (DIST) {
    crea('uploads/pezzi/attacco.php', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.phtml', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.php.jpg', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    crea('uploads/pezzi/attacco.html', '<script>alert(1)</script>');
    for (const f of ['attacco.php', 'attacco.phtml']) {
      r = await get('uploads/pezzi/' + f);
      const t = await r.text();
      ok(r.status === 403 && !t.includes('ESEGUITO-42'), `${f}: ${r.status}, non eseguito`);
    }
    r = await get('uploads/pezzi/attacco.php.jpg');
    const t = await r.text();
    ok(!t.includes('ESEGUITO-42'), `attacco.php.jpg (doppia estensione): ${r.status}, non eseguito`);
    ok(/sandbox/.test(r.headers.get('content-security-policy') || ''), 'le foto sono servite in un recinto (CSP sandbox)');
    for (const f of ['attacco.svg', 'attacco.html']) { r = await get('uploads/pezzi/' + f); ok(r.status === 403, `${f} (script nel browser): ${r.status}`); }
  } else console.log('  (saltato: serve MAS_DIST)');

  console.log('\n[7] API dietro Apache');
  r = await get('api/dati.php');
  ok(r.status === 200 || r.status === 503, `dati.php risponde (${r.status})`);
  const corpo = await r.text();
  ok(!/SQLSTATE|PDOException|Stack trace|\.php on line|Warning:|Notice:/i.test(corpo), 'nessun dettaglio tecnico nella risposta');
  let pezzi = [];
  try { pezzi = JSON.parse(corpo).pezzi || []; } catch { /* 503 */ }
  if (pezzi.length) {
    const f = await get(SERVER + pezzi[0].img);
    ok(f.status === 200 && /^image\//.test(f.headers.get('content-type') || '') && /sandbox/.test(f.headers.get('content-security-policy') || ''), `foto di un pezzo: ${f.status}, immagine in un recinto (${pezzi[0].img.split('/').slice(-2).join('/')})`);
  }
  r = await get('api/pezzi.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{rotto' });
  ok(r.status === 401 && !/Warning|Notice|Fatal/.test(await r.text()), `richiesta senza accesso e con dati rotti: ${r.status}, pulita`);
  if (process.env.MAS_UTENTE && process.env.MAS_PASSWORD) {
    r = await get('api/accesso.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ utente: process.env.MAS_UTENTE, password: process.env.MAS_PASSWORD }) });
    const c = r.headers.get('set-cookie') || '';
    ok(r.status === 200 && /;\s*secure/i.test(c) && /httponly/i.test(c) && /samesite=strict/i.test(c), 'in HTTPS il cookie di sessione è Secure, HttpOnly, SameSite=Strict');
    ok(/path=\/masgioielliDev\/(;|$)/i.test(c), 'e vale solo nella cartella di MasGioielli');
  }
} finally {
  for (const p of creati) rmSync(p, { force: true });
  if (DIST) { const p = join(DIST, '.git'); if (existsSync(p)) rmSync(p, { recursive: true, force: true }); }
}
console.log(ko ? `\n${ko} da sistemare` : '\nTutto a posto');
process.exit(ko ? 1 : 0);
