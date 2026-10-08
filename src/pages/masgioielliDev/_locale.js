// MasGioielli senza database, come la bozza: quello che il negozio cambia dall'area riservata
// (selezione, orari, chiusure, marchi) resta in QUESTO browser (localStorage), e il sito lo
// legge da qui. Il negozio vede le sue modifiche solo sul dispositivo da cui le fa.
// L'area riservata parla con questo modulo come parlerebbe con un server (apiLocale), il
// sito ne legge i dati con datiLocali().
import { CATEGORIE, REPARTI, ORARI } from './_sito.js';

const P = 'masdev:';   // le chiavi della bozza /demoMasGioielli/ cominciano con "mas-": niente scontri
const SESSIONE = P + 'sessione';
const errore = (msg, stato = 400) => { throw Object.assign(new Error(msg), { stato }); };

// ---------------------------------------------------------------- archivio nel browser
const leggi = (k, def) => {
  try { const v = localStorage.getItem(P + k); return v === null ? def : JSON.parse(v); } catch { return def; }
};
const scrivi = (k, v) => {
  try { localStorage.setItem(P + k, JSON.stringify(v)); }
  catch { errore('Non c’è più spazio su questo dispositivo: togliete qualche pezzo e riprovate.', 507); }
};
const togli = (k) => { try { localStorage.removeItem(P + k); } catch { /* niente */ } };
const nuovoId = () => { const n = (leggi('id', 0) || 0) + 1; scrivi('id', n); return n; };
const adesso = () => new Date().toISOString();
const ieri = () => { const d = new Date(Date.now() - 86400000); return d.toISOString().slice(0, 10); };

// ---------------------------------------------------------------- controlli sui campi
const testo = (v, campo, max, obbligatorio = false, righe = false) => {
  if (v == null) v = '';
  if (typeof v !== 'string' && typeof v !== 'number') errore(`Campo «${campo}» non valido`, 422);
  let s = String(v).replace(/\r\n?/g, '\n').replace(righe ? /[^\P{C}\n]+/gu : /\p{C}+/gu, ' ');
  s = (righe ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ')).trim();
  if (obbligatorio && !s) errore(`Manca «${campo}»`, 422);
  if ([...s].length > max) errore(`«${campo}» è troppo lungo (massimo ${max} caratteri)`, 422);
  return s;
};
const intero = (v, campo) => {
  if (Number.isInteger(v)) return v;
  if (typeof v === 'string' && /^\d{1,9}$/.test(v)) return +v;
  return errore(`Campo «${campo}» non valido`, 422);
};
const dataIso = (v, campo) => {
  const ok = typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v + 'T12:00:00'));
  return ok ? v : errore(`Data «${campo}» non valida`, 422);
};

// ---------------------------------------------------------------- accesso
// Come nella bozza, utente e password stanno qui nel codice: senza server proteggono solo i
// dati di chi apre il pannello, che restano nel suo browser. Il repository e' pubblico:
// questa password non va usata per nient'altro.
export const UTENTE = 'admin';
export const PASSWORD = 'DnwR-YvkQ-bpPV-FkxJ';

// La password cambiata dal pannello vale solo su questo dispositivo (come tutto il resto) e
// si salva come impronta PBKDF2, non in chiaro.
const GIRI = 300000;
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
async function impronta(password, sale) {
  if (!crypto?.subtle) errore('Aprite l’area riservata da un indirizzo https', 503);
  const enc = new TextEncoder();
  const chiave = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(sale), iterations: GIRI, hash: 'SHA-256' }, chiave, 256));
}
async function passwordGiusta(utente, password) {
  if (utente !== UTENTE) return false;
  const cambiata = leggi('password', null);
  if (cambiata && cambiata.utente === UTENTE && cambiata.impronta) return (await impronta(password, cambiata.sale)) === cambiata.impronta;
  return password === PASSWORD;
}
const collegato = () => { try { return sessionStorage.getItem(SESSIONE); } catch { return null; } };
const richiediAccesso = () => collegato() || errore('Accesso scaduto: rientrate nell’area riservata', 401);

