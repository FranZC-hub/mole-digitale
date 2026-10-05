# MasGioielli — versione reale (in sviluppo)

Il sito del negozio MasGioielli (Corso Trapani 146/b, Torino): pagine statiche fatte con
Astro e un'area riservata in PHP + MySQL, con cui il negozio aggiorna da solo la vetrina,
gli orari, le chiusure e i marchi, e legge i messaggi dei moduli.

Vive **dentro il sito di Mole Digitale**, in `https://www.moledigitale.it/masgioielliDev/`,
finché non è pronto per masgioielli.it. È fuori da Google (`noindex`, fuori dalla sitemap).
La raccolta di tutti i progetti in sviluppo è `/demoClientiDev/`; la bozza vista dal cliente
resta in `/demoMasGioielli/`.

Gira su qualsiasi hosting Linux con **PHP 8.1+ e MySQL/MariaDB** e Apache con `.htaccess`:
niente Node sul server, niente servizi esterni.

## Dove sta

```
src/pages/demoClientiDev/index.astro raccolta: versioni reali (con credenziali e checklist) e sole bozze
src/pages/masgioielliDev/            le pagine: / selezione/ atelier/ compro-oro/ perizie/
├── _Layout.astro                    contatti/ privacy/ area-riservata/ 404/
└── _sito.js                         dati del negozio, BASE (la cartella), chiamate all'API
src/data/clienti.js                  i clienti, condivisi da /demoClienti/ e /demoClientiDev/
src/scripts/checklist.js             la checklist di /demoClientiDev/: si spunta, si modifica come testo, si copia
                                     (resta nel browser; si parte da docs/masgioielli/PRODUZIONE.md)
public/masgioielliDev/
├── .htaccess                        CSP propria, noindex, 404 (si aggiunge a quello del sito)
├── img/                             foto e logo del negozio
├── api/                             backend PHP
│   ├── config.esempio.php           → da copiare in masgioielli-dati/config.php SUL SERVER
│   ├── installa.php                 una tantum: tabelle + primo utente
│   ├── dati.php                     pubblico: selezione, orari, chiusure, marchi
│   ├── foto.php                     pubblico: le foto dei pezzi (che stanno fuori dal sito)
│   ├── messaggio.php                pubblico: moduli Contatti e Perizie (email + archivio)
│   ├── accesso.php                  accesso, uscita, cambio password
│   ├── pezzi.php orari.php marchi.php messaggi.php   area riservata
│   └── lib/                         base, schema del database, foto, posta (non raggiungibili)
└── uploads/                         solo se le foto non stanno fuori (script disattivati)
tools/masgioielli/                   collaudi, server locale, dati d'esempio
docs/masgioielli/                    questo file, PRODUZIONE.md, .htaccess per masgioielli.it
```

