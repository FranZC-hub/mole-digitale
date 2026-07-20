// Condiviso dalla bozza Farmacia dell'Ausiliatrice: orari live + catalogo prodotti.
// I prodotti aggiunti dal gestionale demo (localStorage) si fondono col catalogo base:
// è la dimostrazione della "gestione autonoma" proposta al cliente.

// Orari ufficiali Farmacia dell'Ausiliatrice — Lun–Ven 8.45–12.45 / 15.15–19.15, Sab 8.45–12.45, Dom chiuso.
// Ore in decimale: .25=15min, .5=30min, .75=45min (es. 8.75 = 8:45).
export const AUS_HOURS = {
  1: [[8.75, 12.75], [15.25, 19.25]], 2: [[8.75, 12.75], [15.25, 19.25]], 3: [[8.75, 12.75], [15.25, 19.25]],
  4: [[8.75, 12.75], [15.25, 19.25]], 5: [[8.75, 12.75], [15.25, 19.25]],
  6: [[8.75, 12.75]], 0: null,
};
const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fmt = (h) => { const hh = Math.floor(h); const mm = Math.round((h - hh) * 60); return `${hh}:${String(mm).padStart(2, '0')}`; };

// Orari settimanali Lun→Dom, in forma pura: usato sia per il render statico (SSR, così
// gli orari sono visibili anche senza JavaScript) sia per l'aggiornamento client.
export function weeklyHours() {
  return [1, 2, 3, 4, 5, 6, 0].map((i) => ({
    i,
    day: DAYS[i],
    label: AUS_HOURS[i] ? AUS_HOURS[i].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' / ') : 'Chiuso',
  }));
}

export function renderHours(listEl, openEl) {
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const ranges = AUS_HOURS[d];
  const open = !!ranges && ranges.some(([a, b]) => t >= a && t < b);
  if (openEl) {
    openEl.textContent = open ? `Aperta ora · chiude alle ${fmt(ranges.find(([a, b]) => t >= a && t < b)[1])}` : 'Chiusa ora';
    openEl.parentElement.classList.toggle('closed', !open);
  }
  if (listEl) {
    listEl.innerHTML = weeklyHours()
      .map(({ i, day, label }) => `<li class="${i === d ? 'today' : ''}"><span>${day}</span><b>${label}</b></li>`)
      .join('');
  }
}

// Catalogo base (esempi realistici dal loro assortimento: dermocosmesi + integrazione)
const BASE_PRODUCTS = [
  { id: 'b1', nome: 'Avène Cicalfate+ 100ml', cat: 'Dermocosmesi', prezzo: '12,90', em: '🧴' },
  { id: 'b2', nome: 'Somatoline Snellente 7 notti', cat: 'Dermocosmesi', prezzo: '34,50', em: '✨' },
  { id: 'b3', nome: 'Magnesio + Potassio 24 bust.', cat: 'Integratori', prezzo: '9,90', em: '⚡' },
  { id: 'b4', nome: 'Vitamina D3 2000 UI', cat: 'Integratori', prezzo: '11,50', em: '☀️' },
  { id: 'b5', nome: 'Termometro digitale', cat: 'Autoanalisi', prezzo: '8,90', em: '🌡' },
  { id: 'b6', nome: 'Crema mani riparatrice', cat: 'Dermocosmesi', prezzo: '7,50', em: '🤲' },
  { id: 'b7', nome: 'Fermenti lattici 30 cps', cat: 'Integratori', prezzo: '14,90', em: '💚' },
  { id: 'b8', nome: 'Misuratore di pressione', cat: 'Autoanalisi', prezzo: '49,90', em: '🩺' },
];

const LS_KEY = 'aus-prodotti';
export const readCustom = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } };
export const writeCustom = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

export function ausProducts() {
  // i prodotti del gestionale compaiono per primi, marcati "aggiunto da te"
  return [...readCustom().map((p) => ({ ...p, mine: true })), ...BASE_PRODUCTS];
}

export function prodCard(p) {
  return `<article class="pcard${p.mine ? ' mine' : ''}">
    ${p.mine ? '<span class="pmine">aggiunto da te ✔</span>' : ''}
    ${p.img ? `<img class="pimg" src="${p.img}" alt="${p.nome}" />` : `<span class="pem" aria-hidden="true">${p.em || '🧺'}</span>`}
    <span class="pcat">${p.cat}</span>
    <h3>${p.nome}</h3>
    <div class="pfoot"><b>€ ${p.prezzo}</b><a href="https://wa.me/393388762564?text=${encodeURIComponent('Ciao! Vorrei informazioni su: ' + p.nome)}" target="_blank" rel="noopener">Chiedi info →</a></div>
  </article>`;
}
