# MasGioielli — cosa manca

Stato all'8 ottobre 2026. ✅ fatto · ⬜ da fare · 👤 serve qualcosa dal negozio

Due tappe: prima la **versione in sviluppo** dentro moledigitale.it (`/masgioielliDev/`, su
Aruba), poi il **passaggio a masgioielli.it**. Il sito è statico, come la bozza: l'area
riservata salva i dati nel browser di chi la usa (localStorage), senza database.

## Tecnica — fatto e verificato

- ✅ Dentro il sito di Mole Digitale, in `/masgioielliDev/`, con la raccolta
  `/demoClientiDev/` (tutti i clienti: chi ha la versione in sviluppo e chi solo la bozza)
- ✅ Sito statico, senza database (dall'8 ottobre 2026, come la bozza): area riservata con
  selezione e foto, orari, chiusure straordinarie, marchi e cambio password; i dati restano
  nel browser di chi li inserisce. Utente e password in `src/pages/masgioielliDev/_locale.js`
- ✅ «Password dimenticata?» fa come se mandasse l'email (senza server non parte nulla)
- ✅ Moduli Contatti e Perizie: senza server non inviano, lo dicono e indicano WhatsApp e telefono
- ✅ Logo nuovo dal PDF del negozio (ottobre 2026), anche nell'anteprima per i social
- ✅ Collaudo nel browser con la CSP del server (`npm run mas:prova`): accesso, vetrina con foto,
  orari, chiusure, marchi, quello che mostra il sito, moduli, password, pagine al telefono
- ✅ Fuori da Google finché è in sviluppo: `noindex` nelle pagine, `X-Robots-Tag`, fuori dalla sitemap
- ✅ Tolto tutto ciò che era da bozza (verificato sul codice e sulla build): fascia «Anteprima»,
  «Bozza dimostrativa», riquadri «Per il titolare», la recensione d'esempio, i marchi inventati,
  le foto d'archivio della Selezione, i commenti interni nell'HTML
- ✅ Informativa privacy aggiornata alla versione senza server

## Tappa 1 — versione in sviluppo su moledigitale.it — 🧑‍💻 noi

- ⬜ **Secret FTP di Aruba** su GitHub (`ARUBA_FTP_HOST`, `ARUBA_FTP_USER`, `ARUBA_FTP_PASS`):
  senza, il deploy di tutto moledigitale.it resta fermo
- ⬜ Dare al negozio utente e password dell'area riservata, spiegando che le modifiche restano
  sul dispositivo da cui le fanno
- ⬜ **Decidere come aggiornare il sito per tutti**: con i dati nel browser, selezione, orari e
  marchi cambiati dall'area riservata li vede solo chi li ha inseriti, non i clienti. Per
  farli vedere a tutti serve un server (il backend PHP + MySQL di prima è nella cronologia di
  git, fino al commit `d48aaef`), oppure si aggiornano i dati nel codice a ogni modifica

## Tappa 2 — passaggio a masgioielli.it — 🧑‍💻 noi

- ⬜ Decidere l'hosting (restare su Aruba con un dominio in più, o Seeweb dove oggi sta il
  WordPress). Sito statico: basta un hosting con **Apache e `.htaccess`** (`mod_rewrite`,
  `mod_headers`, `mod_expires`, `mod_deflate`), FTP e certificato HTTPS
- ⬜ Se si resta su Seeweb: oggi il sito risponde con **nginx**. Verificare che dietro ci sia
  Apache con `.htaccess` attivo, altrimenti le regole vanno riscritte per nginx
- ⬜ **Email del negozio**: DNS e posta del dominio sono su Seeweb (MX `m-07b.th.seeweb.it`).
  Spostando il sito si cambiano **solo** i record A/AAAA, mai gli MX, o le email del negozio
  smettono di arrivare
- ⬜ Pubblicare le pagine alla radice del dominio (`BASE = '/'` in `_sito.js`, percorso dello
  sfondo dell'atelier in `index.astro`), togliere `noindex` (`_Layout.astro`, `.htaccess`),
  canonical e sitemap su masgioielli.it, `robots.txt` con l'area riservata esclusa
- ⬜ `.htaccess` di dominio: `docs/masgioielli/masgioielli.it.htaccess` (HTTPS, www, 301 dai
  19 indirizzi del vecchio WordPress, 410 per `/bozza/` e i file di WordPress)
- ⬜ Certificato HTTPS attivo **prima** di pubblicare (HTTPS e HSTS obbligatori)
- ⬜ Salvare il vecchio sito WordPress (file e database) prima di sostituirlo
- ⬜ Google Search Console: proprietà del dominio e invio della sitemap; aggiornare la scheda Google

## Contenuti — 👤 dal negozio

- ⬜ **Foto della home**: quella grande in apertura è d'archivio (`img/apertura-provvisoria.webp`)
- ⬜ **I pezzi della Selezione** (la sezione resta nascosta finché è vuota)
- ⬜ **I marchi che trattano davvero** (nelle loro foto si vedono Salvatore Arzani e Giorgio Visconti)
- ⬜ **Numero di iscrizione al Registro OAM** per il Compro oro (`INFO.oam` in `_sito.js`)
- ⬜ **Voto e numero di recensioni Google** aggiornati (oggi «4,9 · 200», dal vecchio sito)
- ⬜ **Ragione sociale** per privacy e piede (oggi c'è solo «MasGioielli» e la P.IVA)
- ⬜ **Staff**: nomi, ruoli e foto delle persone oltre al titolare
- ⬜ **Foto originali** di Elisa Miglietti in alta risoluzione e conferma del diritto d'uso
- ⬜ **Testi da far confermare**, scritti da noi per la bozza:
  «la prima stima verbale è sempre gratuita», «possiamo ricevervi a negozio chiuso»,
  «zona San Paolo, si parcheggia davanti», «di solito rispondiamo in giornata»,
  e i testi che Alessandro voleva rivedere
- ⬜ Conferme già chieste: il 338 538 6701 come WhatsApp, la perizia in banca per le cassette
  di sicurezza
- ⬜ **Informativa privacy** da far rileggere al loro consulente
- ⬜ **Moduli Contatti e Perizie**: se li vogliono funzionanti serve un server che spedisca le
  email (e l'indirizzo a cui mandarle, es. info@masgioielli.it)
- ⬜ **Statistiche delle visite**: oggi non ce ne sono (niente cookie, niente banner). Se le
  vogliono, una soluzione senza cookie che non richiede il banner

## Dopo il lancio

- Il negozio cambia la password iniziale dall'area riservata (in fondo: «Cambia la password»):
  vale sul dispositivo da cui la cambia
