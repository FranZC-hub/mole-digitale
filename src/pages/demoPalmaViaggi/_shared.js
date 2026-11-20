// Condiviso dalla bozza Palma Viaggi: dati dell'agenzia, orari, gite e partenze, biglietti,
// prenotazioni e memoria del pannello di gestione.
//
// DATI PUBBLICI (sito palmaviaggi.com, novembre 2026): ragione sociale, P.IVA, indirizzo, telefoni,
// email, orari, servizi, la storia (Bus Number One), il comfort del pullman, lo sconto del 10% per
// chi prenota due mesi prima, il minimo di 35 partecipanti, i punti di salita (Beinasco, Pianezza,
// Torino «e altri da concordare»), le mete in calendario (Annecy, Lugano, Ginevra, laghi Maggiore e
// d'Iseo, Ceresole, Lillaz e Aosta, Sale San Giovanni, Ferragosto) e i paesi (Francia, Svizzera,
// Repubblica Ceca, Malta, Marocco).
// Il sito scrive il cellulare «+324.8017979»: +32 è il Belgio. Il numero è 324 801 7979.
//
// D'ESEMPIO, da sostituire con quelli veri: date, iscritti, orari di salita, programmi e i prezzi
// dei viaggi di più giorni. I prezzi delle gite in giornata sono quelli del loro calendario 2020.

export const INFO = {
  nome: 'Palma Viaggi',
  societa: 'Palma Viaggi di El Khayati Abderrahman',
  titolare: 'Abderrahman El Khayati',
  piva: '10185040010',
  via: 'Corso Torino 54',
  cap: '10090',
  citta: 'Buttigliera Alta',
  prov: 'TO',
  tel: '324 801 7979',
  telHref: '+393248017979',
  wa: '393248017979',          // ⚠️ da confermare: è anche il numero WhatsApp?
  telSera: '373 720 9979',
  telSeraHref: '+393737209979',
  email: 'palmaviaggi@gmail.com',
  facebook: 'https://www.facebook.com/palmaviaggi/',
  instagram: 'https://www.instagram.com/palmaviaggitour/',
};
INFO.indirizzo = `${INFO.via}, ${INFO.cap} ${INFO.citta} (${INFO.prov})`;
INFO.maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`Palma Viaggi, ${INFO.via}, ${INFO.cap} ${INFO.citta} ${INFO.prov}`);
INFO.mapsEmbed = 'https://www.google.com/maps?q=' + encodeURIComponent(`${INFO.via}, ${INFO.cap} ${INFO.citta} ${INFO.prov}`) + '&output=embed';

export const BASE = '/demoPalmaViaggi/';
export const IMG = '/img/palmaviaggi/';

// Foto in due larghezze (public/img/palmaviaggi): la piccola per i biglietti e i telefoni.
// La misura di mezzo serve ai telefoni ad alta densità: senza, scaricavano la 1200.
const MEZZO = { 1200: 800, 1000: 760 };
export const foto = (k, grande = 1200, piccola = 600) => ({
  src: `${IMG}${k}-${grande}.webp`,
  srcset: [piccola, MEZZO[grande], grande].filter(Boolean).map((w) => `${IMG}${k}-${w}.webp ${w}w`).join(', '),
});

// ---------------------------------------------------------------- regole delle gite
// Dal loro sito: «partenza garantita con minimo 35 partecipanti», pullman GT da 54 posti,
// «sconto del 10% per chi prenota fino a due mesi prima della partenza».
export const REGOLE = { posti: 54, minimo: 35, sconto: 0.1, mesiAnticipo: 2 };

// ---------------------------------------------------------------- orari dell'agenzia
// Ore decimali. Dal sito: lunedì solo pomeriggio, sabato solo mattina, domenica chiuso.
export const ORARI = {
  0: null,
  1: [[15, 19]],
  2: [[9, 13], [15, 19]],
  3: [[9, 13], [15, 19]],
  4: [[9, 13], [15, 19]],
  5: [[9, 13], [15, 19]],
  6: [[9, 13]],
};
export const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
export const fmtOra = (h) => `${Math.floor(h)}:${String(Math.round((h - Math.floor(h)) * 60)).padStart(2, '0')}`;

export function orariSettimana() {
  return [1, 2, 3, 4, 5, 6, 0].map((i) => ({
    i, giorno: GIORNI[i],
    label: ORARI[i] ? ORARI[i].map(([a, b]) => `${fmtOra(a)}–${fmtOra(b)}`).join(' · ') : 'Chiuso',
  }));
}

// Giorni consecutivi con lo stesso orario raggruppati: «Martedì–venerdì 9:00–13:00 · 15:00–19:00»
export function orariCompatti() {
  const sett = orariSettimana();
  const gruppi = [];
  sett.forEach((g) => {
    const u = gruppi[gruppi.length - 1];
    if (u && u.label === g.label) u.fine = g.i; else gruppi.push({ inizio: g.i, fine: g.i, label: g.label });
  });
  return gruppi.map((g) => ({
    giorni: g.inizio === g.fine ? GIORNI[g.inizio] : `${GIORNI[g.inizio]}–${GIORNI[g.fine].toLowerCase()}`,
    orario: g.label,
  }));
}

// «Aperta ora», calcolato sul momento, con la prossima apertura quando è chiusa.
export function statoOra(now = new Date()) {
  const d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
  const f = ORARI[d];
  const dentro = f && f.find(([a, b]) => t >= a && t < b);
  if (dentro) return { aperta: true, testo: `Aperta ora · fino alle ${fmtOra(dentro[1])}` };
  const dopo = f && f.find(([a]) => t < a);
  if (dopo) return { aperta: false, testo: `Chiusa ora · riapre alle ${fmtOra(dopo[0])}` };
  let k = 1;
  while (k <= 7 && !ORARI[(d + k) % 7]) k++;
  const g = (d + k) % 7;
  return { aperta: false, testo: `Chiusa ora · riapre ${k === 1 ? 'domani' : GIORNI[g].toLowerCase()} alle ${fmtOra(ORARI[g][0][0])}` };
}

