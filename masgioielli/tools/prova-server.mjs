// Collaudo del SERVER (Apache con .htaccess attivo): HTTPS, www, intestazioni di
// sicurezza, cache, compressione, pagine e cartelle vietate, foto che non eseguono
// script, reindirizzamenti dal vecchio sito, cookie Secure, errori PHP nascosti.
// Si usa su un Apache di prova o sul server vero prima del lancio:
//   MAS_URL=https://127.0.0.1:8443 MAS_HTTP=http://127.0.0.1:8088 MAS_DIST=dist node tools/prova-server.mjs
// MAS_DIST (facoltativo, solo in locale): cartella servita, per creare file di prova
// (script travestiti, file nascosti) e toglierli alla fine.
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import https from 'node:https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= '0';   // certificato di prova in locale
const H = (process.env.MAS_URL || '').replace(/\/$/, '');
const HTTP = (process.env.MAS_HTTP || '').replace(/\/$/, '');
const DIST = process.env.MAS_DIST || '';
if (!H) { console.error('Serve MAS_URL (es. https://www.masgioielli.it)'); process.exit(2); }

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
  console.log('\n[1] HTTPS e indirizzo unico');
  if (HTTP) {
    const r = await get(HTTP + '/perizie/');
    ok(r.status === 301 && r.headers.get('location')?.startsWith('https://'), `http → https (${r.status} ${r.headers.get('location')})`);
  }
  // fetch non lascia cambiare l'intestazione Host: qui serve il modulo https
  const conHost = (host) => new Promise((ris, rif) => {
    const u = new URL(H + '/');
    const req = https.request({ hostname: u.hostname, port: u.port || 443, path: '/', method: 'GET', headers: { Host: host }, rejectUnauthorized: false, servername: host }, (res) => { res.resume(); ris({ status: res.statusCode, location: res.headers.location }); });
    req.on('error', rif); req.end();
  });
  const w = await conHost('masgioielli.it');
  ok(w.status === 301 && w.location === 'https://www.masgioielli.it/', `masgioielli.it → https://www.masgioielli.it/ (${w.status} ${w.location})`);
  let r;

  console.log('\n[2] Intestazioni di sicurezza (pagina HTML)');
  r = await get('/');
  const h = (n) => r.headers.get(n) || '';
  ok(r.status === 200, 'home 200');
  ok(/max-age=31536000/.test(h('strict-transport-security')), 'HSTS');
  ok(h('content-security-policy').includes("script-src 'self'") && h('content-security-policy').includes("object-src 'none'"), 'Content-Security-Policy');
  ok(h('x-content-type-options') === 'nosniff', 'nosniff');
  ok(h('x-frame-options') === 'SAMEORIGIN', 'niente incorniciamento da altri siti');
  ok(h('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy');
  ok(h('permissions-policy').includes('camera=()'), 'Permissions-Policy');
  ok(!h('x-powered-by'), 'la versione di PHP non viene dichiarata');

  console.log('\n[3] Cache e compressione');
  const html = await r.text();
  const asset = html.match(/(?:src|href)="(\/_astro\/[^"]+\.(?:js|css))"/)?.[1];
  if (asset) {
    const a = await get(asset);
    ok(/immutable/.test(a.headers.get('cache-control') || ''), `file di Astro in cache per sempre (${asset.split('/').pop()})`);
  }
  r = await get('/', { headers: { 'Accept-Encoding': 'gzip' } });
  ok(r.headers.get('content-encoding') === 'gzip', 'HTML compresso (gzip)');
  const img = await get('/img/sala.webp');
  ok(img.status === 200 && /webp/.test(img.headers.get('content-type') || '') && (img.headers.get('expires') || /max-age/.test(img.headers.get('cache-control') || '')), 'immagini con scadenza lunga');
  const font = html.match(/href="(\/_astro\/[^"]+\.woff2)"/)?.[1];
  if (font) { const f = await get(font); ok(f.headers.get('content-type') === 'font/woff2', 'font con il tipo giusto (font/woff2)'); }

  console.log('\n[4] Pagine e errori');
  r = await get('/pagina-che-non-esiste/');
  ok(r.status === 404 && (await r.text()).includes('Questa pagina'), 'indirizzo inesistente: 404 con la pagina del sito');
  r = await get('/img/');
  ok(r.status === 403 || r.status === 404, `nessun elenco dei file delle cartelle (/img/ → ${r.status})`);
  r = await get('/robots.txt');
  ok(r.status === 200 && (await r.text()).includes('Disallow: /area-riservata/'), 'robots.txt');

  console.log('\n[5] File che non devono mai uscire');
  for (const [u, nota] of [['/api/config.php', 'configurazione con le password'], ['/api/config.esempio.php', 'esempio di configurazione'], ['/api/lib/base.php', 'librerie interne'], ['/api/phpmailer/src/PHPMailer.php', 'libreria email'], ['/.htaccess', 'regole del server']]) {
    r = await get(u);
    ok(r.status === 403 || r.status === 404, `${u} (${nota}): ${r.status}`);
  }
  if (crea('.env', 'SEGRETO=1')) { r = await get('/.env'); ok(r.status === 403, `/.env (file nascosto): ${r.status}`); }
  if (crea('.git/config', '[core]')) { r = await get('/.git/config'); ok(r.status === 403, `/.git/config: ${r.status}`); }
  if (crea('.well-known/acme-challenge/prova-certificato', 'ok-certificato')) {
    r = await get((HTTP || H) + '/.well-known/acme-challenge/prova-certificato');
    ok(r.status === 200 && (await r.text()) === 'ok-certificato', `/.well-known/ raggiungibile anche in http, per il certificato (${r.status})`);
  }

  console.log('\n[6] Cartella delle foto: nessuno script');
  if (DIST) {
    crea('uploads/pezzi/attacco.php', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.phtml', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.php.jpg', '<?php echo "ESEGUITO-" . (6*7);');
    crea('uploads/pezzi/attacco.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    crea('uploads/pezzi/attacco.html', '<script>alert(1)</script>');
    for (const f of ['attacco.php', 'attacco.phtml']) {
      r = await get('/uploads/pezzi/' + f);
      const t = await r.text();
      ok(r.status === 403 && !t.includes('ESEGUITO-42'), `${f}: ${r.status}, non eseguito`);
    }
    r = await get('/uploads/pezzi/attacco.php.jpg');
    const t = await r.text();
    ok(!t.includes('ESEGUITO-42'), `attacco.php.jpg (doppia estensione): ${r.status}, non eseguito`);
    ok(/sandbox/.test(r.headers.get('content-security-policy') || ''), 'le foto sono servite in un recinto (CSP sandbox)');
    for (const f of ['attacco.svg', 'attacco.html']) { r = await get('/uploads/pezzi/' + f); ok(r.status === 403, `${f} (script nel browser): ${r.status}`); }
  } else console.log('  (saltato: serve MAS_DIST)');

  console.log('\n[7] Indirizzi del vecchio sito');
  const attesi = [
    ['/negozio/', '/'], ['/gioielleria/', '/selezione/'], ['/orologeria/', '/selezione/?cat=Orologi'],
    ['/laboratorio/', '/atelier/'], ['/creazioni/', '/atelier/'], ['/pendoleria-orologeria/', '/atelier/'],
    ['/privacy-policy/', '/privacy/'], ['/author/aduetratti/', '/'], ['/feed/', '/'],
    ['/the-shop/?lang=en', '/'], ['/jewels/?lang=en', '/selezione/'], ['/watches/?lang=en', '/selezione/?cat=Orologi'],
    ['/craft-workshops/?lang=en', '/atelier/'], ['/jewels-creations/?lang=en', '/atelier/'], ['/pendulums-watchmaking/?lang=en', '/atelier/'],
    ['/appraisals/?lang=en', '/perizie/'], ['/contacts/?lang=en', '/contatti/'], ['/?lang=en', '/'],
    ['/wp-sitemap.xml', '/sitemap-index.xml'], ['/sitemap.xml', '/sitemap-index.xml'],
  ];
  for (const [vecchio, nuovo] of attesi) {
    r = await get(vecchio);
    const dove = (r.headers.get('location') || '').replace(/^https?:\/\/[^/]+/, '');
    ok(r.status === 301 && dove === nuovo, `${vecchio} → ${dove || '(nessun redirect)'} ${r.status}`);
  }
  for (const u of ['/perizie/', '/contatti/']) { r = await get(u); ok(r.status === 200, `${u} c'è ancora con lo stesso indirizzo`); }
  for (const u of ['/bozza/', '/bozza/wp-content/uploads/2019/12/image00002.jpeg', '/wp-login.php', '/bozza/wp-admin/', '/xmlrpc.php']) {
    r = await get(u);
    ok(r.status === 410, `${u}: 410 «non esiste più»`);
  }

  console.log('\n[8] API dietro Apache');
  r = await get('/api/dati.php');
  ok(r.status === 200 || r.status === 503, `dati.php risponde (${r.status})`);
  const corpo = await r.text();
  ok(!/SQLSTATE|PDOException|Stack trace|\.php on line|Warning:|Notice:/i.test(corpo), 'nessun dettaglio tecnico nella risposta');
  r = await get('/api/pezzi.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{rotto' });
  ok(r.status === 401 && !/Warning|Notice|Fatal/.test(await r.text()), `richiesta senza accesso e con dati rotti: ${r.status}, pulita`);
  if (process.env.MAS_UTENTE && process.env.MAS_PASSWORD) {
    r = await get('/api/accesso.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ utente: process.env.MAS_UTENTE, password: process.env.MAS_PASSWORD }) });
    const c = r.headers.get('set-cookie') || '';
    ok(r.status === 200 && /;\s*secure/i.test(c) && /httponly/i.test(c) && /samesite=strict/i.test(c), 'in HTTPS il cookie di sessione è Secure, HttpOnly, SameSite=Strict');
  }
} finally {
  for (const p of creati) rmSync(p, { force: true });
  if (DIST) for (const d of ['.git', '.well-known']) { const p = join(DIST, d); if (existsSync(p)) rmSync(p, { recursive: true, force: true }); }
}
console.log(ko ? `\n${ko} da sistemare` : '\nTutto a posto');
process.exit(ko ? 1 : 0);