async function accesso(metodo, d) {
  if (metodo === 'GET') { const u = collegato(); return u ? { collegato: true, utente: u, csrf: 'locale' } : { collegato: false }; }
  if (metodo === 'DELETE') { richiediAccesso(); try { sessionStorage.removeItem(SESSIONE); } catch { /* niente */ } return { collegato: false }; }
  if (d.azione === 'password') {
    const u = richiediAccesso();
    const nuova = typeof d.nuova === 'string' ? d.nuova : '';
    if (nuova.length < 10) errore('La nuova password deve avere almeno 10 caratteri', 422);
    if (nuova.length > 200) errore('La nuova password è troppo lunga', 422);
    if (!(await passwordGiusta(u, typeof d.attuale === 'string' ? d.attuale : ''))) errore('La password attuale non è corretta', 403);
    const sale = hex(crypto.getRandomValues(new Uint8Array(16)));
    scrivi('password', { utente: u, sale, impronta: await impronta(nuova, sale) });
    return { ok: true };
  }
  const utente = testo(d.utente, 'utente', 60);
  if (!(await passwordGiusta(utente, typeof d.password === 'string' ? d.password : ''))) errore('Nome utente o password non corretti', 401);
  try { sessionStorage.setItem(SESSIONE, utente); } catch { errore('Questo browser non lascia salvare l’accesso: provate fuori dalla navigazione privata', 503); }
  return { collegato: true, utente, csrf: 'locale' };
}

// ---------------------------------------------------------------- selezione
// le foto stanno a parte (una chiave ciascuna): l'elenco resta leggero da riscrivere
const foto = (id) => leggi('foto:' + id, '');
const pezzi = () => leggi('pezzi', []).slice().sort((a, b) => a.ordine - b.ordine || a.id - b.id);
const elencoPezzi = () => pezzi().map((p) => ({ id: p.id, nome: p.nome, cat: p.cat, materiale: p.materiale, desc: p.desc, img: foto(p.id) }));

// La foto arriva gia' ridotta dall'area riservata (1600 px): qui scende a 1000 px, che bastano
// per la selezione e fanno stare una ventina di pezzi nello spazio del browser.
const ridotta = (blob) => new Promise((ok, ko) => {
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 1000 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    ok(c.toDataURL('image/jpeg', 0.82));
  };
  img.onerror = () => ko(Object.assign(new Error('Questa foto non si riesce ad aprire: provate con un’altra'), { stato: 422 }));
  img.src = URL.createObjectURL(blob);
});

async function selezione(metodo, d) {
  richiediAccesso();
  if (metodo === 'GET') return { pezzi: elencoPezzi() };
  const tutti = pezzi();
  switch (d.azione) {
    case 'crea':
    case 'modifica': {
      const campi = {
        nome: testo(d.nome, 'nome', 80, true),
        cat: testo(d.categoria, 'categoria', 30, true),
        materiale: testo(d.materiale, 'materiale', 120),
        desc: testo(d.descrizione, 'descrizione', 600, false, true),
      };
      if (!CATEGORIE.includes(campi.cat)) errore('Categoria non valida', 422);
      let img = null;
      if (d.foto instanceof Blob && d.foto.size) img = await ridotta(d.foto);
      else if (typeof d.immagine === 'string' && d.immagine.startsWith('data:image/')) img = d.immagine;   // «Annulla»
      if (d.azione === 'crea') {
        if (!img) errore('Manca la foto', 422);
        const id = nuovoId();
        scrivi('foto:' + id, img);
        // il pezzo nuovo va in cima
        scrivi('pezzi', [{ id, ...campi, ordine: Math.min(0, ...tutti.map((p) => p.ordine)) - 1 }, ...tutti]);
      } else {
        const id = intero(d.id, 'id');
        if (!tutti.some((p) => p.id === id)) errore('Questo pezzo non c’è più', 404);
        if (img) scrivi('foto:' + id, img);
        scrivi('pezzi', tutti.map((p) => (p.id === id ? { ...p, ...campi } : p)));
      }
      break;
    }
    case 'elimina': {
      const id = intero(d.id, 'id');
      scrivi('pezzi', tutti.filter((p) => p.id !== id));
      togli('foto:' + id);
      break;
    }
    case 'ordina': {
      if (!Array.isArray(d.ordine) || d.ordine.length > 500) errore('Ordine non valido', 422);
      const pos = new Map(d.ordine.map((id, i) => [intero(id, 'id'), i]));
      scrivi('pezzi', tutti.map((p) => (pos.has(p.id) ? { ...p, ordine: pos.get(p.id) } : p)));
      break;
    }
    default: errore('Azione non valida');
  }
  scrivi('agg', adesso());
  return { pezzi: elencoPezzi() };
}

