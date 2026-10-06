# MasGioielli — cosa manca

Stato al 5 ottobre 2026. ✅ fatto · ⬜ da fare · 👤 serve qualcosa dal negozio

Due tappe: prima la **versione reale in sviluppo** dentro moledigitale.it
(`/masgioielliDev/`, su Aruba), dove il negozio può già caricare pezzi e marchi;
poi il **passaggio a masgioielli.it**.

## Tecnica — fatto e verificato

- ✅ Dentro il sito di Mole Digitale, in `/masgioielliDev/`, con la raccolta
  `/demoClientiDev/` (tutti i clienti: chi ha la versione reale e chi solo la bozza)
- ✅ Backend PHP + MySQL: selezione con foto, orari, chiusure straordinarie, marchi, cambio password, password dimenticata (link per email); messaggi dei moduli per email, con copia nel database (non nel pannello)
- ✅ Moduli Contatti e Perizie che inviano davvero: email al negozio + copia nell'area riservata
- ✅ Configurazione e foto **sopra la cartella pubblica** (`masgioielli-dati/`, come `mail-config.php`):
  irraggiungibili dal browser e al sicuro anche dal «full_resync» del deploy, che svuota tutta
  la cartella del sito, `exclude` compresi
- ✅ Collaudo API: 73 controlli **su SQLite e su MariaDB 11.4 in modalità strict**
  (installazione, accesso, CSRF, foto, abusi sulle foto e su `foto.php`, SQL nei parametri,
  limiti, spam, password, cookie limitato alla cartella). Lo esegue anche il deploy
- ✅ Collaudo nel browser con la CSP del server: 50 controlli, nessun errore JavaScript,
  nessuna violazione CSP, nessun avviso PHP
- ✅ Prova generale come su Aruba: **Apache 2.4 + PHP come modulo + MariaDB** con utente dai
  permessi minimi, tutto moledigitale.it con il suo `.htaccess` e quello della cartella,
  configurazione e foto in `masgioielli-dati/` trovate da sole. Collaudo del server (37 controlli)
  e nel browser superati, log PHP vuoto. In particolare: l'HTTPS obbligatorio di moledigitale.it
  vale anche qui dentro; la CSP della cartella **sostituisce** quella del sito (non si sommano);
  il resto di moledigitale.it non cambia
- ✅ Fuori da Google finché è in sviluppo: `noindex` nelle pagine, `X-Robots-Tag`, fuori dalla sitemap
- ✅ Tolto tutto ciò che era da bozza (verificato sul codice e sulla build): fascia «Anteprima»,
  «Bozza dimostrativa», riquadri «Per il titolare», credenziali di prova, la recensione d'esempio,
  i marchi inventati, le foto d'archivio della Selezione, i commenti interni nell'HTML
- ✅ Database d'esempio in locale con un comando (`npm run mas:esempio`)
- ✅ Informativa privacy; messaggi cancellati dopo 24 mesi, impronte IP dopo 24 ore

## Tappa 1 — versione in sviluppo su moledigitale.it — 🧑‍💻 noi

