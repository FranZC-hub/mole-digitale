// Condiviso dalla bozza Farmacia dell'Ausiliatrice: orari live + catalogo prodotti.
// I prodotti aggiunti dal gestionale demo (localStorage) si fondono col catalogo base:
// è la dimostrazione della "gestione autonoma" proposta al cliente.

// ⚠ Orari SEGNAPOSTO da confermare col cliente
export const AUS_HOURS = {
  1: [[8.5, 19.5]], 2: [[8.5, 19.5]], 3: [[8.5, 19.5]], 4: [[8.5, 19.5]], 5: [[8.5, 19.5]],
  6: [[9, 13]], 0: null,
};
const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fmt = (h) => `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;

export function renderHours(listEl, openEl) {
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const ranges = AUS_HOURS[d];
  const open = !!ranges && ranges.some(([a, b]) => t >= a && t < b);
  if (openEl) {
    openEl.textContent = open ? `Aperta ora · chiude alle ${fmt(ranges.find(([a, b]) => t >= a && t < b)[1])}` : 'Chiusa ora';
    if (!open) openEl.parentElement.classList.add('closed');
  }
  if (listEl) {
    listEl.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((i) => {
      const h = AUS_HOURS[i] ? AUS_HOURS[i].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' / ') : 'Chiuso';
      return `<li class="${i === d ? 'today' : ''}"><span>${DAYS[i]}</span><b>${h}</b></li>`;
    }).join('');
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
    <span class="pem" aria-hidden="true">${p.em || '🧺'}</span>
    <span class="pcat">${p.cat}</span>
    <h3>${p.nome}</h3>
    <div class="pfoot"><b>€ ${p.prezzo}</b><a href="https://wa.me/393505488606?text=${encodeURIComponent('Ciao! Vorrei informazioni su: ' + p.nome)}" target="_blank" rel="noopener">Chiedi info →</a></div>
  </article>`;
}
