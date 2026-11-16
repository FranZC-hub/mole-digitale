// Le domande frequenti della home, scritte una volta sola: la pagina le mostra (index.astro) e
// Layout.astro le passa a Google come dati strutturati (FAQPage). Prima stavano copiate nei due
// posti: bastava aggiornarne uno solo perché Google leggesse una risposta diversa da quella visibile.
// `a` è HTML: può contenere link. Per Google i tag vengono tolti (senzaTag).
export const FAQ_HOME = [
  { q: "Quanto tempo ci vuole davvero?",
    a: "In media 7 giorni lavorativi per un sito completo. Per l'onepage Essenziale anche 5. Dipende da quanto velocemente ci mandi foto e testi — ma su quello ti diamo una mano." },
  { q: "Devo avere già le foto e i testi?",
    a: "No. Se non li hai, ti aiutiamo noi a scrivere i testi e possiamo organizzare uno shooting foto a Torino a parte. Partiamo anche solo da una chiacchierata." },
  { q: "Come funziona il prezzo?",
    a: "Ti mandiamo un <a href=\"/preventivo/\">preventivo su misura</a>, gratis e senza impegno, prima di iniziare: dentro trovi la creazione del sito (una tantum) e il canone mensile per hosting, dominio, SSL e assistenza tecnica. Le modifiche al sito sono un servizio a parte, con piccole cifre dette sempre prima — nessuna sorpresa. Per farti un’idea, leggi <a href=\"/blog/quanto-costa-un-sito-web-a-torino/\">quanto costa un sito web a Torino</a>." },
  { q: "Lavorate solo a Torino?",
    a: "Partiamo da Torino e provincia perché ci piace incontrare di persona gli esercenti. Ma lavoriamo benissimo anche a distanza, quindi se sei fuori scrivici lo stesso." },
  { q: "E dopo, se voglio cambiare qualcosa?",
    a: "Ci scrivi e lo facciamo noi: ogni modifica ha una piccola cifra chiara, detta sempre prima di partire. Niente sorprese in fattura." },
];

/** Il testo di una risposta senza i tag HTML (per i dati strutturati). */
export const senzaTag = (html) => html.replace(/<[^>]+>/g, '');
