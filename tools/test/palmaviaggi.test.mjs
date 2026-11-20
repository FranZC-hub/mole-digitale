// Controlli della bozza Palma Viaggi:  npm test
// Le regole che, se si rompono, costano soldi o figuracce all'agenzia: sconto, posti, prezzi,
// lista passeggeri coerente con gli iscritti, pagamenti che tornano, fermate nell'ordine giusto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  GITE, GITA, PARTENZE, REGOLE, scadenzaSconto, statoPosti, prezzoOggi, prezzoDi, scontoAttivo, salite,
  prenotazioniEsempio, resoconto, giorniAvviso, euro, orariCompatti, statoOra,
} from '../../src/pages/demoPalmaViaggi/_shared.js';

const IMG = 'public/img/palmaviaggi';
const giorno = (ymd) => new Date(ymd + 'T12:00:00');

test('sconto: la stessa data due mesi prima, anche a fine mese', () => {
  assert.equal(scadenzaSconto('2026-12-31'), '2026-10-31');
  assert.equal(scadenzaSconto('2027-04-30'), '2027-02-28');   // febbraio corto
  assert.equal(scadenzaSconto('2028-04-30'), '2028-02-29');   // bisestile
  assert.equal(scadenzaSconto('2027-01-15'), '2026-11-15');   // cambio d'anno
  assert.equal(scadenzaSconto('2027-03-31'), '2027-01-31');
});

test('prezzo: 10% in meno fino alla scadenza compresa, poi pieno; niente sconto sui voli', () => {
  const praga = PARTENZE.find((p) => p.gita === 'praga');
  const scade = scadenzaSconto(praga.data);
  assert.equal(prezzoOggi(praga, giorno(scade)), Math.round(prezzoDi(praga) * 90) / 100);
  const dopo = new Date(giorno(scade).getTime() + 864e5);
  assert.equal(prezzoOggi(praga, dopo), prezzoDi(praga));
  const volo = PARTENZE.find((p) => GITA[p.gita].mezzo === 'aereo');
  assert.equal(scontoAttivo(volo, giorno('2000-01-01')), false);
});

test('posti: aperta, confermata, ultimi, completo, e l’italiano giusto', () => {
  const p = (iscritti) => ({ id: 'x', gita: 'annecy', data: '2099-01-01', iscritti });
  assert.equal(statoPosti(p(0)).t, 'Iscrizioni aperte');
  assert.equal(statoPosti(p(REGOLE.minimo - 1)).t, 'Manca 1 iscritto');
  assert.equal(statoPosti(p(REGOLE.minimo - 2)).t, 'Mancano 2 iscritti');
  assert.equal(statoPosti(p(REGOLE.minimo)).k, 'confermata');
  assert.equal(statoPosti(p(REGOLE.posti - 8)).k, 'ultimi');
  assert.equal(statoPosti(p(REGOLE.posti - 1)).t, 'Ultimo posto');
  assert.equal(statoPosti(p(REGOLE.posti)).k, 'completo');
  assert.equal(statoPosti(p(REGOLE.posti + 5)).iscritti, REGOLE.posti, 'mai più iscritti dei posti');
});

test('calendario: ogni partenza ha la sua gita, una data vera e codici unici', () => {
  const id = new Set();
  for (const p of PARTENZE) {
    assert.ok(GITA[p.gita], 'gita inesistente: ' + p.gita);
    assert.match(p.data, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(giorno(p.data).getTime()));
    assert.ok(!id.has(p.id), 'id doppio: ' + p.id); id.add(p.id);
  }
});

test('gite: testi completi e foto presenti (anche l’anteprima per WhatsApp)', () => {
  for (const g of GITE) {
    for (const k of ['titolo', 'breve', 'intro', 'alt', 'documento']) assert.ok(g[k], `${g.id}: manca ${k}`);
    assert.ok(g.programma.length && g.comprende.length && g.nonComprende.length, g.id + ': programma o quota vuoti');
    for (const f of [`${g.img}-600.webp`, `${g.img}-800.webp`, `${g.img}-1200.webp`, `og-${g.id}.jpg`]) assert.ok(fs.existsSync(path.join(IMG, f)), 'manca ' + f);
  }
});

test('fermate: orari in ordine; verso il Fréjus l’ultima è Buttigliera Alta', () => {
  for (const g of GITE) {
    const minuti = salite(g).map((f) => f.ora.split(':').reduce((h, m) => h * 60 + Number(m)));
    assert.deepEqual(minuti, [...minuti].sort((a, b) => a - b), g.id);
  }
  assert.equal(salite(GITA.annecy).at(-1).luogo, 'Buttigliera Alta');
});

test('lista passeggeri: tanti quanti gli iscritti, sempre gli stessi, pagamenti che tornano', () => {
  for (const p of PARTENZE) {
    const a = prenotazioniEsempio(p);
    assert.deepEqual(a, prenotazioniEsempio(p), 'non deterministico: ' + p.id);
    assert.equal(a.reduce((s, r) => s + r.passeggeri.length, 0), p.iscritti, 'passeggeri ≠ iscritti: ' + p.id);
    for (const r of a) assert.equal(r.passeggeri.length, r.persone);
    const R = resoconto(p);
    assert.equal(R.fermate.reduce((s, f) => s + f.passeggeri, 0), R.passeggeri, 'fermate ≠ passeggeri: ' + p.id);
    assert.ok(Math.abs(R.incassato + R.residuo - R.totale) < 0.01, 'incassato + da incassare ≠ totale: ' + p.id);
    assert.ok(Math.abs(R.online + R.agenzia - R.incassato) < 0.01, 'online + agenzia ≠ incassato: ' + p.id);
  }
});

test('lista passeggeri: la prenotazione fatta dal sito entra con i suoi nomi', () => {
  const p = PARTENZE.find((x) => x.gita === 'praga');
  const mia = { tipo: 'prenotazione', partenza: p.id, stato: 'acconto pagato', persone: 2, passeggeri: ['Rossi Maria', 'Rossi Luca'], nome: 'Rossi Maria', salita: 'Torino', totale: 808.2, pagato: 242.46, codice: 'PV-TEST1' };
  const R = resoconto(p, [mia]);
  assert.equal(R.passeggeri, p.iscritti + 2);
  assert.ok(R.fermate.find((f) => f.luogo === 'Torino').prenotazioni.some((r) => r.codice === 'PV-TEST1'));
  // la lista d'attesa non sale sul pullman
  assert.equal(resoconto(p, [{ ...mia, stato: 'lista d’attesa' }]).passeggeri, p.iscritti);
});

test('minimo non raggiunto: preavviso almeno quello di legge (art. 41 Codice del Turismo)', () => {
  for (const g of GITE) assert.ok(giorniAvviso(g) >= (g.giorni > 6 ? 20 : g.giorni > 1 ? 7 : 2), g.id);
});

test('orari e prezzi scritti all’italiana', () => {
  assert.deepEqual(orariCompatti().map((o) => o.giorni), ['Lunedì', 'Martedì–venerdì', 'Sabato', 'Domenica']);
  assert.match(statoOra(new Date('2026-11-18T10:00:00')).testo, /^Aperta ora/);   // mercoledì mattina
  assert.match(statoOra(new Date('2026-11-22T10:00:00')).testo, /riapre domani alle 15:00/);   // domenica
  assert.equal(euro(49), '49 €');
  assert.equal(euro(44.1), '44,10 €');
});
