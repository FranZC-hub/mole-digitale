// MySQL in locale per server-locale.mjs --mysql: lo stesso tipo di database dell'hosting.
//
// - Windows: MariaDB portatile (zip ufficiale da archive.mariadb.org, controllato con
//   SHA-256), scaricato la prima volta in .locale/mariadb. Niente installazione, niente
//   servizi: parte con il server locale e si ferma con lui. Ascolta solo su 127.0.0.1.
// - Altrove, o per usare un MySQL gia' installato: MAS_MYSQL=host:porta:utente:password
//   (un utente che possa creare database).
//
// Il sito usa un utente con i soli permessi che servono anche in produzione
// (SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX sul suo database).
import { spawn, execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { appendFileSync, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { connect } from 'node:net';
import { join } from 'node:path';

const VERSIONE = '11.4.4';
const ZIP_URL = `https://archive.mariadb.org/mariadb-${VERSIONE}/winx64-packages/mariadb-${VERSIONE}-winx64.zip`;
const ZIP_SHA256 = 'ee15985d5d0f604fce817986a2749bb972e79e6f8647ae0e09d821a2fdcd6373';
// dallo zip (87 MB) serve solo questo: il server (mariadb-install-db lo cerca anche come
// mysqld.exe), il client a riga di comando, i dati di base
const DAL_ZIP = ['bin/mariadbd.exe', 'bin/mysqld.exe', 'bin/server.dll', 'bin/mariadb.exe', 'bin/mariadb-install-db.exe', 'bin/mariadb-admin.exe', 'bin/mariadb-dump.exe', 'share', 'lib/plugin'];
const DATABASE = 'masgioielli';

const portaAperta = (porta) => new Promise((ok) => {
  const s = connect({ host: '127.0.0.1', port: porta }, () => { s.end(); ok(true); });
  s.on('error', () => ok(false));
});

async function scaricaMariadb(cartella) {
  if (process.platform !== 'win32') {
    throw new Error('MariaDB portatile solo su Windows: installate MySQL/MariaDB e usate MAS_MYSQL=host:porta:utente:password');
  }
  const zip = cartella + '.zip';
  mkdirSync(join(cartella, '..'), { recursive: true });
  console.log(`Scarico MariaDB ${VERSIONE} (87 MB, solo la prima volta)…`);
  const r = await fetch(ZIP_URL);
  if (!r.ok) throw new Error(`Download di MariaDB non riuscito (${r.status})`);
  const hash = createHash('sha256');
  const out = createWriteStream(zip);
  for await (const pezzo of r.body) { hash.update(pezzo); out.write(pezzo); }
  await new Promise((ok) => out.end(ok));
  if (hash.digest('hex') !== ZIP_SHA256) { rmSync(zip, { force: true }); throw new Error('Lo zip di MariaDB non corrisponde al controllo SHA-256: non lo uso'); }
  mkdirSync(cartella, { recursive: true });
  // tar.exe di Windows (bsdtar) apre anche gli zip
  execFileSync(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe'),
    ['-xf', zip, '-C', cartella, '--strip-components', '1', ...DAL_ZIP.map((p) => `mariadb-${VERSIONE}-winx64/${p}`)]);
  rmSync(zip, { force: true });
}

/** Database MySQL pronto per il sito. Restituisce i dati di connessione e ferma(). */
export async function avviaMysql({ locale, azzera = false, php = [] }) {
  const esterno = process.env.MAS_MYSQL ? process.env.MAS_MYSQL.split(':') : null;
  if (esterno) return mysqlEsterno(esterno, azzera, php);

  const cartella = join(locale, 'mariadb');
  const dati = join(locale, 'mysql-dati');
  const accesso = join(locale, 'mysql.json');
  const porta = Number(process.env.MAS_MYSQL_PORTA || 3307);
  const bin = (n) => join(cartella, 'bin', n);
  if (!existsSync(bin('mariadbd.exe'))) await scaricaMariadb(cartella);

  if (await portaAperta(porta)) {
    if (azzera) throw new Error(`Sulla porta ${porta} c'è già un database acceso: fermatelo prima di azzerare`);
    if (!existsSync(accesso)) throw new Error(`La porta ${porta} è occupata da un altro programma (cambiatela con MAS_MYSQL_PORTA)`);
    console.log(`MySQL già acceso sulla porta ${porta}: lo uso`);
    return { ...JSON.parse(readFileSync(accesso, 'utf8')), ferma() {} };
  }

  if (azzera) { rmSync(dati, { recursive: true, force: true }); rmSync(accesso, { force: true }); }
  const ini = join(dati, 'my.ini');
  if (!existsSync(ini)) {
    console.log('Preparo il database locale…');
    execFileSync(bin('mariadb-install-db.exe'), [`--datadir=${dati}`, `--port=${porta}`], { stdio: 'ignore' });
    // come su un hosting: utf8mb4 e modalita' strict (in MariaDB 11 e' gia' quella di base)
    const righe = readFileSync(ini, 'utf8').replace('[mysqld]', `[mysqld]\nbind-address=127.0.0.1\ncharacter-set-server=utf8mb4\ncollation-server=utf8mb4_unicode_ci`);
    writeFileSync(ini, righe);
  }

  const log = join(locale, 'mysql.log');
  appendFileSync(log, `\n--- avvio ${new Date().toISOString()}\n`);
  const server = spawn(bin('mariadbd.exe'), [`--defaults-file=${ini}`, '--console'], { stdio: ['ignore', 'ignore', 'pipe'] });
  server.stderr.on('data', (d) => appendFileSync(log, d));
  let uscito = null;
  server.on('exit', (c) => { uscito = c; });
  for (let i = 0; i < 120 && !(await portaAperta(porta)); i++) {
    if (uscito !== null) throw new Error(`MariaDB non è partito (codice ${uscito}): vedete ${log}`);
    await new Promise((ok) => setTimeout(ok, 250));
  }
  // spegnimento pulito: con Ctrl+C MariaDB si sta gia' fermando da solo e va aspettato;
  // altrimenti glielo si chiede; ucciderlo solo se non risponde
  const attendiUscita = async (secondi) => { for (let i = 0; i < secondi * 4 && uscito === null; i++) await new Promise((ok) => setTimeout(ok, 250)); };
  const ferma = async () => {
    await attendiUscita(3);
    if (uscito === null) try { execFileSync(bin('mariadb-admin.exe'), ['-uroot', '-h127.0.0.1', `-P${porta}`, 'shutdown'], { stdio: 'ignore', timeout: 20000 }); } catch { /* gia' fermo */ }
    await attendiUscita(10);
    if (uscito === null) server.kill();
  };

  if (!existsSync(accesso)) {
    const password = randomBytes(18).toString('hex');
    const sql = `CREATE DATABASE IF NOT EXISTS ${DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      CREATE USER IF NOT EXISTS 'mas_sito'@'127.0.0.1' IDENTIFIED BY '${password}';
      GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX ON ${DATABASE}.* TO 'mas_sito'@'127.0.0.1';`;
    execFileSync(bin('mariadb.exe'), ['-uroot', '-h127.0.0.1', `-P${porta}`, '--skip-ssl-verify-server-cert', '-e', sql], { stdio: 'pipe' });
    writeFileSync(accesso, JSON.stringify({ host: '127.0.0.1', porta, database: DATABASE, utente: 'mas_sito', password }, null, 2));
  }
  return { ...JSON.parse(readFileSync(accesso, 'utf8')), ferma };
}

function mysqlEsterno([host, porta, utente, password = ''], azzera, estensioni) {
  // stringa PHP tra apici singoli: niente variabili interpretate dentro la password
  const q = (t) => "'" + String(t).replace(/[\\']/g, (c) => '\\' + c) + "'";
  const php = (codice) => execFileSync('php', [...estensioni, '-r', codice], { stdio: ['ignore', 'pipe', 'pipe'] });
  const pdo = `$p = new PDO(${q(`mysql:host=${host};port=${porta}`)}, ${q(utente)}, ${q(password)});`;
  if (azzera) php(`${pdo} $p->exec('DROP DATABASE IF EXISTS ${DATABASE}');`);
  php(`${pdo} $p->exec('CREATE DATABASE IF NOT EXISTS ${DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');`);
  return { host, porta: Number(porta), database: DATABASE, utente, password, ferma() {} };
}
