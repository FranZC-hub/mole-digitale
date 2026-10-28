# Kit presenza online — Mole Digitale

Testi pronti da incollare per farsi trovare fuori dal sito: scheda Google, Search Console, Bing,
directory, recensioni, social. **Regola d'oro:** nome, telefono, email e sito devono essere
scritti **identici** ovunque (Google li confronta tra i siti per capire che sei sempre tu).

---

## 0. I dati, sempre uguali

```
Mole Digitale
+39 366 210 2203
info@moledigitale.it
https://www.moledigitale.it/
Torino e provincia
```

Partita IVA: da aggiungere qui, nel piede del sito e in ogni profilo appena c'è (in home page è obbligatoria).

---

## 1. Dopo ogni caricamento del sito

1. Carica tutta la cartella `dist/` su Aruba (compreso `.htaccess`).
2. Dal computer, nella cartella del progetto: `npm run indexnow`
   Avvisa Bing (e chi usa IndexNow) delle pagine nuove o cambiate. La prima volta le manda tutte.
3. Se hai aggiunto pagine importanti: Search Console → «Controllo URL» → incolla l'indirizzo →
   «Richiedi indicizzazione».

---

## 2. Google Search Console (una volta sola)

1. Vai su https://search.google.com/search-console e accedi con l'account Google dell'attività.
2. «Aggiungi proprietà» → scegli **Dominio** e scrivi `moledigitale.it`.
3. Google ti dà una riga di testo (record TXT): dal pannello Aruba → DNS del dominio → aggiungi
   un record **TXT** con quel testo. Torna su Search Console e premi «Verifica»
   (a volte servono alcune ore).
   *Alternativa più semplice:* proprietà **Prefisso URL** `https://www.moledigitale.it/` con
   verifica tramite **file HTML**: scarichi il file, lo metti in `public/` e ricarichi il sito.
4. Menu «Sitemap» → scrivi `sitemap-index.xml` → Invia.
5. «Controllo URL» → chiedi l'indicizzazione di queste pagine, una per una:
   - https://www.moledigitale.it/
   - https://www.moledigitale.it/siti-web-torino/
   - https://www.moledigitale.it/restyling-siti-web-torino/
   - https://www.moledigitale.it/scheda-google-business-torino/
   - https://www.moledigitale.it/blog/
6. Ogni 2-3 settimane: «Rendimento» (per quali ricerche compari) e «Pagine» (errori).

## 3. Bing Webmaster Tools (5 minuti, dopo Search Console)

https://www.bing.com/webmasters → accedi → **Importa da Google Search Console**. Importa sito
e sitemap in un clic. Bing alimenta anche Copilot e viene usato da altri assistenti con IA.

---

## 4. Scheda Google Business Profile

Da https://business.google.com con l'account Google dell'attività.

