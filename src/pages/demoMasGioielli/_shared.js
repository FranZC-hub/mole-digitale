// Condiviso dalla bozza MasGioielli: orari live, catalogo vetrina, lista desideri.
// Dati reali presi dal sito attuale (masgioielli.it): indirizzo, telefono, orari, servizi.

export const INFO = {
  nome: 'MasGioielli',
  fondata: 1996,
  fondatore: 'Massimo Mussa',
  via: 'Corso Trapani 146/b',
  citta: 'Torino',
  cap: '10141',
  tel: '011 331725',
  telHref: '+39011331725',
  wa: '393667210230',        // 366 7210230
  waLabel: '366 7210230',
  email: 'info@masgioielli.it',
  piva: '07049710010',
  fb: 'https://www.facebook.com/masgioielli',
  ig: 'https://www.instagram.com/masgioielli/',
  stelle: '4,9',
  recensioni: 200,
};

// Orari ufficiali: Martedì–Sabato 9:30–12:30 / 15:30–19:30. Lunedì e domenica chiuso.
// Ore in decimale: .5 = 30 minuti (9.5 = 9:30).
export const ORARI = {
  0: null,                                  // domenica
  1: null,                                  // lunedì (chiuso)
  2: [[9.5, 12.5], [15.5, 19.5]],
  3: [[9.5, 12.5], [15.5, 19.5]],
  4: [[9.5, 12.5], [15.5, 19.5]],
  5: [[9.5, 12.5], [15.5, 19.5]],
  6: [[9.5, 12.5], [15.5, 19.5]],
};
const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fmt = (h) => `${Math.floor(h)}:${String(Math.round((h - Math.floor(h)) * 60)).padStart(2, '0')}`;

// Forma pura: usata sia per il render statico (SSR, visibile senza JavaScript)
// sia per l'aggiornamento lato client.
export function orariSettimana() {
  return [1, 2, 3, 4, 5, 6, 0].map((i) => ({
    i,
    giorno: GIORNI[i],
    label: ORARI[i] ? ORARI[i].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' / ') : 'Chiuso',
  }));
}

export function renderOrari(listEl, statoEl) {
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const fasce = ORARI[d];
  const aperto = !!fasce && fasce.some(([a, b]) => t >= a && t < b);
  if (statoEl) {
    if (aperto) {
      statoEl.textContent = `Aperto ora · fino alle ${fmt(fasce.find(([a, b]) => t >= a && t < b)[1])}`;
    } else {
      // prossima apertura utile (oggi più tardi, altrimenti il primo giorno aperto)
      const dopo = fasce?.find(([a]) => t < a);
      if (dopo) statoEl.textContent = `Chiuso ora · riapre alle ${fmt(dopo[0])}`;
      else {
        let k = 1;
        while (k <= 7 && !ORARI[(d + k) % 7]) k++;
        const g = GIORNI[(d + k) % 7];
        statoEl.textContent = `Chiuso ora · riapre ${k === 1 ? 'domani' : g} alle ${fmt(ORARI[(d + k) % 7][0][0])}`;
      }
    }
    statoEl.parentElement.classList.toggle('is-closed', !aperto);
  }
  if (listEl) {
    listEl.innerHTML = orariSettimana()
      .map(({ i, giorno, label }) => `<li class="${i === d ? 'oggi' : ''}"><span>${giorno}</span><b>${label}</b></li>`)
      .join('');
  }
}

