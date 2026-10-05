// Collaudo del sito nel browser: dist/ + API PHP con un database NUOVO, e la stessa
// Content-Security-Policy del server (il server PHP di prova non legge .htaccess,
// quindi la aggiunge il test alle pagine). Serve Chrome e puppeteer-core.
// Uso:  npm run build  poi  node tools/prova-sito.mjs        (SQLite)
//       MAS_MYSQL=127.0.0.1:3307:root: node tools/prova-sito.mjs   (MySQL/MariaDB)
//       MAS_URL=https://127.0.0.1:8443 MAS_CODICE=... node tools/prova-sito.mjs
//         (server gia' acceso, es. Apache con .htaccess: CSP e intestazioni sono quelle vere)
import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

// tools/masgioielli/ → radice del sito di Mole Digitale
const RADICE = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const require = createRequire(join(RADICE, 'package.json'));
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ESTERNO = (process.env.MAS_URL || '').replace(/\/$/, '');
if (ESTERNO) process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= '0';   // certificato di prova
// MAS_URL e' l'indirizzo del server (senza la cartella del sito)
const PORTA = 8092, SERVER = ESTERNO || `http://127.0.0.1:${PORTA}`, H = SERVER + '/masgioielliDev';
const PROVA = join(RADICE, '.locale', 'prova-sito');
rmSync(PROVA, { recursive: true, force: true }); mkdirSync(PROVA, { recursive: true });
const CSP = readFileSync(join(RADICE, 'public/masgioielliDev/.htaccess'), 'utf8').match(/Content-Security-Policy "([^"]+)"/)[1];

let estensioni = [];
try {
  const php = execSync(process.platform === 'win32' ? 'where php' : 'command -v php').toString().split(/\r?\n/)[0].trim();
  const ext = join(dirname(php), 'ext');
  if (existsSync(ext)) estensioni = ['-d', `extension_dir=${ext}`, ...['pdo_sqlite', 'pdo_mysql', 'gd', 'mbstring', 'fileinfo'].flatMap((e) => ['-d', `extension=${e}`])];
} catch {}
const phpEsegui = (c) => execSync(`php ${estensioni.map((x) => `"${x}"`).join(' ')} -r "${c.replace(/"/g, '\\"')}"`).toString();
const CODICE = process.env.MAS_CODICE || randomBytes(16).toString('hex');
const conf = join(PROVA, 'config.php');
const MY = process.env.MAS_MYSQL ? process.env.MAS_MYSQL.split(':') : null;
const NOMEDB = 'mas_sito_' + Date.now();
if (ESTERNO) {
  console.log('Server esterno: ' + ESTERNO);
} else if (MY) {
  const [host, porta, utente, password = ''] = MY;
  phpEsegui(`$p = new PDO('mysql:host=${host};port=${porta}', '${utente}', '${password}'); $p->exec('CREATE DATABASE ${NOMEDB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');`);
  writeFileSync(conf, `<?php return ['db' => ['dsn' => 'mysql:host=${host};port=${porta};dbname=${NOMEDB};charset=utf8mb4', 'utente' => '${utente}', 'password' => '${password}'], 'posta' => ['host' => ''], 'sale' => 'prova', 'installazione' => '${CODICE}'];`);
  console.log('Database: MySQL/MariaDB');
} else {
  writeFileSync(conf, `<?php return ['db' => ['dsn' => 'sqlite:${join(PROVA, 'sito.sqlite').replace(/\\/g, '/')}'], 'posta' => ['host' => ''], 'sale' => 'prova', 'installazione' => '${CODICE}'];`);
  console.log('Database: SQLite');
}
const server = ESTERNO ? { kill() {}, stderr: { on() {} } } : spawn('php', [...estensioni, '-d', 'upload_max_filesize=10M', '-d', 'post_max_size=12M', '-S', `127.0.0.1:${PORTA}`, '-t', join(RADICE, 'dist')], { env: { ...process.env, MAS_CONFIG: conf }, stdio: ['ignore', 'ignore', 'pipe'] });
let logServer = ''; server.stderr.on('data', (d) => { logServer += d; });
if (!ESTERNO) await new Promise((r) => setTimeout(r, 900));

