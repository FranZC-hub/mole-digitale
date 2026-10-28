// Le pagine di settore (/siti-web-<settore>-torino/): dati di ciascuna, condivisi dalla pagina
// del settore ([settore].astro) e dalla pagina che le raccoglie tutte (siti-web-torino.astro).
// I contenuti specifici di ogni settore (come cercano i clienti, cosa non deve mancare, la domanda
// tipica) stanno in DETTAGLI, più sotto: sono loro a rendere ogni pagina diversa dalle altre.

export const SETTORI = {
  'siti-web-ristoranti-torino': {
    kicker: 'Per ristoranti e pizzerie',
    h1a: 'Siti web per', h1b: 'ristoranti a Torino',
    intro: "Un sito che fa venire fame e riempie i tavoli: menu aggiornato, prenotazioni online e la tua attività trovata su Google da chi cerca dove mangiare.",
    points: [
      { h: 'Menu digitale', p: 'Sempre aggiornato, leggibile dal telefono, anche con QR code al tavolo.' },
      { h: 'Prenotazione tavolo', p: 'Il cliente prenota in pochi secondi, anche fuori orario.' },
      { h: 'Trovato su Google', p: 'SEO locale + scheda Google per comparire nelle ricerche «vicino a me».' },
    ],
    demoUrl: '/demo/ristorante/', demoName: 'Trattoria del Sole',
  },
  'siti-web-parrucchieri-torino': {
    kicker: 'Per parrucchieri ed estetiste',
    h1a: 'Siti web per', h1b: 'parrucchieri a Torino',
    intro: "Fai prenotare i clienti mentre sono ancora sul divano: appuntamenti online, galleria dei tuoi lavori e un'immagine curata che racconta il tuo stile.",
    points: [
      { h: 'Appuntamenti online', p: 'Servizio, giorno e ora: il cliente prenota da solo, tu risparmi telefonate.' },
      { h: 'Galleria lavori', p: 'Mostra tagli, colori e acconciature: si compra prima con gli occhi.' },
      { h: 'Restyling', p: 'Hai già un sito ma sembra vecchio? Lo rifacciamo moderno mantenendo i contenuti.' },
    ],
    demoUrl: '/demo/salone/', demoName: 'Salone Aurora',
  },
  'siti-web-officine-torino': {
    kicker: 'Per officine e autoriparazioni',
    h1a: 'Siti web per', h1b: 'officine a Torino',
    intro: "Un sito che ispira fiducia: servizi chiari, richiesta preventivo facile e le recensioni Google bene in vista. Così chi cerca un meccanico onesto trova te.",
    points: [
      { h: 'Preventivo facile', p: 'Il cliente ti scrive il problema in un attimo, tu rispondi col preventivo.' },
      { h: 'Scheda Google', p: 'Recensioni e valutazioni in evidenza: la prova sociale che convince.' },
      { h: 'Servizi & orari', p: 'Tagliandi, gomme, diagnosi: tutto chiaro, niente sorprese.' },
    ],
    demoUrl: '/demo/officina/', demoName: 'Garage Rossi',
  },
  'siti-web-bar-torino': {
    kicker: 'Per bar e caffetterie',
    h1a: 'Siti web per', h1b: 'bar a Torino',
    intro: "Un sito che fa venire voglia di entrare: orari sempre giusti, menu e listino a portata di telefono, e la tua caffetteria trovata su Google da chi passa di lì.",
    points: [
      { h: 'Menu & listino', p: 'Colazioni, aperitivi, asporto: tutto chiaro e aggiornato in un attimo.' },
      { h: 'Orari sempre giusti', p: 'Niente clienti davanti alla saracinesca: orari e festività sempre corretti.' },
      { h: 'Trovato su Google', p: 'Comparire quando cercano «bar / colazione vicino a me».' },
    ],
    demoUrl: '/demo/bar/', demoName: 'Caffè Portici',
  },
  'siti-web-estetiste-torino': {
    kicker: 'Per centri estetici ed estetiste',
    h1a: 'Siti web per', h1b: 'estetiste a Torino',
    intro: "Fai prenotare i trattamenti online, mostra i risultati e fatti scegliere per la cura che metti. Un'immagine curata vale già metà dell'appuntamento.",
    points: [
      { h: 'Prenotazione trattamenti', p: 'La cliente sceglie servizio e orario da sola, anche la sera.' },
      { h: 'Galleria risultati', p: 'Mostra ambiente e lavori: la fiducia nasce dagli occhi.' },
      { h: 'Recensioni in vista', p: 'Le valutazioni Google in evidenza per convincere chi è indeciso.' },
    ],
    demoUrl: '/demo/estetica/', demoName: 'Velvèe', widget: 'il quiz «che pelle hai?» che consiglia il trattamento',
  },
  'siti-web-negozi-torino': {
    kicker: 'Per negozi e botteghe',
    h1a: 'Siti web per', h1b: 'negozi a Torino',
    intro: "Porta la tua vetrina online: prodotti in mostra, orari sempre giusti e — se vuoi — vendita con carrello e consegna. Chi cerca cosa vendi, trova te.",
    points: [
      { h: 'Vetrina prodotti', p: 'Mostra i tuoi articoli con foto curate, aggiornati in un attimo.' },
      { h: 'Vendi anche online', p: 'Se vuoi, aggiungiamo carrello e pagamenti: vendi anche a saracinesca chiusa.' },
      { h: 'Trovato su Google', p: 'SEO locale e scheda Google per comparire a chi cerca «vicino a me».' },
    ],
    demoUrl: '/demo/ecommerce/', demoName: 'Bottega Subalpina',
  },
  'siti-web-pasticcerie-torino': {
    kicker: 'Per pasticcerie e panetterie',
    h1a: 'Siti web per', h1b: 'pasticcerie a Torino',
    intro: "Un sito che fa venire l'acquolina: le tue specialità in vetrina, le torte su ordinazione e l'asporto a portata di telefono. Si compra prima con gli occhi.",
    points: [
      { h: 'Vetrina golosa', p: 'Foto curate di torte, lievitati e dolci, sempre aggiornate.' },
      { h: 'Ordini e torte su misura', p: "Il cliente prenota la torta o l'asporto in pochi tocchi, anche di sera." },
      { h: 'Trovato su Google', p: 'Comparire quando cercano «pasticceria» o «torta su ordinazione» a Torino.' },
    ],
    demoUrl: '/demo/ecommerce/', demoName: 'Bottega Subalpina',
  },
  'siti-web-farmacie-torino': {
    kicker: 'Per farmacie e parafarmacie',
    h1a: 'Siti web per', h1b: 'farmacie a Torino',
    intro: "Un sito che rassicura e informa: orari sempre giusti (anche i turni), servizi in chiaro e il consiglio del farmacista a portata di tap. Così chi cerca una farmacia aperta trova te.",
    metaDesc: "Siti web per farmacie a Torino: orari e turni sempre giusti, servizi in chiaro e SEO locale. Chi cerca una farmacia aperta trova te.",
    points: [
      { h: 'Orari e turni sempre giusti', p: 'Widget «aperta ora / chiusa» automatico: niente clienti davanti alla saracinesca.' },
      { h: 'Servizi in evidenza', p: 'Autoanalisi, noleggio, prenotazioni e consegna a domicilio, tutto chiaro.' },
      { h: 'Trovato su Google', p: 'SEO locale per comparire a chi cerca «farmacia di turno» o «aperta adesso».' },
    ],
    demoUrl: '/demo/farmacia/', demoName: 'Farmacia Aurora', widget: 'il widget «aperta/chiusa ora» con orari live',
  },
  'siti-web-dentisti-torino': {
    kicker: 'Per studi dentistici e odontoiatri',
    h1a: 'Siti web per', h1b: 'dentisti a Torino',
    intro: "Un sito che mette a suo agio e fa prenotare: trattamenti spiegati con chiarezza, prima visita gratuita in evidenza e recensioni che tolgono la paura. La fiducia comincia dal sito.",
    metaDesc: "Siti web per dentisti a Torino: trattamenti spiegati con chiarezza, prima visita in evidenza e recensioni che tolgono la paura.",
    points: [
      { h: 'Prima visita online', p: 'Il paziente prenota la prima visita da solo, anche la sera dal divano.' },
      { h: 'Trattamenti chiari', p: 'Implantologia, ortodonzia, igiene: spiegati semplici, senza ansia.' },
      { h: 'Recensioni in vista', p: 'Le valutazioni Google in evidenza per convincere chi è indeciso.' },
    ],
    demoUrl: '/demo/dentista/', demoName: 'Studio Sorriso', widget: 'il simulatore di rate («da X€/mese»)',
  },
  'siti-web-profumerie-torino': {
    kicker: 'Per profumerie e beauty store',
    h1a: 'Siti web per', h1b: 'profumerie a Torino',
    intro: "Un sito elegante come la tua boutique: fragranze in vetrina, consulenza olfattiva su prenotazione e un'immagine raffinata che fa venire voglia di entrare.",
    points: [
      { h: 'Vetrina delle fragranze', p: 'Brand e famiglie olfattive presentati con gusto, sempre aggiornati.' },
      { h: 'Consulenza su prenotazione', p: 'Il cliente prenota la consulenza olfattiva in pochi tocchi.' },
      { h: 'Immagine premium', p: 'Un design curato che comunica qualità e fa percepire il valore.' },
    ],
    demoUrl: '/demo/profumeria/', demoName: 'Essènza', widget: 'il test olfattivo che consiglia la famiglia giusta',
  },
  'siti-web-centri-massaggi-torino': {
    kicker: 'Per centri massaggi e benessere',
    h1a: 'Siti web per', h1b: 'centri massaggi a Torino',
    intro: "Un sito che fa già rilassare: i tuoi massaggi con durate e prezzi chiari, prenotazione online e un'atmosfera che invita a staccare. Si prenota di più quando è tutto semplice.",
    metaDesc: "Siti web per centri massaggi a Torino: durate e prezzi chiari, prenotazione online e un'atmosfera che invita a staccare.",
    points: [
      { h: 'Listino chiaro', p: 'Ogni massaggio con durata e prezzo: niente domande, solo prenotazioni.' },
      { h: 'Appuntamenti online', p: 'Il cliente sceglie trattamento e orario da solo, a qualsiasi ora.' },
      { h: 'Atmosfera curata', p: 'Foto e design che trasmettono calma e fanno percepire la qualità.' },
    ],
    demoUrl: '/demo/massaggi/', demoName: 'Sàva', widget: 'il selettore «come ti senti oggi?» che suggerisce il massaggio',
  },
  'siti-web-osteopati-torino': {
    kicker: 'Per osteopati e fisioterapisti',
    h1a: 'Siti web per', h1b: 'osteopati a Torino',
    intro: "Un sito che spiega e rassicura: per chi è indicata l'osteopatia, come lavori e perché fidarsi. Chi ha mal di schiena cerca su Google — fatti trovare e fai prenotare.",
    points: [
      { h: 'Per chi è indicato', p: 'Mal di schiena, cervicale, sport, gravidanza: il paziente si riconosce e prenota.' },
      { h: 'Il tuo metodo', p: 'Valutazione, trattamento, prevenzione: spiegati in modo chiaro e professionale.' },
      { h: 'Prenotazione valutazione', p: 'Richiesta della prima valutazione in un tap, anche da telefono.' },
    ],
    demoUrl: '/demo/osteopata/', demoName: 'Àsse', widget: 'la mappa del corpo cliccabile («dove ti fa male?»)',
  },
  'siti-web-agenzie-viaggi-torino': {
    kicker: 'Per agenzie viaggi e tour operator',
    h1a: 'Siti web per', h1b: 'agenzie viaggi a Torino',
    intro: "Un sito che fa sognare e poi convertire: destinazioni in vetrina, richiesta preventivo su misura e quel tocco che fa scegliere te invece del solito portale online.",
    points: [
      { h: 'Destinazioni in vetrina', p: 'Le mete del momento con foto che fanno venire voglia di partire.' },
      { h: 'Preventivo su misura', p: 'Il cliente racconta il viaggio dei sogni, tu rispondi con una proposta.' },
      { h: 'Il valore del consulente', p: 'Racconti perché un viaggio cucito su misura batte il fai-da-te.' },
    ],
    demoUrl: '/demo/viaggi/', demoName: 'Vàgo', widget: 'il filtro destinazioni per budget',
  },
  'siti-web-nail-studio-torino': {
    kicker: 'Per nail studio e onicotecniche',
    h1a: 'Siti web per', h1b: 'nail studio a Torino',
    intro: "Un sito che mostra quanto sei brava: gallery dei tuoi lavori, listino chiaro e prenotazione facile. La nail art si compra con gli occhi — falla vedere.",
    points: [
      { h: 'Gallery dei lavori', p: 'Le tue creazioni in bella mostra: la prossima cliente sceglie guardando.' },
      { h: 'Listino trasparente', p: 'Manicure, gel, ricostruzione, nail art: prezzi chiari, niente sorprese.' },
      { h: 'Prenotazione facile', p: 'Appuntamento in pochi tocchi, con tanto di ispirazioni allegate.' },
    ],
    demoUrl: '/demo/nails/', demoName: 'Lúnula', widget: 'gli swatch smalto che cambiano i colori del sito',
  },
  'siti-web-veterinari-torino': {
    kicker: 'Per ambulatori e cliniche veterinarie',
    h1a: 'Siti web per', h1b: 'veterinari a Torino',
    intro: "Un sito che ispira fiducia a chi ama il suo animale: servizi chiari, urgenze 24/7 in evidenza e prenotazione visita semplice. Quando il cane sta male, ti trovano subito.",
    metaDesc: "Siti web per veterinari a Torino: servizi chiari, urgenze 24/7 in evidenza e prenotazione visita semplice. Ti trovano subito.",
    points: [
      { h: 'Urgenze in evidenza', p: 'Numero per le emergenze sempre visibile: in un attimo ti chiamano.' },
      { h: 'Servizi e prenotazioni', p: 'Visite, vaccinazioni, chirurgia: tutto chiaro, appuntamento in un tap.' },
      { h: 'Trovato su Google', p: 'SEO locale per comparire a chi cerca «veterinario vicino a me».' },
    ],
    demoUrl: '/demo/animali/', demoName: 'Zampe Amiche', widget: 'il triage sintomi («è un\'urgenza?»)',
  },
  'siti-web-lavanderie-torino': {
    kicker: 'Per lavanderie e lavasecco',
    h1a: 'Siti web per', h1b: 'lavanderie a Torino',
    intro: "Un sito comodo come il tuo servizio: come funziona in 3 passi, listino chiaro e ritiro a domicilio prenotabile online. Più richieste, meno telefonate.",
    points: [
      { h: 'Come funziona, chiaro', p: 'Porti o prenoti, laviamo, riconsegniamo: il cliente capisce in 10 secondi.' },
      { h: 'Listino trasparente', p: 'Prezzi per capo in tabella: niente preventivi al telefono.' },
      { h: 'Ritiro a domicilio', p: 'Il cliente prenota il ritiro online: comodità che fidelizza.' },
    ],
    demoUrl: '/demo/lavanderia/', demoName: 'Bollé', widget: 'il calcolatore del bucato con totale live',
  },
  'siti-web-ristoranti-giapponesi-torino': {
    kicker: 'Per sushi e ristoranti giapponesi',
    h1a: 'Siti web per', h1b: 'ristoranti giapponesi a Torino',
    intro: "Un sito elegante come il tuo locale: menu giapponese curato, prenotazione tavolo e asporto/delivery in evidenza. L'esperienza comincia dallo schermo.",
    points: [
      { h: 'Menu curato', p: 'Nigiri, uramaki, sashimi e special: presentati con stile e sempre aggiornati.' },
      { h: 'Prenotazione & delivery', p: 'Tavolo, asporto e consegna: il cliente sceglie come gustarti.' },
      { h: 'Immagine premium', p: 'Design raffinato che comunica qualità e giustifica il prezzo.' },
    ],
    demoUrl: '/demo/sushi/', demoName: 'Hashi', widget: 'il filtro menu crudo/cotto/veggie',
  },
  'siti-web-hotel-torino': {
    kicker: 'Per hotel, B&B e affittacamere',
    h1a: 'Siti web per', h1b: 'hotel a Torino',
    intro: "Ogni prenotazione che passa da un portale ti costa il 15-18% di commissione. Un sito che fa prenotare diretto si ripaga in poche notti — e i clienti stranieri lo leggono nella loro lingua.",
    metaDesc: "Siti web per hotel e B&B a Torino: prenotazione diretta senza commissioni, camere e servizi anche in inglese, trovati su Google.",
    points: [
      { h: 'Prenotazione diretta', p: 'Date, prezzo e richiesta in tre tocchi: la commissione del portale resta a te.' },
      { h: 'Anche in inglese', p: 'Camere, servizi e informazioni pratiche nella lingua di chi arriva da fuori.' },
      { h: 'Trovato su Google', p: 'Chi cerca «hotel centro Torino» arriva da te, non su un portale.' },
    ],
    demoUrl: '/demo/hotel/', demoName: 'Albergo del Teatro', widget: 'il preventivo per date, col confronto su quanto costerebbe la stessa camera su un portale',
  },
  'siti-web-gioiellerie-torino': {
    kicker: 'Per gioiellerie e laboratori orafi',
    h1a: 'Siti web per', h1b: 'gioiellerie a Torino',
    intro: "Un gioiello si sceglie dal vivo, ma si cerca online. Il sito porta in negozio chi sta guardando: la vetrina, le riparazioni e le perizie, spiegate come le spieghi al banco.",
    metaDesc: "Siti web per gioiellerie a Torino: vetrina delle collezioni, riparazioni e perizie in chiaro, e la fiducia che serve per farsi affidare un gioiello.",
    points: [
      { h: 'La vetrina, sempre aperta', p: 'Collezioni e pezzi unici da guardare con calma, e da venire a provare in negozio.' },
      { h: 'Riparazioni e perizie', p: 'I servizi che portano il lavoro più redditizio, spiegati e prenotabili.' },
      { h: 'Fiducia prima di tutto', p: 'Chi affida un gioiello vuole sapere chi sei: storia, laboratorio e garanzie in chiaro.' },
    ],
    demoUrl: '/demo/gioielleria/', demoName: 'Lùmina', widget: 'la lista dei preferiti da portare in boutique e il configuratore della fede su misura',
  },
  'siti-web-addestratori-cani-torino': {
    kicker: 'Per addestratori ed educatori cinofili',
    h1a: 'Siti web per', h1b: 'addestratori cani a Torino',
    intro: "Un sito che trasmette fiducia ai proprietari: percorsi chiari, metodo gentile e lezione di prova in evidenza. Chi cerca un educatore per il proprio cane trova te.",
    points: [
      { h: 'Percorsi chiari', p: 'Cuccioli, educazione di base, problemi di comportamento: ognuno trova il suo.' },
      { h: 'Lezione di prova', p: 'La prima lezione di prova in evidenza: il modo più facile per iniziare.' },
      { h: 'Metodo e fiducia', p: 'Racconti il tuo approccio gentile: i proprietari scelgono di pancia.' },
    ],
    demoUrl: '/demo/addestratore/', demoName: 'Coda Felice', widget: 'il configuratore del percorso su misura',
  },
};

