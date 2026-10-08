// Dati e funzioni comuni del sito MasGioielli.
// I contenuti che il negozio cambia da solo (selezione, orari, chiusure, marchi) stanno nel
// browser (localStorage, _locale.js); quelli qui sotto sono i valori di partenza usati
// nell'HTML statico, cosi' la pagina e' completa anche prima di leggerli.

// Il sito vive in una sottocartella di moledigitale.it (versione reale, in sviluppo):
// tutti gli indirizzi interni partono da qui.
export const BASE = '/masgioielliDev/';

export const INFO = {
  nome: 'MasGioielli',
  fondata: 1996,
  fondatore: 'Massimo Mussa',
  inaugurazione: '16 marzo 1996',
  // Registro degli operatori compro oro (OAM): DA INSERIRE prima della pubblicazione
  oam: '',
  via: 'Corso Trapani 146/b',
  citta: 'Torino',
  cap: '10141',
  tel: '011 331725',
  telHref: '+39011331725',
  wa: '393385386701',
  waLabel: '338 538 6701',
  email: 'info@masgioielli.it',
  piva: '12754900012',
  fb: 'https://www.facebook.com/masgioielli',
  ig: 'https://www.instagram.com/masgioielli/',
  // DA VERIFICARE prima della pubblicazione (vengono dal vecchio sito)
  stelle: '4,9',
  recensioni: 200,
  recensioniUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('MasGioielli Corso Trapani 146 Torino'),
};

// ---------------------------------------------------------------- dati del negozio
// Letti una volta per pagina, condivisi da tutte le parti che ne hanno bisogno.
let promessa = null;
let DATI = null;
export function caricaDati() {
  if (!promessa) {
    promessa = import('./_locale.js').then((m) => m.datiLocali())
      .catch(() => null)
      .then((d) => { DATI = d && typeof d === 'object' ? d : null; return DATI; });
  }
  return promessa;
}

// ---------------------------------------------------------------- orari
// Ore in decimale: .5 = 30 minuti (9.5 = 9:30). Orario di partenza del negozio.
export const ORARI = {
  0: null,
  1: null,
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

const fasciaOk = (f) => Array.isArray(f) && f.length === 2 && f.every((x) => typeof x === 'number' && x >= 0 && x <= 24) && f[0] < f[1];
/** Gli orari in vigore: quelli salvati dal negozio se ci sono e sono validi, altrimenti quelli di partenza. */
export function orariAttivi(dati = DATI) {
  const o = dati?.orari;
  if (!o || typeof o !== 'object') return ORARI;
  const out = {};
  for (let i = 0; i < 7; i++) { const g = o[i] ?? o[String(i)]; out[i] = Array.isArray(g) && g.length && g.every(fasciaOk) ? g : null; }
  return out;
}

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
export function orariPiede(o = ORARI) {
  const g = gruppi(o);
  const chiusi = SETTIMANA.filter((i) => !o[i]).map((i) => GIORNI[i]);
  const elenco = chiusi.length > 1 ? chiusi.slice(0, -1).join(', ') + ' e ' + chiusi.at(-1).toLowerCase() : chiusi[0] || '';
  return {
    aperti: g.filter((x) => x.lab).map((x) => ({ giorni: x.giorni, orario: x.lab })),
    chiusi: elenco ? `${elenco.charAt(0) + elenco.slice(1).toLowerCase()} ${chiusi.length > 1 ? 'chiusi' : 'chiuso'}` : '',
  };
}
// "martedì – sabato, 9:30 – 12:30 e 15:30 – 19:30"
export function orariInRiga(o = ORARI) {
  return gruppi(o).filter((x) => x.lab).map((x) => `${x.giorni.toLowerCase()}, ${x.lab.replace(' · ', ' e ')}`).join('; ');
}
export function piedeHTML(o = ORARI) {
  const p = orariPiede(o);
  return p.aperti.map((x) => `<p class="chiusura-sp">${x.giorni}</p><p>${x.orario}</p>`).join('') + (p.chiusi ? `<p class="chiusura-muto">${p.chiusi}</p>` : '');
}

// ---- chiusure straordinarie: giorni interi, "dal" e "al" compresi
export const isoGiorno = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dataOk = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
export function chiusureAttive(dati = DATI) {
  return (Array.isArray(dati?.chiusure) ? dati.chiusure : [])
    .filter((c) => c && dataOk(c.dal) && dataOk(c.al) && c.dal <= c.al)
    .sort((x, y) => x.dal.localeCompare(y.dal));
}
export const chiusuraDel = (giorno, ch) => ch.find((c) => giorno >= c.dal && giorno <= c.al) || null;
const giornoMese = (s) => new Date(s + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
export const periodo = (c) => (c.dal === c.al ? `il ${giornoMese(c.dal)}` : `dal ${giornoMese(c.dal)} al ${giornoMese(c.al)}`);
const fasceDel = (data, O, ch) => (chiusuraDel(isoGiorno(data), ch) ? null : O[data.getDay()]);

/** "Aperto ora" e l'elenco degli orari, con le chiusure straordinarie. */
export function renderOrari(listEl, statoEl, dati = DATI) {
  const O = orariAttivi(dati), ch = chiusureAttive(dati);
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const chiusaOggi = chiusuraDel(isoGiorno(now), ch);
  const fasce = fasceDel(now, O, ch);
  const aperto = !!fasce && fasce.some(([a, b]) => t >= a && t < b);
  if (statoEl) {
    if (aperto) {
      statoEl.textContent = `Aperto ora · fino alle ${fmt(fasce.find(([a, b]) => t >= a && t < b)[1])}`;
    } else {
      // prossima apertura: oggi piu' tardi, altrimenti il primo giorno aperto nelle
      // prossime otto settimane, saltando ferie e chiusure
      const dopo = fasce?.find(([a]) => t < a);
      if (dopo) statoEl.textContent = `Chiuso ora · riapre alle ${fmt(dopo[0])}`;
      else {
        let k = 1, g = null;
        for (; k <= 56; k++) { g = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k); if (fasceDel(g, O, ch)) break; }
        const prefisso = chiusaOggi ? `Chiuso${chiusaOggi.motivo ? ' per ' + chiusaOggi.motivo : ''}` : 'Chiuso ora';
        if (k > 56) statoEl.textContent = 'Chiuso';
        else {
          const quando = k === 1 ? 'domani' : k < 7 ? GIORNI[g.getDay()].toLowerCase() : `${GIORNI[g.getDay()].toLowerCase()} ${giornoMese(isoGiorno(g))}`;
          statoEl.textContent = `${prefisso} · riapre ${quando} alle ${fmt(fasceDel(g, O, ch)[0][0])}`;
        }
      }
    }
    statoEl.parentElement?.classList.toggle('is-closed', !aperto);
  }
  if (listEl) {
    const oggi = isoGiorno(now), fra30 = isoGiorno(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30));
    const avvisi = ch.filter((c) => c.al >= oggi && c.dal <= fra30);
    listEl.innerHTML = orariSettimana(O)
      .map(({ i, giorno, label }) => `<li class="${i === d && !chiusaOggi ? 'oggi' : ''}"><span>${giorno}</span><b>${label}</b></li>`)
      .join('') + avvisi.map((c) => `<li class="chiusura-avviso"><span>Chiuso${c.motivo ? ' per ' + esc(c.motivo) : ''}</span><b>${periodo(c)}</b></li>`).join('');
  }
}

