// Controlli automatici del sito:  npm test   (dopo  npm run build)
// Non provano «tutto»: tengono ferme le poche cose che, se si rompono, non si notano a occhio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { recapitoValido } from '../../src/scripts/recapito.js';
import { whatsapp, TELEFONO, TELEFONO_VISIBILE, TELEFONO_BREVE, EMAIL } from '../../src/data/contatti.js';
import { FAQ_HOME, senzaTag } from '../../src/data/faq-home.js';

const DIST = 'dist';
const home = () => fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const sorgenti = (dir, est) => fs.readdirSync(dir, { withFileTypes: true, recursive: true })
  .filter((f) => f.isFile() && est.some((e) => f.name.endsWith(e)))
  .map((f) => path.join(f.parentPath ?? f.path, f.name));

test('recapito: accetta telefoni ed email veri, ferma quelli a metà', () => {
  for (const v of ['3331234567', '333 123 4567', '+39 333 1234567', '011 1234567', 'mario@esempio.it', '333 1234567, dopo le 18']) assert.equal(recapitoValido(v), true, v);
  for (const v of ['', '3331', 'mario', 'mario@', 'mario@esempio', '12345678901234567890']) assert.equal(recapitoValido(v), false, v);
});

test('recapiti: numero e link WhatsApp coerenti tra loro', () => {
  const cifre = (s) => s.replace(/\D/g, '');
  assert.equal(cifre(TELEFONO), cifre(TELEFONO_VISIBILE));
  assert.ok(cifre(TELEFONO).endsWith(cifre(TELEFONO_BREVE)));
  assert.equal(whatsapp(), `https://wa.me/${cifre(TELEFONO)}`);
  assert.equal(whatsapp('Ciao! Vorrei un sito — così'), `https://wa.me/${cifre(TELEFONO)}?text=Ciao!%20Vorrei%20un%20sito%20%E2%80%94%20cos%C3%AC`);
  assert.match(EMAIL, /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/);
});

test('recapiti: scritti in un posto solo (src/data/contatti.js)', () => {
  const cifre = TELEFONO.replace('+', '');
  const fuori = sorgenti('src', ['.astro', '.js', '.md'])
    .filter((f) => !f.endsWith(path.join('data', 'contatti.js')))
    .filter((f) => { const t = fs.readFileSync(f, 'utf8'); return t.includes(cifre) || t.includes(TELEFONO_BREVE) || t.includes(EMAIL); });
  assert.deepEqual(fuori, [], 'numero o email scritti a mano in: ' + fuori.join(', '));
});

test('FAQ della home: quello che legge Google è quello che si vede in pagina', () => {
  const html = home();
  const blocchi = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const faq = blocchi.find((b) => b['@type'] === 'FAQPage');
  assert.ok(faq, 'manca il blocco FAQPage in home');
  assert.equal(faq.mainEntity.length, FAQ_HOME.length);
  const visibile = html.match(/<div class="faq-list">.*?<\/div>/s)[0];
  for (const [i, f] of FAQ_HOME.entries()) {
    assert.equal(faq.mainEntity[i].name, f.q);
    assert.equal(faq.mainEntity[i].acceptedAnswer.text, senzaTag(f.a));
    assert.ok(visibile.includes(f.q), 'domanda non in pagina: ' + f.q);
  }
});

test('home: gli stili comuni arrivano prima di quelli della sola home', () => {
  // home.css corregge alcune regole di global.css e conta sull'ordine: vedi il commento in index.astro
  const fogli = [...home().matchAll(/<link rel="stylesheet" href="\/_astro\/([^"]+)"/g)].map((m) => m[1]);
  const comune = fogli.findIndex((f) => f.startsWith('Layout.')), casa = fogli.findIndex((f) => f.startsWith('index.'));
  assert.ok(comune >= 0 && casa >= 0, 'fogli di stile della home non trovati: ' + fogli.join(', '));
  assert.ok(comune < casa, `ordine sbagliato: ${fogli.join(' → ')}`);
});

test('build: niente font di alfabeti che il sito non usa', () => {
  const inutili = fs.readdirSync(path.join(DIST, '_astro')).filter((f) => /-(cyrillic|greek|vietnamese)(-ext)?-.*\.woff2$/.test(f));
  assert.deepEqual(inutili, []);
});
