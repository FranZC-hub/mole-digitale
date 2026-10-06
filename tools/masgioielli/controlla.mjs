// Dopo la build (lo esegue anche il deploy): l'API di MasGioielli deve esserci tutta e la
// configurazione con le password NON deve esserci, altrimenti il deploy la caricherebbe
// sul server sopra quella vera. I link interni li controlla tools/check-links.mjs.
import fs from 'node:fs';
import path from 'node:path';

const RADICE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const SITO = path.join(RADICE, 'dist', 'masgioielliDev');

let problemi = 0;
for (const p of ['index.html', 'area-riservata/index.html', '404/index.html', '.htaccess',
  'api/dati.php', 'api/accesso.php', 'api/pezzi.php', 'api/orari.php', 'api/marchi.php', 'api/messaggio.php',
  'api/messaggi.php', 'api/recupero.php', 'api/installa.php', 'api/foto.php', 'api/lib/base.php', 'api/.htaccess', 'api/lib/.htaccess', 'uploads/.htaccess']) {
  if (!fs.existsSync(path.join(SITO, p))) { console.error('MANCA  ' + p); problemi++; }
}
if (fs.existsSync(path.join(SITO, 'api', 'config.php'))) {
  console.error('PERICOLO  dist/masgioielliDev/api/config.php: le credenziali finirebbero sul server con il deploy');
  problemi++;
}
if (fs.existsSync(path.join(SITO, 'uploads', 'pezzi'))) {
  console.error('PERICOLO  dist/…/uploads/pezzi: foto di prova che il deploy caricherebbe sul server');
  problemi++;
}
console.log(problemi ? `\n${problemi} problemi` : 'MasGioielli: API completa, nessuna credenziale né foto di prova in dist/');
process.exit(problemi ? 1 : 0);
