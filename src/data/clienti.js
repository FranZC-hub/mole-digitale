// Progetti per clienti reali: li usano le due pagine private
//   /demoClienti/     le bozze da far vedere (dati nel browser, nessun server)
//   /demoClientiDev/  le versioni reali in sviluppo (database, area riservata vera, email)
// Un progetto nasce come bozza; quando il cliente dice si', la versione reale cresce in
// /demoClientiDev/ (campo `dev`) prima di andare sul suo dominio.

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
    url: '/demoMasGioielli/',
    stato: 'Modifiche dell’incontro applicate, con il logo vettoriale',
    pitch: 'Gioielleria dal 1996. Il sito è costruito attorno alle due cose che valgono davvero: il laboratorio e le perizie.',
    dentro: [
      'Logo, foto del negozio, del laboratorio e del titolare: quelle vere, dal loro sito attuale',
      'Selezione del momento senza prezzi, che il negozio aggiorna da solo (foto dal telefono, nome, descrizione)',
      'Nuova pagina Compro oro; perizie per successioni e divisioni ereditarie',
      'Area riservata: selezione in vetrina, orari di apertura e marchi trattati',
    ],
    pagine: [
      { t: 'Home', u: '/demoMasGioielli/' },
      { t: 'Selezione', u: '/demoMasGioielli/vetrina/' },
      { t: 'Atelier', u: '/demoMasGioielli/laboratorio/' },
      { t: 'Compro oro', u: '/demoMasGioielli/compro-oro/' },
      { t: 'Perizie', u: '/demoMasGioielli/perizie/' },
      { t: 'Contatti', u: '/demoMasGioielli/contatti/' },
    ],
    accesso: { t: 'Area riservata', u: '/demoMasGioielli/riservata/', user: 'masgioielli', pass: 'trapani146' },
    dev: {
      url: '/masgioielliDev/',
      stato: 'Versione reale in sviluppo',
      // per ora senza database (SENZA_DATABASE in src/pages/masgioielliDev/_sito.js)
      tecnica: 'Pagine statiche · per ora senza database: i dati restano nel browser',
      dentro: [
        'Le pagine della bozza approvata, senza più nulla da bozza: niente note per il titolare, niente dati inventati',
        'Per ora senza database: quello che il negozio cambia dall’area riservata resta su quel dispositivo (il backend PHP + MySQL è pronto, si riaccende con un interruttore)',
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
      // Le credenziali NON stanno qui (il repository e' pubblico): /demoClientiDev/ le legge
      // durante la build da MAS_DEV_UTENTE / MAS_DEV_PASSWORD (secret di GitHub, per il sito
      // online) oppure, in locale, da .locale/negozio-mysql.json. Senza database l'area riservata
      // usa le stesse credenziali (nella pagina va solo l'impronta della password).
      accesso: { t: 'Area riservata', u: '/masgioielliDev/area-riservata/', env: 'MAS_DEV', locale: '.locale/negozio-mysql.json' },
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
];