// ---------------------------------------------------------------- date e prezzi
export const isoLocale = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const daIso = (ymd) => new Date(ymd + 'T12:00:00');
const fmtD = (ymd, o) => daIso(ymd).toLocaleDateString('it-IT', o);
export const dataBreve = (ymd) => fmtD(ymd, { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
export const dataMedia = (ymd) => fmtD(ymd, { day: 'numeric', month: 'long' });
export const dataLunga = (ymd) => fmtD(ymd, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const nomeMese = (ym) => { const s = daIso(ym + '-15').toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }); return s[0].toUpperCase() + s.slice(1); };
export const aggiungiGiorni = (ymd, n) => { const d = daIso(ymd); d.setDate(d.getDate() + n); return isoLocale(d); };

// L'ultimo giorno utile per lo sconto: la stessa data, due mesi prima (31 dicembre → 31 ottobre;
// 30 aprile → 28 febbraio).
export function scadenzaSconto(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  const mi = m - 1 - REGOLE.mesiAnticipo;
  const ultimo = new Date(y, mi + 1, 0).getDate();
  return isoLocale(new Date(y, mi, Math.min(d, ultimo), 12));
}

const EURO0 = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const EURO2 = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
export const euro = (n) => (Number.isInteger(n) ? EURO0 : EURO2).format(n);
export const arrotonda = (n) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------- le gite
// `salita`: da che parte si esce da Torino, che decide l'ordine dei punti di salita.
//   valsusa  verso il Fréjus: Buttigliera Alta è l'ultima fermata prima dell'autostrada
//   sud      verso l'A6 e l'A21: Beinasco, vicino alla tangenziale sud, è l'ultima
//   nord     verso l'A4 e l'A5: Torino è l'ultima
//   aeroporto i viaggi in aereo: navetta per l'aeroporto
// `ora`: partenza dalla prima fermata. `sconto: false` dove il prezzo dipende dal volo.
const COMPRENDE_GITA = [
  'Viaggio in pullman Gran Turismo, con i nostri autisti',
  'Accompagnatore Palma Viaggi per tutta la giornata',
  'Assicurazione medico-bagaglio',
];
const NON_COMPRENDE_GITA = [
  'Pranzo e pasti non indicati',
  'Ingressi, battelli e funivie, se non indicati',
  'Mance ed extra personali',
  'Tutto quello che non è scritto in «La quota comprende»',
];
const DOC_ITALIA = 'Un documento d’identità valido.';
const DOC_ESTERO = 'Carta d’identità valida per l’espatrio, anche per i minori. Porta la tessera sanitaria: sul retro c’è la tessera europea (TEAM), che dà accesso alle cure pubbliche nei paesi dell’Unione europea.';
const DOC_SVIZZERA = 'Carta d’identità valida per l’espatrio, anche per i minori. La Svizzera non è nell’Unione europea: alla dogana ci sono limiti per carne, formaggi e alcolici. La tessera sanitaria europea (TEAM) vale anche lì.';

export const GITE = [
  {
    id: 'annecy', titolo: 'Annecy e il mercatino di Natale', breve: 'La «Venezia delle Alpi» tra canali, luci e casette di legno',
    paese: 'Francia', temi: ['mercatini'], giorni: 1, mezzo: 'pullman', prezzo: 49, img: 'annecy',
    alt: 'Il Palais de l’Isle sul canale del Thiou ad Annecy, la sera, con le luci accese',
    intro: 'Annecy è una cittadina dell’Alta Savoia, sul lago che porta il suo nome: canali, ponticelli fioriti e la vecchia prigione sull’isolotto, il Palais de l’Isle. A dicembre il centro storico si riempie di casette di legno e di luci: vin brulé, formaggi di Savoia, idee regalo.',
    salienti: ['Il centro storico e il Palais de l’Isle', 'Il mercatino di Natale lungo i canali', 'Il lungolago e i Giardini dell’Europa', 'Tempo libero per assaggiare la cucina di Savoia'],
    salita: 'valsusa', ora: '6:00',
    programma: [
      { ora: '6:00', t: 'Partenza', d: 'Dai punti di salita verso il traforo del Fréjus. Sosta per la colazione lungo la strada.' },
      { ora: '10:30', t: 'Arrivo ad Annecy', d: 'Passeggiata con l’accompagnatore nel centro storico: i canali, il Palais de l’Isle, il lungolago.' },
      { ora: '12:30', t: 'Pranzo libero e mercatino', d: 'Tempo libero tra le casette del mercatino di Natale. Al pranzo pensi tu: tartiflette e fonduta sono a ogni angolo.' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per l’Italia, con una sosta lungo la strada. Arrivo previsto verso le 21.' },
    ],
    documento: DOC_ESTERO,
  },
  {
    id: 'lugano', titolo: 'Lugano: museo del cioccolato e mercatino di Natale', breve: 'Il cioccolato svizzero al mattino, le luci della città sul lago al pomeriggio',
    paese: 'Svizzera', temi: ['mercatini'], giorni: 1, mezzo: 'pullman', prezzo: 35, img: 'lugano',
    alt: 'Il grande albero di Natale illuminato davanti al municipio di Lugano, di sera',
    intro: 'La mattina, sul lago di Lugano, al museo del cioccolato: come si passa dalla fava di cacao alla tavoletta, con l’assaggio alla fine. Il pomeriggio a Lugano, tra piazza della Riforma con il suo grande albero, il lungolago e le bancarelle del mercatino nel centro.',
    salienti: ['Il museo del cioccolato, con assaggio', 'Piazza della Riforma e il grande albero', 'Le bancarelle del mercatino nel centro', 'Il lungolago al tramonto'],
    salita: 'nord', ora: '6:30',
    programma: [
      { ora: '6:30', t: 'Partenza', d: 'Dai punti di salita verso Milano e Chiasso. Sosta per la colazione.' },
      { ora: '9:45', t: 'Museo del cioccolato', d: 'Visita al museo, sul lago: la storia del cacao, la produzione, l’assaggio. Chi vuole fa scorta allo spaccio.' },
      { ora: '12:00', t: 'Lugano', d: 'Pranzo libero in centro, poi tempo libero tra le bancarelle e il lungolago.' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 20.' },
    ],
    nonComprende: ['Ingresso al museo del cioccolato (in franchi, si paga sul posto)', ...NON_COMPRENDE_GITA.slice(0, 1), ...NON_COMPRENDE_GITA.slice(2)],
    documento: DOC_SVIZZERA,
  },
  {
    id: 'aosta', titolo: 'Aosta e il Marché Vert Noël', breve: 'Il villaggio alpino del Natale, dentro la «Roma delle Alpi»',
    paese: 'Valle d’Aosta', temi: ['mercatini'], giorni: 1, mezzo: 'pullman', prezzo: 25, img: 'aosta',
    alt: 'L’Arco di Augusto ad Aosta, con le montagne sullo sfondo',
    intro: 'Un’ora e mezza di strada e si è nella «Roma delle Alpi»: l’Arco di Augusto, la Porta Pretoria, il Teatro romano. A dicembre, proprio accanto al teatro, apre il Marché Vert Noël: un villaggio di chalet di legno con l’artigianato valdostano, la fontina, la mocetta e il vin brulé.',
    salienti: ['Il Marché Vert Noël, accanto al Teatro romano', 'L’Arco di Augusto e la Porta Pretoria', 'Artigianato e prodotti valdostani', 'Poca strada: si torna per cena'],
    salita: 'nord', ora: '7:30',
    programma: [
      { ora: '7:30', t: 'Partenza', d: 'Dai punti di salita, in autostrada verso la Valle d’Aosta.' },
      { ora: '9:30', t: 'Aosta romana', d: 'Passeggiata con l’accompagnatore: l’Arco di Augusto, la Porta Pretoria, il Teatro romano, la via Sant’Anselmo.' },
      { ora: '12:00', t: 'Pranzo libero e mercatino', d: 'Il pomeriggio è per il Marché Vert Noël e per gli acquisti in centro.' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 19.' },
    ],
    documento: DOC_ITALIA,
  },
  {
    id: 'alsazia', titolo: 'Strasburgo e Colmar, i mercatini d’Alsazia', breve: 'Due giorni nella capitale del Natale e nella sua cartolina più bella',
    paese: 'Francia', temi: ['mercatini'], giorni: 2, mezzo: 'pullman', prezzo: 229, singola: 40, img: 'alsazia',
    alt: 'Case a graticcio con le luci di Natale nel centro di Colmar',
    intro: 'Il Natale in Alsazia è una cosa seria. Strasburgo si chiama da sé «Capitale del Natale» e il suo mercatino è tra i più antichi d’Europa; Colmar, a un’ora di strada, è tutta case a graticcio colorate e canali, la Petite Venise. Due giorni con una notte in hotel.',
    salienti: ['Colmar e la Petite Venise illuminate', 'Il mercatino di Strasburgo, ai piedi della cattedrale', 'La Petite France e i suoi canali', 'Hotel con colazione e la cena del primo giorno'],
    salita: 'valsusa', ora: '5:00',
    programma: [
      { giorno: 1, t: 'Torino – Colmar', d: 'Partenza all’alba verso il Fréjus e la Svizzera, con le soste lungo la strada. Primo pomeriggio a Colmar: il centro storico, la Petite Venise e i mercatini. Cena e notte in hotel.' },
      { giorno: 2, t: 'Strasburgo – Torino', d: 'Mattina a Strasburgo: la cattedrale, la Petite France, il grande mercatino di piazza Broglie. Pranzo libero e, nel primo pomeriggio, partenza per l’Italia. Arrivo in tarda serata.' },
    ],
    comprende: ['Viaggio in pullman Gran Turismo, con i nostri autisti', 'Accompagnatore Palma Viaggi per i due giorni', 'Una notte in hotel 3 stelle, con colazione', 'Cena del primo giorno', 'Assicurazione medico-bagaglio'],
    nonComprende: ['Pranzi e bevande', 'Tassa di soggiorno, da pagare in hotel', 'Ingressi e mance', 'Supplemento camera singola', 'Tutto quello che non è scritto in «La quota comprende»'],
    documento: DOC_ESTERO,
  },
  {
    id: 'mentone', titolo: 'Mentone, la Festa dei Limoni', breve: 'Sculture giganti di agrumi e i carri del Corso dei frutti d’oro',
    paese: 'Francia', temi: ['feste'], giorni: 1, mezzo: 'pullman', prezzo: 45, img: 'mentone',
    alt: 'Un leone e due giraffe giganti fatti di limoni e arance nei giardini di Mentone',
    intro: 'Ogni febbraio Mentone, l’ultima città francese prima del confine, costruisce sculture giganti con tonnellate di limoni e arance. Nei giardini Biovès si passeggia tra le opere; sul lungomare sfilano i carri del Corso dei frutti d’oro, con bande e gruppi in costume.',
    salienti: ['Le sculture di agrumi nei giardini Biovès', 'Il Corso dei frutti d’oro sul lungomare', 'Il centro storico affacciato sul mare', 'Una giornata di sole in pieno inverno'],
    salita: 'sud', ora: '6:00',
    programma: [
      { ora: '6:00', t: 'Partenza', d: 'Dai punti di salita verso Savona e la Riviera. Sosta per la colazione.' },
      { ora: '10:00', t: 'I giardini Biovès', d: 'Arrivo a Mentone e passeggiata tra le sculture di agrumi.' },
      { ora: '12:00', t: 'Pranzo libero', d: 'In centro o sul lungomare.' },
      { ora: '14:30', t: 'Corso dei frutti d’oro', d: 'La sfilata dei carri sul lungomare: biglietto per le tribune facoltativo, da prenotare con la gita.' },
      { ora: '17:30', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 21.' },
    ],
    nonComprende: ['Biglietto per i giardini e per le tribune del corso (facoltativo, lo prenotiamo noi)', ...NON_COMPRENDE_GITA.slice(0, 1), ...NON_COMPRENDE_GITA.slice(2)],
    documento: DOC_ESTERO,
  },
  {
    id: 'praga', titolo: 'Praga, la città d’oro', breve: 'Quattro giorni tra il Castello, il ponte Carlo e la Città Vecchia',
    paese: 'Repubblica Ceca', temi: ['citta'], giorni: 4, mezzo: 'pullman', prezzo: 449, singola: 120, img: 'praga',
    alt: 'Il ponte Carlo sulla Moldava e il centro di Praga, al tramonto',
    intro: 'Il ponte Carlo con le sue statue, il Castello e la cattedrale di San Vito, la piazza della Città Vecchia con l’orologio astronomico, la birra nelle vecchie birrerie. Quattro giorni con l’accompagnatore, in pullman, con due mezze giornate di visita guidata in italiano.',
    salienti: ['Il Castello e la cattedrale di San Vito', 'Il ponte Carlo e Malá Strana', 'L’orologio astronomico in Città Vecchia', 'Guida locale in italiano per due mezze giornate'],
    salita: 'nord', ora: '5:00',
    programma: [
      { giorno: 1, t: 'Torino – Praga', d: 'Partenza all’alba, attraverso Svizzera e Germania, con le soste lungo la strada. Arrivo a Praga in serata, cena e notte in hotel.' },
      { giorno: 2, t: 'Il Castello e Malá Strana', d: 'Mattina con la guida: il Castello, la cattedrale di San Vito, il Vicolo d’oro, poi giù per Malá Strana fino al ponte Carlo. Pomeriggio libero.' },
      { giorno: 3, t: 'La Città Vecchia', d: 'Mattina con la guida: la piazza della Città Vecchia, l’orologio astronomico, il quartiere ebraico. Sera: crociera facoltativa sulla Moldava.' },
      { giorno: 4, t: 'Praga – Torino', d: 'Colazione e partenza per l’Italia. Arrivo in tarda serata.' },
    ],
    comprende: ['Viaggio in pullman Gran Turismo, con i nostri autisti', 'Accompagnatore Palma Viaggi per tutto il viaggio', 'Tre notti in hotel 3 stelle, con colazione e cena', 'Guida locale in italiano per due mezze giornate', 'Assicurazione medico-bagaglio'],
    nonComprende: ['Pranzi e bevande', 'Ingressi al Castello e ai monumenti', 'Crociera sulla Moldava (facoltativa)', 'Tassa di soggiorno e mance', 'Supplemento camera singola'],
    documento: DOC_ESTERO,
  },
  {
    id: 'roma', titolo: 'Roma, tre giorni nella città eterna', breve: 'Il Colosseo, piazza Navona, Trevi e una mattina in Vaticano',
    paese: 'Lazio', temi: ['citta'], giorni: 3, mezzo: 'pullman', prezzo: 329, singola: 75, img: 'roma',
    alt: 'Il Colosseo illuminato al tramonto, con le scie delle auto su via dei Fori Imperiali',
    intro: 'Il Colosseo e i Fori, il Pantheon, piazza Navona, la fontana di Trevi la sera; una mattina dedicata al Vaticano, con la piazza e la basilica di San Pietro. Tre giorni con l’accompagnatore e un hotel in posizione comoda per girare a piedi.',
    salienti: ['Il Colosseo e i Fori Imperiali', 'Piazza e basilica di San Pietro', 'Trevi, il Pantheon e piazza Navona di sera', 'Trastevere, con la mattina libera'],
    salita: 'sud', ora: '5:30',
    programma: [
      { giorno: 1, t: 'Torino – Roma', d: 'Partenza al mattino presto, con le soste lungo l’autostrada. Arrivo nel primo pomeriggio, sistemazione in hotel e passeggiata serale: Trevi, il Pantheon, piazza Navona.' },
      { giorno: 2, t: 'Vaticano e Roma antica', d: 'Mattina in Vaticano: piazza e basilica di San Pietro (i Musei Vaticani sono facoltativi). Pomeriggio al Colosseo e ai Fori Imperiali.' },
      { giorno: 3, t: 'Roma – Torino', d: 'Mattina libera, con la proposta di una passeggiata a Trastevere. Pranzo libero e partenza. Arrivo in serata.' },
    ],
    comprende: ['Viaggio in pullman Gran Turismo, con i nostri autisti', 'Accompagnatore Palma Viaggi per tutto il viaggio', 'Due notti in hotel 3 stelle, con colazione e cena', 'Assicurazione medico-bagaglio'],
    nonComprende: ['Pranzi e bevande', 'Ingressi al Colosseo e ai Musei Vaticani', 'Tassa di soggiorno e mance', 'Supplemento camera singola'],
    documento: DOC_ITALIA,
  },
  {
    id: 'marocco', titolo: 'Marocco, le città imperiali', breve: 'Marrakech, Fès, Meknès e Rabat: otto giorni con guida in italiano',
    paese: 'Marocco', temi: ['citta'], giorni: 8, mezzo: 'aereo', prezzo: 1090, singola: 180, img: 'marocco', sconto: false, posti: 30, minimo: 15,
    alt: 'Piazza Jemaa el-Fna a Marrakech al tramonto, con il minareto della Koutoubia',
    intro: 'Le quattro città imperiali del Marocco, una dopo l’altra: le medine, i souk, i palazzi, le concerie di Fès e piazza Jemaa el-Fna a Marrakech quando si accendono i banchi del mercato. Volo, hotel e tour in pullman con guida in italiano: tu pensa solo a guardarti intorno.',
    salienti: ['Marrakech e piazza Jemaa el-Fna al tramonto', 'La medina di Fès e le sue concerie', 'Le rovine romane di Volubilis', 'Guida in italiano per tutto il tour'],
    salita: 'aeroporto', ora: '4:30',
    programma: [
      { giorno: 1, t: 'Torino – Marrakech', d: 'Navetta per l’aeroporto e volo per Marrakech. Trasferimento in hotel, cena e notte.' },
      { giorno: 2, t: 'Marrakech', d: 'La Koutoubia, i giardini Majorelle, il palazzo della Bahia, i souk. La sera, piazza Jemaa el-Fna.' },
      { giorno: 3, t: 'Casablanca e Rabat', d: 'La moschea Hassan II a Casablanca, poi Rabat, la capitale: la Kasbah degli Oudaya e il mausoleo di Mohammed V.' },
      { giorno: 4, t: 'Meknès e Volubilis', d: 'Le porte monumentali di Meknès e le rovine romane di Volubilis. Arrivo a Fès in serata.' },
      { giorno: 5, t: 'Fès', d: 'Una giornata intera nella medina più grande del Marocco: le scuole coraniche, le botteghe, le concerie.' },
      { giorno: 6, t: 'Fès – Marrakech', d: 'Traversata del Medio Atlante, con la sosta a Ifrane, fino a Marrakech.' },
      { giorno: 7, t: 'Marrakech', d: 'Giornata libera, o escursione facoltativa nella valle dell’Ourika.' },
      { giorno: 8, t: 'Marrakech – Torino', d: 'Volo di rientro e navetta dall’aeroporto.' },
    ],
    comprende: ['Navetta da Buttigliera Alta e Torino all’aeroporto, andata e ritorno', 'Volo andata e ritorno con bagaglio in stiva', 'Sette notti in hotel 4 stelle, con colazione e cena', 'Tour in pullman con guida in italiano', 'Assicurazione medico-bagaglio'],
    nonComprende: ['Pranzi e bevande', 'Ingressi ai monumenti', 'Escursione nella valle dell’Ourika (facoltativa)', 'Mance e tassa di soggiorno', 'Assicurazione annullamento (facoltativa, la consigliamo)'],
    documento: 'Passaporto con almeno sei mesi di validità dalla data del rientro. Per i cittadini italiani non serve il visto.',
  },
  {
    id: 'malta', titolo: 'Malta, sole e storia nel Mediterraneo', breve: 'La Valletta, Mdina e una giornata in barca a Gozo e Comino',
    paese: 'Malta', temi: ['mare'], giorni: 5, mezzo: 'aereo', prezzo: 690, singola: 140, img: 'malta', sconto: false, posti: 30, minimo: 15,
    alt: 'Le fortificazioni della Valletta affacciate sul Grand Harbour, a Malta',
    intro: 'La Valletta con le sue fortificazioni sul porto, Mdina, la città silenziosa, i villaggi di pescatori con le barche colorate; e una giornata in barca tra Gozo, Comino e la Laguna Blu. A inizio giugno il mare è già da bagno.',
    salienti: ['La Valletta e il Grand Harbour', 'Mdina, la città silenziosa', 'In barca a Gozo, Comino e alla Laguna Blu', 'Escursioni con guida in italiano'],
    salita: 'aeroporto', ora: '5:00',
    programma: [
      { giorno: 1, t: 'Torino – Malta', d: 'Navetta per l’aeroporto e volo per Malta. Trasferimento in hotel e pomeriggio libero.' },
      { giorno: 2, t: 'La Valletta', d: 'La concattedrale di San Giovanni, i giardini Upper Barrakka con la vista sul porto, le Tre Città dall’altra parte.' },
      { giorno: 3, t: 'Mdina e Rabat', d: 'L’antica capitale, chiusa nelle sue mura, e il villaggio di pescatori di Marsaxlokk.' },
      { giorno: 4, t: 'Gozo e Comino', d: 'Giornata in barca: Gozo, poi Comino e un bagno alla Laguna Blu.' },
      { giorno: 5, t: 'Malta – Torino', d: 'Mattina libera e volo di rientro.' },
    ],
    comprende: ['Navetta da Buttigliera Alta e Torino all’aeroporto, andata e ritorno', 'Volo andata e ritorno con bagaglio in stiva', 'Quattro notti in hotel 4 stelle, con colazione', 'Tre escursioni con guida in italiano', 'Assicurazione medico-bagaglio'],
    nonComprende: ['Pranzi, cene e bevande', 'Ingressi ai monumenti', 'Tassa di soggiorno e mance', 'Assicurazione annullamento (facoltativa, la consigliamo)'],
    documento: DOC_ESTERO,
  },
  {
    id: 'maggiore', titolo: 'Lago Maggiore: Stresa e le Isole Borromee', breve: 'Il lungolago di Stresa e il battello per l’Isola Bella e l’Isola dei Pescatori',
    paese: 'Piemonte', temi: ['laghi'], giorni: 1, mezzo: 'pullman', prezzo: 20, img: 'maggiore',
    alt: 'L’Isola dei Pescatori sul Lago Maggiore, vista dall’Isola Bella',
    intro: 'Il lungolago di Stresa con i suoi alberghi d’epoca e, a un quarto d’ora di battello, le Isole Borromee: l’Isola Bella con il palazzo e i giardini a terrazze, l’Isola dei Pescatori con le viuzze e i ristoranti di pesce di lago. La quota comprende il viaggio: il battello e gli ingressi li sceglie ognuno.',
    salienti: ['Il lungolago di Stresa', 'L’Isola Bella e i suoi giardini', 'Pranzo all’Isola dei Pescatori', 'Prezzo basso: battello e ingressi a scelta'],
    salita: 'nord', ora: '7:00',
    programma: [
      { ora: '7:00', t: 'Partenza', d: 'Dai punti di salita verso il Lago Maggiore. Sosta per la colazione.' },
      { ora: '9:15', t: 'Stresa e le isole', d: 'Arrivo a Stresa. Chi vuole prende il battello per le Isole Borromee con l’accompagnatore.' },
      { ora: '12:30', t: 'Pranzo libero', d: 'Il consiglio: all’Isola dei Pescatori, con il pesce di lago.' },
      { ora: '15:00', t: 'Pomeriggio libero', d: 'Sulle isole o sul lungolago di Stresa.' },
      { ora: '17:30', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 19:30.' },
    ],
    nonComprende: ['Battello per le isole e ingressi a palazzi e giardini', ...NON_COMPRENDE_GITA.slice(0, 1), ...NON_COMPRENDE_GITA.slice(2)],
    documento: DOC_ITALIA,
  },
  {
    id: 'iseo', titolo: 'Lago d’Iseo e Monte Isola', breve: 'L’isola senza auto, tra borghi di pescatori e uliveti',
    paese: 'Lombardia', temi: ['laghi'], giorni: 1, mezzo: 'pullman', prezzo: 35, img: 'iseo',
    alt: 'Monte Isola nel lago d’Iseo, con le montagne intorno e l’acqua turchese',
    intro: 'Monte Isola è una delle isole di lago più grandi d’Europa, e ci si gira senza auto: borghi di pescatori, uliveti, le reti stese ad asciugare e, in cima, il santuario della Madonna della Ceriola. Il traghetto da Sulzano è compreso nella quota.',
    salienti: ['Il traghetto per Monte Isola, compreso', 'Peschiera Maraglio e i borghi dei pescatori', 'Le sardine di lago, la specialità dell’isola', 'Il lungolago di Sulzano'],
    salita: 'nord', ora: '6:30',
    programma: [
      { ora: '6:30', t: 'Partenza', d: 'Dai punti di salita verso Milano e Brescia. Sosta per la colazione.' },
      { ora: '9:45', t: 'Traghetto per Monte Isola', d: 'Da Sulzano, dieci minuti di lago. Passeggiata con l’accompagnatore a Peschiera Maraglio.' },
      { ora: '12:30', t: 'Pranzo libero', d: 'Sull’isola: prova le sardine di lago.' },
      { ora: '14:00', t: 'Pomeriggio sull’isola', d: 'A piedi verso Carzano, o in salita al santuario per chi ha gambe buone.' },
      { ora: '16:30', t: 'Rientro', d: 'Traghetto per Sulzano e partenza per Torino. Arrivo previsto verso le 19:30.' },
    ],
    comprende: [...COMPRENDE_GITA, 'Traghetto per Monte Isola, andata e ritorno'],
    documento: DOC_ITALIA,
  },
  {
    id: 'ginevra', titolo: 'Ginevra, la città sul lago', breve: 'Il Jet d’eau, la città vecchia e il lungolago',
    paese: 'Svizzera', temi: ['citta', 'laghi'], giorni: 1, mezzo: 'pullman', prezzo: 45, img: 'ginevra',
    alt: 'Il Jet d’eau di Ginevra con un arcobaleno, sul lago Lemano',
    intro: 'Il Jet d’eau che sale per 140 metri sopra il lago, la città vecchia intorno alla cattedrale di Saint-Pierre, il Giardino inglese con l’orologio fiorito, le rive del Lemano. Una giornata in una delle città più eleganti d’Europa.',
    salienti: ['Il Jet d’eau e il lungolago', 'La città vecchia e la cattedrale di Saint-Pierre', 'Il Giardino inglese e l’orologio fiorito', 'Battello sul lago, facoltativo'],
    salita: 'valsusa', ora: '6:00',
    programma: [
      { ora: '6:00', t: 'Partenza', d: 'Dai punti di salita verso il Fréjus e Chambéry. Sosta per la colazione.' },
      { ora: '10:00', t: 'Ginevra', d: 'Giro in pullman dei quartieri internazionali, poi passeggiata con l’accompagnatore nella città vecchia.' },
      { ora: '12:30', t: 'Pranzo libero', d: 'Poi pomeriggio libero: il lungolago, i negozi, il battello per chi vuole.' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 21.' },
    ],
    documento: DOC_SVIZZERA,
  },
  {
    id: 'lavanda', titolo: 'Sale San Giovanni, la Provenza piemontese', breve: 'Le colline viola di lavanda nell’Alta Langa',
    paese: 'Piemonte', temi: ['montagna'], giorni: 1, mezzo: 'pullman', prezzo: 20, img: 'lavanda',
    alt: 'Un campo di lavanda in fiore sotto un cielo azzurro',
    intro: 'Tra fine giugno e luglio le colline di Sale San Giovanni, nell’Alta Langa, si colorano di viola: lavanda, salvia, camomilla e altre erbe officinali, coltivate intorno a un borgo di poche centinaia di abitanti. Tra un campo e l’altro, la pieve romanica e la vista sulle Alpi.',
    salienti: ['I campi di lavanda in fiore', 'La pieve romanica di San Giovanni', 'Le erbe officinali e i loro prodotti', 'Poca strada, tutta in collina'],
    salita: 'sud', ora: '8:00',
    programma: [
      { ora: '8:00', t: 'Partenza', d: 'Dai punti di salita verso Ceva e l’Alta Langa.' },
      { ora: '10:00', t: 'Tra i campi in fiore', d: 'Passeggiata facile tra la lavanda e le altre erbe, con l’accompagnatore.' },
      { ora: '12:30', t: 'Pranzo libero', d: 'In paese o al sacco tra i campi.' },
      { ora: '14:30', t: 'Il borgo e la pieve', d: 'La pieve romanica di San Giovanni e le botteghe con i prodotti alla lavanda.' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 18:30.' },
    ],
    documento: DOC_ITALIA,
  },
  {
    id: 'ceresole', titolo: 'Ceresole Reale e il Gran Paradiso', breve: 'Il lago e i laghi d’alta quota sotto il Colle del Nivolet',
    paese: 'Piemonte', temi: ['montagna'], giorni: 1, mezzo: 'pullman', prezzo: 19, img: 'ceresole',
    alt: 'I laghi del Serrù e dell’Agnel tra le montagne del Gran Paradiso, con la strada a tornanti',
    intro: 'Il lago di Ceresole, ai piedi delle cime del Parco nazionale del Gran Paradiso, a due ore da Torino. Chi vuole sale con la navetta del parco fino ai laghi del Serrù e dell’Agnel, a 2.300 metri: una delle strade più belle delle Alpi.',
    salienti: ['Il lago di Ceresole e il suo borgo', 'I laghi d’alta quota, con la navetta del parco', 'Passeggiate facili e aria buona', 'Il prezzo più basso del calendario'],
    salita: 'nord', ora: '7:00',
    programma: [
      { ora: '7:00', t: 'Partenza', d: 'Dai punti di salita verso il Canavese e la valle dell’Orco.' },
      { ora: '9:30', t: 'Ceresole Reale', d: 'Passeggiata intorno al lago con l’accompagnatore.' },
      { ora: '12:30', t: 'Pranzo libero', d: 'In una delle trattorie del paese, o al sacco in riva al lago.' },
      { ora: '14:00', t: 'I laghi d’alta quota', d: 'Per chi vuole: navetta del parco fino ai laghi del Serrù e dell’Agnel (biglietto a parte).' },
      { ora: '17:00', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 19:30.' },
    ],
    nonComprende: ['Navetta del parco per i laghi d’alta quota (facoltativa)', ...NON_COMPRENDE_GITA.slice(0, 1), ...NON_COMPRENDE_GITA.slice(2)],
    documento: DOC_ITALIA,
  },
  {
    id: 'lillaz', titolo: 'Cogne, le cascate di Lillaz e Aosta', breve: 'Tre salti d’acqua nel Gran Paradiso e il pomeriggio in città',
    paese: 'Valle d’Aosta', temi: ['montagna'], giorni: 1, mezzo: 'pullman', prezzo: 20, img: 'lillaz',
    alt: 'Le cascate di Lillaz tra i boschi, in Valle di Cogne',
    intro: 'Da Cogne, nel cuore del Gran Paradiso, un sentiero facile lungo il torrente porta alle cascate di Lillaz: tre salti d’acqua per circa 150 metri. Nel pomeriggio si scende ad Aosta, per un giro nel centro romano e un gelato.',
    salienti: ['Le cascate di Lillaz, con un sentiero facile', 'Il prato di Sant’Orso a Cogne', 'Il centro romano di Aosta', 'Adatta anche alle famiglie con bambini'],
    salita: 'nord', ora: '7:00',
    programma: [
      { ora: '7:00', t: 'Partenza', d: 'Dai punti di salita verso la Valle d’Aosta e la valle di Cogne.' },
      { ora: '9:30', t: 'Le cascate', d: 'Da Lillaz a piedi fino alle cascate: un’ora andata e ritorno, senza difficoltà. Scarpe comode.' },
      { ora: '12:00', t: 'Cogne', d: 'Pranzo libero e un giro nel paese, davanti al prato di Sant’Orso.' },
      { ora: '15:00', t: 'Aosta', d: 'Passeggiata nel centro: l’Arco di Augusto, la Porta Pretoria, la via Sant’Anselmo.' },
      { ora: '17:30', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 19:30.' },
    ],
    documento: DOC_ITALIA,
  },
  {
    id: 'ferragosto', titolo: 'Ferragosto in Langa, con il pranzo in agriturismo', breve: 'Il belvedere di La Morra e il pranzo della festa tra i vigneti',
    paese: 'Piemonte', temi: ['feste'], giorni: 1, mezzo: 'pullman', prezzo: 50, img: 'langhe',
    alt: 'Le colline delle Langhe coperte di vigneti, con un borgo in cima',
    intro: 'Il pranzo di Ferragosto lo facciamo in collina, tra i vigneti delle Langhe: menù piemontese della tradizione in agriturismo, con gli antipasti, gli agnolotti del plin, il secondo e il dolce. Prima, il belvedere di La Morra; dopo, un giro con calma ad Alba.',
    salienti: ['Il pranzo di Ferragosto in agriturismo, compreso', 'Il belvedere di La Morra sulle vigne', 'Il centro di Alba', 'Una giornata senza pensieri, anche per chi è da solo'],
    salita: 'sud', ora: '8:30',
    programma: [
      { ora: '8:30', t: 'Partenza', d: 'Dai punti di salita verso le Langhe.' },
      { ora: '10:00', t: 'La Morra', d: 'Il belvedere, uno dei panorami più belli sulle vigne del Barolo, e un giro nel paese.' },
      { ora: '12:30', t: 'Il pranzo della festa', d: 'In agriturismo: antipasti piemontesi, agnolotti del plin, secondo, dolce, acqua, vino della casa e caffè.' },
      { ora: '16:00', t: 'Alba', d: 'Passeggiata nel centro storico, tra le torri e la via Maestra.' },
      { ora: '17:30', t: 'Rientro', d: 'Partenza per Torino. Arrivo previsto verso le 18:45.' },
    ],
    comprende: [...COMPRENDE_GITA, 'Pranzo di Ferragosto in agriturismo, con acqua, vino della casa e caffè'],
    nonComprende: NON_COMPRENDE_GITA.slice(1),
    documento: DOC_ITALIA,
  },
].map((g) => ({ comprende: COMPRENDE_GITA, nonComprende: NON_COMPRENDE_GITA, ...g }));

export const GITA = Object.fromEntries(GITE.map((g) => [g.id, g]));

export const TEMI = [
  { id: 'mercatini', t: 'Mercatini di Natale', d: 'Annecy, Lugano, Aosta, l’Alsazia', img: 'alsazia' },
  { id: 'laghi', t: 'Laghi', d: 'Maggiore, Iseo, Lemano', img: 'iseo' },
  { id: 'montagna', t: 'Montagna e natura', d: 'Gran Paradiso, cascate, lavanda', img: 'ceresole' },
  { id: 'citta', t: 'Città d’arte', d: 'Praga, Roma, Ginevra, Marrakech', img: 'praga' },
  { id: 'feste', t: 'Feste ed eventi', d: 'La Festa dei Limoni, Ferragosto', img: 'mentone' },
  { id: 'mare', t: 'Mare e sole', d: 'Malta e il Mediterraneo', img: 'malta' },
];

// ---------------------------------------------------------------- punti di salita
// Dal loro sito: «Beinasco, Pianezza, Torino, altri punti di carico da concordare con il gruppo
// in base al percorso». Buttigliera Alta è la sede. Minuti dalla prima fermata: d'esempio.
const SEQUENZE = {
  valsusa: [['Beinasco', 0], ['Torino', 20], ['Pianezza', 40], ['Buttigliera Alta', 55]],
  sud: [['Buttigliera Alta', 0], ['Pianezza', 20], ['Torino', 40], ['Beinasco', 55]],
  nord: [['Buttigliera Alta', 0], ['Pianezza', 20], ['Torino', 40]],
  aeroporto: [['Buttigliera Alta', 0], ['Torino', 30]],
};
const piuMinuti = (hhmm, min) => { const [h, m] = hhmm.split(':').map(Number); const t = h * 60 + m + min; return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
export const salite = (g) => SEQUENZE[g.salita].map(([luogo, min]) => ({ luogo, ora: piuMinuti(g.ora, min) }));

// ---------------------------------------------------------------- le partenze
// Una gita può partire più volte. `iscritti`: quanti hanno già il posto. Fine = data + giorni - 1.
export const PARTENZE = [
  { id: 'p01', gita: 'annecy', data: '2026-12-05', iscritti: 47 },
  { id: 'p02', gita: 'lugano', data: '2026-12-06', iscritti: 54 },
  { id: 'p03', gita: 'aosta', data: '2026-12-08', iscritti: 38 },
  { id: 'p04', gita: 'annecy', data: '2026-12-12', iscritti: 22 },
  { id: 'p05', gita: 'alsazia', data: '2026-12-12', iscritti: 31 },
  { id: 'p06', gita: 'lugano', data: '2026-12-13', iscritti: 29 },
  { id: 'p07', gita: 'aosta', data: '2026-12-19', iscritti: 12 },
  { id: 'p08', gita: 'mentone', data: '2027-02-21', iscritti: 18 },
  { id: 'p09', gita: 'mentone', data: '2027-02-28', iscritti: 6 },
  { id: 'p10', gita: 'marocco', data: '2027-04-17', iscritti: 14 },
  { id: 'p11', gita: 'praga', data: '2027-04-29', iscritti: 21 },
  { id: 'p12', gita: 'roma', data: '2027-05-07', iscritti: 9 },
  { id: 'p13', gita: 'maggiore', data: '2027-05-16', iscritti: 15 },
  { id: 'p14', gita: 'malta', data: '2027-06-02', iscritti: 8 },
  { id: 'p15', gita: 'iseo', data: '2027-06-13', iscritti: 4 },
  { id: 'p16', gita: 'lavanda', data: '2027-06-27', iscritti: 3 },
  { id: 'p17', gita: 'lavanda', data: '2027-07-04', iscritti: 0 },
  { id: 'p18', gita: 'lillaz', data: '2027-07-10', iscritti: 0 },
  { id: 'p19', gita: 'ginevra', data: '2027-07-11', iscritti: 2 },
  { id: 'p20', gita: 'maggiore', data: '2027-07-17', iscritti: 0 },
  { id: 'p21', gita: 'lillaz', data: '2027-07-24', iscritti: 0 },
  { id: 'p22', gita: 'ceresole', data: '2027-08-08', iscritti: 0 },
  { id: 'p23', gita: 'ferragosto', data: '2027-08-15', iscritti: 11 },
  { id: 'p24', gita: 'iseo', data: '2027-08-21', iscritti: 0 },
  { id: 'p25', gita: 'ginevra', data: '2027-09-12', iscritti: 0 },
];

export const fineDi = (p) => aggiungiGiorni(p.data, GITA[p.gita].giorni - 1);
export const prezzoDi = (p) => Number(p.prezzo ?? GITA[p.gita].prezzo);
export const scontoAttivo = (p, oggi = new Date()) => GITA[p.gita].sconto !== false && isoLocale(oggi) <= scadenzaSconto(p.data);
export const prezzoOggi = (p, oggi = new Date()) => (scontoAttivo(p, oggi) ? arrotonda(prezzoDi(p) * (1 - REGOLE.sconto)) : prezzoDi(p));
export const giorniAvviso = (g) => (g.giorni > 6 ? 21 : g.giorni > 1 ? 10 : 7);
export const durataTesto = (g) => (g.giorni === 1 ? 'In giornata' : `${g.giorni} giorni`);

// Posti: la barra si riempie con gli iscritti; la tacca segna la partenza garantita.
export function statoPosti(p) {
  const g = GITA[p.gita];
  const posti = Number(p.posti ?? g.posti ?? REGOLE.posti);
  const minimo = Number(g.minimo ?? REGOLE.minimo);
  const iscritti = Math.max(0, Math.min(Number(p.iscritti) || 0, posti));
  const liberi = posti - iscritti;
  const base = { posti, minimo, iscritti, liberi, perc: Math.round((iscritti / posti) * 100), tacca: Math.round((minimo / posti) * 100) };
  if (liberi <= 0) return { ...base, k: 'completo', t: 'Completo', d: 'lista d’attesa aperta' };
  if (liberi <= 8) return { ...base, k: 'ultimi', t: liberi === 1 ? 'Ultimo posto' : `Ultimi ${liberi} posti`, d: 'partenza confermata' };
  if (iscritti >= minimo) return { ...base, k: 'confermata', t: 'Partenza confermata', d: `${liberi} posti liberi` };
  const mancano = minimo - iscritti;
  return { ...base, k: 'aperta', t: !iscritti ? 'Iscrizioni aperte' : mancano === 1 ? 'Manca 1 iscritto' : `Mancano ${mancano} iscritti`, d: `si parte con ${minimo}` };
}

// ---------------------------------------------------------------- memoria locale
// In questa bozza i cambi del pannello e le richieste restano nel browser. Lo storage può
// mancare o sollevare eccezioni (navigazione privata): mai far cadere lo script.
const leggi = (k, def) => { try { const r = localStorage.getItem(k); return r === null ? def : JSON.parse(r); } catch { return def; } };
const scrivi = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

// Le partenze cambiate dal pannello: { mod: {id: {iscritti, prezzo, stato}}, nuove: [...], tolte: [id] }
export function leggiModifiche() {
  const v = leggi('pv-partenze', null) || {};
  return {
    mod: v.mod && typeof v.mod === 'object' ? v.mod : {},
    nuove: Array.isArray(v.nuove) ? v.nuove.filter((p) => p && p.id && GITA[p.gita] && /^\d{4}-\d{2}-\d{2}$/.test(p.data)) : [],
    tolte: Array.isArray(v.tolte) ? v.tolte : [],
  };
}
export const scriviModifiche = (m) => scrivi('pv-partenze', m);

export function partenzeAttuali() {
  const { mod, nuove, tolte } = leggiModifiche();
  return [...PARTENZE, ...nuove].filter((p) => !tolte.includes(p.id)).map((p) => ({ ...p, ...(mod[p.id] || {}) }));
}
export const prossime = (lista, oggi = new Date()) => {
  const o = isoLocale(oggi);
  return lista.filter((p) => p.data >= o && p.stato !== 'annullata').sort((a, b) => a.data.localeCompare(b.data) || a.id.localeCompare(b.id));
};

export const leggiRichieste = () => (leggi('pv-richieste', []) || []).filter((r) => r && r.id);
export const scriviRichieste = (a) => scrivi('pv-richieste', a);
export const aggiungiRichiesta = (r) => scriviRichieste([...leggiRichieste().filter((x) => x.id !== r.id), r]);

export const leggiAvviso = () => ({ testo: '', attivo: false, ...(leggi('pv-avviso', null) || {}) });
export const scriviAvviso = (a) => scrivi('pv-avviso', a);

// ---------------------------------------------------------------- prenotazioni d'esempio
// Per far vedere il resoconto (lista passeggeri, pagamenti, fermate) con le partenze già piene:
// a ogni partenza d'esempio corrispondono prenotazioni inventate, tante quanti i suoi iscritti.
// Sempre le stesse (generatore con seme fisso). Nomi inventati; telefoni con «000» in mezzo.
// Nella versione reale non esistono: ci sono solo le prenotazioni vere, salvate sul sito.
const NOMI_F = ['Maria', 'Anna', 'Giuseppina', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia', 'Carla', 'Francesca', 'Paola', 'Laura', 'Elena', 'Silvia', 'Daniela', 'Patrizia', 'Giulia', 'Chiara', 'Sara', 'Federica', 'Rita', 'Luisa', 'Marisa', 'Fatima'];
const NOMI_M = ['Giuseppe', 'Giovanni', 'Antonio', 'Mario', 'Luigi', 'Francesco', 'Angelo', 'Vincenzo', 'Pietro', 'Salvatore', 'Carlo', 'Franco', 'Domenico', 'Bruno', 'Paolo', 'Michele', 'Marco', 'Andrea', 'Luca', 'Roberto', 'Sergio', 'Piero', 'Youssef', 'Gianni'];
const COGNOMI = ['Rossi', 'Russo', 'Ferrero', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Rinaldi', 'Caruso', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Vitale', 'Serra', 'Coppola', 'Bertolino', 'Chiabrando', 'Giacone', 'Perotti', 'Borgarello', 'Bosio', 'Allasia', 'Cravero', 'Gianotti', 'Mussa', 'Audisio', 'Bonino', 'Picco', 'Sacco', 'Bergamasco', 'Re', 'Rosso', 'Bruna', 'Arnaudo', 'Ghio', 'Testa', 'Pautasso', 'Ruffino', 'Giraudo', 'Tosco', 'Bellino', 'Marchetti', 'Fiore'];
const NOTE = ['Posto davanti: soffre il pullman', 'Celiaca', 'Con il passeggino', 'Cammina con il bastone', 'Vegetariano', 'Posti vicini, per favore'];

const generatore = (seme) => {
  let a = 0; for (const c of String(seme)) a = (a * 31 + c.charCodeAt(0)) | 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

export function prenotazioniEsempio(p) {
  const g = GITA[p.gita];
  if (!g || !PARTENZE.some((x) => x.id === p.id)) return [];
  const caso = generatore(p.id + p.gita);
  const prendi = (a) => a[Math.floor(caso() * a.length)];
  const fermate = salite(g);
  const pesi = fermate.map((_, i) => (i === 0 ? 3 : 2));
  const fermata = () => { let r = caso() * pesi.reduce((s, x) => s + x, 0); for (let i = 0; i < fermate.length; i++) { r -= pesi[i]; if (r < 0) return fermate[i].luogo; } return fermate[0].luogo; };
  const base = PARTENZE.find((x) => x.id === p.id).iscritti;
  const out = [];
  let resto = base, n = 0;
  while (resto > 0) {
    const persone = Math.min(resto, prendi([1, 2, 2, 2, 2, 3, 4]));
    resto -= persone; n++;
    const cognome = prendi(COGNOMI);
    const famiglia = caso() < 0.75;
    const passeggeri = Array.from({ length: persone }, (_, i) => `${famiglia || i === 0 ? cognome : prendi(COGNOMI)} ${prendi(i % 2 ? NOMI_M : NOMI_F)}`);
    const singole = g.singola && persone === 1 && caso() < 0.6 ? 1 : 0;
    const totale = arrotonda(prezzoDi(p) * persone + singole * (g.singola || 0));
    const r = caso();
    const [stato, modo, metodo, pagato] = g.giorni > 1
      ? (r < 0.45 ? ['pagata', 'online', 'Carta online', totale] : r < 0.75 ? ['acconto pagato', 'acconto', 'Carta online (acconto)', arrotonda(totale * 0.3)] : r < 0.9 ? ['pagata', 'agenzia', 'In agenzia', totale] : ['posto bloccato', 'agenzia', '—', 0])
      : (r < 0.6 ? ['pagata', 'online', 'Carta online', totale] : r < 0.88 ? ['pagata', 'agenzia', 'In agenzia', totale] : ['posto bloccato', 'agenzia', '—', 0]);
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    out.push({
      id: `${p.id}-e${n}`, esempio: true, tipo: 'prenotazione', codice: 'PV-' + Array.from({ length: 5 }, () => prendi(A)).join(''),
      partenza: p.id, gita: g.id, data: p.data, persone, passeggeri, nome: passeggeri[0], salita: fermata(),
      tel: `${prendi(['333', '335', '338', '340', '347', '349', '366', '392'])} 000 ${String(Math.floor(caso() * 10000)).padStart(4, '0')}`,
      note: caso() < 0.08 ? prendi(NOTE) : '', singole, totale, pagato, modo, metodo, stato,
    });
  }
  return out;
}

// Il resoconto di una partenza: le prenotazioni (d'esempio + quelle fatte dal sito in questo browser),
// i passeggeri divisi per fermata nell'ordine del giro, i pagamenti e i totali.
export function resoconto(p, richieste = []) {
  const g = GITA[p.gita];
  const vere = richieste.filter((r) => r.tipo === 'prenotazione' && r.partenza === p.id && ['pagata', 'acconto pagato', 'posto bloccato'].includes(r.stato));
  const pren = [...prenotazioniEsempio(p), ...vere].map((r) => ({
    ...r,
    passeggeri: Array.isArray(r.passeggeri) && r.passeggeri.length ? r.passeggeri : [r.nome, ...Array.from({ length: (r.persone || 1) - 1 }, (_, i) => `(accompagnatore ${i + 1} di ${r.nome})`)],
    metodo: r.metodo || (r.modo === 'online' ? 'Carta online' : r.modo === 'acconto' ? 'Carta online (acconto)' : r.pagato > 0 ? 'In agenzia' : '—'),
    residuo: arrotonda(Math.max(0, (Number(r.totale) || 0) - (Number(r.pagato) || 0))),
  }));
  const fermate = salite(g).map((f) => {
    const qui = pren.filter((r) => r.salita === f.luogo);
    return { ...f, prenotazioni: qui, passeggeri: qui.reduce((s, r) => s + r.passeggeri.length, 0) };
  });
  const passeggeri = pren.reduce((s, r) => s + r.passeggeri.length, 0);
  const singole = pren.reduce((s, r) => s + (Number(r.singole) || 0), 0);
  const camere = g.giorni > 1 ? { singole, nomiSingole: pren.filter((r) => r.singole > 0).map((r) => (r.singole > 1 ? `${r.nome} (+${r.singole - 1})` : r.nome)), inDoppia: passeggeri - singole } : null;
  const somma = (k) => arrotonda(pren.reduce((s, r) => s + (Number(r[k]) || 0), 0));
  return {
    g, p, prenotazioni: pren, fermate, passeggeri, camere,
    totale: somma('totale'), incassato: somma('pagato'), residuo: somma('residuo'),
    online: arrotonda(pren.filter((r) => /Carta/.test(r.metodo)).reduce((s, r) => s + r.pagato, 0)),
    agenzia: arrotonda(pren.filter((r) => r.metodo === 'In agenzia').reduce((s, r) => s + r.pagato, 0)),
  };
}

// ---------------------------------------------------------------- piccoli aiuti
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const waLink = (testo, numero = INFO.wa) => `https://wa.me/${numero}?text=${encodeURIComponent(testo)}`;
export const waCondividi = (testo) => `https://wa.me/?text=${encodeURIComponent(testo)}`;

// Il sole a strisce del loro marchio. `id` diverso per ogni sole nella stessa pagina.
// Il pullman visto di lato, col muso a destra: fa il percorso dei passi in home e «guida» mentre si paga.
export const pullmino = (cls = '') => `<svg class="pullmino ${cls}" viewBox="0 0 64 30" aria-hidden="true" focusable="false"><path d="M3 6.5A4.5 4.5 0 0 1 7.5 2h43.2c2.3 0 4.3 1.4 5.1 3.5L60 17v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#fff" stroke="#0b2836" stroke-width="2" stroke-linejoin="round"/><path d="M8 7h9v6H8zM20 7h9v6h-9zM32 7h9v6h-9zM45 7h9.8l2.5 7H45z" fill="#11a8e0"/><path d="M4 17.5h55.6" stroke="#ff8a1f" stroke-width="2.6"/><circle cx="15" cy="24" r="4.2" fill="#0b2836" stroke="#fff" stroke-width="1.6"/><circle cx="49" cy="24" r="4.2" fill="#0b2836" stroke="#fff" stroke-width="1.6"/></svg>`;

export const sole = (id, cls = '') => `<svg class="sole ${cls}" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd23f"/><stop offset=".55" stop-color="#ffa21f"/><stop offset="1" stop-color="#ff6a1a"/></linearGradient><mask id="${id}-m"><rect width="200" height="200" fill="#fff"/>${[[104, 5], [121, 7], [140, 10], [161, 13], [184, 16]].map(([y, h]) => `<rect y="${y}" width="200" height="${h}" fill="#000"/>`).join('')}</mask></defs><circle cx="100" cy="100" r="100" fill="url(#${id}-g)" mask="url(#${id}-m)"/></svg>`;

// ---------------------------------------------------------------- icone (tratto, 24×24)
const TRATTI = {
  bus: '<path d="M5 17V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11"/><path d="M5 11h14M5 17h14v2.5a.5.5 0 0 1-.5.5H17a.5.5 0 0 1-.5-.5V19h-9v.5a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1-.5-.5zM9 6.5h6"/><path d="M8 14h.01M16 14h.01"/>',
  wc: '<rect x="2.5" y="5.5" width="19" height="13" rx="3"/><path d="m5.5 9 1.2 6 1.3-4.5L9.3 15l1.2-6M17.5 10a2.5 2.5 0 1 0 0 4"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
  presa: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  clima: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 3.5l3 2 3-2M9 20.5l3-2 3 2"/>',
  sedile: '<path d="M7 3.5 9 14h7.5"/><path d="M9 14l-1.5 6.5M16.5 14l1.5 6.5M6 20.5h3.5M16 20.5h3.5M11 10h5"/>',
  frigo: '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 10h12M9 5.5v2M9 13v3"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  musica: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  sconto: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  persone: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.6 14.2A5 5 0 0 1 21 19"/>',
  luna: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  telefono: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  mappa: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  orologio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  aereo: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  scuola: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v5"/>',
  cuore: '<path d="M12 20s-7-4.5-9-9a4.8 4.8 0 0 1 9-2.6A4.8 4.8 0 0 1 21 11c-2 4.5-9 9-9 9z"/>',
  chiesa: '<path d="M12 2v4M10 4h4M6 21V11l6-5 6 5v10M3 21h18M10 21v-4a2 2 0 0 1 4 0v4"/>',
  accessibile: '<circle cx="12" cy="4" r="2"/><path d="M12 7v6h5l2 6M12 10H7M9.5 13.6a5 5 0 1 0 6.2 6.2"/>',
  bussola: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  scudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  documento: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16a3.2 3.2 0 0 1 6 0M14 10h4M14 13h4"/>',
  freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  indietro: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  condividi: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  volante: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 14.5V21M9.6 11.3 3.3 10M14.4 11.3l6.3-1.3"/>',
  valigia: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  meno: '<path d="M5 12h14"/>',
  piu: '<path d="M12 5v14M5 12h14"/>',
};
export const icona = (nome, s = 24) => `<svg class="ico" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${TRATTI[nome] || ''}</svg>`;

// Il comfort a bordo, dalla loro pagina Chi siamo.
export const COMFORT = [
  ['wc', 'Toilette a bordo'], ['sedile', 'Sedili reclinabili'], ['clima', 'Aria condizionata'], ['wifi', 'Wi-Fi gratuito'],
  ['presa', 'Prese per telefono e computer'], ['frigo', 'Frigobar'], ['tv', 'TV e lettore DVD'], ['musica', 'Impianto audio hi-fi'],
];

// I servizi, dalla loro pagina Servizi.
export const SERVIZI = [
  { id: 'su-misura', ico: 'bussola', t: 'Viaggi su misura e pacchetti', breve: 'Dove, quando e con chi lo decidi tu: al resto pensiamo noi.', d: 'Ci dici dove vuoi andare, quando e con chi: noi mettiamo insieme voli, hotel, trasferimenti ed escursioni. Se preferisci un pacchetto già pronto, ti proponiamo quelli dei migliori tour operator, e ti diciamo con sincerità quale conviene.', punti: ['Voli, hotel, trasferimenti ed escursioni', 'Pacchetti dei tour operator', 'Un preventivo chiaro, voce per voce'] },
  { id: 'nozze', ico: 'cuore', t: 'Viaggi di nozze', breve: 'In tutto il mondo, costruiti sulla coppia.', d: 'Il viaggio di nozze è uno solo: lo costruiamo con voi, in tutto il mondo, mettendo insieme mare, città e avventura come piace a voi. E lo seguiamo dall’Italia mentre siete in viaggio.', punti: ['Destinazioni in tutto il mondo', 'Itinerario costruito con voi', 'Assistenza durante il viaggio'] },
  { id: 'noleggio', ico: 'bus', t: 'Noleggio pullman con autista', breve: 'Pullman Gran Turismo da 54 posti, con i nostri autisti.', d: 'Il nostro pullman Gran Turismo da 54 posti, con autista, per matrimoni, gite di associazioni e parrocchie, trasferte aziendali, eventi e trasferimenti da e per gli aeroporti. Siamo nati come ditta di trasporti: è il nostro mestiere da prima dell’agenzia.', punti: ['Matrimoni, associazioni, parrocchie, aziende', 'Trasferimenti per gli aeroporti', 'Pullman GT da 54 posti, con tutti i comfort'] },
  { id: 'scuole', ico: 'scuola', t: 'Gite scolastiche', breve: 'Viaggi d’istruzione e uscite didattiche di un giorno.', d: 'Viaggi d’istruzione in Italia e all’estero e uscite didattiche di un giorno, organizzati insieme a guide, aziende e associazioni del territorio. Il pullman è il nostro, e lo sono anche gli autisti.', punti: ['Viaggi d’istruzione in Italia e all’estero', 'Uscite didattiche di un giorno', 'Con guide e associazioni del territorio'] },
  { id: 'religioso', ico: 'chiesa', t: 'Turismo religioso', breve: 'Pellegrinaggi e soggiorni nei luoghi della fede.', d: 'Viaggi verso le principali mete religiose, per parrocchie e gruppi, con la possibilità di dormire in monasteri, conventi e case per ferie.', punti: ['Per parrocchie e gruppi', 'Soggiorni in monasteri e conventi', 'Programma costruito sul gruppo'] },
  { id: 'per-tutti', ico: 'accessibile', t: 'Viaggi per tutti', breve: 'Soluzioni per chi ha disabilità o esigenze particolari.', d: 'Cerchiamo strutture e soluzioni adatte a persone con disabilità o con esigenze particolari, e organizziamo il viaggio intorno a loro: non il contrario.', punti: ['Strutture accessibili, verificate', 'Trasporti adatti', 'Diccelo prima: ci pensiamo noi'] },
];

// ---------------------------------------------------------------- il biglietto
// Lo stesso disegno sul sito (al build) e nel browser (quando il pannello cambia le partenze).
export function barraPosti(s) {
  return `<div class="posti posti--${s.k}">
    <div class="posti-barra" aria-hidden="true"><span style="width:${s.perc}%"></span><i style="left:${s.tacca}%"></i></div>
    <p class="posti-t"><b>${esc(s.t)}</b> · ${esc(s.d)}</p>
  </div>`;
}

export function biglietto(p, oggi = new Date(), opz = {}) {
  const g = GITA[p.gita];
  const s = statoPosti(p);
  const f = foto(g.img);
  const sc = scontoAttivo(p, oggi);
  const prezzo = prezzoDi(p);
  const d = daIso(p.data);
  const [gs, , mese] = dataBreve(p.data).split(' ');
  const fine = g.giorni > 1 ? fineDi(p) : null;
  const tipo = [durataTesto(g), g.mezzo === 'aereo' ? 'volo e tour' : null, g.paese].filter(Boolean).join(' · ');
  const H = opz.h || 'h3';
  return `<article class="bgl bgl--${s.k}" data-p="${esc(p.id)}">
  <div class="bgl-in">
    <div class="bgl-foto"><img src="${f.src.replace('-1200', '-600')}" srcset="${f.srcset}" sizes="${opz.sizes || '(max-width:640px) 92vw, 220px'}" width="600" height="400" alt="" loading="lazy" decoding="async" /></div>
    <div class="bgl-corpo">
      <p class="bgl-tipo">${esc(tipo)}</p>
      <${H} class="bgl-titolo"><a href="${BASE}gite/${g.id}/?p=${encodeURIComponent(p.id)}">${esc(g.titolo)}<span class="sr-only">, ${esc(dataLunga(p.data))}${fine ? ' – ' + esc(dataLunga(fine)) : ''}</span></a></${H}>
      <p class="bgl-breve">${esc(g.breve)}</p>
      ${barraPosti(s)}
    </div>
    <div class="bgl-matrice">
      <p class="bgl-data" aria-hidden="true">${fine ? '<span>dal</span>' : `<span>${esc(gs)}</span>`}<b>${d.getDate()}</b><span>${esc(mese)}</span>${fine ? `<small>al ${esc(dataBreve(fine).split(' ').slice(1).join(' '))}</small>` : ''}</p>
      <div class="bgl-prezzo">
        <p><b>${euro(prezzo)}</b> <small>${g.giorni > 1 ? 'a persona, in doppia' : 'a persona'}</small></p>
        ${sc ? `<p class="bgl-sconto">${euro(prezzoOggi(p, oggi))} se prenoti entro il ${esc(dataBreve(scadenzaSconto(p.data)).split(' ').slice(1).join(' '))}</p>` : ''}
      </div>
      <a class="bgl-cta" href="${BASE}prenota/?p=${encodeURIComponent(p.id)}">${s.k === 'completo' ? 'Lista d’attesa' : 'Prenota'}<span class="sr-only">: ${esc(g.titolo)}, ${esc(dataMedia(p.data))}</span></a>
    </div>
  </div>
</article>`;
}

// Il biglietto piccolo, senza foto: «la prossima partenza» in apertura.
export function bigliettoMini(p, oggi = new Date()) {
  const g = GITA[p.gita];
  const s = statoPosti(p);
  return `<div class="mini">
  <p class="mini-et">${icona('bus', 18)} La prossima partenza</p>
  <p class="mini-data">${esc(dataLunga(p.data).replace(/ \d{4}$/, ''))}</p>
  <p class="mini-titolo"><a href="${BASE}gite/${g.id}/?p=${encodeURIComponent(p.id)}">${esc(g.titolo)}</a></p>
  ${barraPosti(s)}
  <div class="mini-piede">
    <p><b>${euro(prezzoOggi(p, oggi))}</b> <small>${scontoAttivo(p, oggi) ? 'a persona, con lo sconto' : 'a persona'}</small></p>
    <a href="${BASE}prenota/?p=${encodeURIComponent(p.id)}" class="mini-cta">${s.k === 'completo' ? 'Lista d’attesa' : 'Prenota'} ${icona('freccia', 16)}</a>
  </div>
</div>`;
}