let ko = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  KO   ') + m); if (!c) ko++; };
const pausa = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, acceptInsecureCerts: !!ESTERNO, args: ['--no-sandbox', '--disable-gpu'] });
const errori = [];
const ctx = await b.createBrowserContext();
async function pagina(vp = { width: 1280, height: 900 }) {
  const p = await ctx.newPage();
  await p.setViewport(vp);
  // la CSP del server sulle pagine HTML
  if (!ESTERNO) await p.setRequestInterception(true);
  if (!ESTERNO) p.on('request', async (req) => {
    if (req.resourceType() !== 'document') return req.continue();
    try {
      const r = await fetch(req.url(), { redirect: 'manual' });
      const corpo = Buffer.from(await r.arrayBuffer());
      const h = Object.fromEntries(r.headers.entries());
      req.respond({ status: r.status, headers: { ...h, 'content-security-policy': CSP }, body: corpo });
    } catch { req.continue(); }
  });
  await p.evaluateOnNewDocument(() => {
    document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = 'html{scroll-behavior:auto !important}'; document.head.append(s); });
  });
  p.on('pageerror', (e) => errori.push('JS: ' + e.message.split('\n')[0]));
  p.on('console', (m) => {
    // il 401 e' la risposta giusta al tentativo con password sbagliata che il test fa apposta
    if (m.type() === 'error' && /status of 401/.test(m.text())) return;
    // e il 404 della pagina inesistente che il test apre apposta
    if (m.type() === 'error' && /status of 404/.test(m.text()) && /pagina-che-non-esiste/.test(m.location()?.url || '')) return;
    if (m.type() === 'error' || /Refused|Content Security Policy/i.test(m.text())) errori.push('console: ' + m.text().slice(0, 160));
  });
  p.on('dialog', (d) => d.accept());
  return p;
}
const posta = async (percorso, campi) => fetch(H + percorso, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(campi) }).then((r) => r.text());

