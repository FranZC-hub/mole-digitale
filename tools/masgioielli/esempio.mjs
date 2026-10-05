// Dati d'ESEMPIO per vedere il sito "pieno" in locale: pezzi con foto, marchi, una
// chiusura straordinaria, qualche messaggio. Passano dall'API vera, come se li
// inserisse il negozio dall'area riservata (e i visitatori dai moduli).
// Li carica server-locale.mjs --esempio su un database appena creato. H e' l'indirizzo del
// sito, cartella compresa (es. http://127.0.0.1:8090/demoClientiDev/masgioielli).
// Non partono mai verso un server che non sia questo computer.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const FOTO = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'esempio');

// Pezzi e foto della bozza vista dal negozio. In ordine di vetrina (il primo in alto).
const PEZZI = [
  { foto: 'solitario.webp', nome: 'Solitario ovale', categoria: 'Anelli', materiale: 'Oro bianco 18kt · diamante taglio ovale', descrizione: 'Diamante ovale su gambo pavé, con contorno nascosto sotto la pietra. L’anello di fidanzamento che scegliamo insieme, misura compresa.' },
  { foto: 'veretta.webp', nome: 'Veretta rubini e diamanti', categoria: 'Anelli', materiale: 'Oro giallo 18kt · rubini navette e diamanti', descrizione: 'Rubini a navette alternati a diamanti, tutt’intorno. Si porta da sola o affiancata alla fede: un colore che si nota senza gridare.' },
  { foto: 'cronografo.webp', nome: 'Cronografo automatico', categoria: 'Orologi', materiale: 'Acciaio · movimento automatico', descrizione: 'Cronografo a tre contatori, vetro zaffiro e impermeabilità 100 m. Revisionato e garantito dal nostro laboratorio di orologeria.' },
  { foto: 'goccia.webp', nome: 'Collana con stella', categoria: 'Collane', materiale: 'Oro bianco · rubini, zaffiri e diamanti', descrizione: 'Pendente a rosetta con stella centrale in pavé di diamanti, rubini e zaffiri calibrati; girocollo con stelle. Pezzo unico da vedere dal vivo.' },
  { foto: 'intreccio.webp', nome: 'Fedi su misura', categoria: 'Anelli', materiale: 'Oro giallo e oro bianco 18kt · la coppia', descrizione: 'Le facciamo noi, in laboratorio: scegliete profilo, larghezza e finitura, e le incidiamo con la data o quello che volete.' },
  { foto: 'diver.webp', nome: 'Diver 300 m', categoria: 'Orologi', materiale: 'Acciaio · ghiera unidirezionale', descrizione: 'Subacqueo con lunetta girevole e quadrante luminescente. Bracciale accorciato su misura in negozio.' },
  { foto: 'pendenti.webp', nome: 'Orecchino d’epoca', categoria: 'Orecchini', materiale: 'Oro · granato e perline · restaurato in laboratorio', descrizione: 'Gioiello antico con castone decorato, tornato indossabile dopo il restauro conservativo fatto al nostro banco.' },
  { foto: 'solotempo.webp', nome: 'Solo tempo essenziale', categoria: 'Orologi', materiale: 'Acciaio · cinturino in pelle', descrizione: 'Quadrante pulito, cassa sottile: l’orologio da portare sempre, sotto qualsiasi camicia.' },
  { foto: 'tasca.webp', nome: 'Orologio da tasca d’epoca', categoria: 'Orologi', materiale: 'Argento · carica manuale', descrizione: 'Pezzo d’epoca restaurato nel nostro laboratorio di pendoleria. Meccanica revisionata, funzionante e garantita.' },
];

// Nomi INVENTATI (come nella bozza): il negozio mettera' i marchi che tratta davvero.
const MARCHI = [
  { nome: 'Àuria', reparto: 'Gioielleria' },
  { nome: 'Vermeil', reparto: 'Gioielleria' },
  { nome: 'Orsini 1912', reparto: 'Gioielleria' },
  { nome: 'Tempo Reale', reparto: 'Orologeria' },
  { nome: 'Cassia', reparto: 'Orologeria' },
  { nome: 'Nord Milano', reparto: 'Argenteria' },
];

// Persone inventate, indirizzi email del dominio riservato agli esempi (example.com).
const MESSAGGI = [
  { tipo: 'perizia', nome: 'Laura Esempio', telefono: '333 000 0001', email: 'laura@example.com', motivo: 'Successione', pezzi: '4–10', dove: 'In una cassetta di sicurezza', note: 'Sono gioielli di mia nonna, servirebbe la perizia per la successione. Possiamo vederci in banca?', letto: false },
  { tipo: 'contatti', nome: 'Marco Prova', telefono: '333 000 0002', email: '', argomento: 'Una riparazione', messaggio: 'Buongiorno, il mio automatico si ferma dopo poche ore. Posso portarlo sabato mattina?', letto: false },
  { tipo: 'contatti', nome: 'Giulia Campione', telefono: '', email: 'giulia@example.com', argomento: 'Informazioni su un gioiello', messaggio: 'Il solitario ovale è ancora disponibile? Vorrei vederlo la prossima settimana.', letto: true },
];

const giorno = (tra) => { const d = new Date(); d.setDate(d.getDate() + tra); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export async function caricaEsempio(H, utente, password) {
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(H).hostname)) throw new Error('I dati d’esempio si caricano solo in locale');

  let cookie = '', csrf = '';
  const chiama = async (percorso, { json, form, metodo = 'POST' } = {}) => {
    const h = {};
    if (cookie) h.Cookie = cookie;
    if (csrf) h['X-CSRF-Token'] = csrf;
    if (json) h['Content-Type'] = 'application/json';
    const r = await fetch(H + percorso, { method: metodo, headers: h, body: json ? JSON.stringify(json) : form });
    const sc = r.headers.get('set-cookie');
    if (sc) cookie = sc.split(';')[0];
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`${percorso}: ${r.status} ${d.errore || ''}`);
    return d;
  };

  // prima i messaggi, come visitatori (senza accesso)
  for (const { letto, ...m } of MESSAGGI) await chiama('/api/messaggio.php', { json: { ...m, privacy: true, aperto: Date.now() - 60000 } });

  csrf = (await chiama('/api/accesso.php', { json: { utente, password } })).csrf;

  // i pezzi nuovi vanno in cima: si caricano dall'ultimo al primo
  for (const p of [...PEZZI].reverse()) {
    const f = new FormData();
    f.append('azione', 'crea');
    for (const k of ['nome', 'categoria', 'materiale', 'descrizione']) f.append(k, p[k]);
    f.append('foto', new Blob([readFileSync(join(FOTO, p.foto))], { type: 'image/webp' }), p.foto);
    await chiama('/api/pezzi.php', { form: f });
  }
  for (const m of MARCHI) await chiama('/api/marchi.php', { json: { azione: 'crea', ...m } });
  // una chiusura fra due settimane: si vede l'avviso in home e nell'area riservata
  await chiama('/api/orari.php', { json: { azione: 'chiusura', dal: giorno(14), al: giorno(16), motivo: 'inventario' } });

  const { messaggi = [] } = await chiama('/api/messaggi.php', { metodo: 'GET' });
  for (const m of messaggi.filter((x) => MESSAGGI.find((e) => e.letto && e.nome === x.nome))) await chiama('/api/messaggi.php', { json: { azione: 'letto', id: m.id } });

  return { pezzi: PEZZI.length, marchi: MARCHI.length, messaggi: MESSAGGI.length };
}