// ---------------------------------------------------------------- selezione e marchi
export const CATEGORIE = ['Anelli', 'Collane', 'Orecchini', 'Bracciali', 'Orologi', 'Argenteria', 'Altro'];
export const REPARTI = ['Gioielleria', 'Orologeria', 'Argenteria', 'Pelletteria', 'Altro'];

export const pezziAttivi = (dati = DATI) => (Array.isArray(dati?.pezzi) ? dati.pezzi.filter((x) => x && x.id && x.nome && x.img) : []);
export const marchiAttivi = (dati = DATI) => (Array.isArray(dati?.marchi) ? dati.marchi.filter((m) => m && m.nome) : []);
export const dataEstesa = (d) => new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
// l'id nel DOM e nell'indirizzo: "p12" (un id che comincia con una cifra non va bene nei selettori)
export const idPezzo = (x) => 'p' + x.id;

export function pezzoHTML(x) {
  const e = esc;
  return `<article class="pezzo" id="${e(idPezzo(x))}" data-id="${e(x.id)}" data-nome="${e(x.nome)}" data-cat="${e(x.cat)}" data-img="${e(x.img)}" data-alt="${e(x.alt || x.nome)}" data-materiale="${e(x.materiale || '')}" data-desc="${e(x.desc || '')}">
    <div class="pezzo-foto"><img src="${e(x.img)}" width="640" height="800" alt="${e(x.alt || x.nome)}" loading="lazy" />
      <button type="button" class="segna" aria-label="Segna ${e(x.nome)} nella tua lista"><span class="segna-ic" aria-hidden="true">♡</span></button></div>
    <p class="pezzo-cat">${e(x.cat)}</p>
    <h3><button type="button" class="pezzo-apri" aria-haspopup="dialog">${e(x.nome)}</button></h3>
    <p class="pezzo-mat">${e(x.materiale || '')}</p>
  </article>`;
}
export function railHTML(x) {
  const e = esc;
  return `<a class="rail-el" href="${BASE}selezione/#${e(idPezzo(x))}"><div class="rail-foto"><img src="${e(x.img)}" width="640" height="800" alt="${e(x.alt || x.nome)}" loading="lazy" /></div><p class="rail-cat">${e(x.cat)}</p><p class="rail-nome">${e(x.nome)}</p></a>`;
}
export function marcaHTML(b) {
  return `<li class="marca"><span class="marca-nome">${esc(b.nome)}</span><span class="marca-rep">${esc(b.reparto || '')}</span></li>`;
}

// ---------------------------------------------------------------- utilità
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Lo storage puo' mancare (navigazione privata, dati bloccati): mai far cadere lo script.
export const salva = (chiave, valore) => { try { localStorage.setItem(chiave, valore); return true; } catch { return false; } };

// Lista desideri: resta solo sul dispositivo del visitatore finche' non la manda su WhatsApp.
const LS = 'mas-desideri';
export const leggiLista = () => { try { return JSON.parse(localStorage.getItem(LS) || '[]').filter((x) => x && x.id); } catch { return []; } };
export const scriviLista = (a) => salva(LS, JSON.stringify(a));

/** Moduli Contatti e Perizie: senza server non parte nessuna email, e meglio dirlo che
 *  fingere di averla mandata. */
export async function inviaMessaggio() {
  return { ok: false, errore: `Questa è la versione di prova, senza server: il messaggio non parte. Scriveteci su WhatsApp al ${INFO.waLabel} o chiamate lo ${INFO.tel}.` };
}

// Modale accessibile: Escape, focus intrappolato, sfondo inerte.
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
