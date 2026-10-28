// Progetti per clienti reali: li usano le due pagine private
//   /demoClienti/     le bozze da far vedere (dati nel browser, nessun server)
//   /demoClientiDev/  le versioni reali in sviluppo (pagine definitive, area riservata)
// Un progetto nasce come bozza; quando il cliente dice si', la versione reale cresce in
// /demoClientiDev/ (campo `dev`) prima di andare sul suo dominio. Quando la versione reale
// ha superato la bozza, la bozza si toglie: restano solo `dev` e i dati del cliente
// (niente `url`), e il progetto compare solo in /demoClientiDev/ (es. MasGioielli).
import { UTENTE as MAS_UTENTE, PASSWORD as MAS_PASSWORD } from '../pages/masgioielliDev/_locale.js';

export const CLIENTI = [
  {
    nome: 'Farmacia dell’Ausiliatrice',
    settore: 'Farmacia',
    dove: 'Torino',
    url: '/demoFarmaciaAusiliatrice/',
    stato: 'Bozza da mostrare',
    pitch: 'Una farmacia di quartiere che fa molto più che vendere farmaci: il sito mette in prima fila i servizi su prenotazione e le offerte del mese.',
    dentro: [
      'Orari veri con “aperta ora / chiusa ora” calcolato sul momento, pausa pranzo compresa',
      'Servizi con prenotazione: Holter, ECG, tamponi, autoanalisi',
      'Offerte con ricerca, scheda del prodotto e lista della spesa da mandare su WhatsApp con la data di ritiro',
      'Pannello di gestione: la farmacia aggiunge e modifica i propri servizi da sola',
    ],
    pagine: [
      { t: 'Home', u: '/demoFarmaciaAusiliatrice/' },
      { t: 'Servizi', u: '/demoFarmaciaAusiliatrice/servizi/' },
      { t: 'Offerte', u: '/demoFarmaciaAusiliatrice/offerte/' },
      { t: 'Prenotazioni', u: '/demoFarmaciaAusiliatrice/prenotazioni/' },
      { t: 'Chi siamo', u: '/demoFarmaciaAusiliatrice/chi-siamo/' },
      { t: 'Dove siamo', u: '/demoFarmaciaAusiliatrice/dove-siamo/' },
      { t: 'Contatti', u: '/demoFarmaciaAusiliatrice/contatti/' },
    ],
    accesso: { t: 'Pannello di gestione', u: '/demoFarmaciaAusiliatrice/gestione/', user: 'ausiliatrice', pass: 'farmacia2026' },
  },
  {
    nome: 'MasGioielli',
    settore: 'Gioielleria e laboratorio orafo',
    dove: 'Corso Trapani 146/b, Torino',
    // bozza /demoMasGioielli/ tolta il 27 ottobre 2026: la versione reale l'aveva superata
    // (i suoi indirizzi portano qui, vedi public/.htaccess)
    dev: {
      url: '/masgioielliDev/',
      stato: 'Versione reale in sviluppo · testi del negozio applicati',
      tecnica: 'Pagine statiche · area riservata con i dati nel browser',
      dentro: [
        'Le pagine della bozza approvata, senza più nulla da bozza: niente note per il titolare, niente dati inventati',
        'Senza database, come la bozza: quello che il negozio cambia dall’area riservata resta su quel dispositivo',
        'Area riservata con accesso protetto: selezione con le foto dal telefono, orari, chiusure straordinarie, marchi',
        'I moduli Contatti e Perizie, senza server, avvisano che il messaggio non parte e indicano WhatsApp e telefono',
        'Fuori da Google finché è in sviluppo; quando è pronto si sposta su masgioielli.it',
      ],
      pagine: [
        { t: 'Home', u: '/masgioielliDev/' },
        { t: 'Selezione', u: '/masgioielliDev/selezione/' },
        { t: 'Atelier', u: '/masgioielliDev/atelier/' },
        { t: 'Compro oro', u: '/masgioielliDev/compro-oro/' },
        { t: 'Perizie', u: '/masgioielliDev/perizie/' },
        { t: 'Contatti', u: '/masgioielliDev/contatti/' },
        { t: 'Privacy', u: '/masgioielliDev/privacy/' },
      ],
      // utente e password sono quelli scritti nell'area riservata (masgioielliDev/_locale.js)
      accesso: { t: 'Area riservata', u: '/masgioielliDev/area-riservata/', user: MAS_UTENTE, pass: MAS_PASSWORD },
      // la checklist della pagina viene da qui: per spuntare una voce, ⬜ → ✅ nel documento
      checklist: 'docs/masgioielli/PRODUZIONE.md',
    },
  },
  {
    nome: 'El Warike',
    settore: 'Ristorante peruviano',
    dove: 'Via Fréjus 52b, Torino',
    url: '/demoElWarike/',
    stato: 'Bozza da mostrare',
    pitch: 'Il “warike” di Gisela: cucina peruana di casa, accanto al suo negozio sudamericano. Il sito fa vedere il locale e riempie i tavoli.',
    dentro: [
      'Prenotazione in tre tocchi: solo giorni e orari in cui il locale è davvero aperto',
      'Menù del pranzo che Gisela aggiorna ogni giorno dal telefono',
      'Pannello: prenotazioni per giorno con i coperti, conferma su WhatsApp, giorni di chiusura',
      'Mancano le foto vere del locale e dei piatti: quelle dei piatti sono a licenza libera',
    ],
    pagine: [
      { t: 'Home', u: '/demoElWarike/' },
      { t: 'Menù', u: '/demoElWarike/menu/' },
      { t: 'Prenota', u: '/demoElWarike/prenota/' },
      { t: 'Privacy', u: '/demoElWarike/privacy/' },
    ],
    accesso: { t: 'Pannello di gestione', u: '/demoElWarike/gestione/', user: 'warike', pass: 'frejus52' },
  },
  {
    nome: 'PuntoPane',
    settore: 'Laboratorio di panificazione · ingrosso',
    dove: 'Torino',
    url: '/demoPuntoPane/',
    stato: 'Bozza da mostrare',
    pitch: 'Un laboratorio che fa pane a lievito madre con farine bio e rifornisce ristoranti, bar, hotel e negozi. Hanno chiesto un sito essenziale: il sito presenta il laboratorio, mostra i prodotti e porta richieste di listino.',
    dentro: [
      'Catalogo con foto e filtri: chi compra spunta «Mi interessa» e i prodotti arrivano già scelti nella richiesta',
      'Pagina per ristoranti, bar, hotel e negozi: cosa portano a ciascuno e come si comincia',
      'Richiesta del listino pensata per l’ingrosso (attività, zona, prodotti, quantità): apre l’email già scritta',
      'Nessun pannello di gestione: hanno chiesto un sito semplice e a costo contenuto',
      'Mancano foto vere, indirizzo del laboratorio e condizioni di fornitura: le foto sono a licenza libera',
    ],
    pagine: [
      { t: 'Home', u: '/demoPuntoPane/' },
      { t: 'Prodotti', u: '/demoPuntoPane/prodotti/' },
      { t: 'Il laboratorio', u: '/demoPuntoPane/laboratorio/' },
      { t: 'Ingrosso', u: '/demoPuntoPane/ingrosso/' },
      { t: 'Contatti', u: '/demoPuntoPane/contatti/' },
      { t: 'Privacy', u: '/demoPuntoPane/privacy/' },
    ],
    // niente `accesso`: questa bozza non ha un'area riservata
  },
];
