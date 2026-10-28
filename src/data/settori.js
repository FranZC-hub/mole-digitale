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
//   checklist  cosa non deve mancare sul sito, specifico del settore
//   domanda    la domanda che fanno davvero, aggiunta alle FAQ della pagina
// Le note normative (allergeni, pubblicità sanitaria, CIN, farmaci online) sono di principio:
// i dettagli si verificano col cliente quando si fa il sito.
const DETTAGLI = {
  'siti-web-ristoranti-torino': {
    etichetta: 'Ristoranti e pizzerie', gruppo: 'ristorazione',
    cercano: 'Chi cerca dove mangiare decide in pochi minuti, quasi sempre dal telefono: «ristorante piemontese San Salvario», «pizzeria aperta ora», «dove mangiare vicino a Porta Nuova». Guarda le foto dei piatti, controlla menu e prezzi, legge due recensioni e prenota. Se il menu è un PDF illeggibile o gli orari sono sbagliati, passa al locale dopo.',
    checklist: [
      { h: 'Il menu in pagina, non in PDF', p: 'Leggibile dal telefono, con i prezzi, e aggiornabile in un minuto quando cambia un piatto.' },
      { h: 'Gli allergeni', p: 'Indicati nel menu o con un modo chiaro per chiederli: è un obbligo, e i clienti li cercano.' },
      { h: 'La prenotazione senza telefonate', p: 'Giorno, ora e coperti: arriva anche quando il locale è chiuso.' },
      { h: 'Foto vere del locale', p: 'Sala, dehors, piatti: è quello che fa scegliere te invece del vicino.' },
    ],
    domanda: { q: 'Posso cambiare il menu da solo?', a: 'Sì: il menu è una pagina del sito, non un file da rifare. Possiamo darti un piccolo pannello per aggiornare piatti e prezzi dal telefono, oppure ce lo mandi su WhatsApp e lo aggiorniamo noi.' },
  },
  'siti-web-ristoranti-giapponesi-torino': {
    etichetta: 'Ristoranti giapponesi e sushi', gruppo: 'ristorazione',
    cercano: 'Per il sushi si cerca soprattutto la formula: «sushi all you can eat Torino», «sushi da asporto», «ristorante giapponese tradizionale». Contano il menu con le foto, il prezzo della formula a pranzo e a cena, le regole del «giapponese a volontà» e la possibilità di ordinare da asporto senza passare dalle app.',
    checklist: [
      { h: 'Il menu con le foto', p: 'Nel sushi si ordina con gli occhi: ogni piatto con la sua immagine.' },
      { h: 'Formule e prezzi chiari', p: 'Pranzo, cena, weekend, bambini: niente sorprese al conto.' },
      { h: 'L’asporto diretto', p: 'Ordine dal sito e ritiro al ristorante, senza le commissioni delle app.' },
      { h: 'Gli allergeni piatto per piatto', p: 'Pesce crudo, sesamo, soia, glutine: chi ha un’allergia lo cerca prima di prenotare.' },
    ],
    domanda: { q: 'Posso ricevere ordini da asporto dal sito?', a: 'Sì: il cliente sceglie i piatti e l’orario di ritiro, l’ordine ti arriva su WhatsApp o per email. Ogni ordine che passa dal sito è un ordine senza le commissioni delle app di consegna.' },
  },
  'siti-web-bar-torino': {
    etichetta: 'Bar e caffetterie', gruppo: 'ristorazione',
    cercano: 'Al bar si arriva quasi sempre a piedi e all’ultimo momento: «bar colazione vicino a me», «aperitivo Vanchiglia», «bar aperto domenica». La scelta si fa sulla scheda Google e sul sito, in pochi secondi: orari giusti, una foto che invoglia e il listino. Il resto lo fa la posizione.',
    checklist: [
      { h: 'Orari sempre giusti', p: 'Anche festivi e chiusure per ferie: niente clienti davanti alla saracinesca.' },
      { h: 'Colazione, pranzo, aperitivo', p: 'Cosa offri in ogni momento della giornata, con i prezzi principali.' },
      { h: 'Foto del banco e del dehors', p: 'È lì che si decide se entrare.' },
      { h: 'Eventi e partite', p: 'Serate, musica, maxischermo: una pagina che aggiorni quando serve.' },
    ],
    domanda: { q: 'Mi serve davvero un sito se ho la scheda Google?', a: 'La scheda ti fa trovare, il sito ti fa scegliere: menu, foto, eventi e prenotazioni per i gruppi stanno lì. E una scheda collegata a un sito curato è più completa agli occhi di Google e dei clienti.' },
  },
  'siti-web-pasticcerie-torino': {
    etichetta: 'Pasticcerie', gruppo: 'ristorazione',
    cercano: 'Le ricerche hanno quasi sempre una data: «torta di compleanno Torino», «pasticceria per matrimonio», «colomba artigianale». Chi ordina vuole vedere le torte già fatte, capire con quanto anticipo prenotare e quanto costa al chilo. Il sito che risponde a queste tre domande riceve l’ordine.',
    checklist: [
      { h: 'La galleria delle torte su ordinazione', p: 'Compleanni, cerimonie, cake design: si sceglie guardando.' },
      { h: 'La richiesta d’ordine con la data', p: 'Gusto, numero di persone, giorno di ritiro: arriva tutto per iscritto.' },
      { h: 'Le ricorrenze', p: 'Colombe, panettoni, uova di Pasqua: una pagina che cambia con le stagioni.' },
      { h: 'Allergeni e intolleranze', p: 'Senza glutine, senza lattosio: se lo fai, dillo chiaramente.' },
    ],
    domanda: { q: 'Posso ricevere gli ordini delle torte dal sito?', a: 'Sì: un modulo raccoglie gusto, dimensioni, scritta e data di ritiro, e ti arriva per email o su WhatsApp. Tu confermi e chiedi l’eventuale acconto come fai oggi.' },
  },
  'siti-web-parrucchieri-torino': {
    etichetta: 'Parrucchieri', gruppo: 'bellezza',
    cercano: 'Chi cambia parrucchiere cerca su Google «parrucchiere Crocetta» o «colore capelli Torino», poi guarda Instagram e il sito per capire lo stile. Decide guardando i lavori, i prezzi indicativi e quanto è facile prenotare. Chi può fissare l’appuntamento la sera, senza chiamare, prenota da chi lo permette.',
    checklist: [
      { h: 'Il listino con i «a partire da»', p: 'Taglio, piega, colore, trattamenti: i prezzi indicativi tolgono l’imbarazzo di chiedere.' },
      { h: 'Una prenotazione che conosce le durate', p: 'Un colore non dura quanto una piega: l’agenda propone solo gli orari giusti.' },
      { h: 'La galleria dei lavori', p: 'Prima e dopo, colori, tagli: con un tocco si passa al tuo Instagram.' },
      { h: 'Chi c’è nel salone', p: 'Le persone e le loro specialità: si sceglie anche chi ti mette le mani in testa.' },
    ],
    domanda: { q: 'Il sito si collega a Instagram?', a: 'Sì: dal sito un tocco porta al tuo profilo, e nella galleria mettiamo i lavori migliori che ci mandi. Così chi arriva da Google vede subito il tuo stile.' },
  },
  'siti-web-estetiste-torino': {
    etichetta: 'Centri estetici', gruppo: 'bellezza',
    cercano: 'Chi cerca un centro estetico confronta: «pulizia viso Torino», «laminazione ciglia Cit Turin», «epilazione laser prezzi». Legge i trattamenti, guarda l’ambiente e le recensioni, e prenota dove è più semplice. Spesso la sera, a centro chiuso: se si può prenotare solo per telefono, la cliente va altrove.',
    checklist: [
      { h: 'Trattamenti con durata e prezzo', p: 'Una scheda per ogni trattamento: cos’è, quanto dura, quanto costa.' },
      { h: 'La prenotazione online', p: 'Con le durate giuste: meno buchi in agenda, meno telefonate.' },
      { h: 'Pacchetti e buoni regalo', p: 'Il regalo più facile per chi non sa cosa regalare, richiedibile dal sito.' },
      { h: 'L’ambiente', p: 'Foto vere delle cabine e del centro: si sceglie anche dove ci si sente a proprio agio.' },
    ],
    domanda: { q: 'Posso vendere buoni regalo dal sito?', a: 'Sì: si può partire da una semplice richiesta con ritiro in istituto e, se serve, aggiungere il pagamento online. Sotto le feste è uno dei motivi per cui si visita il sito.' },
  },
  'siti-web-nail-studio-torino': {
    etichetta: 'Nail studio', gruppo: 'bellezza',
    cercano: 'Le unghie si scelgono con gli occhi: «nail art Torino», «ricostruzione unghie Barriera di Milano», «semipermanente vicino a me», e poi dritte su Instagram. Il sito serve a chiudere: listino chiaro, galleria dei lavori e una prenotazione che sa quanto dura un refill rispetto a una ricostruzione.',
    checklist: [
      { h: 'La galleria nail art', p: 'I lavori migliori, divisi per stile: si prenota indicando quello che piace.' },
      { h: 'Il listino dei servizi', p: 'Semipermanente, ricostruzione, refill, nail art: prezzi e durate.' },
      { h: 'Una prenotazione con le durate giuste', p: 'Niente sovrapposizioni in agenda.' },
      { h: 'Il collegamento a Instagram', p: 'Per chi vuole vedere gli ultimi lavori.' },
    ],
    domanda: { q: 'Le clienti possono prenotare con la stessa onicotecnica?', a: 'Sì: ogni operatrice ha la sua agenda e la cliente sceglie con chi prenotare. Le abituali la ritrovano in un attimo.' },
  },
  'siti-web-centri-massaggi-torino': {
    etichetta: 'Centri massaggi e benessere', gruppo: 'bellezza',
    cercano: 'Chi cerca un massaggio guarda tre cose: il tipo («massaggio decontratturante Torino», «massaggio di coppia»), la durata e il prezzo. Poi le foto dell’ambiente, per capire se è il posto giusto in cui rilassarsi. La prenotazione arriva spesso la sera, o all’ultimo momento per un regalo.',
    checklist: [
      { h: 'Massaggi con durata e prezzo', p: '30, 50, 80 minuti: tutto chiaro prima di prenotare.' },
      { h: 'La prenotazione online', p: 'Con l’operatore preferito, se il cliente lo desidera.' },
      { h: 'I buoni regalo', p: 'Per compleanni e anniversari è il regalo più cercato.' },
      { h: 'Le parole giuste', p: 'Massaggi per il benessere, senza promesse sanitarie che non si possono fare.' },
    ],
    domanda: { q: 'Come gestisco le prenotazioni con più operatori?', a: 'Ogni operatore ha la sua agenda e i suoi massaggi: il cliente sceglie il trattamento e vede solo gli orari davvero liberi.' },
  },
  'siti-web-profumerie-torino': {
    etichetta: 'Profumerie', gruppo: 'bellezza',
    cercano: 'Chi cerca una profumeria a Torino sa già cosa vuole, o vuole essere consigliato: «profumeria artistica Torino», «profumi di nicchia Torino». Cerca le marche che tratti, l’atmosfera del negozio e un modo per chiedere un consiglio o un campione. Il sito porta in negozio chi non vuole comprare un profumo alla cieca online.',
    checklist: [
      { h: 'Le marche e le collezioni', p: 'Molti cercano per maison: elencarle ti fa trovare.' },
      { h: 'La consulenza su appuntamento', p: 'Mezz’ora dedicata per trovare la fragranza giusta, prenotata dal sito.' },
      { h: 'I buoni regalo', p: 'Il regalo giusto per chi non conosce i gusti di chi lo riceve.' },
      { h: 'Ordina e ritira', p: 'Il profumo prenotato online, ritirato in negozio già confezionato.' },
    ],
    domanda: { q: 'Ha senso un sito se le grandi catene vendono online?', a: 'Sì, se racconta quello che le catene non hanno: la selezione, il consiglio, le marche introvabili. È quello che porta da te chi cerca qualcosa di diverso.' },
  },
  'siti-web-dentisti-torino': {
    etichetta: 'Dentisti e studi odontoiatrici', gruppo: 'salute',
    cercano: 'Il dentista si cerca in due modi: con calma («dentista Santa Rita», «impianti dentali Torino») o con urgenza («dentista urgenze sabato Torino»). Nel primo caso si confrontano studio, trattamenti e recensioni; nel secondo vince chi mostra subito come farsi ricevere. Il sito deve servire a entrambi.',
    checklist: [
      { h: 'Trattamenti spiegati', p: 'Igiene, impianti, ortodonzia, estetica: cosa sono e come si svolgono, senza gergo.' },
      { h: 'La prima visita prenotabile', p: 'In due tocchi, con i giorni disponibili.' },
      { h: 'Le urgenze in evidenza', p: 'Se le ricevi, dillo in alto: è lì che guarda chi ha mal di denti.' },
      { h: 'Un tono informativo', p: 'Le regole sulla pubblicità sanitaria chiedono contenuti informativi, non promozionali: li scriviamo così.' },
    ],
    domanda: { q: 'Posso pubblicare offerte e promozioni?', a: 'Le informazioni su servizi e modalità sì; offerte e toni promozionali vanno evitati, perché la comunicazione delle strutture sanitarie deve restare informativa. Impostiamo il sito tenendone conto fin dall’inizio.' },
  },
  'siti-web-osteopati-torino': {
    etichetta: 'Osteopati', gruppo: 'salute',
    metaDesc: 'Siti web per osteopati a Torino: per chi è indicata l’osteopatia, come lavori e la prima seduta prenotabile online. Fatti trovare da chi cerca.',
    cercano: 'Chi ha mal di schiena cerca «osteopata Torino», «osteopata per neonati», «osteopata sportivo». Prima di prenotare vuole capire se l’osteopatia fa per lui, come si svolge una seduta e chi è il professionista: formazione, approccio, recensioni. Un sito che spiega bene trasforma il dubbio in un appuntamento.',
    checklist: [
      { h: 'Per chi è indicata', p: 'Adulti, sportivi, gravidanza, neonati: chi si riconosce, prenota.' },
      { h: 'Come si svolge una seduta', p: 'Durata, cosa portare, cosa aspettarsi: meno ansia, più prenotazioni.' },
      { h: 'Chi sei', p: 'Formazione e percorso, raccontati in modo semplice.' },
      { h: 'Niente promesse di guarigione', p: 'Un tono informativo è più credibile, e più corretto.' },
    ],
    domanda: { q: 'Posso far prenotare la prima seduta online?', a: 'Sì, con i tuoi orari e le durate giuste. Puoi anche chiedere due righe sul motivo della visita, così arrivi preparato.' },
  },
  'siti-web-veterinari-torino': {
    etichetta: 'Veterinari e ambulatori', gruppo: 'salute',
    cercano: 'Per gli animali si cerca in due momenti: con calma («veterinario per gatti Torino», «vaccini cane») o con l’ansia («veterinario urgenze notte Torino»). Nel secondo caso servono subito telefono e orari di reperibilità; nel primo, i servizi, le specie trattate e la possibilità di prenotare una visita.',
    checklist: [
      { h: 'Le urgenze in alto', p: 'Numero e orari di reperibilità visibili subito, anche da telefono.' },
      { h: 'Servizi e specie trattate', p: 'Cani e gatti, ma anche esotici? Dillo: chi ha un coniglio cerca proprio quello.' },
      { h: 'La prenotazione delle visite', p: 'Vaccini, controlli, chirurgia programmata: separati dalle urgenze.' },
      { h: 'Consigli per i proprietari', p: 'Zecche, viaggi, alimentazione: guide brevi che aiutano e ti fanno trovare.' },
    ],
    domanda: { q: 'Come separo le urgenze dalle visite normali?', a: 'Con due strade ben distinte: in alto il numero per le urgenze, e un modulo di prenotazione per tutto il resto. Così il telefono squilla per le cose che contano.' },
  },
  'siti-web-farmacie-torino': {
    etichetta: 'Farmacie', gruppo: 'salute',
    cercano: 'La farmacia si cerca quasi sempre per un bisogno preciso: «farmacia di turno Torino», «farmacia aperta ora», «ECG in farmacia», «prenotazione CUP in farmacia». Contano orari e turni corretti, i servizi in chiaro e la possibilità di prenotarli. È il tipo di ricerca in cui chi risponde meglio vince subito.',
    checklist: [
      { h: 'Turni e orari aggiornati', p: 'Con la pausa pranzo e i giorni di turno: è la prima cosa che si cerca.' },
      { h: 'I servizi prenotabili', p: 'ECG, holter, autoanalisi, tamponi, CUP: ognuno con la sua pagina e la prenotazione.' },
      { h: 'Le offerte del mese', p: 'Parafarmaco e cosmetica in vetrina, da prenotare e ritirare.' },
      { h: 'Il consiglio del farmacista', p: 'Brevi guide di stagione: aiutano i clienti e ti fanno trovare su Google.' },
    ],
    domanda: { q: 'Posso vendere online dal sito?', a: 'Parafarmaco e cosmetica sì, come un normale negozio online. Per vendere a distanza i farmaci senza ricetta servono invece l’autorizzazione e il logo comune europeo: ti aiutiamo a capire cosa serve prima di partire.' },
  },
  'siti-web-negozi-torino': {
    etichetta: 'Negozi', gruppo: 'negozi',
    cercano: 'Prima di uscire di casa si controlla: «negozio scarpe bambino Torino», «ferramenta aperta sabato», «dove comprare… vicino a me». Chi cerca vuole sapere se hai quello che serve, se sei aperto e come arrivare. Un sito con i prodotti principali e gli orari giusti porta in negozio chi altrimenti comprerebbe online.',
    checklist: [
      { h: 'La vetrina dei prodotti', p: 'Le categorie e i pezzi forti, con le foto: non serve mettere tutto il magazzino.' },
      { h: 'Ordina e ritira', p: 'Il cliente prenota online e passa a prendere: comodo per lui, vendita sicura per te.' },
      { h: 'Le marche trattate', p: 'Molti cercano per marca: elencarle ti fa trovare.' },
      { h: 'Orari, mappa, parcheggio', p: 'Le domande più fatte, con la risposta prima che le facciano.' },
    ],
    domanda: { q: 'Mi conviene un e-commerce completo?', a: 'Dipende da cosa vendi e da chi ti compra. Per molti negozi di quartiere funziona meglio una vetrina con «ordina e ritira»: costa meno, non richiede spedizioni e porta gente in negozio. Se le richieste crescono, il carrello si aggiunge.' },
  },
  'siti-web-gioiellerie-torino': {
    etichetta: 'Gioiellerie e laboratori orafi', gruppo: 'negozi',
    cercano: 'In gioielleria si entra per fiducia, e oggi la fiducia si costruisce prima, online: «gioielleria Torino fedi», «riparazione orologi Torino», «compro oro Torino». Chi cerca vuole vedere lo stile delle collezioni, capire i servizi di laboratorio e sapere da quanti anni esistete. Le recensioni fanno il resto.',
    checklist: [
      { h: 'Le collezioni in vetrina', p: 'Una selezione di pezzi, aggiornabile dal negozio, per far venire voglia di entrare.' },
      { h: 'Laboratorio e riparazioni', p: 'Saldature, misure, orologi: i servizi spiegati, con i tempi.' },
      { h: 'Il compro oro con il numero OAM', p: 'Se lo fai, l’iscrizione all’OAM in evidenza: rassicura chi deve vendere.' },
      { h: 'La vostra storia', p: 'Da quanti anni, chi c’è dietro il banco: in gioielleria conta.' },
    ],
    domanda: { q: 'Posso aggiornare la vetrina da solo?', a: 'Sì: da un’area riservata carichi le foto dei nuovi pezzi dal telefono, con nome e descrizione. Non serve saper fare nulla di tecnico.' },
  },
  'siti-web-officine-torino': {
    etichetta: 'Officine e autoriparazioni', gruppo: 'servizi',
    cercano: 'Quando si accende una spia si cerca «officina vicino a me» o «tagliando Torino Lingotto», e si sceglie in fretta, spesso con l’auto ferma. Contano tre cose: le recensioni, la chiarezza su servizi e marche trattate, e poter chiedere un preventivo senza perdere mezza mattina al telefono.',
    checklist: [
      { h: 'Servizi e marche trattate', p: 'Tagliandi, freni, gomme, climatizzatore, diagnosi: chi cerca vede subito se fai al caso suo.' },
      { h: 'La richiesta di preventivo', p: 'Modello, targa e problema in un modulo: rispondi quando hai le mani libere.' },
      { h: 'Le recensioni in vista', p: 'Collegate alla scheda Google: sono il primo motivo per cui si sceglie un meccanico.' },
      { h: 'Orari e come arrivare', p: 'Con la mappa e, se ce l’hai, l’auto sostitutiva in evidenza.' },
    ],
    domanda: { q: 'Posso far prenotare il tagliando online?', a: 'Sì: il cliente sceglie il giorno in cui lasciare l’auto tra quelli liberi, e tu confermi. Così riempi l’agenda senza telefonate.' },
  },
  'siti-web-lavanderie-torino': {
    etichetta: 'Lavanderie e tintorie', gruppo: 'servizi',
    cercano: 'Le ricerche sono pratiche: «lavanderia vicino a me», «lavaggio piumoni Torino», «tintoria abito da sposa», «lavanderia self service aperta». Chi cerca vuole sapere cosa lavi, quanto costa, in quanto tempo è pronto e se ritiri a domicilio. Se il sito lo dice, il cliente arriva già deciso.',
    checklist: [
      { h: 'Il listino per capo', p: 'Camicie, piumoni, tende, capi delicati: prezzi chiari evitano domande al banco.' },
      { h: 'I tempi di consegna', p: 'In giornata, in 48 ore: dillo per ogni servizio.' },
      { h: 'Ritiro e consegna', p: 'Se lo fai, è il motivo per cui ti scelgono: si prenota dal sito.' },
      { h: 'Il self service', p: 'Orari, numero di macchine, come si paga.' },
    ],
    domanda: { q: 'Posso far prenotare il ritiro a domicilio?', a: 'Sì: il cliente sceglie giorno e fascia oraria, indica i capi e l’indirizzo. Ti arriva tutto per iscritto e organizzi il giro.' },
  },
  'siti-web-agenzie-viaggi-torino': {
    etichetta: 'Agenzie di viaggio', gruppo: 'servizi',
    metaDesc: 'Siti web per agenzie viaggi a Torino: le vostre mete in vetrina, preventivi su misura e un motivo in più per scegliere voi invece del portale.',
    cercano: 'Chi va in agenzia invece che su un portale cerca qualcosa in più: «viaggio di nozze agenzia Torino», «crociera con agenzia», «tour del Giappone organizzato». Vuole capire se conoscete davvero quella meta, vedere proposte concrete e chiedere un preventivo su misura senza impegno.',
    checklist: [
      { h: 'Le vostre specialità', p: 'Viaggi di nozze, gruppi, le mete che conoscete davvero: è il motivo per cui si sceglie un’agenzia.' },
      { h: 'Proposte con periodo e durata', p: 'Idee concrete da cui partire, aggiornate di stagione in stagione.' },
      { h: 'Il preventivo su misura', p: 'Date, persone, budget: la richiesta arriva completa.' },
      { h: 'I dati dell’agenzia in chiaro', p: 'Ragione sociale, autorizzazioni e garanzie: tolgono il dubbio a chi spende molto.' },
    ],
    domanda: { q: 'Devo pubblicare i prezzi dei viaggi?', a: 'Non serve: un «a partire da» su qualche proposta aiuta, ma il vostro valore è il su misura. Il sito porta richieste di preventivo, il resto lo fate voi.' },
  },
  'siti-web-hotel-torino': {
    etichetta: 'Hotel e B&B', gruppo: 'servizi',
    cercano: 'Chi prenota un alloggio a Torino passa quasi sempre da un portale, poi cerca il nome della struttura su Google per vedere il sito. Se lì trova belle foto, la posizione chiara e la possibilità di prenotare direttamente, magari con un piccolo vantaggio, la prenotazione arriva a te senza commissione.',
    checklist: [
      { h: 'La prenotazione diretta', p: 'Con il motore di prenotazione o una richiesta di disponibilità: ogni prenotazione diretta è una commissione risparmiata.' },
      { h: 'Camere con foto e servizi', p: 'Una pagina per tipologia, con letti, metri quadri e dotazioni.' },
      { h: 'Il codice CIN', p: 'Il Codice Identificativo Nazionale va indicato anche negli annunci online: sul sito lo mettiamo in vista.' },
      { h: 'In italiano e in inglese', p: 'Molti ospiti arrivano dall’estero: il sito deve parlare anche la loro lingua.' },
    ],
    domanda: { q: 'Il sito si collega al mio channel manager?', a: 'Nella maggior parte dei casi sì: il motore di prenotazione del tuo channel manager si inserisce nel sito, così disponibilità e prezzi restano allineati con i portali.' },
  },
  'siti-web-addestratori-cani-torino': {
    etichetta: 'Educatori e addestratori cinofili', gruppo: 'servizi',
    metaDesc: 'Siti web per addestratori ed educatori cinofili a Torino: percorsi chiari, lezione di prova prenotabile e il tuo metodo raccontato bene.',
    cercano: 'Chi ha un cucciolo nuovo o un cane difficile cerca «educatore cinofilo Torino», «corso per cuccioli», «cane che tira al guinzaglio». Prima di affidare il proprio cane vuole capire il metodo, vedere il campo e leggere le esperienze di altri proprietari. La lezione di prova è il passo che fa decidere.',
    checklist: [
      { h: 'Il tuo metodo', p: 'Gentile, a rinforzo positivo, come lavori: è la prima cosa che si chiede.' },
      { h: 'Percorsi per esigenza', p: 'Cuccioli, educazione di base, problemi di comportamento, sport.' },
      { h: 'Dove si fanno le lezioni', p: 'Campo, parco, a domicilio: con foto e mappa.' },
      { h: 'La lezione di prova prenotabile', p: 'Il passo più facile per cominciare.' },
    ],
    domanda: { q: 'Posso raccontare i cani che ho seguito?', a: 'Sì, ed è una delle cose che convince di più: prima e dopo, con il permesso dei proprietari. Le storie vere valgono più di qualsiasi descrizione.' },
  },
};

// Unisce i dettagli ai dati delle pagine: ogni settore deve averli (la build si ferma se ne manca uno).
for (const [slug, d] of Object.entries(SETTORI)) {
  if (!DETTAGLI[slug]) throw new Error(`settori.js: mancano i DETTAGLI di ${slug}`);
  Object.assign(d, DETTAGLI[slug]);
}
