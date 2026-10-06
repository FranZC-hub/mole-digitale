// Collaudo dell'API PHP: avvia un server PHP su public/ con un database SQLite NUOVO,
// prova installazione, accesso, CSRF, selezione con foto, orari, chiusure, marchi,
// messaggi dei moduli, password dimenticata, e i tentativi di abuso piu' comuni. Esce con 1 se qualcosa non va.
// Uso:  node tools/masgioielli/prova-api.mjs   (npm run mas:prova-api)
import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

// tools/masgioielli/ → radice del sito di Mole Digitale
const RADICE = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const PROVA = join(RADICE, '.locale', 'prova');
// il sito sta in una sottocartella del sito principale: l'API si prova li'
const PORTA = 8091, H = `http://127.0.0.1:${PORTA}/masgioielliDev`;
rmSync(PROVA, { recursive: true, force: true });
mkdirSync(PROVA, { recursive: true });
// le foto caricate nelle prove vanno via alla fine
const fotoPrima = new Set(existsSync(join(RADICE, 'public/masgioielliDev/uploads/pezzi')) ? readdirSync(join(RADICE, 'public/masgioielliDev/uploads/pezzi')) : []);

const CODICE = randomBytes(16).toString('hex');
const conf = join(PROVA, 'config.php');
// le email non partono: si scrivono qui (cosi' si legge il link «password dimenticata»)
const POSTA = join(PROVA, 'posta');
const confPosta = `'posta' => ['cartella_prova' => '${POSTA.replace(/\\/g, '/')}', 'destinatario' => 'negozio@esempio.it'], 'indirizzo' => 'http://127.0.0.1:${PORTA}'`;

let estensioni = [];
try {
  const php = execSync(process.platform === 'win32' ? 'where php' : 'command -v php').toString().split(/\r?\n/)[0].trim();
  const ext = join(dirname(php), 'ext');
  if (existsSync(ext)) estensioni = ['-d', `extension_dir=${ext}`, ...['pdo_sqlite', 'pdo_mysql', 'gd', 'mbstring', 'fileinfo'].flatMap((e) => ['-d', `extension=${e}`])];
} catch {}

// Con MAS_MYSQL=host:porta:utente:password le prove girano su MySQL/MariaDB, in un
// database creato apposta e cancellato alla fine. Senza, su SQLite.
const MY = process.env.MAS_MYSQL ? process.env.MAS_MYSQL.split(':') : null;
const NOMEDB = 'mas_prova_' + Date.now();
const phpEsegui = (codice) => execSync(`php ${estensioni.map((x) => `"${x}"`).join(' ')} -r "${codice.replace(/"/g, '\\"')}"`).toString();
if (MY) {
  const [host, porta, utente, password = ''] = MY;
  phpEsegui(`$p = new PDO('mysql:host=${host};port=${porta}', '${utente}', '${password}'); $p->exec('CREATE DATABASE ${NOMEDB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');`);
  writeFileSync(conf, `<?php return ['db' => ['dsn' => 'mysql:host=${host};port=${porta};dbname=${NOMEDB};charset=utf8mb4', 'utente' => '${utente}', 'password' => '${password}'], ${confPosta}, 'sale' => 'prova', 'installazione' => '${CODICE}', 'foto' => '${join(PROVA, 'foto').replace(/\\/g, '/')}'];`);
  console.log(`Prove su MySQL/MariaDB (${host}:${porta}, database ${NOMEDB})`);
} else {
  writeFileSync(conf, `<?php return ['db' => ['dsn' => 'sqlite:${join(PROVA, 'prova.sqlite').replace(/\\/g, '/')}'], ${confPosta}, 'sale' => 'prova', 'installazione' => '${CODICE}', 'foto' => '${join(PROVA, 'foto').replace(/\\/g, '/')}'];`);
  console.log('Prove su SQLite');
}
// OPcache spento: le prove riscrivono la configurazione a meta' corsa, e con OPcache (attivo
// nel PHP di Ubuntu, quello di GitHub) php -S continuerebbe a usare la versione vecchia
const server = spawn('php', [...estensioni, '-d', 'opcache.enable=0', '-S', `127.0.0.1:${PORTA}`, '-t', join(RADICE, 'public')], { env: { ...process.env, MAS_CONFIG: conf }, stdio: ['ignore', 'ignore', 'pipe'] });
let logServer = ''; server.stderr.on('data', (d) => { logServer += d; });
await new Promise((r) => setTimeout(r, 900));

