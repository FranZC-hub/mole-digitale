// Server di prova in locale: sito compilato (dist/) + API PHP su SQLite.
// Uso:  npm run build  e poi  npm run server   →  http://127.0.0.1:8090/
//
// - La configurazione di prova sta in .locale/ (esclusa da git), MAI in public/api/config.php:
//   cosi' non finisce in dist/ ne' sul server per sbaglio.
// - In produzione si usa MySQL; SQLite qui serve solo a provare senza installare nulla.
// - Primo avvio: aprire /api/installa.php con il codice stampato qui sotto.
import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const RADICE = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const LOCALE = join(RADICE, '.locale');
const PORTA = process.env.PORTA || '8090';
if (!existsSync(join(RADICE, 'dist'))) { console.error('Manca dist/: prima  npm run build'); process.exit(1); }
mkdirSync(LOCALE, { recursive: true });

const conf = join(LOCALE, 'config.php');
if (!existsSync(conf)) {
  const db = join(LOCALE, 'mas.sqlite').replace(/\\/g, '/');
  writeFileSync(conf, `<?php
// Configurazione di PROVA (locale). Non usarla sul server.
return [
  'db' => ['dsn' => 'sqlite:${db}'],
  'posta' => ['host' => ''],
  'sale' => '${randomBytes(24).toString('hex')}',
  'installazione' => '${randomBytes(16).toString('hex')}',
];
`);
}
const codice = readFileSync(conf, 'utf8').match(/'installazione' => '([^']*)'/)?.[1];

// estensioni di PHP che servono (su Windows non sono attive senza php.ini)
let estensioni = [];
try {
  const php = execSync(process.platform === 'win32' ? 'where php' : 'command -v php').toString().split(/\r?\n/)[0].trim();
  const ext = join(dirname(php), 'ext');
  if (existsSync(ext)) estensioni = ['-d', `extension_dir=${ext}`, ...['pdo_sqlite', 'gd', 'mbstring', 'fileinfo', 'openssl'].flatMap((e) => ['-d', `extension=${e}`])];
} catch { /* php non trovato: lo dira' spawn */ }

console.log(`Sito:          http://127.0.0.1:${PORTA}/`);
console.log(`Installazione: http://127.0.0.1:${PORTA}/api/installa.php   codice: ${codice}`);
const p = spawn('php', [...estensioni, '-d', 'upload_max_filesize=10M', '-d', 'post_max_size=12M', '-S', `127.0.0.1:${PORTA}`, '-t', join(RADICE, 'dist')], {
  stdio: 'inherit',
  env: { ...process.env, MAS_CONFIG: conf },
});
p.on('exit', (c) => process.exit(c ?? 0));
