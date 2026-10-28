// IndexNow: avvisa subito Bing (e gli altri motori che lo usano, come Yandex e Seznam) delle
// pagine nuove o cambiate, invece di aspettare che passino da soli. Bing alimenta anche Copilot.
// Google non usa IndexNow: per Google c'è la sitemap in Search Console.
//
// Uso, DOPO aver caricato dist/ sul server:   npm run indexnow
//   - la prima volta invia tutte le pagine della sitemap;
//   - le volte dopo solo quelle il cui HTML è cambiato dall'ultimo invio riuscito
//     (l'impronta delle pagine sta in tools/.indexnow-ultimo.json, solo in locale).
//   - con --tutte reinvia tutto.
// La chiave è pubblica per definizione: il file public/<chiave>.txt la dimostra al motore.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SITO = 'https://www.moledigitale.it';
const CHIAVE = '4bd0f63aec5cfa5ef7d33058abd6e8ef';
const DIST = 'dist';
const ULTIMO = 'tools/.indexnow-ultimo.json';

const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const impronta = (u) => {
  const f = path.join(DIST, new URL(u).pathname, 'index.html');
  return fs.existsSync(f) ? crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex') : null;
};
const ora = Object.fromEntries(urls.map((u) => [u, impronta(u)]));
const prima = !process.argv.includes('--tutte') && fs.existsSync(ULTIMO) ? JSON.parse(fs.readFileSync(ULTIMO, 'utf8')) : {};
const daInviare = urls.filter((u) => ora[u] && ora[u] !== prima[u]);

if (!daInviare.length) { console.log('Nessuna pagina cambiata dall’ultimo invio.'); process.exit(0); }

// la chiave deve essere già online, altrimenti il motore rifiuta l'invio
const verifica = await fetch(`${SITO}/${CHIAVE}.txt`).catch(() => null);
if (!verifica || !verifica.ok || (await verifica.text()).trim() !== CHIAVE) {
  console.log(`Il file ${SITO}/${CHIAVE}.txt non è (ancora) online: carica dist/ sul server e riprova.`);
  process.exit(1);
}

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITO).host, key: CHIAVE, keyLocation: `${SITO}/${CHIAVE}.txt`, urlList: daInviare }),
});
// 200 = ricevuto, 202 = ricevuto in attesa di verifica della chiave
if (r.status === 200 || r.status === 202) {
  fs.writeFileSync(ULTIMO, JSON.stringify(ora, null, 1));
  console.log(`Inviate ${daInviare.length} pagine (risposta ${r.status}):\n  ` + daInviare.join('\n  '));
} else {
  console.log(`Invio rifiutato (${r.status}): ${await r.text()}`);
  process.exit(1);
}