let ko = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  KO   ') + m); if (!c) ko++; };
let cookie = '';
const chiama = async (percorso, { metodo = 'GET', json, form, csrf, intestazioni = {} } = {}) => {
  const h = { ...intestazioni };
  if (cookie) h.Cookie = cookie;
  if (csrf) h['X-CSRF-Token'] = csrf;
  let body;
  if (json !== undefined) { h['Content-Type'] = 'application/json'; body = JSON.stringify(json); }
  if (form) body = form;
  const r = await fetch(H + percorso, { method: metodo, headers: h, body, redirect: 'manual' });
  const sc = r.headers.get('set-cookie');
  if (sc) cookie = sc.split(';')[0];
  const t = await r.text();
  let d = null; try { d = JSON.parse(t); } catch {}
  return { s: r.status, d, t, h: r.headers };
};
const jpeg = readFileSync(join(RADICE, 'public/masgioielliDev/img/anteprima.jpg'));
const fotoForm = (campi, foto = jpeg, nome = 'foto.jpg', tipo = 'image/jpeg') => {
  const f = new FormData();
  for (const [k, v] of Object.entries(campi)) f.append(k, String(v));
  if (foto) f.append('foto', new Blob([foto], { type: tipo }), nome);
  return f;
};

try {
  console.log('\n[1] Prima dell’installazione');
  let r = await chiama('/api/dati.php');
  ok(r.s === 503 || r.s === 500, `senza tabelle l'API non mostra dettagli tecnici (${r.s}: ${r.t.slice(0, 60)})`);
  ok(!/SQLSTATE|PDO|stack|\.php on line/i.test(r.t), 'nessun messaggio tecnico al browser');

  console.log('\n[2] Installazione');
  r = await chiama('/api/installa.php?codice=' + CODICE);
  ok(r.s === 200 && !r.t.includes('Tabelle create'), 'il codice nell’indirizzo (GET) non basta');
  const fi = new URLSearchParams({ codice: 'sbagliato' });
  r = await chiama('/api/installa.php', { metodo: 'POST', form: fi, intestazioni: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  ok(!r.t.includes('Tabelle create'), 'codice sbagliato: niente');
  r = await chiama('/api/installa.php', { metodo: 'POST', form: new URLSearchParams({ codice: CODICE, utente: 'negozio', password: 'corta', ripeti: 'corta' }), intestazioni: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  ok(r.t.includes('almeno 10 caratteri'), 'password troppo corta: rifiutata');
  r = await chiama('/api/installa.php', { metodo: 'POST', form: new URLSearchParams({ codice: CODICE, utente: 'negozio', password: 'Solo-per-i-collaudi-1', ripeti: 'Solo-per-i-collaudi-1' }), intestazioni: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  ok(r.t.includes('Installazione completata') && r.t.includes('negozio'), 'tabelle create e primo utente pronto');
  r = await chiama('/api/installa.php', { metodo: 'POST', form: new URLSearchParams({ codice: CODICE, utente: 'intruso', password: 'Intruso-12345', ripeti: 'Intruso-12345' }), intestazioni: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  ok(r.t.includes('ha già un utente') && !r.t.includes('intruso'), 'con un utente gia’ presente non se ne creano altri');

  console.log('\n[3] Dati pubblici');
  r = await chiama('/api/dati.php');
  ok(r.s === 200 && Array.isArray(r.d.pezzi) && r.d.pezzi.length === 0, 'selezione vuota all’inizio');
  ok(r.d.orari && r.d.orari['1'] === null && JSON.stringify(r.d.orari['2']) === '[[9.5,12.5],[15.5,19.5]]', 'orario di partenza: lunedì chiuso, martedì 9:30–12:30 / 15:30–19:30');
  ok(/no-cache/.test(r.h.get('cache-control') || '') && r.h.get('etag'), 'niente dati vecchi in cache: si ricontrolla a ogni visita (con ETag)');
  const r304 = await fetch(H + '/api/dati.php', { headers: { 'If-None-Match': r.h.get('etag') } });
  ok(r304.status === 304, 'se nulla è cambiato: 304, senza riscaricare i dati');

  console.log('\n[4] Accesso');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', json: { azione: 'elimina', id: 1 } });
  ok(r.s === 401, 'senza accesso le modifiche sono rifiutate (401)');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'sbagliata' } });
  ok(r.s === 401 && r.d.errore === 'Nome utente o password non corretti', 'password sbagliata');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'nessuno', password: 'sbagliata' } });
  ok(r.s === 401 && r.d.errore === 'Nome utente o password non corretti', 'utente inesistente: stesso messaggio (non si scopre chi esiste)');
  const cookieSessione = (await chiama('/api/accesso.php')).h.get('set-cookie') || cookie;
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Solo-per-i-collaudi-1' } });
  ok(r.s === 200 && r.d.collegato && r.d.csrf?.length === 64, 'accesso riuscito, token CSRF consegnato');
  const CSRF = r.d.csrf;
  const sc = r.h.get('set-cookie') || '';
  ok(/HttpOnly/i.test(sc) && /SameSite=Strict/i.test(sc), 'cookie di sessione HttpOnly e SameSite=Strict');
  ok(/path=\/masgioielliDev\/(;|$)/i.test(sc), 'cookie valido solo nella cartella del sito, non in tutto moledigitale.it');
  ok(!sc || !cookieSessione.includes(sc.split(';')[0]), 'all’accesso la sessione cambia identificativo');

  console.log('\n[5] CSRF');
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'crea', nome: 'X', reparto: 'Gioielleria' } });
  ok(r.s === 403, 'modifica senza token CSRF: rifiutata');
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'crea', nome: 'X', reparto: 'Gioielleria' }, csrf: 'a'.repeat(64) });
  ok(r.s === 403, 'token sbagliato: rifiutata');

  console.log('\n[6] Selezione con foto');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'Collana Arzani', categoria: 'Collane', materiale: 'Argento', descrizione: 'Riga uno\nRiga due' }), csrf: CSRF });
  ok(r.s === 200 && r.d.pezzi.length === 1 && /^\/masgioielliDev\/api\/foto\.php\?f=[a-f0-9]{24}\.jpg$/.test(r.d.pezzi[0].img), 'pezzo creato, foto salvata con nome casuale fuori dalla cartella pubblica: ' + r.d.pezzi?.[0]?.img);
  ok(r.d.pezzi[0].desc === 'Riga uno\nRiga due', 'gli a capo della descrizione restano');
  const foto1 = r.d.pezzi[0].img;
  const img = await fetch(new URL(foto1, H));   // l'API da' l'indirizzo completo
  ok(img.status === 200 && img.headers.get('content-type')?.includes('image/jpeg'), 'la foto si vede');
  ok(/immutable/.test(img.headers.get('cache-control') || '') && /sandbox/.test(img.headers.get('content-security-policy') || ''), 'foto in cache per sempre e servita in un recinto (CSP sandbox)');
  for (const f of ['../config.php', '..%2F..%2Fconfig.php', 'config.php', 'aaaaaaaaaaaaaaaaaaaaaaaa.jpg', foto1.split('f=')[1] + '.php', '']) {
    const x = await fetch(H + '/api/foto.php?f=' + f);
    ok(x.status === 404 && !(await x.text()).includes('<?php'), `foto.php?f=${f || '(vuoto)'}: 404, nient’altro esce`);
  }
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'Anello', categoria: 'Anelli' }), csrf: CSRF });
  ok(r.d.pezzi[0].nome === 'Anello', 'il pezzo nuovo va in cima');
  const [idAnello, idCollana] = r.d.pezzi.map((x) => x.id);
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'modifica', id: idAnello, nome: 'Anello trilogy', categoria: 'Anelli', materiale: 'Oro bianco' }, null), csrf: CSRF });
  ok(r.d.pezzi[0].nome === 'Anello trilogy' && r.d.pezzi[0].img !== '', 'modifica senza nuova foto: la foto resta');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', json: { azione: 'ordina', ordine: [idCollana, idAnello] }, csrf: CSRF });
  ok(r.d.pezzi[0].id === idCollana, 'ordine cambiato');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', json: { azione: 'elimina', id: idCollana }, csrf: CSRF });
  ok(r.d.pezzi.length === 1, 'pezzo tolto');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'Collana Arzani', categoria: 'Collane', immagine: foto1 }, null), csrf: CSRF });
  ok(r.d.pezzi.some((x) => x.img === foto1), '«Annulla»: si ricrea con la stessa foto');
  r = await chiama('/api/dati.php');
  ok(r.d.pezzi.length === 2 && r.d.aggiornato, 'i visitatori vedono la selezione aggiornata');

  console.log('\n[7] Abusi sulle foto');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'X', categoria: 'Anelli' }, Buffer.from('<?php echo "pwned"; ?>'), 'foto.jpg'), csrf: CSRF });
  ok(r.s === 422, 'un file PHP travestito da .jpg: rifiutato');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'X', categoria: 'Anelli' }, Buffer.concat([jpeg.subarray(0, 3000), Buffer.from('<?php system($_GET[1]); ?>')]), 'x.php', 'image/jpeg'), csrf: CSRF });
  ok(r.s === 422 || (r.s === 200 && r.d.pezzi.every((x) => x.img.endsWith('.jpg'))), 'un JPEG tagliato con codice dentro, chiamato .php: rifiutato o ripulito, mai salvato come .php');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'X', categoria: 'Anelli', immagine: '/uploads/pezzi/../../api/config.php' }, null), csrf: CSRF });
  ok(r.s === 422, 'percorso «furbo» al posto della foto: rifiutato');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'X', categoria: 'Pistole' }), csrf: CSRF });
  ok(r.s === 422, 'categoria inventata: rifiutata');
  r = await chiama('/api/pezzi.php', { metodo: 'POST', form: fotoForm({ azione: 'crea', nome: 'x'.repeat(81), categoria: 'Anelli' }), csrf: CSRF });
  ok(r.s === 422, 'nome troppo lungo: rifiutato');
  const quanti = (await chiama('/api/dati.php')).d.pezzi.length;
  r = await chiama('/api/pezzi.php', { metodo: 'POST', json: { azione: 'elimina', id: "1 OR 1=1" }, csrf: CSRF });
  ok(r.s === 422 && (await chiama('/api/dati.php')).d.pezzi.length === quanti, 'SQL nel campo id: rifiutato, niente cancellato');

  console.log('\n[8] Orari e chiusure');
  const sett = { 0: null, 1: [[10, 13]], 2: [[9.5, 12.5], [15.5, 19.5]], 3: [[9.5, 12.5], [15.5, 19.5]], 4: [[9.5, 12.5], [15.5, 19.5]], 5: [[9.5, 12.5], [15.5, 19.5]], 6: null };
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'settimana', orari: sett }, csrf: CSRF });
  ok(r.s === 200 && JSON.stringify(r.d.orari['1']) === '[[10,13]]' && r.d.orari['6'] === null, 'settimana salvata (lunedì 10–13, sabato chiuso)');
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'settimana', orari: { ...sett, 2: [[12.5, 9.5]] } }, csrf: CSRF });
  ok(r.s === 422, 'chiusura prima dell’apertura: rifiutata');
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'settimana', orari: { ...sett, 2: [[9.5, 13], [12, 19]] } }, csrf: CSRF });
  ok(r.s === 422, 'fasce sovrapposte: rifiutate');
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'settimana', orari: { ...sett, 2: [[9.33, 12]] } }, csrf: CSRF });
  ok(r.s === 422, 'orari non a quarti d’ora: rifiutati');
  const anno = new Date().getFullYear() + 1;
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'chiusura', dal: `${anno}-08-10`, al: `${anno}-08-24`, motivo: 'ferie' }, csrf: CSRF });
  ok(r.s === 200 && r.d.chiusure.length === 1 && r.d.chiusure[0].motivo === 'ferie', 'ferie aggiunte');
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'chiusura', dal: '2020-01-01', al: '2020-01-02' }, csrf: CSRF });
  ok(r.s === 422, 'date passate: rifiutate');
  r = await chiama('/api/orari.php', { metodo: 'POST', json: { azione: 'chiusura', dal: `${anno}-02-30` }, csrf: CSRF });
  ok(r.s === 422, '30 febbraio: rifiutato');
  r = await chiama('/api/dati.php');
  ok(r.d.chiusure.length === 1 && JSON.stringify(r.d.orari['1']) === '[[10,13]]', 'i visitatori vedono orari e ferie');

  console.log('\n[9] Marchi');
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'crea', nome: 'Salvatore Arzani', reparto: 'Gioielleria', nota: 'dal 2018' }, csrf: CSRF });
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'crea', nome: 'Giorgio Visconti', reparto: 'Gioielleria' }, csrf: CSRF });
  ok(r.d.marchi.length === 2 && r.d.marchi[0].nome === 'Salvatore Arzani', 'marchi in ordine di inserimento');
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'elimina', id: r.d.marchi[0].id }, csrf: CSRF });
  r = await chiama('/api/marchi.php', { metodo: 'POST', json: { azione: 'ripristina', nome: 'Salvatore Arzani', reparto: 'Gioielleria', nota: 'dal 2018', posizione: 0 }, csrf: CSRF });
  ok(r.d.marchi[0].nome === 'Salvatore Arzani', '«Annulla»: il marchio torna al suo posto');
  r = await chiama('/api/dati.php');
  ok(r.d.marchi.length === 2 && r.d.marchi.every((m) => !('nota' in m)), 'ai visitatori non arriva la nota interna');

  console.log('\n[10] Moduli del sito (Contatti, Perizie)');
  cookie = '';   // un visitatore qualunque
  const ora = Date.now() - 10000;
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: '<img src=x onerror=alert(1)>', telefono: '333 1234567', messaggio: 'Vorrei informazioni', privacy: true, aperto: ora } });
  ok(r.s === 200 && r.d.ok, 'messaggio dai Contatti accettato');
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'perizia', nome: 'Rosa', email: 'rosa@example.it', motivo: 'Successione', pezzi: '4–10', dove: 'Li porto in negozio', privacy: true, aperto: ora } });
  ok(r.s === 200, 'richiesta di perizia accettata');
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: 'Rosa', messaggio: 'x', privacy: true, aperto: ora } });
  ok(r.s === 422, 'senza telefono né email: rifiutato (non si potrebbe rispondere)');
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: 'Rosa', telefono: '333', messaggio: 'x', aperto: ora } });
  ok(r.s === 422, 'senza consenso privacy: rifiutato');
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: 'Bot', telefono: '3331234567', messaggio: 'spam', privacy: true, sito_web: 'http://spam', aperto: ora } });
  ok(r.s === 200, 'campo trappola compilato: risposta «ok» ma niente salvato');
  r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: 'Bot', telefono: '3331234567', messaggio: 'spam', privacy: true, aperto: Date.now() } });
  ok(r.s === 200, 'inviato in meno di 3 secondi: idem');
  for (let i = 0; i < 4; i++) r = await chiama('/api/messaggio.php', { metodo: 'POST', json: { tipo: 'contatti', nome: 'Rosa', telefono: '3331234567', messaggio: 'ancora ' + i, privacy: true, aperto: ora } });
  ok(r.s === 429, 'dopo 5 messaggi in un’ora dallo stesso indirizzo: fermato');

  console.log('\n[11] Messaggi nell’area riservata');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Solo-per-i-collaudi-1' } });
  const CSRF2 = r.d.csrf;
  r = await chiama('/api/messaggi.php');
  ok(r.s === 200 && r.d.messaggi.length === 5, `${r.d.messaggi.length} messaggi salvati (quelli trappola e lampo no)`);
  ok(r.d.messaggi.some((m) => m.nome === '<img src=x onerror=alert(1)>'), 'il testo è salvato com’è: l’area riservata lo mostra come testo (controllato nel collaudo della pagina)');
  ok(r.d.messaggi.find((m) => m.tipo === 'perizia')?.dati['Dove si trovano'] === 'Li porto in negozio', 'i dettagli della perizia ci sono');
  ok(!isNaN(new Date(r.d.messaggi[0].creato)), 'data leggibile (ISO)');
  r = await chiama('/api/messaggi.php', { metodo: 'POST', json: { azione: 'letto', id: r.d.messaggi[0].id }, csrf: CSRF2 });
  ok(r.d.messaggi[0].letto === true, 'segnato come letto');

  console.log('\n[12] Password e uscita');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { azione: 'password', attuale: 'sbagliata', nuova: 'Nuova-password-1' }, csrf: CSRF2 });
  ok(r.s === 403, 'cambio password con la password attuale sbagliata: rifiutato');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { azione: 'password', attuale: 'Solo-per-i-collaudi-1', nuova: 'Nuova-password-1' }, csrf: CSRF2 });
  ok(r.s === 200, 'password cambiata');
  r = await chiama('/api/accesso.php', { metodo: 'DELETE', csrf: CSRF2 });
  r = await chiama('/api/accesso.php');
  ok(r.d.collegato === false, 'uscita: la sessione non vale più');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Nuova-password-1' } });
  ok(r.d.collegato, 'si rientra con la password nuova');

  console.log('\n[13] Troppi tentativi');
  cookie = '';
  for (let i = 0; i < 8; i++) r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'tentativo' + i } });
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Nuova-password-1' } });
  ok(r.s === 429, 'dopo 8 tentativi sbagliati si aspetta un quarto d’ora, anche con la password giusta');

  console.log('\n[14] Password dimenticata');
  cookie = '';
  const recupero = (json) => chiama('/api/recupero.php', { metodo: 'POST', json });
  const emailRecupero = () => (existsSync(POSTA) ? readdirSync(POSTA).sort() : []).map((x) => readFileSync(join(POSTA, x), 'utf8')).filter((t) => t.includes('Oggetto: Area riservata'));
  const codiceIn = (t) => (t || '').match(/#recupero=([a-f0-9]{64})/)?.[1];
  const confVera = readFileSync(conf, 'utf8');
  writeFileSync(conf, confVera.replace(/, 'indirizzo' => '[^']*'/, ''));
  r = await recupero({ azione: 'richiesta', utente: 'negozio' });
  ok(r.s === 503 && r.d.errore.includes('non è ancora attivo'), 'senza l’indirizzo del sito nella configurazione: «non ancora attivo», nessun link');
  writeFileSync(conf, confVera);
  r = await recupero({ azione: 'richiesta', utente: 'nessuno' });
  ok(r.s === 200 && r.d.ok && emailRecupero().length === 0, 'utente inesistente: stessa risposta, nessuna email (non si scopre chi esiste)');
  r = await recupero({ azione: 'richiesta', utente: 'negozio' });
  let posta = emailRecupero();
  const codice1 = codiceIn(posta[0]);
  ok(r.s === 200 && posta.length === 1 && codice1, 'utente giusto: arriva l’email con il link');
  ok(posta[0].startsWith('A: negozio@esempio.it') && posta[0].includes('http://127.0.0.1:' + PORTA + '/masgioielliDev/area-riservata/#recupero='), 'all’indirizzo del negozio, con il link all’indirizzo della configurazione');
  if (!MY) ok(!readFileSync(join(PROVA, 'prova.sqlite')).includes(codice1), 'nel database c’è solo l’impronta del codice, non il codice');
  r = await recupero({ azione: 'verifica', codice: 'f'.repeat(64) });
  ok(r.s === 410, 'codice inventato: il link non vale');
  r = await recupero({ azione: 'verifica', codice: '../../x' });
  ok(r.s === 410, 'codice malformato: rifiutato');
  r = await recupero({ azione: 'richiesta', utente: 'negozio' });
  const codice2 = codiceIn(emailRecupero().at(-1));
  r = await recupero({ azione: 'verifica', codice: codice1 });
  ok(r.s === 410 && codice2 && codice2 !== codice1, 'un nuovo link annulla quello di prima');
  r = await recupero({ azione: 'verifica', codice: codice2 });
  ok(r.s === 200 && r.d.utente === 'negozio', 'link giusto: si può scegliere la nuova password');
  r = await recupero({ azione: 'nuova', codice: codice2, password: 'corta' });
  ok(r.s === 422, 'nuova password troppo corta: rifiutata (il link resta buono)');
  r = await recupero({ azione: 'nuova', codice: codice2, password: 'Recuperata-password-1' });
  ok(r.s === 200 && r.d.utente === 'negozio', 'nuova password salvata');
  r = await recupero({ azione: 'nuova', codice: codice2, password: 'Un-altra-password-1' });
  ok(r.s === 410, 'il link vale una volta sola');
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Recuperata-password-1' } });
  ok(r.s === 200 && r.d.collegato, 'si entra subito con la nuova password, anche dopo i tentativi sbagliati di prima');
  cookie = '';
  r = await chiama('/api/accesso.php', { metodo: 'POST', json: { utente: 'negozio', password: 'Nuova-password-1' } });
  ok(r.s === 401, 'la password di prima non vale più');
  r = await recupero({ azione: 'richiesta', utente: 'negozio' });
  r = await recupero({ azione: 'richiesta', utente: 'negozio' });
  ok(r.s === 429, 'più di 3 richieste in un’ora per lo stesso utente: fermato');
  for (let i = 0; i < 8; i++) r = await recupero({ azione: 'verifica', codice: randomBytes(32).toString('hex') });
  ok(r.s === 429, 'dopo 10 codici sbagliati in un quarto d’ora: fermato');
  r = await recupero({ azione: 'boh' });
  ok(r.s === 400 || r.s === 429, 'azione sconosciuta: rifiutata');

  console.log('\n[15] Metodi e file');
  r = await chiama('/api/dati.php', { metodo: 'DELETE' });
  ok(r.s === 405, 'metodo non previsto: 405');
  r = await chiama('/api/lib/base.php');
  ok(r.t.trim() === '' || r.s === 404, 'una libreria aperta direttamente non fa nulla');
  ok(!/Warning|Notice|Deprecated|Fatal/.test(logServer), 'nessun avviso PHP nel log del server' + (/Warning|Notice|Deprecated|Fatal/.test(logServer) ? ':\n' + logServer.split('\n').filter((l) => /Warning|Notice|Deprecated|Fatal/.test(l)).slice(0, 5).join('\n') : ''));
} finally {
  server.kill();
  if (MY) {
    const [host, porta, utente, password = ''] = MY;
    try { phpEsegui(`$p = new PDO('mysql:host=${host};port=${porta}', '${utente}', '${password}'); $p->exec('DROP DATABASE ${NOMEDB}');`); } catch (e) { console.log('  (database di prova non cancellato: ' + e.message + ')'); }
  }
  // via le foto create dalle prove
  const cart = join(RADICE, 'public/masgioielliDev/uploads/pezzi');
  if (existsSync(cart)) for (const f of readdirSync(cart)) if (!fotoPrima.has(f)) rmSync(join(cart, f));
  if (existsSync(cart) && readdirSync(cart).length === 0) rmSync(cart, { recursive: true });
}
console.log(ko ? `\n${ko} da sistemare` : '\nTutto a posto');
process.exit(ko ? 1 : 0);
