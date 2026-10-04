// Condiviso dalla bozza MasGioielli: orari live, catalogo vetrina, lista desideri.
// Dati reali presi dal sito attuale (masgioielli.it): indirizzo, telefono, orari, servizi.

export const INFO = {
  nome: 'MasGioielli',
  fondata: 1996,
  fondatore: 'Massimo Mussa',
  inaugurazione: '16 marzo 1996',
  // Registro degli operatori compro oro (OAM): numero da farsi dare dal negozio
  oam: '',
  via: 'Corso Trapani 146/b',
  citta: 'Torino',
  cap: '10141',
  tel: '011 331725',
  telHref: '+39011331725',
  wa: '393385386701',        // 338 538 6701 (indicato dal negozio, mail di ottobre 2026)
  waLabel: '338 538 6701',
  email: 'info@masgioielli.it',
  piva: '12754900012',
  fb: 'https://www.facebook.com/masgioielli',
  ig: 'https://www.instagram.com/masgioielli/',
  stelle: '4,9',
  recensioni: 200,
};

// Orari di partenza: Martedì–Sabato 9:30–12:30 / 15:30–19:30. Lunedì e domenica chiuso.
// Il negozio li cambia dall'area riservata (vedi orariAttivi piu' sotto).
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
export const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
// la settimana come la legge un negoziante: dal lunedì alla domenica
export const SETTIMANA = [1, 2, 3, 4, 5, 6, 0];
export const fmt = (h) => `${Math.floor(h)}:${String(Math.round((h - Math.floor(h)) * 60)).padStart(2, '0')}`;

// ---- orari salvati dal titolare. `null` = mai toccati: valgono quelli qui sopra.
const LS_ORARI = 'mas-orari';
const fasciaOk = (f) => Array.isArray(f) && f.length === 2 && f.every((x) => typeof x === 'number' && x >= 0 && x <= 24) && f[0] < f[1];
export const leggiOrari = () => {
  try {
    const raw = localStorage.getItem(LS_ORARI);
    if (raw === null) return null;
    const o = JSON.parse(raw), out = {};
    for (let i = 0; i < 7; i++) { const g = o[i]; out[i] = Array.isArray(g) && g.length && g.every(fasciaOk) ? g : null; }
    return out;
  } catch { return null; }
};
export const scriviOrari = (o) => salva(LS_ORARI, JSON.stringify(o));
export const cancellaOrari = () => { try { localStorage.removeItem(LS_ORARI); } catch { /* niente */ } };
export const orariAttivi = () => leggiOrari() ?? ORARI;

// Forma pura: usata sia per il render statico (SSR, visibile senza JavaScript)
// sia per l'aggiornamento lato client.
export function orariSettimana(o = ORARI) {
  return SETTIMANA.map((i) => ({
    i,
    giorno: GIORNI[i],
    label: o[i] ? o[i].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' / ') : 'Chiuso',
  }));
}

// Giorni consecutivi con lo stesso orario raggruppati ("Martedì – Sabato").
function gruppi(o) {
  const out = [];
  SETTIMANA.forEach((i) => {
    const lab = o[i] ? o[i].map(([a, b]) => `${fmt(a)} – ${fmt(b)}`).join(' · ') : '';
    const u = out[out.length - 1];
    if (u && u.lab === lab) u.fine = i; else out.push({ inizio: i, fine: i, lab });
  });
  return out.map((g) => ({ ...g, giorni: g.inizio === g.fine ? GIORNI[g.inizio] : `${GIORNI[g.inizio]} – ${GIORNI[g.fine]}` }));
}
// Per il piede: i gruppi aperti con il loro orario, e i giorni di chiusura in una riga.
export function orariPiede(o = ORARI) {
  const g = gruppi(o);
  const chiusi = SETTIMANA.filter((i) => !o[i]).map((i) => GIORNI[i]);
  const elenco = chiusi.length > 1 ? chiusi.slice(0, -1).join(', ') + ' e ' + chiusi.at(-1).toLowerCase() : chiusi[0] || '';
  return {
    aperti: g.filter((x) => x.lab).map((x) => ({ giorni: x.giorni, orario: x.lab })),
    chiusi: elenco ? `${elenco.charAt(0) + elenco.slice(1).toLowerCase()} ${chiusi.length > 1 ? 'chiusi' : 'chiuso'}` : '',
  };
}
// Per le note nelle pagine: "martedì – sabato, 9:30 – 12:30 e 15:30 – 19:30".
export function orariInRiga(o = ORARI) {
  return gruppi(o).filter((x) => x.lab).map((x) => `${x.giorni.toLowerCase()}, ${x.lab.replace(' · ', ' e ')}`).join('; ');
}
// HTML del piede: stesso markup lato server e lato client
export function piedeHTML(o = ORARI) {
  const p = orariPiede(o);
  return p.aperti.map((x) => `<p class="chiusura-sp">${x.giorni}</p><p>${x.orario}</p>`).join('') + (p.chiusi ? `<p class="chiusura-muto">${p.chiusi}</p>` : '');
}

