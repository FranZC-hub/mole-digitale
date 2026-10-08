// Collaudo di MasGioielli SENZA DATABASE (SENZA_DATABASE in src/pages/masgioielliDev/_sito.js):
// dist/ servito da un piccolo server statico (niente PHP), con la stessa Content-Security-Policy
// del server vero. Prova accesso, vetrina con foto, orari, chiusure, marchi, quello che vede
// il sito, i moduli, il cambio password e «password dimenticata». Serve Chrome e puppeteer-core.
// Uso:  npm run mas:prova-locale   (build + collaudo)
// La password e' quella della build: MAS_DEV_UTENTE / MAS_DEV_PASSWORD, oppure .locale/negozio-mysql.json.
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

// tools/masgioielli/ → radice del sito di Mole Digitale
const RADICE = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const require = createRequire(join(RADICE, 'package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIST = join(RADICE, 'dist');
const PORTA = 8093, H = `http://127.0.0.1:${PORTA}/masgioielliDev`;
const CSP = readFileSync(join(RADICE, 'public/masgioielliDev/.htaccess'), 'utf8').match(/Content-Security-Policy "([^"]+)"/)[1];

if (!/export const SENZA_DATABASE = true/.test(readFileSync(join(RADICE, 'src/pages/masgioielliDev/_sito.js'), 'utf8'))) {
  console.log('Il sito usa il database (SENZA_DATABASE = false): il collaudo giusto è  npm run mas:prova-sito');
  process.exit(0);
}
if (!existsSync(join(DIST, 'masgioielliDev'))) { console.error('Manca dist/: prima  npm run build'); process.exit(1); }
let utente = process.env.MAS_DEV_UTENTE || 'negozio', password = process.env.MAS_DEV_PASSWORD || '';
if (!password) {
  try { ({ utente, password } = JSON.parse(readFileSync(join(RADICE, '.locale/negozio-mysql.json'), 'utf8'))); }
  catch { console.error('Manca la password della build (MAS_DEV_PASSWORD o .locale/negozio-mysql.json)'); process.exit(1); }
}

// ---------------------------------------------------------------- server statico
const TIPI = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  const percorso = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(DIST, percorso);
  if (!file.startsWith(DIST)) { res.writeHead(400); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const trovato = existsSync(file) && statSync(file).isFile();
  if (!trovato) file = join(DIST, 'masgioielliDev/404/index.html');
  const tipo = TIPI[extname(file)] || 'application/octet-stream';
  res.writeHead(trovato ? 200 : 404, { 'Content-Type': tipo, ...(tipo.startsWith('text/html') ? { 'Content-Security-Policy': CSP } : {}) });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(PORTA, '127.0.0.1', ok));

// ---------------------------------------------------------------- collaudo
let ko = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  KO   ') + m); if (!c) ko++; };
const pausa = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const ctx = await b.createBrowserContext();
const errori = [];
async function pagina(vp = { width: 1280, height: 900 }) {
  const p = await ctx.newPage();
  await p.setViewport(vp);
  p.on('pageerror', (e) => errori.push('JS: ' + e.message.split('\n')[0]));
  p.on('console', (m) => {
    // il 404 della pagina inesistente che il test apre apposta
    if (m.type() === 'error' && /status of 404/.test(m.text()) && /pagina-che-non-esiste/.test(m.location()?.url || '')) return;
    if (m.type() === 'error' || /Refused|Content Security Policy/i.test(m.text())) errori.push('console: ' + m.text().slice(0, 160));
  });
  // senza database nessuna pagina deve chiamare il server
  p.on('request', (r) => { if (r.url().includes('/api/')) errori.push('chiamata al server: ' + r.url()); });
  p.on('dialog', (d) => d.accept());
  return p;
}

try {
  console.log('\n[1] Accesso');
  const a = await pagina();
  await a.goto(H + '/area-riservata/', { waitUntil: 'networkidle0' }); await pausa(500);
  ok(await a.$eval('#accesso', (e) => !e.hidden), 'si chiede l’accesso');
  ok(!(await a.content()).includes(password), 'la password non è nella pagina (solo la sua impronta)');
  await a.type('#l-user', utente); await a.type('#l-pass', 'sbagliata'); await a.click('#lEntra'); await pausa(1500);
  ok((await a.$eval('#lErr', (e) => e.textContent)).includes('non corretti'), 'password sbagliata: rifiutata');
  await a.$eval('#l-pass', (i) => { i.value = ''; }); await a.type('#l-pass', password); await a.click('#lEntra'); await pausa(1500);
  ok(await a.$eval('#pannello', (e) => !e.hidden), 'dentro, con la password della build');
  ok(await a.$eval('#avvisoLocale', (e) => e.offsetParent !== null), 'avviso «versione di prova, senza database»');

  console.log('\n[2] Vetrina');
  ok((await a.$eval('#sVetrina', (e) => e.textContent)) === '0 pezzi in vetrina', 'si parte vuoti: niente dati inventati');
  for (const nome of ['Collana di prova', 'Anello di prova']) {
    await a.click('#nuovoPezzo'); await pausa(200);
    await (await a.$('#z-foto')).uploadFile(join(RADICE, 'public/masgioielliDev/img/anteprima.jpg')); await pausa(800);
    await a.type('#z-nome', nome); await a.select('#z-cat', nome.startsWith('Anello') ? 'Anelli' : 'Collane');
    await a.click('#pezzoSalva'); await pausa(1200);
  }
  let nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi.join() === 'Anello di prova,Collana di prova', 'due pezzi, l’ultimo in cima');
  ok((await a.$eval('#elencoPezzi img', (i) => i.src)).startsWith('data:image/jpeg'), 'la foto è salvata nel browser, ridotta');
  await a.click('#elencoPezzi [data-giu="0"]'); await pausa(500);
  nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi[0] === 'Collana di prova', 'spostato giù');
  await a.click('#elencoPezzi [data-via="0"]'); await pausa(500);
  await a.click('#avvisoAnnulla'); await pausa(1200);
  nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi.join() === 'Collana di prova,Anello di prova', 'tolto e rimesso con «Annulla», al suo posto');

  console.log('\n[3] Orari, chiusure, marchi');
  await a.click('#t-orari'); await pausa(200);
  ok((await a.$$eval('#orariForm .o-aperto', (x) => x.filter((i) => i.checked).length)) === 5, 'il modulo parte dall’orario del negozio (5 giorni aperti), non da tutto chiuso');
  await a.click('#orariForm tr[data-g="1"] .o-aperto'); await a.click('#orariSalva'); await pausa(800);
  ok((await a.$eval('#avvisoTxt', (e) => e.textContent)).includes('Orari salvati'), 'lunedì aperto: orari salvati');
  const fra = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
  await a.$eval('#c-dal', (i, v) => { i.value = v; i.dispatchEvent(new Event('change')); }, fra);
  await a.type('#c-motivo', 'inventario'); await a.click('#chiuForm button'); await pausa(800);
  ok((await a.$$eval('#elencoChiusure .el-riga', (x) => x.length)) === 1, 'chiusura aggiunta');
  await a.click('#t-marchi'); await a.click('#nuovoMarchio'); await pausa(200);
  await a.type('#b-nome', 'Marchio di prova'); await a.click('#salva'); await pausa(800);
  ok((await a.$$eval('#elenco .el-riga', (x) => x.length)) === 1, 'marchio aggiunto');

  console.log('\n[4] Il sito mostra quello che il negozio ha inserito (in questo browser)');
  const p = await pagina();
  await p.goto(H + '/', { waitUntil: 'networkidle0' }); await pausa(1200);
  ok(await p.$eval('#selezioneHome', (e) => !e.hidden) && (await p.$$eval('#rail .rail-el', (x) => x.length)) === 2, 'home: la selezione con 2 pezzi');
  ok(await p.$eval('#marchiBanda', (e) => !e.hidden), 'home: fascia marchi');
  ok((await p.$eval('#listaOrari', (e) => e.innerText)).includes('inventario'), 'home: la chiusura è annunciata');
  ok((await p.$eval('#piedeOrari', (e) => e.innerText)).toLowerCase().includes('lunedì'), 'piede: orari aggiornati');
  ok(/Martedì\s*9:30–12:30 \/ 15:30–19:30/.test(await p.$eval('#listaOrari', (e) => e.innerText)), 'aprire il lunedì non chiude gli altri giorni');
  await p.goto(H + '/selezione/', { waitUntil: 'networkidle0' }); await pausa(1200);
  ok((await p.$$eval('.pezzo', (x) => x.length)) === 2, 'Selezione: i due pezzi');

  console.log('\n[5] Moduli');
  await p.goto(H + '/contatti/', { waitUntil: 'networkidle0' }); await pausa(600);
  await p.type('#c-nome', 'Rosa'); await p.type('#c-rec', 'rosa@example.it'); await p.click('#c-privacy');
  await p.click('#contForm button[type=submit]'); await pausa(600);
  ok((await p.$eval('#contOk', (e) => e.textContent)).includes('versione di prova'), 'Contatti: dice che senza server il messaggio non parte');
  await p.goto(H + '/perizie/', { waitUntil: 'networkidle0' }); await pausa(600);
  await p.type('#q-nome', 'Mario'); await p.type('#q-tel', '333 1234567'); await p.click('#q-privacy');
  await p.click('#perForm button[type=submit]'); await pausa(600);
  ok((await p.$eval('#perOk', (e) => e.textContent)).includes('versione di prova'), 'Perizie: idem');

  console.log('\n[6] Password e sessione');
  await a.bringToFront();
  await a.click('#password summary');
  await a.type('#pw-attuale', password); await a.type('#pw-nuova', 'Nuova-password-1'); await a.type('#pw-ripeti', 'Nuova-password-1');
  await a.click('#pwForm button'); await pausa(2000);
  ok((await a.$eval('#avvisoTxt', (e) => e.textContent)) === 'Password cambiata', 'password cambiata (su questo dispositivo)');
  await a.click('#esci'); await pausa(500);
  await a.reload({ waitUntil: 'networkidle0' }); await pausa(500);
  ok(await a.$eval('#accesso', (e) => !e.hidden), 'Esci: ricaricando non si rientra senza password');
  await a.$eval('#l-user', (i) => { i.value = ''; }); await a.type('#l-user', utente); await a.type('#l-pass', 'Nuova-password-1'); await a.click('#lEntra'); await pausa(1500);
  ok(await a.$eval('#pannello', (e) => !e.hidden), 'si entra con la password nuova');
  await a.click('#esci'); await pausa(500);
  await a.click('#vaiRecupero'); await a.click('#rManda'); await pausa(500);
  ok(await a.$eval('#rFatto', (e) => !e.hidden) && await a.$eval('#rErr', (e) => e.hidden), '«Password dimenticata?»: fa come se l’email partisse');

  console.log('\n[7] Telefono e pagine');
  const m = await pagina({ width: 390, height: 844, isMobile: true, hasTouch: true });
  for (const u of ['/', '/selezione/', '/atelier/', '/compro-oro/', '/perizie/', '/contatti/', '/privacy/', '/area-riservata/', '/pagina-che-non-esiste/']) {
    const r = await m.goto(H + u, { waitUntil: 'networkidle0' });
    const w = await m.evaluate(() => document.documentElement.scrollWidth);
    ok(w <= 390 && (u.includes('non-esiste') ? r.status() === 404 : r.status() === 200), `${u} (${r.status()}) senza scorrimento orizzontale (${w}px)`);
  }
} finally {
  await b.close();
  server.close();
}
console.log('\nerrori JavaScript / CSP / chiamate al server:', errori.length ? '\n  ' + [...new Set(errori)].join('\n  ') : 'nessuno');
if (errori.length) ko++;
console.log(ko ? `\n${ko} da sistemare` : '\nTutto a posto');
process.exit(ko ? 1 : 0);
