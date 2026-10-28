// Condiviso dalla bozza PuntoPane: dati dell'azienda, prodotti, settori serviti, richiesta.
// Dati pubblici (email di richiesta di ottobre 2026, profili Instagram e Facebook, Gambero Rosso):
// nome, ragione sociale, email, lievito madre e farine bio macinate a pietra.
// Telefono e indirizzo del laboratorio sono DA CONFERMARE: online ci sono versioni diverse.
// L'assortimento è d'esempio: va sostituito con quello vero, con le pezzature e le foto del laboratorio.

export const INFO = {
  nome: 'PuntoPane',
  societa: 'Cammino S.r.l.',
  citta: 'Torino',
  email: 'servizioclienti@puntopane.life',
  // dalla pagina Facebook; Gambero Rosso riporta 011 1971 5951 (vedi promemoria in Contatti)
  tel: '327 666 2132',
  telHref: '+393276662132',
  instagram: 'https://www.instagram.com/puntopane_/',
};

export const BASE = '/demoPuntoPane/';
export const IMG = '/img/puntopane/';

// Foto in due larghezze (vedi public/img/puntopane): la grande per gli schermi larghi e i telefoni
// ad alta densità, la piccola per le schede da telefono.
export const foto = (k, grande = 960, piccola = 480) => ({
  src: `${IMG}${k}-${grande}.webp`,
  srcset: `${IMG}${k}-${piccola}.webp ${piccola}w, ${IMG}${k}-${grande}.webp ${grande}w`,
});

export const CATEGORIE = [
  { id: 'pane', t: 'Pane' },
  { id: 'speciali', t: 'Pani speciali' },
  { id: 'focacce', t: 'Focacce e grissini' },
  { id: 'colazione', t: 'Colazione e dolci' },
];

// `per`: a chi serve di più (le stesse etichette dei settori qui sotto)
export const PRODOTTI = [
  { id: 'pagnotta', cat: 'pane', nome: 'Pagnotta a lievito madre', desc: 'Crosta croccante e mollica alveolata. La lunga fermentazione le dà profumo e la fa restare buona più a lungo.', per: ['Ristoranti', 'Negozi'], alt: 'Pagnotte rustiche infarinate in un cesto' },
  { id: 'filoni', cat: 'pane', nome: 'Filoni e baguette', desc: 'Da affettare per il cestino al tavolo o da aprire per i panini del pranzo.', per: ['Ristoranti', 'Bar'], alt: 'Filoni di pane in una cassetta' },
  { id: 'panini', cat: 'pane', nome: 'Panini e bocconcini', desc: 'Pezzature piccole per il cestino del pane, il buffet della colazione e i panini farciti.', per: ['Hotel', 'Ristoranti', 'Bar'], alt: 'Panini dorati su teglie da forno' },
  { id: 'cassetta', cat: 'pane', nome: 'Pane in cassetta', desc: 'Morbido e regolare, anche già affettato: per toast, tramezzini e colazioni.', per: ['Bar', 'Hotel'], alt: 'Fette di pane in cassetta' },
  { id: 'integrale', cat: 'speciali', nome: 'Pane integrale', desc: 'Con farina integrale biologica: sapore pieno e mollica più compatta.', per: ['Ristoranti', 'Negozi'], alt: 'Pane integrale a fette su un tagliere' },
  { id: 'cereali', cat: 'speciali', nome: 'Pane ai cereali e semi', desc: 'Semi nell’impasto e sulla crosta: croccante fuori, ricco dentro.', per: ['Ristoranti', 'Negozi', 'Hotel'], alt: 'Pagnotta rustica ricoperta di semi' },
  { id: 'panfrutto', cat: 'speciali', nome: 'Pan frutto', desc: 'Pane con frutta secca e uvetta, da solo o con i formaggi.', per: ['Ristoranti', 'Negozi', 'Hotel'], alt: 'Pane tondo con uvetta e noci' },
  { id: 'focaccia', cat: 'focacce', nome: 'Focaccia in teglia', desc: 'Alta e soffice, con olio extravergine e rosmarino: a tranci per l’aperitivo o da farcire.', per: ['Bar', 'Ristoranti'], alt: 'Focaccia al rosmarino tagliata, con la mollica in vista' },
  { id: 'grissini', cat: 'focacce', nome: 'Grissini stirati a mano', desc: 'Il grissino di Torino, stirato a mano e cotto finché è friabile. Per il tavolo e per l’aperitivo.', per: ['Ristoranti', 'Bar'], alt: 'Grissini lunghi stesi su una tovaglia a quadri' },
  { id: 'brioche', cat: 'colazione', nome: 'Brioche', desc: 'Per la colazione al banco e il buffet dell’hotel: morbide, lucide, appena sfornate.', per: ['Bar', 'Hotel'], alt: 'Brioche dorate su una griglia' },
  { id: 'biscotti', cat: 'colazione', nome: 'Biscotti', desc: 'Con gocce di cioccolato e non solo: per il caffè, la colazione e la vendita al banco.', per: ['Bar', 'Hotel', 'Negozi'], alt: 'Biscotti con gocce di cioccolato su un tagliere' },
  { id: 'panettone', cat: 'colazione', nome: 'Panettone artigianale', desc: 'Per le feste, su prenotazione: da servire ai vostri clienti o da regalare.', per: ['Ristoranti', 'Hotel', 'Negozi'], alt: 'Panettone tagliato con l’uvetta in vista', stagione: 'Natale' },
];