// Gruppi della pagina che raccoglie tutti i settori, nell'ordine in cui compaiono.
export const GRUPPI = [
  { id: 'ristorazione', t: 'Ristorazione' },
  { id: 'bellezza', t: 'Bellezza e benessere' },
  { id: 'salute', t: 'Salute' },
  { id: 'negozi', t: 'Negozi' },
  { id: 'servizi', t: 'Servizi e ospitalità' },
];

// Quello che rende ogni pagina di settore diversa dalle altre (prima ~80 parole su 460 lo erano,
// il resto era uguale in tutte e 20: per Google erano quasi fotocopie). Per ogni settore:
//   etichetta  il nome nella pagina che li raccoglie e nei link tra settori
//   cercano    come cercano e come scelgono i clienti di quel settore
//   esempio    una scena tipica, dichiaratamente ipotetica («Immagina…»): non sono clienti veri
//   checklist  cosa non deve mancare sul sito, specifico del settore
//   domanda    la domanda che fanno davvero, aggiunta alle FAQ della pagina
//   domanda2   una seconda domanda tipica del settore (le FAQ generiche erano uguali su tutte e 20)
// Le note normative (allergeni, pubblicità sanitaria, CIN, farmaci online) sono di principio:
// i dettagli si verificano col cliente quando si fa il sito.
const DETTAGLI = {
  'siti-web-ristoranti-torino': {
    etichetta: 'Ristoranti e pizzerie', gruppo: 'ristorazione',
    cercano: 'Chi cerca dove mangiare decide in pochi minuti, quasi sempre dal telefono: «ristorante piemontese San Salvario», «pizzeria aperta ora», «dove mangiare vicino a Porta Nuova». Guarda le foto dei piatti, controlla menu e prezzi, legge due recensioni e prenota. Se il menu è un PDF illeggibile o gli orari sono sbagliati, passa al locale dopo.',
    esempio: "Immagina una trattoria in Borgo San Paolo. Sabato pomeriggio una coppia cerca «trattoria piemontese vicino a me»: trova la scheda Google, apre il sito, vede il menu con i prezzi e le foto dei tajarin, sceglie le 20:30 e prenota in tre tocchi. Il titolare trova la prenotazione sul telefono, senza aver risposto a nessuna chiamata.",
    checklist: [
      { h: 'Il menu in pagina, non in PDF', p: 'Leggibile dal telefono, con i prezzi, e aggiornabile in un minuto quando cambia un piatto.' },
      { h: 'Gli allergeni', p: 'Indicati nel menu o con un modo chiaro per chiederli: è un obbligo, e i clienti li cercano.' },
      { h: 'La prenotazione senza telefonate', p: 'Giorno, ora e coperti: arriva anche quando il locale è chiuso.' },
      { h: 'Foto vere del locale', p: 'Sala, dehors, piatti: è quello che fa scegliere te invece del vicino.' },
    ],
    domanda: { q: 'Posso cambiare il menu da solo?', a: 'Sì: il menu è una pagina del sito, non un file da rifare. Possiamo darti un piccolo pannello per aggiornare piatti e prezzi dal telefono, oppure ce lo mandi su WhatsApp e lo aggiorniamo noi.' },
    domanda2: { q: "Posso avere il menu anche in inglese?", a: "Sì, ed è un aiuto concreto con i turisti che arrivano a Torino. I prezzi si cambiano una volta sola e valgono per entrambe le lingue; per i piatti nuovi basta mandarci la traduzione, o la facciamo noi." },
  },
  'siti-web-ristoranti-giapponesi-torino': {
    etichetta: 'Ristoranti giapponesi e sushi', gruppo: 'ristorazione',
    cercano: 'Per il sushi si cerca soprattutto la formula: «sushi all you can eat Torino», «sushi da asporto», «ristorante giapponese tradizionale». Contano il menu con le foto, il prezzo della formula a pranzo e a cena, le regole del «giapponese a volontà» e la possibilità di ordinare da asporto senza passare dalle app.',
    esempio: "Immagina un ristorante giapponese a Vanchiglia. Un gruppo di amici cerca «sushi all you can eat Torino» alle sette di sera: sul sito trova il prezzo della formula cena, le regole, le foto dei piatti e il bottone per l’asporto. Due di loro ordinano da portare via, gli altri prenotano un tavolo per sei.",
    checklist: [
      { h: 'Il menu con le foto', p: 'Nel sushi si ordina con gli occhi: ogni piatto con la sua immagine.' },
      { h: 'Formule e prezzi chiari', p: 'Pranzo, cena, weekend, bambini: niente sorprese al conto.' },
      { h: 'L’asporto diretto', p: 'Ordine dal sito e ritiro al ristorante, senza le commissioni delle app.' },
      { h: 'Gli allergeni piatto per piatto', p: 'Pesce crudo, sesamo, soia, glutine: chi ha un’allergia lo cerca prima di prenotare.' },
    ],
    domanda: { q: 'Posso ricevere ordini da asporto dal sito?', a: 'Sì: il cliente sceglie i piatti e l’orario di ritiro, l’ordine ti arriva su WhatsApp o per email. Ogni ordine che passa dal sito è un ordine senza le commissioni delle app di consegna.' },
    domanda2: { q: "Posso spiegare le regole dell’all you can eat?", a: "Sì, ed è una delle cose più cercate: prezzo a pranzo e a cena, quanti piatti per ordine, cosa è escluso dalla formula, come funzionano gli avanzi. Scritto chiaro sul sito, evita discussioni al tavolo." },
  },
  'siti-web-bar-torino': {
    etichetta: 'Bar e caffetterie', gruppo: 'ristorazione',
    cercano: 'Al bar si arriva quasi sempre a piedi e all’ultimo momento: «bar colazione vicino a me», «aperitivo Vanchiglia», «bar aperto domenica». La scelta si fa sulla scheda Google e sul sito, in pochi secondi: orari giusti, una foto che invoglia e il listino. Il resto lo fa la posizione.',
    esempio: "Immagina un bar in Crocetta. Una mattina d’agosto qualcuno cerca «bar aperto vicino a me»: il sito e la scheda dicono che sei aperto anche ad agosto, con gli orari giusti. Vede la foto delle brioche e del dehors, e attraversa la strada. Senza quell’informazione sarebbe andato dove era sicuro di trovare aperto.",
    checklist: [
      { h: 'Orari sempre giusti', p: 'Anche festivi e chiusure per ferie: niente clienti davanti alla saracinesca.' },
      { h: 'Colazione, pranzo, aperitivo', p: 'Cosa offri in ogni momento della giornata, con i prezzi principali.' },
      { h: 'Foto del banco e del dehors', p: 'È lì che si decide se entrare.' },
      { h: 'Eventi e partite', p: 'Serate, musica, maxischermo: una pagina che aggiorni quando serve.' },
    ],
    domanda: { q: 'Mi serve davvero un sito se ho la scheda Google?', a: 'La scheda ti fa trovare, il sito ti fa scegliere: menu, foto, eventi e prenotazioni per i gruppi stanno lì. E una scheda collegata a un sito curato è più completa agli occhi di Google e dei clienti.' },
    domanda2: { q: "Posso far prenotare i tavoli per l’aperitivo o una festa?", a: "Sì: per gruppi e serate un modulo raccoglie giorno, ora e numero di persone, e ti arriva su WhatsApp. Per la colazione di tutti i giorni non serve: lì contano orari giusti e posizione." },
  },
  'siti-web-pasticcerie-torino': {
    etichetta: 'Pasticcerie', gruppo: 'ristorazione',
    cercano: 'Le ricerche hanno quasi sempre una data: «torta di compleanno Torino», «pasticceria per matrimonio», «colomba artigianale». Chi ordina vuole vedere le torte già fatte, capire con quanto anticipo prenotare e quanto costa al chilo. Il sito che risponde a queste tre domande riceve l’ordine.',
    esempio: "Immagina una pasticceria in Santa Rita. Una mamma cerca «torta di compleanno Torino» due settimane prima della festa: sul sito vede le torte già fatte, il prezzo al chilo e il modulo per ordinare con gusto, numero di persone e data di ritiro. L’ordine arriva per iscritto, e in negozio basta confermare.",
    checklist: [
      { h: 'La galleria delle torte su ordinazione', p: 'Compleanni, cerimonie, cake design: si sceglie guardando.' },
      { h: 'La richiesta d’ordine con la data', p: 'Gusto, numero di persone, giorno di ritiro: arriva tutto per iscritto.' },
      { h: 'Le ricorrenze', p: 'Colombe, panettoni, uova di Pasqua: una pagina che cambia con le stagioni.' },
      { h: 'Allergeni e intolleranze', p: 'Senza glutine, senza lattosio: se lo fai, dillo chiaramente.' },
    ],
    domanda: { q: 'Posso ricevere gli ordini delle torte dal sito?', a: 'Sì: un modulo raccoglie gusto, dimensioni, scritta e data di ritiro, e ti arriva per email o su WhatsApp. Tu confermi e chiedi l’eventuale acconto come fai oggi.' },
    domanda2: { q: "Conviene mostrare i prezzi delle torte?", a: "Per le torte più richieste un prezzo al chilo o un «a partire da» aiuta chi deve decidere e toglie le telefonate fatte solo per chiedere quanto costa. Per il cake design su misura è meglio la richiesta di preventivo." },
  },
  'siti-web-parrucchieri-torino': {
    etichetta: 'Parrucchieri', gruppo: 'bellezza',
    cercano: 'Chi cambia parrucchiere cerca su Google «parrucchiere Crocetta» o «colore capelli Torino», poi guarda Instagram e il sito per capire lo stile. Decide guardando i lavori, i prezzi indicativi e quanto è facile prenotare. Chi può fissare l’appuntamento la sera, senza chiamare, prenota da chi lo permette.',
    esempio: "Immagina un salone in San Salvario. Alle dieci di sera una cliente nuova cerca «colore capelli San Salvario», guarda la galleria dei lavori, vede da che prezzo parte un colore e prenota martedì alle 15 con la stessa stilista delle foto. La mattina dopo, in salone, l’appuntamento è già in agenda.",
    checklist: [
      { h: 'Il listino con i «a partire da»', p: 'Taglio, piega, colore, trattamenti: i prezzi indicativi tolgono l’imbarazzo di chiedere.' },
      { h: 'Una prenotazione che conosce le durate', p: 'Un colore non dura quanto una piega: l’agenda propone solo gli orari giusti.' },
      { h: 'La galleria dei lavori', p: 'Prima e dopo, colori, tagli: con un tocco si passa al tuo Instagram.' },
      { h: 'Chi c’è nel salone', p: 'Le persone e le loro specialità: si sceglie anche chi ti mette le mani in testa.' },
    ],
    domanda: { q: 'Il sito si collega a Instagram?', a: 'Sì: dal sito un tocco porta al tuo profilo, e nella galleria mettiamo i lavori migliori che ci mandi. Così chi arriva da Google vede subito il tuo stile.' },
    domanda2: { q: "Posso mostrare i prezzi senza vincolarmi?", a: "Sì, con un listino «a partire da»: il cliente si orienta prima di prenotare, e il prezzo finale lo definisci in salone in base a lunghezza e trattamento." },
  },
  'siti-web-estetiste-torino': {
    etichetta: 'Centri estetici', gruppo: 'bellezza',
    cercano: 'Chi cerca un centro estetico confronta: «pulizia viso Torino», «laminazione ciglia Cit Turin», «epilazione laser prezzi». Legge i trattamenti, guarda l’ambiente e le recensioni, e prenota dove è più semplice. Spesso la sera, a centro chiuso: se si può prenotare solo per telefono, la cliente va altrove.',
    esempio: "Immagina un centro estetico in Cit Turin. Una cliente cerca «laminazione ciglia Torino» la domenica sera: sul sito trova il trattamento con durata e prezzo, le foto delle cabine e la prenotazione online. Prenota per giovedì e, già che c’è, guarda i buoni regalo per il compleanno di un’amica.",
    checklist: [
      { h: 'Trattamenti con durata e prezzo', p: 'Una scheda per ogni trattamento: cos’è, quanto dura, quanto costa.' },
      { h: 'La prenotazione online', p: 'Con le durate giuste: meno buchi in agenda, meno telefonate.' },
      { h: 'Pacchetti e buoni regalo', p: 'Il regalo più facile per chi non sa cosa regalare, richiedibile dal sito.' },
      { h: 'L’ambiente', p: 'Foto vere delle cabine e del centro: si sceglie anche dove ci si sente a proprio agio.' },
    ],
    domanda: { q: 'Posso vendere buoni regalo dal sito?', a: 'Sì: si può partire da una semplice richiesta con ritiro in istituto e, se serve, aggiungere il pagamento online. Sotto le feste è uno dei motivi per cui si visita il sito.' },
    domanda2: { q: "Posso pubblicare le foto prima e dopo?", a: "Sì, con il consenso scritto della cliente, e senza viso riconoscibile se non serve. Le foto vere dei tuoi lavori e del centro convincono molto più di quelle di repertorio." },
  },
  'siti-web-nail-studio-torino': {
    etichetta: 'Nail studio', gruppo: 'bellezza',
    cercano: 'Le unghie si scelgono con gli occhi: «nail art Torino», «ricostruzione unghie Barriera di Milano», «semipermanente vicino a me», e poi dritte su Instagram. Il sito serve a chiudere: listino chiaro, galleria dei lavori e una prenotazione che sa quanto dura un refill rispetto a una ricostruzione.',
    esempio: "Immagina un nail studio in Barriera di Milano. Una ragazza vede una foto su Instagram, cerca il nome dello studio su Google e arriva al sito: listino chiaro, galleria divisa per stili, prenotazione con l’onicotecnica che ha fatto quel lavoro. Sceglie un refill con nail art, e il sabato è già in agenda.",
    checklist: [
      { h: 'La galleria nail art', p: 'I lavori migliori, divisi per stile: si prenota indicando quello che piace.' },
      { h: 'Il listino dei servizi', p: 'Semipermanente, ricostruzione, refill, nail art: prezzi e durate.' },
      { h: 'Una prenotazione con le durate giuste', p: 'Niente sovrapposizioni in agenda.' },
      { h: 'Il collegamento a Instagram', p: 'Per chi vuole vedere gli ultimi lavori.' },
    ],
    domanda: { q: 'Le clienti possono prenotare con la stessa onicotecnica?', a: 'Sì: ogni operatrice ha la sua agenda e la cliente sceglie con chi prenotare. Le abituali la ritrovano in un attimo.' },
    domanda2: { q: "Posso mostrare i lavori fatti alle clienti?", a: "Sì, ed è il tuo biglietto da visita: basta il permesso della cliente, e di solito si vedono solo le mani. Una galleria divisa per stile fa prenotare chi cerca proprio quello." },
  },
  'siti-web-centri-massaggi-torino': {
    etichetta: 'Centri massaggi e benessere', gruppo: 'bellezza',
    cercano: 'Chi cerca un massaggio guarda tre cose: il tipo («massaggio decontratturante Torino», «massaggio di coppia»), la durata e il prezzo. Poi le foto dell’ambiente, per capire se è il posto giusto in cui rilassarsi. La prenotazione arriva spesso la sera, o all’ultimo momento per un regalo.',
    esempio: "Immagina un centro benessere in Borgo Po. Prima di San Valentino qualcuno cerca «massaggio di coppia Torino»: sul sito trova il massaggio di coppia con durata e prezzo, le foto della stanza e i buoni regalo. Ne compra uno da regalare, e chi lo riceve prenota online il giorno dopo.",
    checklist: [
      { h: 'Massaggi con durata e prezzo', p: '30, 50, 80 minuti: tutto chiaro prima di prenotare.' },
      { h: 'La prenotazione online', p: 'Con l’operatore preferito, se il cliente lo desidera.' },
      { h: 'I buoni regalo', p: 'Per compleanni e anniversari è il regalo più cercato.' },
      { h: 'Le parole giuste', p: 'Massaggi per il benessere, senza promesse sanitarie che non si possono fare.' },
    ],
    domanda: { q: 'Come gestisco le prenotazioni con più operatori?', a: 'Ogni operatore ha la sua agenda e i suoi massaggi: il cliente sceglie il trattamento e vede solo gli orari davvero liberi.' },
    domanda2: { q: "Posso descrivere i benefici dei massaggi?", a: "Sì, parlando di benessere, relax e tensioni che si sciolgono. Effetti terapeutici e promesse di cura spettano ai professionisti sanitari: li evitiamo, anche per non avere problemi." },
  },
  'siti-web-profumerie-torino': {
    etichetta: 'Profumerie', gruppo: 'bellezza',
    cercano: 'Chi cerca una profumeria a Torino sa già cosa vuole, o vuole essere consigliato: «profumeria artistica Torino», «profumi di nicchia Torino». Cerca le marche che tratti, l’atmosfera del negozio e un modo per chiedere un consiglio o un campione. Il sito porta in negozio chi non vuole comprare un profumo alla cieca online.',
    esempio: "Immagina una profumeria artistica in centro. Un cliente cerca una fragranza di nicchia che online non trova da nessuna parte: sul sito vede che trattate quella maison, prenota una consulenza di mezz’ora per sabato e ci va. Esce con il profumo che cercava e con un secondo flacone da regalare.",
    checklist: [
      { h: 'Le marche e le collezioni', p: 'Molti cercano per maison: elencarle ti fa trovare.' },
      { h: 'La consulenza su appuntamento', p: 'Mezz’ora dedicata per trovare la fragranza giusta, prenotata dal sito.' },
      { h: 'I buoni regalo', p: 'Il regalo giusto per chi non conosce i gusti di chi lo riceve.' },
      { h: 'Ordina e ritira', p: 'Il profumo prenotato online, ritirato in negozio già confezionato.' },
    ],
    domanda: { q: 'Ha senso un sito se le grandi catene vendono online?', a: 'Sì, se racconta quello che le catene non hanno: la selezione, il consiglio, le marche introvabili. È quello che porta da te chi cerca qualcosa di diverso.' },
    domanda2: { q: "Posso vendere le fragranze online?", a: "Si può, con un piccolo catalogo e il ritiro in negozio o la spedizione. Molte profumerie partono da «prenota e ritira»: niente magazzino online da gestire, e il cliente viene in negozio, dove trova il consiglio." },
  },
  'siti-web-dentisti-torino': {
    etichetta: 'Dentisti e studi odontoiatrici', gruppo: 'salute',
    cercano: 'Il dentista si cerca in due modi: con calma («dentista Santa Rita», «impianti dentali Torino») o con urgenza («dentista urgenze sabato Torino»). Nel primo caso si confrontano studio, trattamenti e recensioni; nel secondo vince chi mostra subito come farsi ricevere. Il sito deve servire a entrambi.',
    esempio: "Immagina uno studio dentistico in Santa Rita. Un paziente con un dente che fa male cerca «dentista urgenze Torino» il sabato mattina: il sito mostra in alto il numero per le urgenze e gli orari in cui lo studio risponde. Un altro, con calma, legge come si svolge un impianto e prenota la prima visita online.",
    checklist: [
      { h: 'Trattamenti spiegati', p: 'Igiene, impianti, ortodonzia, estetica: cosa sono e come si svolgono, senza gergo.' },
      { h: 'La prima visita prenotabile', p: 'In due tocchi, con i giorni disponibili.' },
      { h: 'Le urgenze in evidenza', p: 'Se le ricevi, dillo in alto: è lì che guarda chi ha mal di denti.' },
      { h: 'Un tono informativo', p: 'Le regole sulla pubblicità sanitaria chiedono contenuti informativi, non promozionali: li scriviamo così.' },
    ],
    domanda: { q: 'Posso pubblicare offerte e promozioni?', a: 'Le informazioni su servizi e modalità sì; offerte e toni promozionali vanno evitati, perché la comunicazione delle strutture sanitarie deve restare informativa. Impostiamo il sito tenendone conto fin dall’inizio.' },
    domanda2: { q: "Posso mostrare i casi trattati?", a: "Solo con il consenso scritto del paziente, senza dati che lo rendano riconoscibile e con un tono informativo: si mostra cosa si può fare, senza promettere risultati." },
  },
  'siti-web-osteopati-torino': {
    etichetta: 'Osteopati', gruppo: 'salute',
    metaDesc: 'Siti web per osteopati a Torino: per chi è indicata l’osteopatia, come lavori e la prima seduta prenotabile online. Fatti trovare da chi cerca.',
    cercano: 'Chi ha mal di schiena cerca «osteopata Torino», «osteopata per neonati», «osteopata sportivo». Prima di prenotare vuole capire se l’osteopatia fa per lui, come si svolge una seduta e chi è il professionista: formazione, approccio, recensioni. Un sito che spiega bene trasforma il dubbio in un appuntamento.',
    esempio: "Immagina uno studio di osteopatia a Mirafiori. Una neomamma cerca «osteopata per neonati Torino»: sul sito trova per chi è indicata l’osteopatia pediatrica, come si svolge la seduta e chi è il professionista. Senza dover telefonare per chiedere tutto, prenota la prima seduta online.",
    checklist: [
      { h: 'Per chi è indicata', p: 'Adulti, sportivi, gravidanza, neonati: chi si riconosce, prenota.' },
      { h: 'Come si svolge una seduta', p: 'Durata, cosa portare, cosa aspettarsi: meno ansia, più prenotazioni.' },
      { h: 'Chi sei', p: 'Formazione e percorso, raccontati in modo semplice.' },
      { h: 'Niente promesse di guarigione', p: 'Un tono informativo è più credibile, e più corretto.' },
    ],
    domanda: { q: 'Posso far prenotare la prima seduta online?', a: 'Sì, con i tuoi orari e le durate giuste. Puoi anche chiedere due righe sul motivo della visita, così arrivi preparato.' },
    domanda2: { q: "Conviene spiegare la differenza con il fisioterapista?", a: "Sì: molti non la conoscono. Due righe chiare su cosa fa l’osteopata e quando conviene rivolgersi a lui tolgono un dubbio che altrimenti fa rimandare la prenotazione." },
  },
  'siti-web-veterinari-torino': {
    etichetta: 'Veterinari e ambulatori', gruppo: 'salute',
    cercano: 'Per gli animali si cerca in due momenti: con calma («veterinario per gatti Torino», «vaccini cane») o con l’ansia («veterinario urgenze notte Torino»). Nel secondo caso servono subito telefono e orari di reperibilità; nel primo, i servizi, le specie trattate e la possibilità di prenotare una visita.',
    esempio: "Immagina un ambulatorio veterinario in Aurora. Di notte un proprietario cerca «veterinario urgenze Torino» con il gatto che sta male: il sito mostra subito il numero di reperibilità. Il giorno dopo un’altra cliente, con calma, prenota online il richiamo del vaccino del cane, senza occupare il telefono.",
    checklist: [
      { h: 'Le urgenze in alto', p: 'Numero e orari di reperibilità visibili subito, anche da telefono.' },
      { h: 'Servizi e specie trattate', p: 'Cani e gatti, ma anche esotici? Dillo: chi ha un coniglio cerca proprio quello.' },
      { h: 'La prenotazione delle visite', p: 'Vaccini, controlli, chirurgia programmata: separati dalle urgenze.' },
      { h: 'Consigli per i proprietari', p: 'Zecche, viaggi, alimentazione: guide brevi che aiutano e ti fanno trovare.' },
    ],
    domanda: { q: 'Come separo le urgenze dalle visite normali?', a: 'Con due strade ben distinte: in alto il numero per le urgenze, e un modulo di prenotazione per tutto il resto. Così il telefono squilla per le cose che contano.' },
    domanda2: { q: "Conviene pubblicare le tariffe delle visite?", a: "Molti proprietari le cercano. Se scegli di pubblicarle, meglio come prezzi indicativi per le prestazioni più comuni, come visita e vaccini, spiegando che il costo finale si definisce dopo la visita." },
  },
  'siti-web-farmacie-torino': {
    etichetta: 'Farmacie', gruppo: 'salute',
    cercano: 'La farmacia si cerca quasi sempre per un bisogno preciso: «farmacia di turno Torino», «farmacia aperta ora», «ECG in farmacia», «prenotazione CUP in farmacia». Contano orari e turni corretti, i servizi in chiaro e la possibilità di prenotarli. È il tipo di ricerca in cui chi risponde meglio vince subito.',
    esempio: "Immagina una farmacia in San Donato. Una signora cerca «farmacia di turno Torino» la domenica: il sito dice se siete di turno e fino a che ora. Un altro cliente legge che fate l’ECG in farmacia e lo prenota per giovedì, e intanto mette da parte due prodotti delle offerte del mese da ritirare.",
    checklist: [
      { h: 'Turni e orari aggiornati', p: 'Con la pausa pranzo e i giorni di turno: è la prima cosa che si cerca.' },
      { h: 'I servizi prenotabili', p: 'ECG, holter, autoanalisi, tamponi, CUP: ognuno con la sua pagina e la prenotazione.' },
      { h: 'Le offerte del mese', p: 'Parafarmaco e cosmetica in vetrina, da prenotare e ritirare.' },
      { h: 'Il consiglio del farmacista', p: 'Brevi guide di stagione: aiutano i clienti e ti fanno trovare su Google.' },
    ],
    domanda: { q: 'Posso vendere online dal sito?', a: 'Parafarmaco e cosmetica sì, come un normale negozio online. Per vendere a distanza i farmaci senza ricetta servono invece l’autorizzazione e il logo comune europeo: ti aiutiamo a capire cosa serve prima di partire.' },
    domanda2: { q: "Posso far prenotare il CUP dal sito?", a: "Il sito non sostituisce il sistema della Regione, ma può raccogliere la richiesta: il cliente indica la prestazione e quando passa, e voi la prenotate al banco. Meno code e meno telefonate." },
  },
  'siti-web-negozi-torino': {
    etichetta: 'Negozi', gruppo: 'negozi',
    cercano: 'Prima di uscire di casa si controlla: «negozio scarpe bambino Torino», «ferramenta aperta sabato», «dove comprare… vicino a me». Chi cerca vuole sapere se hai quello che serve, se sei aperto e come arrivare. Un sito con i prodotti principali e gli orari giusti porta in negozio chi altrimenti comprerebbe online.',
    esempio: "Immagina un negozio di articoli per la casa in Borgo Vittoria. Un cliente cerca «pentole in ghisa Torino»: sul sito trova la marca che cerca tra quelle che trattate, vede che siete aperti il sabato pomeriggio e prenota il pezzo con «ordina e ritira». Passa a prenderlo e, già che c’è, compra anche altro.",
    checklist: [
      { h: 'La vetrina dei prodotti', p: 'Le categorie e i pezzi forti, con le foto: non serve mettere tutto il magazzino.' },
      { h: 'Ordina e ritira', p: 'Il cliente prenota online e passa a prendere: comodo per lui, vendita sicura per te.' },
      { h: 'Le marche trattate', p: 'Molti cercano per marca: elencarle ti fa trovare.' },
      { h: 'Orari, mappa, parcheggio', p: 'Le domande più fatte, con la risposta prima che le facciano.' },
    ],
    domanda: { q: 'Mi conviene un e-commerce completo?', a: 'Dipende da cosa vendi e da chi ti compra. Per molti negozi di quartiere funziona meglio una vetrina con «ordina e ritira»: costa meno, non richiede spedizioni e porta gente in negozio. Se le richieste crescono, il carrello si aggiunge.' },
    domanda2: { q: "Devo mettere online tutto il magazzino?", a: "No: bastano le categorie e i pezzi forti, aggiornati quando cambia la stagione. Il sito deve far venire in negozio, non copiare il gestionale." },
  },
  'siti-web-gioiellerie-torino': {
    etichetta: 'Gioiellerie e laboratori orafi', gruppo: 'negozi',
    cercano: 'In gioielleria si entra per fiducia, e oggi la fiducia si costruisce prima, online: «gioielleria Torino fedi», «riparazione orologi Torino», «compro oro Torino». Chi cerca vuole vedere lo stile delle collezioni, capire i servizi di laboratorio e sapere da quanti anni esistete. Le recensioni fanno il resto.',
    esempio: "Immagina una gioielleria di quartiere aperta da trent’anni. Una coppia cerca «fedi nuziali Torino»: sul sito vede lo stile delle collezioni, i servizi del laboratorio e da quanti anni esiste il negozio. Chiede un appuntamento per provare le fedi, e nello stesso giorno un’altra cliente porta a riparare l’orologio del nonno.",
    checklist: [
      { h: 'Le collezioni in vetrina', p: 'Una selezione di pezzi, aggiornabile dal negozio, per far venire voglia di entrare.' },
      { h: 'Laboratorio e riparazioni', p: 'Saldature, misure, orologi: i servizi spiegati, con i tempi.' },
      { h: 'Il compro oro con il numero OAM', p: 'Se lo fai, l’iscrizione all’OAM in evidenza: rassicura chi deve vendere.' },
      { h: 'La vostra storia', p: 'Da quanti anni, chi c’è dietro il banco: in gioielleria conta.' },
    ],
    domanda: { q: 'Posso aggiornare la vetrina da solo?', a: 'Sì: da un’area riservata carichi le foto dei nuovi pezzi dal telefono, con nome e descrizione. Non serve saper fare nulla di tecnico.' },
    domanda2: { q: "Conviene mostrare i prezzi dei gioielli?", a: "Puoi scegliere pezzo per pezzo: il prezzo su alcuni, «su richiesta» su altri. Per i pezzi importanti molti preferiscono la richiesta, che porta il cliente a parlare con voi." },
  },
  'siti-web-officine-torino': {
    etichetta: 'Officine e autoriparazioni', gruppo: 'servizi',
    cercano: 'Quando si accende una spia si cerca «officina vicino a me» o «tagliando Torino Lingotto», e si sceglie in fretta, spesso con l’auto ferma. Contano tre cose: le recensioni, la chiarezza su servizi e marche trattate, e poter chiedere un preventivo senza perdere mezza mattina al telefono.',
    esempio: "Immagina un’officina al Lingotto. Una mattina a una cliente si accende la spia del motore: cerca «officina vicino a me», trova la scheda con le recensioni, apre il sito e manda modello, targa e problema dal modulo. In pausa pranzo il meccanico risponde con un preventivo e le dà appuntamento per il giorno dopo.",
    checklist: [
      { h: 'Servizi e marche trattate', p: 'Tagliandi, freni, gomme, climatizzatore, diagnosi: chi cerca vede subito se fai al caso suo.' },
      { h: 'La richiesta di preventivo', p: 'Modello, targa e problema in un modulo: rispondi quando hai le mani libere.' },
      { h: 'Le recensioni in vista', p: 'Collegate alla scheda Google: sono il primo motivo per cui si sceglie un meccanico.' },
      { h: 'Orari e come arrivare', p: 'Con la mappa e, se ce l’hai, l’auto sostitutiva in evidenza.' },
    ],
    domanda: { q: 'Posso far prenotare il tagliando online?', a: 'Sì: il cliente sceglie il giorno in cui lasciare l’auto tra quelli liberi, e tu confermi. Così riempi l’agenda senza telefonate.' },
    domanda2: { q: "Conviene mostrare i prezzi del tagliando?", a: "Un «a partire da» per i servizi più richiesti (tagliando, cambio gomme, climatizzatore) aiuta chi confronta; il prezzo finale dipende dall’auto e lo confermi con il preventivo." },
  },
  'siti-web-lavanderie-torino': {
    etichetta: 'Lavanderie e tintorie', gruppo: 'servizi',
    cercano: 'Le ricerche sono pratiche: «lavanderia vicino a me», «lavaggio piumoni Torino», «tintoria abito da sposa», «lavanderia self service aperta». Chi cerca vuole sapere cosa lavi, quanto costa, in quanto tempo è pronto e se ritiri a domicilio. Se il sito lo dice, il cliente arriva già deciso.',
    esempio: "Immagina una lavanderia a Pozzo Strada. A fine stagione una famiglia cerca «lavaggio piumoni Torino»: sul sito trova il prezzo per piumone, i tempi di consegna e il ritiro a domicilio. Prenota il ritiro per venerdì sera, e quando i piumoni sono pronti riceve un messaggio.",
    checklist: [
      { h: 'Il listino per capo', p: 'Camicie, piumoni, tende, capi delicati: prezzi chiari evitano domande al banco.' },
      { h: 'I tempi di consegna', p: 'In giornata, in 48 ore: dillo per ogni servizio.' },
      { h: 'Ritiro e consegna', p: 'Se lo fai, è il motivo per cui ti scelgono: si prenota dal sito.' },
      { h: 'Il self service', p: 'Orari, numero di macchine, come si paga.' },
    ],
    domanda: { q: 'Posso far prenotare il ritiro a domicilio?', a: 'Sì: il cliente sceglie giorno e fascia oraria, indica i capi e l’indirizzo. Ti arriva tutto per iscritto e organizzi il giro.' },
    domanda2: { q: "Posso avvisare i clienti quando il capo è pronto?", a: "Sì: il sito raccoglie il numero quando il cliente prenota il ritiro, e quando il capo è pronto mandi un messaggio WhatsApp dal telefono del negozio. Niente app complicate." },
  },
  'siti-web-agenzie-viaggi-torino': {
    etichetta: 'Agenzie di viaggio', gruppo: 'servizi',
    metaDesc: 'Siti web per agenzie viaggi a Torino: le vostre mete in vetrina, preventivi su misura e un motivo in più per scegliere voi invece del portale.',
    cercano: 'Chi va in agenzia invece che su un portale cerca qualcosa in più: «viaggio di nozze agenzia Torino», «crociera con agenzia», «tour del Giappone organizzato». Vuole capire se conoscete davvero quella meta, vedere proposte concrete e chiedere un preventivo su misura senza impegno.',
    esempio: "Immagina un’agenzia di viaggi in centro. Una coppia cerca «viaggio di nozze agenzia Torino»: sul sito trova le proposte per le mete che l’agenzia conosce davvero, con periodo migliore e durata. Compila il modulo con date e budget e riceve una proposta su misura, invece di perdersi tra cento offerte online.",
    checklist: [
      { h: 'Le vostre specialità', p: 'Viaggi di nozze, gruppi, le mete che conoscete davvero: è il motivo per cui si sceglie un’agenzia.' },
      { h: 'Proposte con periodo e durata', p: 'Idee concrete da cui partire, aggiornate di stagione in stagione.' },
      { h: 'Il preventivo su misura', p: 'Date, persone, budget: la richiesta arriva completa.' },
      { h: 'I dati dell’agenzia in chiaro', p: 'Ragione sociale, autorizzazioni e garanzie: tolgono il dubbio a chi spende molto.' },
    ],
    domanda: { q: 'Devo pubblicare i prezzi dei viaggi?', a: 'Non serve: un «a partire da» su qualche proposta aiuta, ma il vostro valore è il su misura. Il sito porta richieste di preventivo, il resto lo fate voi.' },
    domanda2: { q: "Ha senso pubblicare idee di viaggio sul sito?", a: "Sì, se raccontano mete che conoscete davvero: itinerari, periodi migliori, consigli pratici. Portano chi sta ancora decidendo, che è il momento giusto per farsi conoscere." },
  },
  'siti-web-hotel-torino': {
    etichetta: 'Hotel e B&B', gruppo: 'servizi',
    cercano: 'Chi prenota un alloggio a Torino passa quasi sempre da un portale, poi cerca il nome della struttura su Google per vedere il sito. Se lì trova belle foto, la posizione chiara e la possibilità di prenotare direttamente, magari con un piccolo vantaggio, la prenotazione arriva a te senza commissione.',
    esempio: "Immagina un B&B vicino a Porta Susa. Un ospite trova la camera su un portale, poi cerca il nome del B&B su Google: sul sito vede le stesse camere, la posizione a due passi dalla stazione e un prezzo migliore per chi prenota direttamente. Prenota dal sito, e il B&B non paga la commissione.",
    checklist: [
      { h: 'La prenotazione diretta', p: 'Con il motore di prenotazione o una richiesta di disponibilità: ogni prenotazione diretta è una commissione risparmiata.' },
      { h: 'Camere con foto e servizi', p: 'Una pagina per tipologia, con letti, metri quadri e dotazioni.' },
      { h: 'Il codice CIN', p: 'Il Codice Identificativo Nazionale va indicato anche negli annunci online: sul sito lo mettiamo in vista.' },
      { h: 'In italiano e in inglese', p: 'Molti ospiti arrivano dall’estero: il sito deve parlare anche la loro lingua.' },
    ],
    domanda: { q: 'Il sito si collega al mio channel manager?', a: 'Nella maggior parte dei casi sì: il motore di prenotazione del tuo channel manager si inserisce nel sito, così disponibilità e prezzi restano allineati con i portali.' },
    domanda2: { q: "Posso offrire un prezzo migliore a chi prenota dal sito?", a: "Sì: in Italia, dal 2017, la legge sulla concorrenza rende nulle le clausole con cui i portali impedivano agli hotel prezzi migliori sul proprio sito. Uno sconto o un piccolo extra per chi prenota direttamente è il modo più semplice per pagare meno commissioni." },
  },
  'siti-web-addestratori-cani-torino': {
    etichetta: 'Educatori e addestratori cinofili', gruppo: 'servizi',
    metaDesc: 'Siti web per addestratori ed educatori cinofili a Torino: percorsi chiari, lezione di prova prenotabile e il tuo metodo raccontato bene.',
    cercano: 'Chi ha un cucciolo nuovo o un cane difficile cerca «educatore cinofilo Torino», «corso per cuccioli», «cane che tira al guinzaglio». Prima di affidare il proprio cane vuole capire il metodo, vedere il campo e leggere le esperienze di altri proprietari. La lezione di prova è il passo che fa decidere.',
    esempio: "Immagina un educatore cinofilo con il campo alle porte di Torino. Una famiglia con un cucciolo nuovo cerca «corso cuccioli Torino»: sul sito trova il metodo spiegato, le foto del campo, i percorsi e la lezione di prova prenotabile. Prenota per sabato mattina e, dopo la prova, si iscrive al corso.",
    checklist: [
      { h: 'Il tuo metodo', p: 'Gentile, a rinforzo positivo, come lavori: è la prima cosa che si chiede.' },
      { h: 'Percorsi per esigenza', p: 'Cuccioli, educazione di base, problemi di comportamento, sport.' },
      { h: 'Dove si fanno le lezioni', p: 'Campo, parco, a domicilio: con foto e mappa.' },
      { h: 'La lezione di prova prenotabile', p: 'Il passo più facile per cominciare.' },
    ],
    domanda: { q: 'Posso raccontare i cani che ho seguito?', a: 'Sì, ed è una delle cose che convince di più: prima e dopo, con il permesso dei proprietari. Le storie vere valgono più di qualsiasi descrizione.' },
    domanda2: { q: "Posso vendere i pacchetti di lezioni dal sito?", a: "Si può partire dalla prenotazione della lezione di prova e proporre i pacchetti dopo, di persona. Se tieni corsi di gruppo con date fisse, si può aggiungere l’iscrizione con pagamento online." },
  },
};

