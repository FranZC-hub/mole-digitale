# MasGioielli — pronto per la produzione?

Stato al 5 ottobre 2026. ✅ fatto · ⬜ da fare · 👤 serve qualcosa dal negozio

## Tecnica — fatto e verificato

- ✅ Progetto autonomo (`masgioielli/`), sito alla radice del dominio, dominio configurabile (`SITO_URL`)
- ✅ Backend PHP + MySQL: selezione con foto, orari, chiusure straordinarie, marchi, messaggi, cambio password
- ✅ Moduli Contatti e Perizie che inviano davvero: email al negozio + copia nell'area riservata
- ✅ Collaudo API: 65 controlli, tutti superati **su SQLite e su MariaDB 11.4 in modalità strict**
  (installazione, accesso, CSRF, foto, abusi sulle foto, SQL nei parametri, limiti, spam, password)
- ✅ Collaudo nel browser con la stessa CSP del server: 51 controlli, su entrambi i database,
  nessun errore JavaScript, nessuna violazione CSP, nessun avviso PHP
- ✅ Prova generale su un server come quello di un hosting: **Apache 2.4 + PHP come modulo +
  MariaDB** con un utente del database dai permessi minimi, `.htaccess` attivo, errori PHP nascosti.
  Collaudo del server (`prova-server.mjs`) e collaudo nel browser tutti superati, log PHP vuoto:
  HTTPS e www obbligatori, intestazioni di sicurezza e CSP vere, cache e gzip, 404 del sito,
  `config.php`/librerie/`.env`/`.git` irraggiungibili, nessuno script eseguibile tra le foto
  (nemmeno `foto.php.jpg`), cookie di sessione Secure
- ✅ Database MySQL d'esempio in locale con un comando (`npm run esempio`): stessa struttura e
  stessi permessi della produzione, pezzi con foto, marchi, chiusura e messaggi caricati dall'API
- ✅ Redirect 301 dai 19 indirizzi del vecchio WordPress (italiani e inglesi) alle pagine nuove;
  `/bozza/` e i file di WordPress rispondono 410
- ✅ Lighthouse, pagine pubbliche: prestazioni 97–100, accessibilità 100, buone pratiche 100, SEO 100, CLS 0
- ✅ Tolto tutto ciò che era da bozza: fascia «Anteprima», «Bozza dimostrativa», riquadri «Per il
  titolare», credenziali di prova, «Riporta agli esempi», `noindex`, statistiche di moledigitale.it,
  la recensione d'esempio («Silvia R.»), i marchi inventati, le 9 foto d'archivio della Selezione
- ✅ SEO: canonical, Open Graph con indirizzi assoluti, dati strutturati JewelryStore, sitemap,
  robots.txt (area riservata e API escluse)
- ✅ Informativa privacy di produzione; messaggi cancellati dopo 24 mesi, impronte IP dopo 24 ore
- ✅ Deploy automatico pronto (parte solo con i secret dell'hosting)

## Hosting e messa online — 🧑‍💻 noi

- ⬜ Decidere l'hosting (Aruba o Seeweb, dove oggi sta masgioielli.it con WordPress)
- ⬜ Creare il database MySQL (permessi all'utente: `SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX`)
  e la casella email che manda i messaggi (es. sito@masgioielli.it)
- ⬜ Secret su GitHub: `MAS_FTP_HOST`, `MAS_FTP_USER`, `MAS_FTP_PASS`, `MAS_FTP_DIR`
- ⬜ Sul server: `api/config.php` da `config.esempio.php`, poi `/api/installa.php`, poi svuotare il codice
- ⬜ Certificato HTTPS attivo sul dominio **prima** di pubblicare (il `.htaccess` impone HTTPS e HSTS)
- ⬜ Salvare il vecchio sito WordPress (file e database) prima di sostituirlo
- ⬜ Backup automatico del database e della cartella `uploads/` (pannello dell'hosting)
- ⬜ Dopo la pubblicazione: `MAS_URL=https://www.masgioielli.it MAS_HTTP=http://www.masgioielli.it
  node tools/prova-server.mjs` (su Aruba/Seeweb alcuni moduli Apache possono mancare: lo dice lui)
- ⬜ Dopo la pubblicazione: prova di un messaggio da Contatti e da Perizie, controllo che l'email arrivi
- ⬜ Google Search Console: proprietà del dominio e invio della sitemap
- ⬜ Aggiornare la scheda Google (sito web, orari) se cambiano

## Contenuti — 👤 dal negozio

- ⬜ **Foto della home**: quella grande in apertura è d'archivio (`img/apertura-provvisoria.webp`)
- ⬜ **I pezzi della Selezione**: li caricano loro dall'area riservata (la sezione resta nascosta finché è vuota)
- ⬜ **I marchi che trattano davvero** (nelle loro foto si vedono Salvatore Arzani e Giorgio Visconti)
- ⬜ **Numero di iscrizione al Registro OAM** per il Compro oro (`INFO.oam` in `src/lib/sito.js`)
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

## Dopo il lancio

- La prima settimana: controllare ogni giorno che i messaggi arrivino anche per email
- Il negozio cambia la password iniziale dall'area riservata (in fondo: «Cambia la password»)