Tutti gli indirizzi interni partono da `BASE` in `_sito.js`; il PHP ricava la cartella da solo
(`base_sito()`), quindi funziona sia qui sia alla radice di un dominio. Nel CSS c'è un solo
percorso scritto per intero (lo sfondo dell'atelier in `index.astro`).

## Sul server: configurazione e foto FUORI dalla cartella pubblica

Come `mail-config.php` di Mole Digitale, i dati stanno **sopra** la cartella pubblica:

```
(radice FTP di Aruba)
├── www.moledigitale.it/             il sito (lo carica il deploy)
├── mail-config.php                  Mole Digitale
└── masgioielli-dati/
    ├── config.php                   database, email, sale, codice di installazione
    └── foto/                        le foto caricate dal negozio (le consegna api/foto.php)
```

Così il browser non le raggiunge e il deploy non le tocca mai: con «full_resync» l'action FTP
svuota **tutta** la cartella del sito, anche i file in `exclude`. Se l'hosting non lasciasse
scrivere lì, `api/config.php` funziona ancora (bloccato da `.htaccess`), senza la riga `foto`.

### Prima installazione

1. Creare un database MySQL dal pannello di Aruba. Se il pannello lo permette, all'utente
   bastano `SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX` su quel solo database.
2. Via FTP, creare `masgioielli-dati/` accanto a `www.moledigitale.it/` e caricarci
   `config.php`, copiato da `api/config.esempio.php` e compilato: database, casella email,
   una `sale` casuale, un codice di `installazione` casuale (almeno 20 caratteri).
3. Aprire `https://www.moledigitale.it/masgioielliDev/api/installa.php`, inserire
   il codice e creare l'utente del negozio (password di almeno 10 caratteri).
4. Svuotare `installazione` in `config.php` (`'installazione' => ''`).
5. Collaudo del server vero:
   `MAS_URL=https://www.moledigitale.it MAS_HTTP=http://www.moledigitale.it node tools/masgioielli/prova-server.mjs`

## In locale

```bash
npm run mas:esempio          # build + MySQL + dati d'esempio: il sito "pieno", come sarà online
npm run mas:server           # tutto il sito + API su SQLite, database vuoto
npm run mas:prova-api        # collaudo dell'API (73 controlli; lo esegue anche il deploy)
npm run mas:prova-sito       # build + collaudo nel browser con la CSP del server (50 controlli)
```

Il sito locale è su `http://127.0.0.1:8090/masgioielliDev/`.

`mas:esempio`, la prima volta, su Windows scarica MariaDB 11.4 portatile in `.locale/mariadb`
(87 MB, controllato con SHA-256; niente installazione né servizi) e lo accende solo su
127.0.0.1; altrove, o con un MySQL già installato: `MAS_MYSQL=host:porta:utente:password`.
Crea il database `masgioielli` e l'utente `mas_sito` con i permessi minimi, installa e carica
dall'API vera 9 pezzi con foto, 6 marchi inventati, una chiusura e 3 messaggi; poi stampa
indirizzi, utente e password dell'area riservata e i dati per collegarsi al database.
I dati restano tra un avvio e l'altro; `npm run mas:esempio -- --azzera` riparte da zero;
`Ctrl+C` ferma sito e database. I dati d'esempio non partono mai verso un server che non sia
`127.0.0.1`.

La configurazione di prova sta in `.locale/` (esclusa da git) e si passa al PHP con
`MAS_CONFIG`; anche le foto locali stanno lì. Non si crea mai `api/config.php` in `public/`:
finirebbe in `dist/` e sul server (`tools/masgioielli/controlla.mjs` blocca il deploy se succede).

### Collaudi su un server già acceso

```bash
MAS_URL=https://SERVER MAS_HTTP=http://SERVER node tools/masgioielli/prova-server.mjs
#   facoltativi: MAS_UTENTE / MAS_PASSWORD (cookie Secure), MAS_DIST (solo in locale)
MAS_URL=https://127.0.0.1:8443 MAS_CODICE=... node tools/masgioielli/prova-sito.mjs
#   SOLO su un database di prova appena creato: installa e cambia la password
```

## Deploy

È quello di moledigitale.it (`.github/workflows/deploy.yml`, push su `main`): collaudo
dell'API, build, controllo dei link e di `dist/`, poi FTP su Aruba. Parte solo con i secret
`ARUBA_FTP_HOST`, `ARUBA_FTP_USER`, `ARUBA_FTP_PASS`. Non tocca mai `masgioielli-dati/`.

## Sicurezza, in breve

- Credenziali solo in `masgioielli-dati/config.php` sul server, fuori dalla cartella pubblica.
- Password con `password_hash`; sessione con cookie HttpOnly, Secure, SameSite=Strict, valido
  solo in `/masgioielliDev/`; identificativo rigenerato all'accesso; uscita dopo
  2 ore di inattività.
- Token CSRF su ogni modifica; massimo 8 tentativi di accesso ogni 15 minuti.
- Query sempre preparate; testi validati e limitati sul server; nell'HTML tutto passa da `esc()`.
- Foto: controllate sul contenuto (JPEG/PNG/WebP), ricodificate con GD (via EXIF/GPS), nome
  casuale, fuori dalla cartella pubblica; `foto.php` consegna solo nomi generati dal sito.
- Moduli pubblici: campo trappola, tempo minimo, 5 invii l'ora per indirizzo.
- Errori: mai dettagli tecnici al browser, solo nel log del server.
- `.htaccess` della cartella: CSP senza script in linea (sostituisce quella del sito principale),
  `noindex`; HTTPS e HSTS restano quelli di moledigitale.it.

## Quando si passa a masgioielli.it

Vedi la seconda parte di `PRODUZIONE.md`. In breve: pubblicare le pagine alla radice del dominio
(`BASE = '/'`), togliere `noindex`, usare `docs/masgioielli/masgioielli.it.htaccess` (HTTPS, www,
redirect dal vecchio WordPress), spostare database e `masgioielli-dati/`.