export function renderOrari(listEl, statoEl) {
  const O = orariAttivi();
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const fasce = O[d];
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
        while (k <= 7 && !O[(d + k) % 7]) k++;
        // con gli orari modificabili puo' capitare una settimana tutta chiusa (ferie)
        if (k > 7) statoEl.textContent = 'Chiuso';
        else statoEl.textContent = `Chiuso ora · riapre ${k === 1 ? 'domani' : GIORNI[(d + k) % 7].toLowerCase()} alle ${fmt(O[(d + k) % 7][0][0])}`;
      }
    }
    statoEl.parentElement.classList.toggle('is-closed', !aperto);
  }
  if (listEl) {
    listEl.innerHTML = orariSettimana(O)
      .map(({ i, giorno, label }) => `<li class="${i === d ? 'oggi' : ''}"><span>${giorno}</span><b>${label}</b></li>`)
      .join('');
  }
}

// ---------------------------------------------------------------- catalogo
// Selezione dimostrativa: i pezzi veri li caricherebbe il titolare dal gestionale.
export const PEZZI = [
  { id: 'g1', nome: 'Solitario ovale',         cat: 'Anelli',    img: '/img/demo-gioielleria/p-solitario.webp',  materiale: 'Oro bianco 18kt · diamante taglio ovale', alt: 'Anello solitario con diamante ovale indossato al dito', desc: 'Diamante ovale su gambo pavé, con contorno nascosto sotto la pietra. L\'anello di fidanzamento che scegliamo insieme, misura compresa.' },
  { id: 'g2', nome: 'Veretta rubini e diamanti', cat: 'Anelli',  img: '/img/demo-gioielleria/p-veretta.webp',    materiale: 'Oro giallo 18kt · rubini navette e diamanti', alt: 'Veretta in oro giallo con rubini a navette e diamanti', desc: 'Rubini a navette alternati a diamanti, tutt\'intorno. Si porta da sola o affiancata alla fede: un colore che si nota senza gridare.' },
  { id: 'g3', nome: 'Fedi su misura',          cat: 'Anelli',    img: '/img/demo-gioielleria/p-intreccio.webp',    materiale: 'Oro giallo e oro bianco 18kt · la coppia', alt: 'Coppia di fedi nuziali in oro giallo e bianco su spighe di grano', desc: 'Le facciamo noi, in laboratorio: scegliete profilo, larghezza e finitura, e le incidiamo con la data o quello che volete. Provate le misure in negozio.' },
  { id: 'g4', nome: 'Collana con stella',      cat: 'Collane',   img: '/img/demo-gioielleria/p-goccia.webp',     materiale: 'Oro bianco · rubini, zaffiri e diamanti', alt: 'Collana in oro bianco con pendente a rosetta di rubini, zaffiri e diamanti', desc: 'Pendente a rosetta con stella centrale in pavé di diamanti, rubini e zaffiri calibrati; girocollo con stelle. Pezzo unico da vedere dal vivo.' },
  { id: 'g5', nome: 'Orecchino d\'epoca',      cat: 'Orecchini', img: '/img/demo-gioielleria/p-pendenti.webp',   materiale: 'Oro · granato e perline · restaurato in laboratorio', alt: 'Orecchino antico in oro con castone decorato e granato', desc: 'Gioiello antico a cerchio con castone decorato, tornato indossabile dopo il restauro conservativo fatto al nostro banco. Portateci i vostri: spesso si salvano.' },
  { id: 'o1', nome: 'Cronografo automatico',   cat: 'Orologi',   img: '/img/demo-orologiaio/g-cronografo.webp',  materiale: 'Acciaio · movimento automatico', alt: 'Cronografo automatico in acciaio con tre contatori', desc: 'Cronografo a tre contatori, vetro zaffiro e impermeabilità 100m. Revisionato e garantito dal nostro laboratorio di orologeria.' },
  { id: 'o2', nome: 'Diver 300m',              cat: 'Orologi',   img: '/img/demo-orologiaio/g-diver.webp',       materiale: 'Acciaio · ghiera unidirezionale', alt: 'Orologio subacqueo in acciaio con ghiera girevole', desc: 'Subacqueo professionale con lunetta girevole e quadrante luminescente. Bracciale accorciabile su misura in negozio.' },
  { id: 'o3', nome: 'Solo tempo essenziale',   cat: 'Orologi',   img: '/img/demo-orologiaio/g-solotempo.webp',     materiale: 'Acciaio · cinturino in pelle', alt: 'Orologio solo tempo con cinturino in pelle', desc: 'Quadrante pulito, cassa sottile: l\'orologio da portare sempre, sotto qualsiasi camicia.' },
  { id: 'o4', nome: 'Orologio da tasca d\'epoca', cat: 'Orologi', img: '/img/demo-orologiaio/g-tasca.webp',      materiale: 'Argento · carica manuale', alt: 'Orologio da tasca d\'epoca in argento', desc: 'Pezzo d\'epoca restaurato nel nostro laboratorio di pendoleria. Meccanica revisionata, funzionante e garantita.' },
];
export const CATEGORIE = ['Anelli', 'Collane', 'Orecchini', 'Orologi'];