// ---------------------------------------------------------------- orari e chiusure
// finche' il negozio non li salva valgono quelli di partenza, come nel database appena
// installato (orari_iniziali): con null il modulo mostrerebbe tutti i giorni chiusi
const statoOrari = () => ({
  orari: leggi('orari', null) ?? ORARI,
  chiusure: leggi('chiusure', []).filter((c) => c.al >= ieri()).sort((a, b) => a.dal.localeCompare(b.dal)),
});
const fasceValide = (f, g) => {
  if (f == null || (Array.isArray(f) && !f.length)) return null;
  if (!Array.isArray(f) || f.length > 2) errore(`Orario del giorno ${g} non valido`, 422);
  const out = [];
  for (const fascia of f) {
    const [a, b] = Array.isArray(fascia) && fascia.length === 2 ? fascia.map((x) => (typeof x === 'number' ? x : -1)) : [-1, -1];
    if (a < 0 || b > 24 || a >= b || (a * 4) % 1 || (b * 4) % 1) errore(`Orario del giorno ${g} non valido`, 422);
    if (out.length && a < out.at(-1)[1]) errore(`Orario del giorno ${g}: le fasce si sovrappongono`, 422);
    out.push([a, b]);
  }
  return out;
};
async function orari(metodo, d) {
  richiediAccesso();
  if (metodo === 'POST') {
    switch (d.azione) {
      case 'settimana': {
        if (!d.orari || typeof d.orari !== 'object') errore('Orari non validi', 422);
        const o = {};
        for (let g = 0; g <= 6; g++) o[g] = fasceValide(d.orari[g] ?? d.orari[String(g)] ?? null, g);
        scrivi('orari', o);
        break;
      }
      case 'chiusura': {
        const dal = dataIso(d.dal, 'dal');
        const al = dataIso(d.al || dal, 'al');
        if (al < dal) errore('La riapertura viene prima della chiusura', 422);
        if (al < ieri()) errore('Queste date sono già passate', 422);
        scrivi('chiusure', [...leggi('chiusure', []), { id: nuovoId(), dal, al, motivo: testo(d.motivo, 'motivo', 60) }]);
        break;
      }
      case 'elimina-chiusura': {
        const id = intero(d.id, 'id');
        scrivi('chiusure', leggi('chiusure', []).filter((c) => c.id !== id));
        break;
      }
      default: errore('Azione non valida');
    }
  }
  return statoOrari();
}

// ---------------------------------------------------------------- marchi
async function marchi(metodo, d) {
  richiediAccesso();
  let tutti = leggi('marchi', []);
  if (metodo === 'POST') {
    let campi = null;
    if (['crea', 'modifica', 'ripristina'].includes(d.azione)) {
      campi = { nome: testo(d.nome, 'nome', 60, true), reparto: testo(d.reparto, 'reparto', 30, true), nota: testo(d.nota, 'nota', 120) };
      if (!REPARTI.includes(campi.reparto)) errore('Reparto non valido', 422);
    }
    switch (d.azione) {
      case 'crea': tutti = [...tutti, { id: nuovoId(), ...campi }]; break;
      // torna nella posizione da cui era stato tolto
      case 'ripristina': tutti.splice(Math.min(Math.max(0, intero(d.posizione ?? 0, 'posizione')), tutti.length), 0, { id: nuovoId(), ...campi }); break;
      case 'modifica': { const id = intero(d.id, 'id'); tutti = tutti.map((m) => (m.id === id ? { ...m, ...campi } : m)); break; }
      case 'elimina': { const id = intero(d.id, 'id'); tutti = tutti.filter((m) => m.id !== id); break; }
      default: errore('Azione non valida');
    }
    scrivi('marchi', tutti);
  }
  return { marchi: tutti };
}

// ---------------------------------------------------------------- password dimenticata
// Senza server non parte nessuna email: si fa come se partisse, cosi' il percorso si vede tutto.
async function recupero(metodo, d) {
  if (d.azione === 'richiesta') { testo(d.utente, 'nome utente', 60, true); return { ok: true }; }
  return errore('Azione non valida');
}

// ---------------------------------------------------------------- ingresso
const PERCORSI = { accesso, pezzi: selezione, orari, marchi, recupero };

/** Le richieste dell'area riservata: apiLocale('pezzi', { json | form, metodo }). */
export async function apiLocale(percorso, { json, form, metodo } = {}) {
  const m = metodo || (json || form ? 'POST' : 'GET');
  const d = json || (form ? Object.fromEntries(form.entries()) : {});
  const f = PERCORSI[percorso] || (() => errore('Servizio non trovato', 404));
  return f(m, d);
}

/** I dati che le pagine del sito mostrano (selezione, orari, chiusure, marchi). */
export function datiLocali() {
  const o = statoOrari();
  return {
    pezzi: elencoPezzi().map((p) => ({ ...p, alt: p.nome })),
    aggiornato: leggi('agg', null),
    orari: o.orari,
    chiusure: o.chiusure.map(({ dal, al, motivo }) => ({ dal, al, motivo })),
    marchi: leggi('marchi', []).map(({ nome, reparto }) => ({ nome, reparto })),
  };
}