try {
  console.log('\n[1] Installazione');
  const t = await posta('/api/installa.php', { codice: CODICE, utente: 'negozio', password: 'Solo-per-i-collaudi-1', ripeti: 'Solo-per-i-collaudi-1' });
  ok(t.includes('Installazione completata'), 'tabelle e primo utente');

  console.log('\n[2] Sito appena installato (vetrina e marchi vuoti)');
  const p = await pagina();
  await p.goto(H + '/', { waitUntil: 'networkidle0' });
  ok(await p.$eval('#selezioneHome', (e) => e.hidden), 'home: senza pezzi la sezione «selezione» non compare');
  ok(await p.$eval('#marchiBanda', (e) => e.hidden), 'home: senza marchi la fascia non compare');
  ok((await p.$$eval('#listaOrari li', (l) => l.length)) === 7, 'home: orari dal database');
  ok(!(await p.content()).includes('Silvia R.'), 'nessuna recensione inventata');
  ok(!/demoMasGioielli|Bozza dimostrativa|Per il titolare|Anteprima realizzata/.test(await p.content()), 'nessuna traccia della bozza');
  ok((await p.$eval('link[rel=canonical]', (l) => l.href)) === 'https://www.moledigitale.it/masgioielliDev/', 'link canonico all’indirizzo vero');
  ok((await p.$eval('meta[name=robots]', (m) => m.content)).includes('noindex'), 'versione in sviluppo: fuori da Google (noindex)');
  await p.goto(H + '/selezione/', { waitUntil: 'networkidle0' });
  ok(await p.$eval('#vuotoTutto', (e) => !e.hidden), 'Selezione vuota: «Stiamo rinnovando la selezione»');

  console.log('\n[3] Area riservata');
  const a = await pagina();
  await a.goto(H + '/area-riservata/', { waitUntil: 'networkidle0' });
  ok(await a.$eval('#accesso', (e) => !e.hidden) && (await a.$eval('meta[name=robots]', (m) => m.content)).includes('noindex'), 'si chiede l’accesso; pagina non indicizzata');
  await a.type('#l-user', 'negozio'); await a.type('#l-pass', 'sbagliata');
  await a.click('#lEntra'); await pausa(500);
  ok((await a.$eval('#lErr', (e) => e.textContent)).includes('non corretti'), 'password sbagliata: messaggio chiaro');
  await a.$eval('#l-pass', (i) => { i.value = ''; }); await a.type('#l-pass', 'Solo-per-i-collaudi-1');
  await a.click('#lEntra'); await pausa(800);
  ok(await a.$eval('#pannello', (e) => !e.hidden), 'dentro');
  ok((await a.$eval('#sVetrina', (e) => e.textContent)) === '0 pezzi in vetrina', 'riepilogo: ' + await a.$eval('#sVetrina', (e) => e.textContent));
  // aggiunta di due pezzi con foto
  for (const [nome, cat, foto] of [['Collana Arzani', 'Collane', 'vetrina.webp'], ['Anello trilogy', 'Anelli', 'titolare.webp']]) {
    await a.click('#nuovoPezzo'); await pausa(200);
    await (await a.$('#z-foto')).uploadFile(join(RADICE, 'public/masgioielliDev/img', foto));
    await a.waitForFunction(() => !document.getElementById('zAnteprima').hidden, { timeout: 5000 });
    await a.type('#z-nome', nome); await a.select('#z-cat', cat);
    await a.type('#z-desc', 'Prima riga\nSeconda riga');
    await a.click('#pezzoSalva'); await pausa(900);
  }
  let nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi.join('|') === 'Anello trilogy|Collana Arzani', 'due pezzi caricati, l’ultimo in cima');
  ok(/^\/masgioielliDev\/(uploads\/pezzi\/|api\/foto\.php\?f=)/.test(await a.$eval('#elencoPezzi img', (i) => i.getAttribute('src'))), 'foto salvata sul server');
  // modifica
  await a.click('#elencoPezzi [data-mod]'); await pausa(300);
  await a.$eval('#z-mat', (i) => { i.value = ''; }); await a.type('#z-mat', 'Oro bianco 18kt');
  await a.click('#pezzoSalva'); await pausa(800);
  ok((await a.$eval('#elencoPezzi li:first-child .el-tx i', (e) => e.textContent)) === 'Oro bianco 18kt', 'modifica salvata');
  // sposta e togli con Annulla
  await a.click('#elencoPezzi [data-giu="0"]'); await pausa(800);
  nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi[0] === 'Collana Arzani', 'spostato giù');
  await a.click('#elencoPezzi [data-via="0"]'); await pausa(800);
  ok((await a.$$('#elencoPezzi .el-riga')).length === 1 && await a.$eval('#avvisoAnnulla', (x) => !x.hidden), 'tolto, con «Annulla»');
  await a.click('#avvisoAnnulla'); await pausa(1200);
  nomi = await a.$$eval('#elencoPezzi .el-tx b', (x) => x.map((y) => y.textContent));
  ok(nomi.join('|') === 'Collana Arzani|Anello trilogy', '«Annulla»: torna al suo posto, con la sua foto');
  // orari e ferie
  await a.click('#t-orari');
  await a.$eval('#orariForm tr[data-g="2"] .o-a1', (i) => { i.value = '10:00'; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await a.click('#orariCopia'); await a.click('#orariSalva'); await pausa(800);
  ok((await a.$eval('#oStato', (e) => e.textContent)) === '✓ Salvati', 'orari salvati (apertura alle 10:00)');
  const anno = new Date().getFullYear() + 1;
  await a.$eval('#c-dal', (i, y) => { i.value = `${y}-08-10`; i.dispatchEvent(new Event('change', { bubbles: true })); }, anno);
  await a.$eval('#c-al', (i, y) => { i.value = `${y}-08-24`; }, anno);
  await a.type('#c-motivo', 'ferie');
  await a.click('#chiuForm button'); await pausa(800);
  ok((await a.$eval('#elencoChiusure', (e) => e.textContent)).includes('ferie'), 'ferie aggiunte');
  // marchi
  await a.click('#t-marchi'); await a.click('#nuovoMarchio'); await pausa(200);
  await a.type('#b-nome', 'Salvatore Arzani'); await a.click('#salva'); await pausa(800);
  ok((await a.$eval('#sMarchi', (e) => e.textContent)) === '1 marchio in home', 'marchio aggiunto');
  await a.screenshot({ path: join(PROVA, 'area-riservata.png') });

  console.log('\n[4] Il sito mostra quello che il negozio ha inserito');
  await p.bringToFront();   // una scheda in secondo piano non risponde
  await p.goto(H + '/', { waitUntil: 'networkidle0' }); await pausa(500);
  ok(await p.$eval('#selezioneHome', (e) => !e.hidden) && (await p.$$('#rail .rail-el')).length === 2, 'home: la selezione compare con 2 pezzi');
  const misure = await p.$eval('#rail .rail-el', (el) => { const i = el.querySelector('img').getBoundingClientRect(); return { el: Math.round(el.getBoundingClientRect().width), r: +(i.height / i.width).toFixed(2), snap: getComputedStyle(el).scrollSnapAlign }; });
  ok(misure.el <= 340 && misure.r === 1.25 && misure.snap.includes('start'), `home: schede del nastro con il loro stile (larga ${misure.el}px, foto 4:5 = ${misure.r}, scorrimento a scatti)`);
  ok((await p.$eval('#marchi', (e) => e.textContent)).includes('Salvatore Arzani') && await p.$eval('#marchiBanda', (e) => !e.hidden), 'home: fascia marchi');
  ok((await p.$eval('#listaOrari', (e) => e.innerText)).includes('10:00'), 'home: orari aggiornati');
  ok((await p.$eval('#piedeOrari', (e) => e.innerText)).includes('10:00'), 'piede: orari aggiornati');
  await p.goto(H + '/selezione/', { waitUntil: 'networkidle0' }); await pausa(400);
  const card = await p.$eval('.pezzo', (el) => { const i = el.querySelector('img').getBoundingClientRect(); return { r: +(i.height / i.width).toFixed(2), segna: getComputedStyle(el.querySelector('.segna')).position }; });
  ok(card.r === 1.25 && card.segna === 'absolute', `Selezione: schede con il loro stile (foto 4:5 = ${card.r}, cuore sulla foto)`);
  const filtri = await p.$$eval('#categorie .cat', (x) => x.map((y) => y.textContent));
  ok(filtri.join('|') === 'Tutto|Anelli|Collane', 'filtri solo per le categorie presenti: ' + filtri.join(', '));
  await p.click('#categorie .cat[data-cat="Anelli"]'); await pausa(200);
  ok((await p.$$eval('.pezzo:not([hidden])', (x) => x.length)) === 1, 'filtro Anelli');
  // come farebbe un visitatore: dalla home, clic su un pezzo del nastro
  await p.goto(H + '/', { waitUntil: 'networkidle0' }); await pausa(400);
  await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.click('#rail .rail-el')]);
  await pausa(500);
  ok(await p.$eval('#scheda', (e) => !e.hidden) && (await p.$eval('#sDesc', (e) => e.textContent)).includes('Seconda riga'), 'dalla home, il clic su un pezzo apre la sua scheda in Selezione');
  await p.keyboard.press('Escape');

  console.log('\n[5] Moduli: i messaggi arrivano davvero');
  await p.goto(H + '/contatti/', { waitUntil: 'networkidle0' });
  await pausa(3200);   // il modulo rifiuta gli invii "lampo" sotto i 3 secondi
  await p.type('#c-nome', '<img src=x onerror=alert(1)>');
  await p.type('#c-rec', 'rosa@example.it'); await p.type('#c-msg', 'Vorrei un appuntamento');
  await p.click('#c-privacy'); await p.click('#contForm button[type=submit]'); await pausa(1000);
  ok((await p.$eval('#contOk', (e) => e.textContent)).includes('messaggio ricevuto') && !(await p.$('#contOk img')), 'Contatti: inviato; il nome con codice resta testo');
  await p.goto(H + '/perizie/', { waitUntil: 'networkidle0' });
  await pausa(3200);
  await p.type('#q-nome', 'Mario'); await p.type('#q-tel', '333 1234567'); await p.click('#q-privacy');
  await p.click('#perForm button[type=submit]'); await pausa(1000);
  ok((await p.$eval('#perOk', (e) => e.textContent)).includes('Richiesta ricevuta'), 'Perizie: inviata');
  await p.goto(H + '/contatti/', { waitUntil: 'networkidle0' });
  await p.type('#c-nome', 'Lampo'); await p.type('#c-rec', '3331234567'); await p.click('#c-privacy');
  await p.click('#contForm button[type=submit]'); await pausa(800);
  await a.bringToFront();
  await a.reload({ waitUntil: 'networkidle0' }); await pausa(800);
  await a.click('#t-messaggi'); await pausa(200);
  const msg = await a.$$eval('#elencoMessaggi .msg', (x) => x.map((y) => y.innerText));
  ok(msg.length === 2, `nell’area riservata 2 messaggi (l’invio «lampo» di un programma no): ${msg.length}`);
  ok(!(await a.$('#elencoMessaggi img')) && msg.some((t) => t.includes('<img src=x')), 'il nome con codice è mostrato come testo, non eseguito');
  ok((await a.$eval('#sMessaggi', (e) => e.textContent)) === '2 da leggere', 'riepilogo: 2 da leggere');
  await a.click('#elencoMessaggi [data-letto]'); await pausa(700);
  ok((await a.$eval('#sMessaggi', (e) => e.textContent)) === '1 da leggere', 'segnato come letto');

  console.log('\n[6] Password e sessione');
  await a.click('#password summary');
  await a.type('#pw-attuale', 'Solo-per-i-collaudi-1'); await a.type('#pw-nuova', 'Nuova-password-1'); await a.type('#pw-ripeti', 'Nuova-password-1');
  await a.click('#pwForm button'); await pausa(800);
  ok((await a.$eval('#avvisoTxt', (e) => e.textContent)) === 'Password cambiata', 'password cambiata dall’area riservata');
  await a.click('#esci'); await pausa(600);
  ok(await a.$eval('#accesso', (e) => !e.hidden), 'Esci: si torna all’accesso');
  await a.reload({ waitUntil: 'networkidle0' }); await pausa(400);
  ok(await a.$eval('#accesso', (e) => !e.hidden), 'ricaricando non si rientra senza password');

  console.log('\n[7] Telefono e pagine');
  const m = await pagina({ width: 390, height: 844, isMobile: true, hasTouch: true });
  for (const u of ['/', '/selezione/', '/atelier/', '/compro-oro/', '/perizie/', '/contatti/', '/privacy/', '/area-riservata/', '/pagina-che-non-esiste/']) {
    const r = await m.goto(H + u, { waitUntil: 'networkidle0' });
    const w = await m.evaluate(() => document.documentElement.scrollWidth);
    ok(w <= 390 && (u.includes('non-esiste') || r.status() === 200), `${u} (${r.status()}) senza scorrimento orizzontale (${w}px)`);
  }
  const sitemap = await fetch(SERVER + '/sitemap-0.xml').then((r) => r.text());
  ok(sitemap.includes('<loc>') && !sitemap.includes('masgioielliDev') && !sitemap.includes('demoClientiDev'), 'nella sitemap di moledigitale.it non c’è (versione in sviluppo)');
} finally {
  await b.close();
  server.kill();
  if (MY && !ESTERNO) { const [host, porta, utente, password = ''] = MY; try { phpEsegui(`$p = new PDO('mysql:host=${host};port=${porta}', '${utente}', '${password}'); $p->exec('DROP DATABASE ${NOMEDB}');`); } catch {} }
  const cart = join(RADICE, 'dist/masgioielliDev/uploads/pezzi');
  if (existsSync(cart)) rmSync(cart, { recursive: true });
}
const avvisiPhp = logServer.split('\n').filter((l) => /Warning|Notice|Deprecated|Fatal/.test(l));
console.log('\nerrori JavaScript / CSP:', errori.length ? '\n  ' + [...new Set(errori)].join('\n  ') : 'nessuno');
console.log('avvisi PHP:', avvisiPhp.length ? '\n  ' + avvisiPhp.slice(0, 5).join('\n  ') : 'nessuno');
if (errori.length || avvisiPhp.length) ko++;
console.log(ko ? `\n${ko} da sistemare` : '\nTutto a posto');
process.exit(ko ? 1 : 0);
