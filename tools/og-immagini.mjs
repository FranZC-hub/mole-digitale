// Anteprime per i social (og:image, 1200x630) nello stile del sito: fondo scuro, barra a
// gradiente, due cerchi, titolo su due righe (la seconda in ciano). Le disegna Chrome con i
// caratteri veri del sito e le salva in public/og/.
// Uso: npm run og            (tutte)        npm run og -- restyling   (solo quelle che contengono «restyling»)
// Per aggiungerne una: una riga in IMMAGINI, poi `image="/og/<file>.png"` nella pagina
// (o `og: "/og/<file>.png"` nel frontmatter della guida).
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const IMMAGINI = [
  { file: 'siti-web-torino', r1: 'Siti web per', r2: 'ogni attività.', sotto: 'Un sito su misura per ciascuno dei 20 settori' },
  { file: 'restyling-siti-web-torino', r1: 'Il tuo sito,', r2: 'rifatto come si deve.', sotto: 'Restyling a Torino · senza perdere le posizioni su Google' },
  { file: 'scheda-google-business-torino', r1: 'La scheda Google,', r2: 'fatta bene.', sotto: 'Creazione, verifica, recensioni e collegamento al sito' },
  { file: 'chi-siamo', r1: 'Siti come si deve,', r2: 'senza prezzi da agenzia.', sotto: 'Chi siamo · siti web per gli esercenti di Torino' },
  { file: 'guide', r1: 'Guide pratiche,', r2: 'senza giri di parole.', sotto: 'Siti web, Google e clienti, spiegati semplici' },
  { file: 'blog-scheda-google', r1: 'Scheda Google', r2: 'Business.', sotto: 'Come crearla, verificarla e farla rendere' },
  { file: 'blog-sito-vetrina', r1: 'Sito vetrina:', r2: 'cosa deve avere.', sotto: 'E quando basta davvero' },
  { file: 'blog-sito-ia', r1: 'Sito con l’IA', r2: 'o professionista?', sotto: 'Cosa cambia davvero per un’attività locale' },
  { file: 'blog-rifare-sito', r1: 'Rifare il sito', r2: 'senza perdere Google.', sotto: 'La checklist del passaggio' },
  { file: 'blog-costo-annuale', r1: 'Quanto costa', r2: 'un sito all’anno?', sotto: 'Dominio, hosting, assistenza: cosa controllare' },
  { file: 'blog-sito-ristorante', r1: 'Il sito del', r2: 'ristorante.', sotto: 'Cosa deve avere per riempire i tavoli' },
];

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const font = (pkg, f) => fs.readFileSync(path.join('node_modules/@fontsource-variable', pkg, 'files', f)).toString('base64');
const GROTESK = font('space-grotesk', 'space-grotesk-latin-wght-normal.woff2');
const INTER = font('inter', 'inter-latin-wght-normal.woff2');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = (x) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${GROTESK}) format('woff2');font-weight:300 700}
@font-face{font-family:I;src:url(data:font/woff2;base64,${INTER}) format('woff2');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#10101f;position:relative;font-family:G,sans-serif}
.barra{position:absolute;top:0;left:0;right:0;height:10px;background:linear-gradient(90deg,#7c5cff,#22d3ee 55%,#ff6b88)}
.c1{position:absolute;width:680px;height:680px;border-radius:50%;background:#12203a;left:-330px;top:-340px}
.c2{position:absolute;width:620px;height:620px;border-radius:50%;background:#211d4c;right:-160px;bottom:-300px}
.testo{position:absolute;left:80px;top:150px;right:80px}
.kick{font-size:30px;font-weight:600;letter-spacing:.2em;color:#22d3ee}
h1{font-size:84px;font-weight:700;line-height:1.02;letter-spacing:-.02em;color:#f3f3fb;margin-top:34px}
h1 span{color:#22d3ee;display:block}
.sotto{font-family:I,sans-serif;font-size:29px;color:#b8b8d0;margin-top:40px}
.sito{position:absolute;left:80px;bottom:62px;font-size:28px;font-weight:700;color:#f3f3fb}
</style></head><body><div class="barra"></div><div class="c1"></div><div class="c2"></div>
<div class="testo"><p class="kick">MOLE DIGITALE · TORINO</p><h1>${esc(x.r1)}<span>${esc(x.r2)}</span></h1><p class="sotto">${esc(x.sotto)}</p></div>
<p class="sito">moledigitale.it</p></body></html>`;

const filtro = process.argv[2];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
for (const x of IMMAGINI.filter((i) => !filtro || i.file.includes(filtro))) {
  await page.setContent(html(x), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // il titolo non deve uscire dall'immagine né scontrarsi col cerchio in basso a destra
  const largo = await page.$eval('h1', (h) => Math.max(...[...h.childNodes].map((n) => { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect().right; })));
  if (largo > 1120) console.log(`  attenzione: «${x.r1} ${x.r2}» arriva a ${Math.round(largo)}px`);
  const out = path.join('public/og', x.file + '.png');
  await page.screenshot({ path: out, type: 'png' });
  console.log('ok', out);
}
await browser.close();