- ⬜ **Rimettere il database**: `SENZA_DATABASE = false` in `src/pages/masgioielliDev/_sito.js`
  (per ora i dati restano nel browser di chi usa l'area riservata)

- ⬜ **Secret FTP di Aruba** su GitHub (`ARUBA_FTP_HOST`, `ARUBA_FTP_USER`, `ARUBA_FTP_PASS`):
  senza, il deploy di tutto moledigitale.it resta fermo
- ⬜ Dopo l'installazione, secret `MAS_DEV_PASSWORD` (e `MAS_DEV_UTENTE` se non è `negozio`)
  su GitHub: così utente e password compaiono in `/demoClientiDev/` senza finire nel codice
- ⬜ **Database MySQL** dal pannello di Aruba (verificare che il piano lo includa); permessi
  all'utente, se si possono scegliere: `SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX`
- ⬜ **`masgioielli-dati/config.php`** accanto a `www.moledigitale.it/` (da `api/config.esempio.php`):
  database, casella email che spedisce, `sale` e codice di installazione casuali,
  `indirizzo` del sito (senza, «Password dimenticata?» risponde che non è attivo)
- ⬜ Installazione da `/masgioielliDev/api/installa.php`, poi svuotare il codice;
  password del negozio consegnata a voce o di persona (al primo accesso la cambiano)
- ⬜ `MAS_URL=https://www.moledigitale.it MAS_HTTP=http://www.moledigitale.it node tools/masgioielli/prova-server.mjs`
- ⬜ Un messaggio di prova da Contatti e da Perizie: arriva l'email?
- ⬜ «Password dimenticata?» di prova: arriva l'email con il link, e il link funziona?
- ⬜ Backup del database e di `masgioielli-dati/` (pannello di Aruba)

## Tappa 2 — passaggio a masgioielli.it — 🧑‍💻 noi

- ⬜ Decidere l'hosting (restare su Aruba con un dominio in più, o Seeweb dove oggi sta il
  WordPress). Requisiti: PHP 8.1+ con `pdo_mysql` e `gd`, MySQL/MariaDB, **Apache con `.htaccess`**
  (`mod_rewrite`, `mod_headers`, `mod_expires`, `mod_deflate`), FTP, certificato HTTPS
- ⬜ Se si resta su Seeweb: oggi il sito risponde con **nginx**. Verificare che dietro ci sia
  Apache con `.htaccess` attivo, altrimenti le regole vanno riscritte per nginx
- ⬜ **Email del negozio**: DNS e posta del dominio sono su Seeweb (MX `m-07b.th.seeweb.it`,
  SPF solo Seeweb). Spostando il sito si cambiano **solo** i record A/AAAA, mai gli MX, o le
  email del negozio smettono di arrivare. Il sito deve spedire da una casella che l'SPF
  autorizza (una casella Seeweb, oppure aggiungere l'hosting nuovo all'SPF)
- ⬜ Pubblicare le pagine alla radice del dominio (`BASE = '/'` in `_sito.js`, percorso dello
  sfondo dell'atelier in `index.astro`), togliere `noindex` (`_Layout.astro`, `.htaccess`),
  canonical e sitemap su masgioielli.it, `robots.txt` con l'area riservata esclusa;
  in `config.php` `'indirizzo' => 'https://www.masgioielli.it'` (il link «password dimenticata»)
- ⬜ `.htaccess` di dominio: `docs/masgioielli/masgioielli.it.htaccess` (HTTPS, www, 301 dai
  19 indirizzi del vecchio WordPress, 410 per `/bozza/` e i file di WordPress)
- ⬜ Spostare i dati: esportare il database (`mariadb-dump`) e copiare `masgioielli-dati/`;
  nel database le foto sono salvate per nome, quindi restano valide
- ⬜ Certificato HTTPS attivo **prima** di pubblicare (HTTPS e HSTS obbligatori)
- ⬜ Salvare il vecchio sito WordPress (file e database) prima di sostituirlo
- ⬜ Google Search Console: proprietà del dominio e invio della sitemap; aggiornare la scheda Google

## Contenuti — 👤 dal negozio

- ⬜ **Foto della home**: quella grande in apertura è d'archivio (`img/apertura-provvisoria.webp`)
- ⬜ **I pezzi della Selezione**: li caricano loro dall'area riservata (la sezione resta nascosta finché è vuota)
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
  di sicurezza, il logo a triangolo pieno
- ⬜ **Informativa privacy** da far rileggere al loro consulente
- ⬜ **A quale indirizzo** far arrivare i messaggi dei moduli (es. info@masgioielli.it)
- ⬜ **Statistiche delle visite**: oggi non ce ne sono (niente cookie, niente banner). Se le
  vogliono, una soluzione senza cookie che non richiede il banner

## Dopo il lancio

- La prima settimana: controllare ogni giorno che i messaggi arrivino anche per email
- Il negozio cambia la password iniziale dall'area riservata (in fondo: «Cambia la password»)
