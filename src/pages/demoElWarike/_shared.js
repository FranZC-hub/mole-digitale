// Condiviso dalla bozza El Warike: dati del locale, orari, prenotazioni, menù del giorno.
// Dati pubblici (schede del locale e articolo di Monsù Barachin, luglio 2023):
// indirizzo, telefono, orari, piatti. DA CONFERMARE con Gisela prima di andare online.

export const INFO = {
  nome: 'El Warike',
  titolare: 'Gisela',
  via: 'Via Fréjus 52b',
  cap: '10139',
  citta: 'Torino',
  tel: '320 429 7014',
  telHref: '+393204297014',
  wa: '393204297014',
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('El Warike, Via Fréjus 52b, 10139 Torino'),
  stelle: '4,2',
  recensioni: 110,
};

// Orari (ore decimali: 12.5 = 12:30). Martedì chiuso.
export const ORARI = {
  0: [[12, 17], [18, 22]],   // domenica
  1: [[12, 16], [18, 22]],
  2: null,                   // martedì
  3: [[12, 16], [18, 22]],
  4: [[12, 16], [18, 22]],
  5: [[12, 16], [18, 22]],
  6: [[12, 17], [18, 22]],   // sabato
};
export const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
export const fmt = (h) => `${Math.floor(h)}:${String(Math.round((h - Math.floor(h)) * 60)).padStart(2, '0')}`;

// Per il piede: giorni consecutivi con lo stesso orario raggruppati
// ("Mercoledì–venerdì 12–16 · 18–22"), dal lunedì alla domenica.
export function orariCompatti() {
  const h = (x) => (Number.isInteger(x) ? String(x) : fmt(x));
  const sett = [1, 2, 3, 4, 5, 6, 0].map((i) => ({ i, lab: ORARI[i] ? ORARI[i].map(([a, b]) => `${h(a)}–${h(b)}`).join(' · ') : 'chiuso' }));
  const gruppi = [];
  sett.forEach((g) => {
    const u = gruppi[gruppi.length - 1];
    if (u && u.lab === g.lab) u.fine = g.i; else gruppi.push({ inizio: g.i, fine: g.i, lab: g.lab });
  });
  return gruppi.map((g) => ({
    giorni: g.inizio === g.fine ? GIORNI[g.inizio] : `${GIORNI[g.inizio]}–${GIORNI[g.fine].toLowerCase()}`,
    orario: g.lab,
  }));
}

export function orariSettimana() {
  return [1, 2, 3, 4, 5, 6, 0].map((i) => ({
    i, giorno: GIORNI[i],
    label: ORARI[i] ? ORARI[i].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' · ') : 'Chiuso',
  }));
}

// "Aperto ora" calcolato sul momento, con la prossima apertura se e' chiuso.
export function statoOra(now = new Date()) {
  const d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const f = ORARI[d];
  const dentro = f && f.find(([a, b]) => t >= a && t < b);
  if (dentro) return { aperto: true, testo: `Aperto ora · fino alle ${fmt(dentro[1])}` };
  const dopo = f && f.find(([a]) => t < a);
  if (dopo) return { aperto: false, testo: `Chiuso ora · riapre alle ${fmt(dopo[0])}` };
  let k = 1;
  while (k <= 7 && !ORARI[(d + k) % 7]) k++;
  const g = (d + k) % 7;
  return { aperto: false, testo: `Chiuso ora · riapre ${k === 1 ? 'domani' : GIORNI[g].toLowerCase()} alle ${fmt(ORARI[g][0][0])}` };
}

// Orari prenotabili: ogni mezz'ora, fino a un'ora prima della chiusura del turno.
export function orariPrenotabili(ymd, now = new Date()) {
  const data = new Date(ymd + 'T12:00:00');
  const f = ORARI[data.getDay()];
  if (!f) return [];
  const oggi = ymd === isoLocale(now);
  const adesso = now.getHours() + now.getMinutes() / 60;
  const out = [];
  f.forEach(([a, b], turno) => {
    for (let h = a; h <= b - 1; h += 0.5) {
      if (oggi && h < adesso + 0.5) continue;   // almeno mezz'ora di preavviso
      out.push({ h, label: fmt(h), turno: turno === 0 ? 'Pranzo' : 'Cena' });
    }
  });
  return out;
}
export const isoLocale = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dataEstesa = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