// Secondo strato di contenuto proprio (ottobre 2026): con i soli DETTAGLI ogni pagina aveva ancora
// ~40% di testo in comune con quella del settore più vicino (bar e pasticcerie, dentisti e osteopati).
//   funzioni   tre approfondimenti su come lavora il sito in quel settore (blocco «Come lavora il sito»)
//   domanda3   una terza domanda del settore: prende il posto della FAQ generica «E dopo la consegna?»
const APPROFONDIMENTI = {
  'siti-web-ristoranti-torino': {
    funzioni: [
      { h: 'Una pagina per ogni momento', p: 'Pranzo di lavoro, cena, pizza da asporto, menu degustazione: chi cerca ha in mente un momento preciso. Una sezione per ciascuno, con i suoi piatti e i suoi prezzi, risponde meglio di un menu unico, e Google la mostra a chi cerca proprio quello, come «pranzo di lavoro Borgo San Paolo» o «pizza da asporto Torino».' },
      { h: 'Gruppi ed eventi senza telefonate', p: 'Compleanni, cene aziendali, il pranzo di Natale: le richieste dei gruppi arrivano da un modulo con data, numero di persone ed eventuale menu fisso. Rispondi a servizio finito, con tutto scritto, e le date occupate non si perdono tra messaggi e foglietti.' },
      { h: 'Il menu che segue le stagioni', p: 'Tartufo in autunno, bollito in inverno, piatti freddi d’estate: un menu stagionale aggiornato è un motivo per tornare sul sito e dice a Google che il locale è vivo. Lo aggiorni dal telefono, o ce lo mandi e la pagina cambia in giornata.' },
    ],
    domanda3: { q: 'Posso usare il sistema di prenotazione che ho già?', a: 'Sì: se prenoti già con una piattaforma online, il bottone del sito porta lì e l’agenda resta una sola. Se non ne usi una, un modulo semplice ti manda le richieste su WhatsApp o per email.' },
  },
  'siti-web-ristoranti-giapponesi-torino': {
    funzioni: [
      { h: 'Il menu diviso come si ordina', p: 'Nigiri, uramaki, sashimi, piatti caldi, dolci: il menu segue le categorie con cui si ordina al tavolo, con il numero del piatto se lo usate nell’all you can eat. Chi lo guarda dal telefono trova subito quello che cerca, e al tavolo ordina più in fretta.' },
      { h: 'Pranzo, cena e asporto separati', p: 'Formula pranzo, formula cena, carta e asporto hanno prezzi e regole diversi: ognuno ha la sua sezione, così nessuno arriva la sera convinto di pagare il prezzo del pranzo. E Google mostra la pagina giusta a chi cerca «sushi pranzo Torino» o «sushi da asporto».' },
      { h: 'Foto nuove quando cambia il menu', p: 'Nel sushi le foto sono il menu. Quando aggiungete un piatto ci mandate la foto dal telefono e lo mettiamo online con nome, prezzo e allergeni. Le foto vere dei vostri piatti, non quelle di repertorio, sono quelle che fanno ordinare.' },
    ],
    domanda3: { q: 'Il menu può essere in più lingue?', a: 'Sì: stesse foto e stessi prezzi, con i nomi e le descrizioni in inglese o in altre lingue. È utile con i turisti e con chi non legge bene l’italiano, e lo gestisci come una pagina sola.' },
  },
  'siti-web-bar-torino': {
    funzioni: [
      { h: 'La giornata del bar, ora per ora', p: 'Colazione, pranzo veloce, merenda, aperitivo: il bar cambia faccia nel corso della giornata e il sito lo racconta così, una sezione per ogni momento con i prezzi principali. È anche il modo per farsi trovare da chi cerca «pranzo veloce Crocetta» e non solo «bar».' },
      { h: 'Le serate in calendario', p: 'Musica dal vivo, partite, degustazioni, quiz: una pagina eventi che aggiorni quando serve, con data e ora. Chi cerca «aperitivo con musica Torino» o vuole sapere dove vedere la partita trova te, e la stessa notizia la rilanci su Instagram e sulla scheda Google.' },
      { h: 'Il dehors in vetrina', p: 'Da aprile a ottobre il dehors è spesso il motivo per cui si sceglie un bar: foto, quanti tavoli, se è coperto o riscaldato, se ci si sta con il cane. Sono dettagli che si cercano prima di uscire di casa e che una foto risolve meglio di qualsiasi descrizione.' },
    ],
    domanda3: { q: 'Come tengo aggiornati orari e chiusure per ferie?', a: 'Ci mandi un messaggio e li cambiamo sul sito; per agosto e per le feste mettiamo un avviso in alto, che togliamo alla riapertura. Ricordati di aggiornare anche la scheda Google: i clienti guardano entrambi.' },
  },
  'siti-web-pasticcerie-torino': {
    funzioni: [
      { h: 'Il calendario delle ricorrenze', p: 'San Valentino, le bugie di Carnevale, Pasqua, la festa del papà, Natale: ogni ricorrenza ha i suoi dolci e il suo tempo per ordinare. Una pagina che cambia nel corso dell’anno, con la data entro cui prenotare, fa arrivare gli ordini per tempo invece che tutti l’ultimo giorno.' },
      { h: 'Le torte su misura, spiegate', p: 'Per compleanni, battesimi, comunioni e matrimoni il cliente vuole capire cosa è possibile: gusti, piani, decorazioni, scritte, torte a tema. Una galleria divisa per occasione e due righe su come funzionano l’ordine e il ritiro tolgono le domande che oggi arrivano tutte al banco.' },
      { h: 'Il banco di ogni giorno', p: 'Oltre alle ordinazioni c’è la vetrina quotidiana: paste, biscotti, cioccolato, la colazione se c’è la caffetteria. Raccontarla con foto vere ti fa trovare da chi cerca «pasticceria vicino a me» la domenica mattina, e chi cerca un vassoio di paste per l’ufficio trova il modulo per ordinarlo.' },
    ],
    domanda3: { q: 'Posso indicare entro quando ordinare per le feste?', a: 'Sì: per ogni ricorrenza mettiamo in evidenza la data limite per gli ordini e i giorni di ritiro. Quando sei al completo scriviamo «ordini chiusi» e togliamo il modulo: niente ordini che non riesci a fare.' },
  },
  'siti-web-parrucchieri-torino': {
    funzioni: [
      { h: 'Una pagina per ogni servizio', p: 'Colore, balayage, trattamenti alla cheratina, taglio uomo, acconciature: ogni servizio con la sua pagina, le foto e il prezzo indicativo. È così che Google ti mostra a chi cerca «balayage Torino», e non solo a chi conosce già il nome del salone. E chi legge arriva sapendo cosa chiedere.' },
      { h: 'Spose e cerimonie', p: 'Acconciature da sposa e da cerimonia si prenotano con mesi di anticipo e valgono più di una piega. Una sezione dedicata, con i lavori fatti, come funziona la prova e un modulo per chiederla, raccoglie richieste che oggi arrivano solo dal passaparola.' },
      { h: 'Clienti abituali e promemoria', p: 'Chi fa il colore ogni sei settimane torna più volentieri se prenotare è un attimo. Molte agende online per saloni mandano un promemoria prima dell’appuntamento: collegate al sito, riducono le dimenticanze, che in un salone sono ore perse.' },
    ],
    domanda3: { q: 'Posso usare l’agenda online che ho già?', a: 'Sì: se il salone usa già un’agenda online, il sito ci porta con un bottone e le prenotazioni restano tutte lì. Se non ce l’hai, ti aiutiamo a sceglierne una adatta a quante persone lavorano con te.' },
  },
  'siti-web-estetiste-torino': {
    funzioni: [
      { h: 'Una scheda per ogni trattamento', p: 'Pulizia viso, laminazione ciglia, epilazione, trattamenti corpo: ognuno con la sua pagina, che spiega cos’è, per chi è indicato, quanto dura e ogni quanto ripeterlo. Google la mostra a chi cerca proprio quel trattamento a Torino, e risponde alle domande prima della telefonata.' },
      { h: 'Percorsi e pacchetti', p: 'Molti trattamenti funzionano a cicli: epilazione, trattamenti corpo, percorsi viso. Presentarli come percorsi, con il numero di sedute e il prezzo del pacchetto, aiuta la cliente a decidere e ti porta prenotazioni ripetute invece di appuntamenti singoli.' },
      { h: 'Le stagioni del centro', p: 'Prima dell’estate epilazione e corpo, in autunno il viso, a Natale i buoni regalo: il sito mette in evidenza quello che conta nel periodo. Una proposta di stagione in prima pagina, cambiata quando serve, è spesso il motivo per cui una cliente prenota proprio da te.' },
    ],
    domanda3: { q: 'Conviene indicare quando un trattamento è sconsigliato?', a: 'Sì, è un segno di serietà: per laser, peeling e trattamenti con apparecchiature, due righe su quando evitarli e sulla consulenza iniziale rassicurano. Le scriviamo con te, con un tono informativo e senza promesse di risultato.' },
  },
  'siti-web-nail-studio-torino': {
    funzioni: [
      { h: 'Il listino che spiega le differenze', p: 'Semipermanente, gel, acrilico, ricostruzione, refill, copertura: chi non è del mestiere non sa cosa scegliere. Due righe per ciascun servizio, con durata, prezzo e ogni quanto rifarlo, fanno prenotare il servizio giusto e non sbagliare il tempo in agenda.' },
      { h: 'Gli stili del momento', p: 'French, baby boomer, effetto cromato, nail art a tema per le feste: gli stili cambiano ogni stagione e si cercano per nome. Una galleria dei tuoi lavori divisa per stile, aggiornata spesso, ti fa trovare anche da chi cerca uno stile preciso e lo studio ancora non lo conosce.' },
      { h: 'Le regole dello studio', p: 'Ritardi, disdette, rimozione di lavori fatti altrove, acconto per la nail art più lunga: scritte sul sito, le regole evitano discussioni e buchi in agenda. La cliente le legge prima di prenotare, e tu non devi spiegarle ogni volta.' },
    ],
    domanda3: { q: 'Posso chiedere un acconto per gli appuntamenti lunghi?', a: 'Sì: diverse agende online permettono di chiedere un acconto per i servizi più lunghi o per le clienti nuove. È il modo più semplice per ridurre gli appuntamenti saltati senza avviso.' },
  },
  'siti-web-centri-massaggi-torino': {
    funzioni: [
      { h: 'Ogni massaggio spiegato', p: 'Decontratturante, rilassante, sportivo, con pietre calde, di coppia: chi cerca spesso non conosce le differenze. Una pagina per ciascuno, con come si svolge, quanto dura e a chi piace di più, aiuta a scegliere e ti fa trovare da chi cerca quel massaggio preciso a Torino.' },
      { h: 'Il regalo comprato la sera prima', p: 'I buoni regalo si comprano spesso all’ultimo momento, la sera prima del compleanno. Se il sito permette di sceglierli e pagarli online, vendi anche a centro chiuso: a San Valentino, per la festa della mamma e a Natale sono la parte più visitata del sito.' },
      { h: 'Un ambiente da mostrare', p: 'Le stanze, le luci, la doccia, la stanza per la coppia: chi vuole rilassarsi vuole sapere dove andrà. Foto vere e due righe su come si svolge la prima volta, dall’accoglienza alla fine del trattamento, tolgono l’imbarazzo a chi non è mai stato in un centro massaggi.' },
    ],
    domanda3: { q: 'Si può prenotare il massaggio di coppia online?', a: 'Sì: si prenota come un servizio unico che blocca due operatori e la stanza nello stesso orario. Il cliente sceglie il giorno e vede solo gli orari in cui sono liberi entrambi.' },
  },
  'siti-web-profumerie-torino': {
    funzioni: [
      { h: 'Le famiglie olfattive', p: 'Agrumati, floreali, legnosi, ambrati: molti clienti non sanno il nome del profumo che cercano, ma sanno cosa amano. Una sezione che li guida per famiglie olfattive, con le fragranze che hai in negozio, trasforma la curiosità in una visita e ti fa trovare anche da chi non cerca una marca.' },
      { h: 'Cosmetica e trattamenti', p: 'Molte profumerie hanno anche skincare, make-up e una cabina estetica: meritano pagine a parte, con le linee trattate e i servizi. Chi cerca una linea cosmetica precisa a Torino scopre che la trova da te, e chi viene per la crema torna per il profumo.' },
      { h: 'Le idee regalo', p: 'Natale, San Valentino, la festa della mamma e del papà: la profumeria vive di regali. Una pagina di idee per fascia di prezzo, con la confezione e la possibilità di prenotare e ritirare, aiuta chi non sa cosa scegliere e porta in negozio chi altrimenti comprerebbe online.' },
    ],
    domanda3: { q: 'Posso far richiedere i campioncini dal sito?', a: 'Sì, come richiesta: il cliente indica le fragranze che vuole provare e passa a ritirarle, oppure le prova in negozio su appuntamento. È un modo semplice per portare in profumeria chi sta ancora scegliendo.' },
  },
  'siti-web-dentisti-torino': {
    funzioni: [
      { h: 'Le pagine dei trattamenti', p: 'Igiene e prevenzione, conservativa, endodonzia, implantologia, ortodonzia anche trasparente, pedodonzia: una pagina per ciascuno, che spiega cos’è, come si svolge e quante sedute servono. Sono le pagine che rispondono a chi cerca «apparecchio trasparente Torino» e lo fanno arrivare con le domande giuste.' },
      { h: 'Lo studio e chi ci lavora', p: 'Chi sceglie un dentista vuole sapere chi lo curerà: i professionisti con titoli e ambiti di lavoro, l’iscrizione all’albo, le attrezzature dello studio. È il contenuto informativo adatto a uno studio sanitario, e mette a proprio agio chi del dentista ha paura.' },
      { h: 'La prima visita, senza ansia', p: 'Molti rimandano per timore del dolore o del costo. Spiegare come si svolge la prima visita, quanto dura, se si fanno radiografie e come si arriva al preventivo scritto toglie due paure in una volta: chi si sente tranquillo prenota, chi non trova risposte rimanda ancora.' },
    ],
    domanda3: { q: 'Posso indicare convenzioni e modalità di pagamento?', a: 'Sì, sono informazioni utili e cercate: fondi e assicurazioni convenzionati, modalità di pagamento, eventuali rateizzazioni. Si scrivono in modo informativo, senza trasformarle in offerte promozionali.' },
  },
  'siti-web-osteopati-torino': {
    funzioni: [
      { h: 'Una pagina per ogni situazione', p: 'Mal di schiena, cervicale, gravidanza, sportivi, neonati: una pagina per ciascuna situazione, scritta in modo informativo, spiega come lavori in quel caso. Chi cerca «osteopata cervicale Torino» trova una risposta precisa invece di una pagina generica, e capisce se sei la persona giusta.' },
      { h: 'La prima seduta, spiegata', p: 'Cosa succede nel primo incontro: il colloquio, la valutazione, il trattamento, quanto dura, cosa indossare, se portare esami o referti. Sono dettagli semplici, ma per chi non è mai stato da un osteopata fanno la differenza tra prenotare e rimandare.' },
      { h: 'Il lavoro con gli altri professionisti', p: 'Se collabori con medici, fisioterapisti od ostetriche, dirlo rassicura: il paziente capisce che sei una parte del percorso, non un’alternativa alla medicina. Una pagina sullo studio e sulla rete con cui lavori costruisce fiducia meglio di qualsiasi slogan.' },
    ],
    domanda3: { q: 'Posso pubblicare le recensioni dei pazienti?', a: 'Puoi mostrare quelle della tua scheda Google collegandola al sito: sono pubbliche e verificabili. Meglio evitare testimonianze che parlano di guarigioni: un tono informativo è più corretto e più credibile.' },
  },
  'siti-web-veterinari-torino': {
    funzioni: [
      { h: 'Una pagina per ogni servizio', p: 'Visite e vaccinazioni, chirurgia, ecografie e radiografie, odontoiatria, esami del sangue, microchip e passaporto per l’estero: ogni servizio con due righe su come si svolge e come prepararsi. Chi cerca «ecografia cane Torino» trova la pagina giusta e chiama già informato.' },
      { h: 'I richiami durante l’anno', p: 'Cucciolo nuovo, richiami dei vaccini, prevenzione per zecche e filaria: una pagina con il calendario che consigli, e il modulo per prenotare il richiamo subito sotto. È una pagina che i proprietari aprono più volte all’anno, e ogni volta li riporta da te.' },
      { h: 'Esotici e visite a domicilio', p: 'Se tratti conigli, furetti, uccelli o rettili, una pagina dedicata ti fa trovare da chi fa fatica a trovare un veterinario per il suo animale. Lo stesso vale per le visite a domicilio, preziose per animali anziani o difficili da trasportare.' },
    ],
    domanda3: { q: 'Come spiego ai clienti quando arrivano i risultati degli esami?', a: 'Con due righe chiare sul sito: quali esami fate in ambulatorio, quali mandate al laboratorio e come comunicate l’esito, per telefono o per email. Il cliente sa cosa aspettarsi, e il telefono squilla meno.' },
  },
  'siti-web-farmacie-torino': {
    funzioni: [
      { h: 'Una pagina per ogni servizio', p: 'Pressione, ECG e holter, autoanalisi, vaccinazioni dove previste, noleggio di bilance pesaneonati e tiralatte, preparazioni galeniche: ogni servizio con cosa serve, quanto dura e come prenotarlo. Sono le pagine che Google mostra a chi cerca proprio quel servizio in farmacia, vicino a casa.' },
      { h: 'I reparti, raccontati', p: 'Dermocosmesi, infanzia, integratori, veterinaria, senza glutine: molte farmacie hanno reparti che i clienti non conoscono. Una pagina per reparto, con le marche principali, ti fa trovare da chi cerca «farmacia dermocosmesi Torino» e porta al banco chi oggi compra online.' },
      { h: 'I consigli di stagione', p: 'Allergie in primavera, protezione solare d’estate, raffreddore e influenza in autunno: il sito mette in evidenza i servizi e i consigli del periodo, con un linguaggio informativo. Sono contenuti utili, che fanno tornare i clienti e che puoi rilanciare sulla scheda Google.' },
    ],
    domanda3: { q: 'Posso far prenotare i prodotti da ritirare?', a: 'Sì, per parafarmaco e cosmetica: il cliente sceglie e passa a ritirare, come in un negozio. Per i farmaci il sito può raccogliere una richiesta di disponibilità, che poi conferma il farmacista.' },
  },
  'siti-web-negozi-torino': {
    funzioni: [
      { h: 'Le pagine per categoria', p: 'Una pagina per ogni reparto, con le foto dei prodotti più rappresentativi e le marche, è quello che ti fa trovare quando qualcuno cerca un prodotto preciso a Torino. Google mostra la pagina delle scarpe da corsa a chi cerca scarpe da corsa, non una home generica.' },
      { h: 'Novità e promozioni', p: 'Nuovi arrivi, collezioni di stagione, saldi: una sezione che aggiorni quando cambia la vetrina dà un motivo per tornare sul sito e per passare in negozio. La stessa notizia va sulla scheda Google, dove la vede anche chi passa di lì.' },
      { h: 'Il servizio che le catene non hanno', p: 'Consiglio, riparazioni, prove, consegna in zona, ordini su richiesta: sono i motivi per cui si sceglie un negozio di quartiere. Scriverli sul sito, insieme a un modo per chiedere un prodotto che non vedi esposto, trasforma una ricerca online in una visita.' },
    ],
    domanda3: { q: 'Posso far richiedere un prodotto che non ho in negozio?', a: 'Sì: un modulo raccoglie prodotto, marca e contatti, e ti arriva su WhatsApp. Rispondi con disponibilità e tempi, il cliente passa a ritirare: una vendita che altrimenti sarebbe andata online.' },
  },
  'siti-web-gioiellerie-torino': {
    funzioni: [
      { h: 'Fedi e anelli di fidanzamento', p: 'Sono gli acquisti più pensati e più cercati: «fedi nuziali Torino», «anello di fidanzamento». Una pagina dedicata con gli stili, i metalli, i tempi di realizzazione e l’incisione, insieme alla richiesta di appuntamento, porta in negozio coppie che hanno già scelto voi.' },
      { h: 'Il laboratorio, mostrato', p: 'Se avete un laboratorio è il vostro vantaggio: riparazioni, misure degli anelli, creazioni su disegno, gioielli di famiglia rimontati. Le foto del banco di lavoro e qualche prima e dopo raccontano un saper fare che le catene non hanno.' },
      { h: 'Orologi e piccoli servizi', p: 'Cambio pila, revisione, cinturini, valutazione: anche i servizi piccoli portano gente in negozio, e chi entra per una pila spesso torna per un regalo. Ogni servizio con i tempi indicativi e un modulo per chiedere informazioni risparmia telefonate.' },
    ],
    domanda3: { q: 'Posso ricevere richieste per gioielli su misura?', a: 'Sì: un modulo raccoglie l’idea del cliente, il budget indicativo e, se vuole, una foto o un disegno di riferimento. Arriva tutto per iscritto, e fissate l’appuntamento per parlarne in negozio.' },
  },
  'siti-web-officine-torino': {
    funzioni: [
      { h: 'Una pagina per ogni lavoro', p: 'Tagliando, freni, frizione, distribuzione, climatizzatore, gomme e deposito, revisione se la fate: una pagina per ciascun lavoro, con cosa comprende e quanto tempo serve. Chi cerca «ricarica clima auto Torino» trova direttamente il servizio, non solo il nome dell’officina.' },
      { h: 'Il cambio gomme di stagione', p: 'Due volte l’anno molti cercano chi monta le gomme invernali o estive, con l’obbligo di gomme da neve o catene a bordo sulle strade dove è previsto. Una pagina che apre le prenotazioni per tempo e spiega il deposito pneumatici riempie l’agenda prima della corsa di novembre.' },
      { h: 'I segnali di serietà', p: 'Auto di cortesia, ritiro e consegna, preventivo scritto prima di cominciare, garanzia sui lavori: chi ha avuto brutte esperienze in officina cerca proprio questi segnali. Se li offri, vanno in evidenza: spesso decidono la scelta più del prezzo.' },
    ],
    domanda3: { q: 'Conviene indicare marche e ricambi con cui lavoro?', a: 'Sì: le marche in cui siete specializzati e il tipo di ricambi, originali o equivalenti, aiutano chi confronta. Detto con chiarezza, è uno dei motivi per cui si sceglie un’officina invece di un’altra.' },
  },
  'siti-web-lavanderie-torino': {
    funzioni: [
      { h: 'I capi speciali', p: 'Abiti da sposa, piumini, tappeti, tende, pelle, divise da lavoro: sono i servizi che si cercano per nome e che valgono una visita. Una pagina per ciascuno, con come li trattate, i tempi e il prezzo indicativo, ti fa trovare da chi cerca «lavaggio tappeti Torino».' },
      { h: 'Attività e affitti brevi', p: 'Ristoranti, saloni, palestre, B&B e case vacanza lavano biancheria tutte le settimane. Una sezione per le attività, con il ritiro programmato e la richiesta di preventivo, ti porta clienti che fanno lavoro ogni settimana, non una volta all’anno.' },
      { h: 'Il self service, spiegato', p: 'Chi non ha mai usato una lavanderia self service ha dubbi semplici: quanto dura un lavaggio, quanti chili per macchina, se il detersivo è compreso, come si paga. Due righe chiare e qualche foto tolgono l’imbarazzo della prima volta.' },
    ],
    domanda3: { q: 'Posso avere prezzi diversi per aziende e clienti abituali?', a: 'Sì: il listino del sito vale per tutti, e per attività e clienti abituali scriviamo «tariffe su richiesta» con il modulo per il preventivo. Il prezzo al banco resta chiaro, le condizioni speciali le decidi tu.' },
  },
  'siti-web-agenzie-viaggi-torino': {
    funzioni: [
      { h: 'Una pagina per ogni meta che conoscete', p: 'Un’agenzia vale per l’esperienza: chi c’è stato, quali hotel ha visto, quali errori fa evitare. Una pagina per ogni meta che conoscete bene, con periodo migliore, durata consigliata e un’idea di itinerario, risponde a chi cerca «tour del Giappone organizzato» e mostra quello che un portale non sa fare.' },
      { h: 'Gruppi, scuole e aziende', p: 'Viaggi di gruppo, gite scolastiche, viaggi aziendali, pellegrinaggi: richiedono organizzazione e sono il lavoro che i portali non fanno. Una sezione dedicata, con un modulo che chiede persone, periodo e budget, porta richieste complete e di valore.' },
      { h: 'Partire da Torino', p: 'Chi parte da Torino vuole sapere come arriverà: volo da Caselle o da Malpensa, treno, partenze organizzate in pullman. Indicare da dove partono le vostre proposte e se il trasferimento è compreso rende concreta l’offerta, e ti fa scegliere da chi non vuole pensare alla logistica.' },
    ],
    domanda3: { q: 'Posso pubblicare le offerte last minute?', a: 'Sì, con una sezione che aggiorni quando hai un’offerta, con date, cosa è compreso e fino a quando vale. Le offerte con una scadenza chiara funzionano bene anche sui social e sulla scheda Google.' },
  },
  'siti-web-hotel-torino': {
    funzioni: [
      { h: 'Torino a due passi', p: 'Chi viene a Torino ha un motivo: una fiera al Lingotto, una partita, il Museo Egizio, una visita in ospedale, un concerto. Una pagina su come raggiungere da te i luoghi principali, con i tempi a piedi o con i mezzi, ti fa trovare da chi cerca «hotel vicino al Lingotto» o «B&B vicino a Porta Nuova».' },
      { h: 'Ospiti che tornano', p: 'Chi ha già dormito da te e torna a Torino deve trovarti in un attimo e prenotare senza passare dal portale. Il sito, un piccolo vantaggio per chi prenota diretto e WhatsApp per le richieste speciali, come check-in tardivo, culla o parcheggio, trasformano un ospite in un cliente abituale.' },
      { h: 'Le regole della casa', p: 'Orari della colazione, parcheggio, animali, check-in autonomo, imposta di soggiorno: sono le domande che arrivano a tutte le ore. Scritte bene sul sito, in italiano e in inglese, rispondono prima che l’ospite scriva e tolgono il dubbio a chi sta scegliendo tra te e un’altra struttura.' },
    ],
    domanda3: { q: 'Posso mostrare le recensioni sul sito?', a: 'Sì: la cosa più semplice è collegare quelle della scheda Google, che sono tue; il punteggio dei portali si può citare rispettando le loro regole. Le recensioni vicino al bottone «prenota» sono quelle che convincono.' },
  },
  'siti-web-addestratori-cani-torino': {
    funzioni: [
      { h: 'I problemi che risolvi', p: 'Il cane che tira al guinzaglio, che abbaia quando resta solo, che salta addosso, che non torna al richiamo: chi ha un problema lo cerca con le sue parole. Una pagina per ciascuno, che spiega come lo affronti, ti fa trovare da chi cerca proprio quello e mostra il tuo metodo meglio di una descrizione generale.' },
      { h: 'Gruppo o lezione individuale', p: 'Classi per cuccioli, educazione di base in gruppo, lezioni individuali, percorsi a domicilio, sport cinofili: formule diverse per esigenze diverse. Indicare per ciascuna durata, numero di incontri e cosa si impara aiuta il proprietario a scegliere senza mille domande.' },
      { h: 'Prima che arrivi il cucciolo', p: 'Molti cercano un educatore prima ancora di portare a casa il cucciolo. Una guida su come prepararsi, cosa comprare e quando cominciare, con il corso cuccioli in fondo alla pagina, incontra queste famiglie nel momento giusto e le porta al campo.' },
    ],
    domanda3: { q: 'Conviene indicare la mia formazione?', a: 'Sì: il percorso di formazione, l’ente con cui ti sei formato e gli aggiornamenti rassicurano chi deve affidarti il cane. Li scriviamo in modo semplice, senza sigle incomprensibili.' },
  },
};

// Unisce dettagli e approfondimenti ai dati delle pagine: ogni settore deve averli
// (la build si ferma se ne manca uno).
for (const [slug, d] of Object.entries(SETTORI)) {
  if (!DETTAGLI[slug]) throw new Error(`settori.js: mancano i DETTAGLI di ${slug}`);
  if (!APPROFONDIMENTI[slug]) throw new Error(`settori.js: mancano gli APPROFONDIMENTI di ${slug}`);
  Object.assign(d, DETTAGLI[slug], APPROFONDIMENTI[slug]);
}