export const SETTORI = [
  { id: 'Ristoranti', t: 'Ristoranti e trattorie', d: 'Il pane per il cestino al tavolo, i grissini, la focaccia per l’aperitivo. Nelle quantità del vostro servizio, con consegne regolari.', prodotti: ['pagnotta', 'filoni', 'grissini', 'focaccia'], img: 'cestino', alt: 'Cestino del pane su un tavolo apparecchiato' },
  { id: 'Bar', t: 'Bar e caffetterie', d: 'Brioche per la colazione, pane in cassetta per i toast, focaccia e filoni per i panini del pranzo.', prodotti: ['brioche', 'cassetta', 'focaccia', 'filoni'] },
  { id: 'Hotel', t: 'Hotel e B&B', d: 'Il buffet della colazione, completo: panini, pane in cassetta, brioche, biscotti.', prodotti: ['panini', 'cassetta', 'brioche', 'biscotti'] },
  { id: 'Negozi', t: 'Negozi e gastronomie', d: 'Pani a lievito madre e pani speciali per il vostro banco, consegnati freschi.', prodotti: ['pagnotta', 'integrale', 'cereali', 'panfrutto'] },
];

// I tre punti fermi, dalle loro stesse parole (Instagram: «solo farine bio di alta qualità, acqua,
// sale e lievito madre»; sito: farine «biologiche e macinate a pietra», «lenta fermentazione»)
export const PUNTI = [
  { t: 'Lievito madre', d: 'È lui che fa crescere il pane, con i suoi tempi. Niente scorciatoie.' },
  { t: 'Farine bio macinate a pietra', d: 'Solo farine biologiche, acqua e sale. Nient’altro nell’impasto.' },
  { t: 'Lunga fermentazione', d: 'Diamo all’impasto il tempo che serve: più profumo, e un pane che resta buono più a lungo.' },
];

// ---------------------------------------------------------------- la richiesta
// I prodotti spuntati nel catalogo restano nel browser e arrivano già spuntati nel modulo.
// Lo storage può mancare o sollevare eccezioni (navigazione privata): mai far cadere lo script.
const CHIAVE = 'pp-richiesta';
export const leggiRichiesta = () => {
  try { const v = JSON.parse(localStorage.getItem(CHIAVE) || '[]'); return Array.isArray(v) ? v.filter((id) => PRODOTTI.some((p) => p.id === id)) : []; }
  catch { return []; }
};
export const scriviRichiesta = (ids) => { try { localStorage.setItem(CHIAVE, JSON.stringify(ids)); } catch { /* resta solo in pagina */ } };