// Niente prezzi in vetrina: tolti su richiesta del negozio (si chiedono in negozio o su WhatsApp).

// ---------------------------------------------------------------- selezione del momento
// Il negozio non vende online: la vetrina e' una SELEZIONE di pezzi che il titolare
// cambia quando vuole dall'area riservata (foto, nome, descrizione). `null` = mai
// toccata: si mostrano gli esempi resi lato server.
const LS_SEL = 'mas-selezione';
export const leggiSelezione = () => {
  try {
    const raw = localStorage.getItem(LS_SEL);
    if (raw === null) return null;
    const o = JSON.parse(raw);
    return { pezzi: (o.pezzi || []).filter((x) => x && x.id && x.nome && x.img), agg: o.agg || '' };
  } catch { return null; }
};
export const scriviSelezione = (sel) => salva(LS_SEL, JSON.stringify(sel));
export const selezioneDaMostrare = () => leggiSelezione()?.pezzi ?? PEZZI;
export const dataEstesa = (d) => new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

// Stesso markup del render statico di vetrina e home: quando la selezione arriva
// dall'area riservata non si notano stacchi.
export function pezzoHTML(x) {
  const e = esc;
  return `<article class="pezzo" id="${e(x.id)}" data-id="${e(x.id)}" data-nome="${e(x.nome)}" data-cat="${e(x.cat)}" data-img="${e(x.img)}" data-alt="${e(x.alt || x.nome)}" data-materiale="${e(x.materiale || '')}" data-desc="${e(x.desc || '')}">
    <div class="pezzo-foto"><img src="${e(x.img)}" width="640" height="480" alt="${e(x.alt || x.nome)}" loading="lazy" />
      <button type="button" class="segna" aria-label="Segna ${e(x.nome)} nella tua lista"><span class="segna-ic" aria-hidden="true">♡</span></button></div>
    <p class="pezzo-cat">${e(x.cat)}</p>
    <h3><button type="button" class="pezzo-apri" aria-haspopup="dialog">${e(x.nome)}</button></h3>
    <p class="pezzo-mat">${e(x.materiale || '')}</p>
  </article>`;
}
export function railHTML(x) {
  const e = esc;
  return `<a class="rail-el" href="/demoMasGioielli/vetrina/#${e(x.id)}"><div class="rail-foto"><img src="${e(x.img)}" width="640" height="480" alt="${e(x.alt || x.nome)}" loading="lazy" /></div><p class="rail-cat">${e(x.cat)}</p><p class="rail-nome">${e(x.nome)}</p></a>`;
}