// ---------------------------------------------------------------- il menù
// Solo piatti citati dalle fonti pubbliche. Niente prezzi inventati: li mette Gisela.
// Ogni foto ha anche le versioni da 640 e 320 px: da telefono non si scarica l'originale.
export const CARTA = [
  { id: 'ceviche', nome: 'Ceviche', it: 'Pesce crudo marinato nel lime con cipolla rossa e peperoncino, servito con choclo (il mais gigante) e camote (la patata dolce).', img: '/img/elwarike/ceviche.webp', img640: '/img/elwarike/ceviche-640.webp', img320: '/img/elwarike/ceviche-320.webp', alt: 'Ceviche di pesce con choclo, salse e cancha' },
  { id: 'pollo', nome: 'Pollo a la brasa', it: 'Marinato e cotto alla brace: croccante fuori, tenero dentro. Con patate e insalata di avocado.', img: '/img/elwarike/pollo-a-la-brasa.webp', img640: '/img/elwarike/pollo-a-la-brasa-640.webp', img320: '/img/elwarike/pollo-a-la-brasa-320.webp', alt: 'Pollo intero cotto alla brace' },
  { id: 'lomo', nome: 'Lomo saltado', it: 'Manzo saltato a fuoco vivo con cipolla e pomodoro, con riso bianco e patate fritte.', img: '/img/elwarike/lomo-saltado.webp', img640: '/img/elwarike/lomo-saltado-640.webp', img320: '/img/elwarike/lomo-saltado-320.webp', alt: 'Lomo saltado con riso bianco' },
  { id: 'papa', nome: 'Papa rellena', it: 'Patata ripiena di ragù, impanata e fritta.', img: '/img/elwarike/papa-rellena.webp', img640: '/img/elwarike/papa-rellena-640.webp', img320: '/img/elwarike/papa-rellena-320.webp', alt: 'Papa rellena con insalata di avocado' },
  { id: 'estofado', nome: 'Estofado de res', it: 'Spezzatino di manzo cotto piano, con riso bianco.' },
  { id: 'carapulcra', nome: 'Carapulcra con sopa seca', it: 'Stufato di patata essiccata con carne arrosto, pasta aromatica alla chinchana e yuca fritta.' },
  { id: 'sopa', nome: 'Sopa del día', it: 'La zuppa del giorno, come si fa a casa.' },
];

// Menù del pranzo: cambia ogni giorno, lo aggiorna Gisela dal pannello.
export const MENU_GIORNO_BASE = {
  prezzo: '12',
  formula: 'Due piatti a scelta',
  piatti: ['Sopa del día', 'Papa rellena', 'Estofado de res con arroz', 'Lomo saltado', 'Carapulcra con sopa seca', 'Pollo a la brasa (¼)'],
  nota: 'Dal lunedì alla domenica, martedì escluso.',
  agg: '',
};

// ---------------------------------------------------------------- memoria locale
// Lo storage puo' mancare o sollevare eccezioni (navigazione privata): mai lasciar cadere lo script.
const leggi = (k, def) => { try { const r = localStorage.getItem(k); return r === null ? def : JSON.parse(r); } catch { return def; } };
const scrivi = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

export const leggiMenuGiorno = () => ({ ...MENU_GIORNO_BASE, ...(leggi('ew-menu-giorno', null) || {}) });
export const scriviMenuGiorno = (m) => scrivi('ew-menu-giorno', m);

export const leggiChiusure = () => (leggi('ew-chiusure', []) || []).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
export const scriviChiusure = (a) => scrivi('ew-chiusure', a);

export const leggiPrenotazioni = () => (leggi('ew-prenotazioni', []) || []).filter((p) => p && p.id);
export const scriviPrenotazioni = (a) => scrivi('ew-prenotazioni', a);

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const waLink = (numero, testo) => `https://wa.me/${numero}?text=${encodeURIComponent(testo)}`;
