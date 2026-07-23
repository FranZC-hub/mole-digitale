// Condiviso dalla bozza Farmacia dell'Ausiliatrice: orari live + elenco servizi.
// I servizi aggiunti dal gestionale demo (localStorage) si affiancano a quelli base
// sulla pagina Servizi: è la dimostrazione della "gestione autonoma" proposta al cliente.

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

// Servizi base della farmacia (fonte unica: importati sia dalla pagina Servizi per il
// render statico SSR, sia dal gestionale come riferimento). Ordine = come appaiono.
export const BASE_SERVICES = [
  { em: '🫀', nome: 'Holter cardiaco', desc: 'Monitoraggio cardiaco nelle 24 ore con referto entro 5 giorni lavorativi — o in 24 ore in caso di urgenza.', prenotabile: true },
  { em: '📈', nome: 'Elettrocardiogramma', desc: 'ECG in farmacia con teleconsulto cardiologico e telerefertazione immediata: esci col referto.', prenotabile: true },
  { em: '💊', nome: 'Riconfezionamento farmaci', desc: 'Prepariamo le tue dosi unitarie personalizzate (deblistering), giorno per giorno: mai più dubbi sulla terapia.', prenotabile: false, nuovo: true },
  { em: '🧪', nome: 'Tamponi rapidi', desc: 'Tamponi antigenici con esito in 15–30 minuti, anche senza prenotazione.', prenotabile: true },
  { em: '🩸', nome: 'Glicemia e autoanalisi', desc: 'Controllo di glicemia e parametri di base, in pochi minuti e senza appuntamento.', prenotabile: false },
  { em: '🩺', nome: 'Misurazione pressione', desc: 'Controllo della pressione arteriosa con consiglio del farmacista.', prenotabile: false },
  { em: '🏠', nome: 'Consegna a domicilio', desc: 'Ti portiamo farmaci e prodotti direttamente a casa: ordina per telefono o WhatsApp.', prenotabile: false },
  { em: '💬', nome: 'Consiglio del farmacista', desc: 'Il servizio più antico e più prezioso: ascolto e consiglio su misura, ogni giorno.', prenotabile: false },
];

// Escape HTML: i testi inseriti dal titolare (nome/descrizione servizio) vengono
// iniettati come stringhe, quindi vanno neutralizzati per non rompere il markup
// (né permettere iniezioni) se contengono < > & " '.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Servizi aggiunti dal titolare nel gestionale demo (solo su questo dispositivo).
const LS_KEY = 'aus-servizi';
export const readServices = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } };
export const writeServices = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

// Card servizio in HTML: markup identico a quello SSR di servizi.astro, così i servizi
// aggiunti dal gestionale (iniettati via JS) si fondono senza stacchi con quelli base.
// `mine` = aggiunto dal titolare (bordo evidenziato + etichetta).
export function serviceCard(s, mine = false) {
  const badges = [
    s.nuovo ? '<span class="sbadge sbadge-new">novità</span>' : '',
    s.prenotabile ? '<span class="sbadge">prenotabile</span>' : '',
  ].join('');
  // il bottone "Prenota" appare SOLO sui servizi prenotabili; porta alla prenotazione
  // GIÀ con questo servizio selezionato
  const pren = '/demoFarmaciaAusiliatrice/prenotazioni/?servizio=' + encodeURIComponent(s.nome || '');
  const book = s.prenotabile ? `<a class="sbook" href="${pren}">Prenota →</a>` : '';
  // data-* servono al modale dettaglio (aperto al click sulla card); il nome è un <button> per la tastiera
  return `<article class="fcard${mine ? ' fcard-mine' : ''}" data-nome="${esc(s.nome)}" data-em="${esc(s.em)}" data-desc="${esc(s.desc || '')}" data-nuovo="${s.nuovo ? '1' : ''}" data-prenotabile="${s.prenotabile ? '1' : ''}">
    <span class="fic" aria-hidden="true">${esc(s.em) || '🧩'}</span>
    <h3><button type="button" class="sopen">${esc(s.nome)}</button> ${badges}</h3>
    ${s.desc ? `<p>${esc(s.desc)}</p>` : ''}
    ${book}
  </article>`;
}

// Controlli condivisi per un modale `.omodal` (dettaglio offerta/servizio, carrello):
// apertura/chiusura con blocco scroll, focus iniziale e ripristino, Escape, focus-trap
// e `inert` sullo sfondo (il resto della pagina non è raggiungibile mentre è aperto).
export function initModal(modal) {
  let lastFocus = null;
  const bg = (on) => document.querySelectorAll('main > *').forEach((el) => { if (el !== modal) el.inert = on; });
  const open = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('omodal-open');
    bg(true);
    (modal.querySelector('.omodal-x') || modal).focus();
  };
  const close = () => {
    modal.hidden = true;
    bg(false);
    if (!document.querySelector('.omodal:not([hidden])')) document.body.classList.remove('omodal-open');
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  };
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const f = [...modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null && !el.disabled);
    if (!f.length) return;
    const a = f[0], b = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  });
  return { open, close };
}