// ---------------------------------------------------------------- marchi trattati
// Nomi DIMOSTRATIVI: non sono marchi reali, servono solo a far vedere come appare
// la fascia in home. Il titolare li sostituisce coi propri dall'area riservata.
export const BRAND_BASE = [
  { id: 'b1', nome: 'Àuria', reparto: 'Gioielleria' },
  { id: 'b2', nome: 'Vermeil', reparto: 'Gioielleria' },
  { id: 'b3', nome: 'Orsini 1912', reparto: 'Gioielleria' },
  { id: 'b4', nome: 'Tempo Reale', reparto: 'Orologeria' },
  { id: 'b5', nome: 'Cassia', reparto: 'Orologeria' },
  { id: 'b6', nome: 'Nord Milano', reparto: 'Argenteria' },
];
export const REPARTI = ['Gioielleria', 'Orologeria', 'Argenteria', 'Pelletteria', 'Altro'];

// Lo storage puo' non essere disponibile (navigazione privata di Safari, browser
// con i dati bloccati): li' setItem SOLLEVA un'eccezione. Senza protezione il clic
// sul cuore interrompeva il resto dello script.
export const salva = (chiave, valore) => {
  try { localStorage.setItem(chiave, valore); return true; } catch { return false; }
};
export const salvaSessione = (chiave, valore) => {
  try { sessionStorage.setItem(chiave, valore); return true; } catch { return false; }
};

// Conteggio ANONIMO delle azioni che contano: nessun cookie, nessun dato personale,
// solo "su questa pagina e' successa questa cosa". Serve al titolare per sapere se
// il sito lavora davvero, non per profilare chi naviga.
export function traccia(azione) {
  try {
    if (navigator.webdriver) return;
    if (['localhost', '127.0.0.1'].includes(location.hostname)) return;
    fetch(`/stats.php?p=${encodeURIComponent(location.pathname)}&e=${encodeURIComponent(azione)}`, { keepalive: true }).catch(() => {});
  } catch (_) {}
}

const LS_BRAND = 'mas-marchi';
// `null` = il titolare non ha ancora toccato nulla: mostro gli esempi.
export const leggiBrand = () => {
  try {
    const raw = localStorage.getItem(LS_BRAND);
    if (raw === null) return null;
    return JSON.parse(raw).filter((b) => b && b.id && b.nome);
  } catch { return null; }
};
export const scriviBrand = (a) => salva(LS_BRAND, JSON.stringify(a));
// quelli effettivamente da mostrare: i suoi se ci sono, altrimenti gli esempi
export const brandDaMostrare = () => leggiBrand() ?? BRAND_BASE;

// Voce della fascia marchi: stesso markup del render statico, cosi' non si notano stacchi.
export function brandVoce(b) {
  return `<li class="marca"><span class="marca-nome">${esc(b.nome)}</span><span class="marca-rep">${esc(b.reparto || '')}</span></li>`;
}

// ---------------------------------------------------------------- utilità
// I testi che finiscono dentro stringhe HTML vanno neutralizzati.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Lista desideri (solo su questo dispositivo): il cliente segna i pezzi che gli
// interessano e li manda in negozio su WhatsApp prima di passare.
const LS = 'mas-desideri';
export const leggiLista = () => { try { return JSON.parse(localStorage.getItem(LS) || '[]').filter((x) => x && x.id); } catch { return []; } };
export const scriviLista = (a) => salva(LS, JSON.stringify(a));

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
