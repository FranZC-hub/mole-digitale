// Server di prova in locale: tutto il sito di Mole Digitale compilato (dist/) + l'API PHP di
// MasGioielli, che sta in /masgioielliDev/.
//   npm run mas:server            SQLite, database vuoto   → http://127.0.0.1:8090/masgioielliDev/
//   npm run mas:server:mysql      MySQL come sull'hosting (vedi mysql-locale.mjs)
//   npm run mas:esempio           build + MySQL + dati d'esempio pronti da guardare
//   npm run mas:esempio -- --azzera    ricomincia da un database vuoto con i dati d'esempio
//
// - --esempio: su un database nuovo crea da solo l'utente del negozio e carica pezzi, marchi,
//   una chiusura e qualche messaggio (tools/esempio.mjs). La password sta in
//   .locale/negozio-<db>.json, resta la stessa anche con --azzera, e /demoClientiDev/ la mostra.
// - --build: compila il sito DOPO aver preparato la password, cosi' la pagina la trova subito.
// - La configurazione di prova sta in .locale/ (esclusa da git), MAI in public/api/config.php:
//   cosi' non finisce in dist/ ne' sul server per sbaglio. Anche le foto caricate stanno in
//   .locale/ (tools/masgioielli/router-locale.php): la build di Astro svuota dist/ e le perderebbe.
import { spawn, spawnSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { connect } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { avviaMysql } from './mysql-locale.mjs';
import { caricaEsempio } from './esempio.mjs';

// tools/masgioielli/ → radice del sito di Mole Digitale
const RADICE = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const LOCALE = join(RADICE, '.locale');
const PORTA = process.env.PORTA || '8090';
const H = `http://127.0.0.1:${PORTA}/masgioielliDev`;
const arg = (a) => process.argv.includes(a);
const MYSQL = arg('--mysql'), AZZERA = arg('--azzera'), ESEMPIO = arg('--esempio') || AZZERA, BUILD = arg('--build');
mkdirSync(LOCALE, { recursive: true });
const percorso = (p) => p.replace(/\\/g, '/');
const attendi = (ms) => new Promise((ok) => setTimeout(ok, ms));
const portaAperta = (porta) => new Promise((ok) => {
  const s = connect({ host: '127.0.0.1', port: Number(porta) }, () => { s.end(); ok(true); });
  s.on('error', () => ok(false));
});
if (/export const SENZA_DATABASE = true/.test(readFileSync(join(RADICE, 'src/pages/masgioielliDev/_sito.js'), 'utf8'))) {
  console.log('Attenzione: il sito è SENZA_DATABASE (_sito.js), quindi le pagine non usano questo server.\nPer provarlo basta  npm run dev  (localhost:4321); per tornare al database: SENZA_DATABASE = false.\n');
}
if (await portaAperta(PORTA)) { console.error(`La porta ${PORTA} è già occupata (un altro server locale acceso?). Cambiatela con PORTA=…`); process.exit(1); }

// estensioni di PHP che servono (su Windows non sono attive senza php.ini)
let estensioni = [];
try {
  const php = execSync(process.platform === 'win32' ? 'where php' : 'command -v php').toString().split(/\r?\n/)[0].trim();
  const ext = join(dirname(php), 'ext');
  if (existsSync(ext)) estensioni = ['-d', `extension_dir=${ext}`, ...['pdo_sqlite', 'pdo_mysql', 'gd', 'mbstring', 'fileinfo', 'openssl'].flatMap((e) => ['-d', `extension=${e}`])];
} catch { /* php non trovato: lo dira' spawn */ }

// ---------------------------------------------------------------- database e configurazione
const nome = MYSQL ? 'mysql' : 'sqlite';
const conf = join(LOCALE, MYSQL ? 'config-mysql.php' : 'config.php');
const sqlite = join(LOCALE, 'mas.sqlite');
const foto = join(LOCALE, `foto-${nome}`);
// le email non partono: si scrivono qui (moduli e link «password dimenticata»)
const posta = join(LOCALE, `posta-${nome}`);
const fileAccesso = join(LOCALE, `negozio-${nome}.json`);
if (AZZERA) {
  // la password d'esempio resta (fileAccesso): cambia solo il contenuto del database
  for (const f of [conf, foto, posta, ...(MYSQL ? [] : [sqlite])]) rmSync(f, { recursive: true, force: true });
  console.log(`Database ${MYSQL ? 'MySQL' : 'SQLite'} locale azzerato`);
}
let accesso = existsSync(fileAccesso) ? JSON.parse(readFileSync(fileAccesso, 'utf8')) : null;
if (ESEMPIO && !accesso) {
  accesso = { utente: 'negozio', password: 'esempio-' + randomBytes(4).toString('hex') };
  writeFileSync(fileAccesso, JSON.stringify(accesso, null, 2));
}
if (BUILD) {
  console.log('Build del sito…');
  // la build legge la password appena preparata: /demoClientiDev/ la mostra
  const b = spawnSync('npx astro build', { cwd: RADICE, shell: true, stdio: ['ignore', 'ignore', 'inherit'] });
  if (b.status !== 0) { console.error('Build non riuscita'); process.exit(1); }
}
if (!existsSync(join(RADICE, 'dist', 'masgioielliDev'))) { console.error('Manca dist/: prima  npm run build'); process.exit(1); }
const db = MYSQL ? await avviaMysql({ locale: LOCALE, azzera: AZZERA, php: estensioni }) : null;

// si riscrive a ogni avvio (i dati del database possono cambiare), tenendo sale e codice
const vecchia = existsSync(conf) ? readFileSync(conf, 'utf8') : '';
const prendi = (k) => vecchia.match(new RegExp(`'${k}' => '([0-9a-f]+)'`))?.[1];
const codice = prendi('installazione') || randomBytes(16).toString('hex');
const q = (t) => "'" + String(t).replace(/[\\']/g, (c) => '\\' + c) + "'";
writeFileSync(conf, `<?php
// Configurazione di PROVA (locale), scritta da tools/server-locale.mjs. Non usarla sul server.
return [
  'db' => ${db
    ? `['dsn' => ${q(`mysql:host=${db.host};port=${db.porta};dbname=${db.database};charset=utf8mb4`)}, 'utente' => ${q(db.utente)}, 'password' => ${q(db.password)}]`
    : `['dsn' => ${q('sqlite:' + percorso(sqlite))}]`},
  'posta' => ['cartella_prova' => ${q(percorso(posta))}, 'destinatario' => 'negozio@esempio.it'],
  'indirizzo' => 'http://127.0.0.1:${PORTA}',
  'sale' => '${prendi('sale') || randomBytes(24).toString('hex')}',
  'installazione' => '${codice}',
  'foto' => ${q(percorso(foto))},
];
`);

// ---------------------------------------------------------------- server PHP
const server = spawn('php', [...estensioni, '-d', 'upload_max_filesize=10M', '-d', 'post_max_size=12M',
  '-S', `127.0.0.1:${PORTA}`, '-t', join(RADICE, 'dist'), join(RADICE, 'tools', 'masgioielli', 'router-locale.php')], {
  stdio: ['ignore', 'inherit', 'pipe'],
  env: { ...process.env, MAS_CONFIG: conf },
});
// php -S scrive una riga per ogni richiesta: si mostrano solo errori e avvisi (non quello,
// atteso, delle tabelle che mancano prima dell'installazione)
let chiuso = false, installato = false;
server.stderr.on('data', (d) => {
  for (const riga of String(d).split(/\r?\n/)) {
    if (!riga || /\] 127\.0\.0\.1:\d+ (Accepted|Closing|Closed without|\[\d{3}\]:)|Development Server .* started/.test(riga)) continue;
    if (!installato && /Base table or view not found|no such table/.test(riga)) continue;
    console.error(riga);
  }
});
const chiudi = async (codiceUscita = 0) => {
  if (chiuso) return;
  chiuso = true;
  server.kill();
  if (db) await db.ferma();
  process.exit(codiceUscita);
};
server.on('exit', (c) => chiudi(c ?? 0));
process.on('SIGINT', () => chiudi(0));
for (let i = 0; i < 40 && !(await portaAperta(PORTA)); i++) await attendi(150);

// ---------------------------------------------------------------- installazione e dati d'esempio
installato = (await fetch(H + '/api/dati.php')).status === 200;
try {
  if (ESEMPIO && !installato) {
    const { utente, password } = accesso;
    const t = await (await fetch(H + '/api/installa.php', { method: 'POST', body: new URLSearchParams({ codice, utente, password, ripeti: password }) })).text();
    if (!t.includes('Installazione completata')) throw new Error('installazione non riuscita: ' + t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200));
    installato = true;
    const n = await caricaEsempio(H, accesso.utente, accesso.password);
    console.log(`Dati d'esempio caricati: ${n.pezzi} pezzi con foto, ${n.marchi} marchi, ${n.messaggi} messaggi, 1 chiusura`);
  } else if (ESEMPIO) {
    console.log(`Il database c’era già: lo lascio com’è (per ricominciare:  npm run ${MYSQL ? 'mas:esempio' : 'mas:server'} -- --azzera)`);
  }
} catch (e) {
  console.error('Errore: ' + e.message);
  await chiudi(1);
}

console.log(`
Sito:            ${H}/`);
if (!installato) console.log(`Installazione:   ${H}/api/installa.php   codice: ${codice}`);
else if (accesso) console.log(`Area riservata:  ${H}/area-riservata/   utente ${accesso.utente} · password ${accesso.password}`);
else console.log(`Area riservata:  ${H}/area-riservata/   (con l'utente creato all'installazione)`);
console.log(`Email di prova:  ${percorso(posta)}/   (non partono: anche il link «password dimenticata» è qui)`);
if (db) {
  console.log(`Database:        MySQL ${db.host}:${db.porta}, database ${db.database}, utente ${db.utente} · password ${db.password}`);
  if (!process.env.MAS_MYSQL) console.log(`                 da riga di comando: .locale/mariadb/bin/mariadb.exe -uroot -h127.0.0.1 -P${db.porta} ${db.database}`);
} else console.log(`Database:        SQLite, ${percorso(sqlite)}`);
console.log('Ctrl+C per fermare.');