// ---------------------------------------------------------------- catalogo
// Selezione dimostrativa: i pezzi veri li caricherebbe il titolare dal gestionale.
export const PEZZI = [
  { id: 'g1', nome: 'Solitario ovale',         cat: 'Anelli',    img: '/img/demo-gioielleria/p-solitario.webp',  prezzo: '3.900', materiale: 'Oro bianco 18kt · diamante taglio ovale', alt: 'Anello solitario con diamante ovale indossato al dito', desc: 'Diamante ovale su gambo pavé, con contorno nascosto sotto la pietra. L\'anello di fidanzamento che scegliamo insieme, misura compresa.' },
  { id: 'g2', nome: 'Veretta rubini e diamanti', cat: 'Anelli',  img: '/img/demo-gioielleria/p-veretta.webp',    prezzo: '1.450', materiale: 'Oro giallo 18kt · rubini navette e diamanti', alt: 'Veretta in oro giallo con rubini a navette e diamanti', desc: 'Rubini a navette alternati a diamanti, tutt\'intorno. Si porta da sola o affiancata alla fede: un colore che si nota senza gridare.' },
  { id: 'g3', nome: 'Fedi su misura',          cat: 'Anelli',    img: '/img/demo-gioielleria/p-intreccio.webp',  prezzo: '890',   materiale: 'Oro giallo e oro bianco 18kt · la coppia', alt: 'Coppia di fedi nuziali in oro giallo e bianco su spighe di grano', desc: 'Le facciamo noi, in laboratorio: scegliete profilo, larghezza e finitura, e le incidiamo con la data o quello che volete. Provate le misure in negozio.' },
  { id: 'g4', nome: 'Collana con stella',      cat: 'Collane',   img: '/img/demo-gioielleria/p-goccia.webp',     prezzo: '4.200', materiale: 'Oro bianco · rubini, zaffiri e diamanti', alt: 'Collana in oro bianco con pendente a rosetta di rubini, zaffiri e diamanti', desc: 'Pendente a rosetta con stella centrale in pavé di diamanti, rubini e zaffiri calibrati; girocollo con stelle. Pezzo unico da vedere dal vivo.' },
  { id: 'g5', nome: 'Orecchino d\'epoca',      cat: 'Orecchini', img: '/img/demo-gioielleria/p-pendenti.webp',   prezzo: 'su richiesta', materiale: 'Oro · granato e perline · restaurato in laboratorio', alt: 'Orecchino antico in oro con castone decorato e granato', desc: 'Gioiello antico a cerchio con castone decorato, tornato indossabile dopo il restauro conservativo fatto al nostro banco. Portateci i vostri: spesso si salvano.' },
  { id: 'o1', nome: 'Cronografo automatico',   cat: 'Orologi',   img: '/img/demo-orologiaio/g-cronografo.webp',  prezzo: '2.300', materiale: 'Acciaio · movimento automatico', alt: 'Cronografo automatico in acciaio con tre contatori', desc: 'Cronografo a tre contatori, vetro zaffiro e impermeabilità 100m. Revisionato e garantito dal nostro laboratorio di orologeria.' },
  { id: 'o2', nome: 'Diver 300m',              cat: 'Orologi',   img: '/img/demo-orologiaio/g-diver.webp',       prezzo: '1.750', materiale: 'Acciaio · ghiera unidirezionale', alt: 'Orologio subacqueo in acciaio con ghiera girevole', desc: 'Subacqueo professionale con lunetta girevole e quadrante luminescente. Bracciale accorciabile su misura in negozio.' },
  { id: 'o3', nome: 'Solo tempo essenziale',   cat: 'Orologi',   img: '/img/demo-orologiaio/g-solotempo.webp',   prezzo: '890',   materiale: 'Acciaio · cinturino in pelle', alt: 'Orologio solo tempo con cinturino in pelle', desc: 'Quadrante pulito, cassa sottile: l\'orologio da portare sempre, sotto qualsiasi camicia.' },
  { id: 'o4', nome: 'Orologio da tasca d\'epoca', cat: 'Orologi', img: '/img/demo-orologiaio/g-tasca.webp',      prezzo: '1.320', materiale: 'Argento · carica manuale', alt: 'Orologio da tasca d\'epoca in argento', desc: 'Pezzo d\'epoca restaurato nel nostro laboratorio di pendoleria. Meccanica revisionata, funzionante e garantita.' },
];
export const CATEGORIE = ['Anelli', 'Collane', 'Orecchini', 'Orologi'];

// Etichetta del prezzo: i pezzi unici o da restaurare non hanno una cifra fissa.
export const prezzoLabel = (p) => (/^[\d.,]+$/.test(String(p)) ? `€ ${p}` : String(p).charAt(0).toUpperCase() + String(p).slice(1));

// ---------------------------------------------------------------- utilità
// I testi che finiscono dentro stringhe HTML vanno neutralizzati.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Lista desideri (solo su questo dispositivo): il cliente segna i pezzi che gli
// interessano e li manda in negozio su WhatsApp prima di passare.
const LS = 'mas-desideri';
export const leggiLista = () => { try { return JSON.parse(localStorage.getItem(LS) || '[]').filter((x) => x && x.id); } catch { return []; } };
export const scriviLista = (a) => localStorage.setItem(LS, JSON.stringify(a));

// Controlli condivisi per un modale .velo: apertura/chiusura, focus, Escape,
// focus-trap e sfondo inert (il resto della pagina non è raggiungibile).
export function initModal(modal) {
  let ultimo = null;
  const sfondo = (on) => document.querySelectorAll('main > *, header, footer').forEach((el) => { if (el !== modal) el.inert = on; });
  const open = () => {
    ultimo = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('velo-aperto');
    sfondo(true);
    (modal.querySelector('.velo-x') || modal).focus();
  };
  const close = () => {
    modal.hidden = true;
    sfondo(false);
    document.body.classList.remove('velo-aperto');
    if (ultimo) { ultimo.focus(); ultimo = null; }
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