**Tipo di attività:** lavori presso i clienti o in videochiamata, non ricevi in una sede aperta
al pubblico → è un'**attività con area di servizio**: l'indirizzo va inserito per la verifica ma
**nascosto**, e si indica la zona servita. (Se un giorno apri uno studio dove ricevi i clienti,
l'indirizzo va mostrato.)

**Nome:** `Mole Digitale` — esattamente così, senza aggiungere «siti web Torino» o altro
(le parole in più nel nome sono il primo motivo di sospensione).

**Categoria principale:** cerca **«Web designer»**. Se non compare, la più vicina tra
«Servizio di progettazione di siti web» e simili (i nomi delle categorie cambiano nel tempo:
scegli quella che descrive proprio il tuo lavoro).
**Categorie secondarie (1-2):** «Agenzia di marketing su Internet», «Consulente di marketing».

**Zona servita:** Torino, Moncalieri, Nichelino, Collegno, Grugliasco, Rivoli, Settimo Torinese,
San Mauro Torinese, Venaria Reale, Chieri, Orbassano, Beinasco.

**Descrizione** (massimo 750 caratteri, questa ne ha 652):

```
Mole Digitale crea e rifà siti web per ristoranti, bar, negozi, studi e attività di Torino e provincia. Siti veloci, pensati per il telefono, accessibili e pronti per Google, con menu, prenotazioni, contatti WhatsApp e scheda Google collegata. Ti mostriamo una prima bozza gratis in 48 ore, senza anticipo, e il sito completo è online in circa una settimana. Ci occupiamo anche del restyling di siti esistenti, mantenendo dominio, contenuti e posizioni su Google, e della cura della scheda Google Business. Hosting, dominio, sicurezza e assistenza a canone fisso, con il prezzo detto prima. Incontriamo i clienti di persona a Torino o in videochiamata.
```

**Servizi** (nome + descrizione breve):

| Servizio | Descrizione |
|---|---|
| Realizzazione siti web | Siti nuovi per attività locali: veloci, pensati per il telefono e pronti per Google. Prima bozza gratis in 48 ore. |
| Restyling siti web | Rifacciamo il sito che hai già tenendo dominio, email, contenuti buoni e posizioni su Google. |
| Siti per ristoranti e bar | Menu in pagina, prenotazione del tavolo senza commissioni, orari sempre giusti. |
| Siti per parrucchieri ed estetiste | Listino, galleria dei lavori e appuntamenti online con le durate giuste. |
| Siti per studi e professionisti | Servizi spiegati con chiarezza e prima visita prenotabile online. |
| Siti per negozi | Vetrina dei prodotti, ordina e ritira, orari e come arrivare. |
| Scheda Google Business | Creazione, verifica e cura della scheda su Google Maps, collegata al sito. |
| Hosting e assistenza | Hosting, dominio, sicurezza, backup e assistenza a canone fisso. |

**Link:** sito `https://www.moledigitale.it/` · prenotazione/appuntamento `https://www.moledigitale.it/preventivo/`

**Foto da caricare:** il logo (`public/apple-touch-icon.png`), la copertina (`public/og-image.png`),
5-6 schermate delle demo (`public/img/thumbs/`), il prima/dopo, e appena puoi **una tua foto**:
le schede con una persona vera ispirano più fiducia.

**Primi post** (uno ogni 1-2 settimane; testo breve + link):

```
Il tuo sito è vecchio o non si legge dal telefono? Lo rifacciamo moderno tenendo dominio, contenuti e posizioni su Google. Prima bozza gratis in 48 ore.
→ https://www.moledigitale.it/restyling-siti-web-torino/
```
```
La tua scheda Google è completa? Orari, foto, categorie e recensioni fanno la differenza su Maps. Ecco come impostarla bene, passo per passo.
→ https://www.moledigitale.it/blog/scheda-google-business-guida/
```
```
Ristorante, bar, negozio, studio: guarda come può essere il sito della tua attività, settore per settore.
→ https://www.moledigitale.it/siti-web-torino/
```

---

## 5. Recensioni

Dalla scheda: «Chiedi recensioni» → copia il link breve. Poi, a ogni cliente soddisfatto,
appena il suo sito è online:

```
Ciao [nome]! Il sito di [attività] è online 🎉 Se ti sei trovato bene, mi aiuteresti moltissimo con una recensione su Google: bastano due righe, qui → [link]. Grazie!
```

**Regole:** chiederla a tutti (non solo ai più contenti), mai offrire sconti o regali in cambio
(è contro le regole di Google), rispondere a ogni recensione, anche a quelle negative, con calma.

Candidati per le prime: Farmacia dell'Ausiliatrice, MasGioielli, El Warike, PuntoPane — quando
il loro sito è online e se sono contenti.

---

## 6. Directory e profili

Iscriviti a queste, con i dati della sezione 0 sempre identici. Molte compaiono proprio quando
si cerca «realizzazione siti web Torino».

| Dove | Note |
|---|---|
| Bing Places — https://www.bingplaces.com | Importa direttamente dalla scheda Google |
| Apple Business Connect — https://businessconnect.apple.com | Per comparire su Mappe di Apple (iPhone) |
| Pagine Gialle — https://www.paginegialle.it | Scheda base gratuita |
| reteimprese.it | Compare tra i risultati per «realizzazione siti web Torino» |
| Cylex Italia — https://www.cylex-italia.it | Elenco locale, scheda gratuita |
| Clutch — https://clutch.co | Elenco agenzie; contano le recensioni dei clienti |
| Sortlist — https://www.sortlist.it | Elenco agenzie con richieste di preventivo |
| Techbehemoths — https://techbehemoths.com | Elenco agenzie per città |
| Trustpilot — https://it.trustpilot.com | Facoltativo: meglio concentrare le recensioni su Google |

**Descrizione breve** (fino a 160 caratteri):
```
Siti web per ristoranti, negozi e attività di Torino: veloci, pronti per Google e online in una settimana. Prima bozza gratis.
```

**Descrizione media** (circa 300 caratteri):
```
Mole Digitale crea e rifà siti web per le attività di Torino e provincia: ristoranti, bar, negozi, studi, saloni. Siti veloci, pensati per il telefono e pronti per Google, con scheda Google collegata. Prima bozza gratis in 48 ore, nessun anticipo, online in circa una settimana.
```

**Descrizione lunga** (per Clutch, Sortlist e simili):
```
Mole Digitale è uno studio di Torino che crea e rifà siti web per le piccole attività: ristoranti, bar, pasticcerie, negozi, parrucchieri, centri estetici, studi medici, officine, hotel. Ogni sito è pensato prima di tutto per il telefono, è veloce, accessibile (controllato con le regole WCAG) e pronto per Google, con SEO locale, dati strutturati e scheda Google Business collegata.

Lavoriamo così: una chiacchierata, una prima bozza gratis in 48 ore, le rifiniture insieme e il sito online in circa una settimana, senza anticipo. Per chi ha già un sito facciamo il restyling mantenendo dominio, contenuti e posizioni su Google. Dopo la pubblicazione pensiamo noi a hosting, dominio, sicurezza e assistenza, a canone fisso, con il prezzo di ogni modifica detto prima.
```

---

## 7. Social

**Instagram — bio** (fino a 150 caratteri):
```
Siti web per le attività di Torino 🏛️ Veloci, belli, trovati su Google. Prima bozza gratis in 48h 👇
```
Link in bio: `https://www.moledigitale.it/` · Cosa pubblicare: i prima/dopo, 15 secondi di
scorrimento di un sito nuovo da telefono, un consiglio pratico a settimana (dalle guide).

**LinkedIn — pagina aziendale, slogan** (fino a 120 caratteri):
```
Siti web veloci e pronti per Google per ristoranti, negozi e attività di Torino.
```

Quando apri i profili, mandami gli indirizzi: li aggiungo al piede del sito e ai dati
strutturati (`sameAs`), così Google collega i profili al sito.

---

## 8. Da sistemare sul sito appena possibile (servono i tuoi dati)

- **Partita IVA** nel piede (in `src/layouts/Layout.astro` c'è già il punto, commentato).
- **Chi siamo:** nome, foto e due righe su chi c'è dietro (in `src/pages/chi-siamo.astro` c'è il promemoria).
- **Caso studio MasGioielli:** pronto in bozza in `src/pages/lavori/_masgioielli.astro`; si pubblica
  con il permesso del negozio e i primi numeri veri.
- **Domini dei clienti intestati a loro:** la guida «quanto costa un sito all'anno» lo consiglia
  ai lettori; è bene che sia così anche nei siti che fai tu.
