# Sito di MasGioielli

Sito del negozio MasGioielli (Corso Trapani 146/b, Torino): pagine statiche fatte con
[Astro](https://astro.build) e un'area riservata in PHP + MySQL con cui il negozio aggiorna
da solo la vetrina, gli orari, le chiusure, i marchi e legge i messaggi dei moduli.

Gira su qualsiasi hosting Linux con **PHP 8.1+ e MySQL/MariaDB** (Aruba, Seeweb, …):
niente Node sul server, niente servizi esterni.

## Struttura

```
masgioielli/
├── src/                       pagine (Astro)
│   ├── pages/                 / selezione/ atelier/ compro-oro/ perizie/ contatti/ privacy/ area-riservata/ 404
│   ├── layouts/Layout.astro   testata, piede, stili comuni
│   └── lib/sito.js            dati del negozio, orari, chiamate all'API
├── public/                    copiato così com'è nel sito
│   ├── .htaccess              HTTPS, intestazioni di sicurezza (CSP), cache, 404
│   ├── api/                   backend PHP
│   │   ├── config.esempio.php → da copiare in config.php SUL SERVER (mai nel repository)
│   │   ├── installa.php       una tantum: tabelle + primo utente
│   │   ├── dati.php           pubblico: selezione, orari, chiusure, marchi
│   │   ├── messaggio.php      pubblico: moduli Contatti e Perizie (email + archivio)
│   │   ├── accesso.php        accesso, uscita, cambio password
│   │   ├── pezzi.php orari.php marchi.php messaggi.php   area riservata
│   │   └── lib/               base, schema del database, foto, posta (non raggiungibili dal browser)
│   └── uploads/               foto caricate dal negozio (sul server; script disattivati)
└── tools/
    ├── prova-api.mjs          collaudo dell'API (lo esegue anche il deploy)
    ├── prova-sito.mjs         collaudo completo nel browser, con la CSP del server
    ├── prova-server.mjs       collaudo del server Apache: HTTPS, intestazioni, file vietati, redirect
    ├── server-locale.mjs      sito + API in locale su SQLite
    └── controlla-link.mjs     dopo la build: link interni e credenziali in dist/
```

## In locale

Serve Node 20+ e PHP 8.1+ (su Windows le estensioni vengono attivate dallo script).

```bash
npm install
npm run dev              # solo le pagine, http://localhost:4321 (l'API non c'è: le pagine usano i dati di partenza)
npm run build            # dist/ + controllo dei link
npm run server           # dist/ + API su SQLite, http://127.0.0.1:8090 (il codice di installazione è stampato a video)
```

La configurazione di prova sta in `.locale/` (esclusa da git) e si passa al PHP con la
variabile `MAS_CONFIG`: **non** si crea mai `public/api/config.php` in locale, altrimenti
finirebbe in `dist/` e, caricato a mano sul server, sovrascriverebbe quella vera
(`controlla-link.mjs` blocca la build se succede).

### Collaudi

```bash
node tools/prova-api.mjs                                  # API su SQLite
MAS_MYSQL=127.0.0.1:3306:root:password node tools/prova-api.mjs   # API su MySQL/MariaDB
node tools/prova-sito.mjs                                 # tutto nel browser (serve Chrome)
```

Su un Apache già acceso (di prova o il server vero, prima del lancio), con il `.htaccess` attivo:

```bash
MAS_URL=https://DOMINIO MAS_HTTP=http://DOMINIO node tools/prova-server.mjs
# facoltativi: MAS_UTENTE/MAS_PASSWORD (controlla il cookie Secure),
#              MAS_DIST=cartella servita (solo in locale: crea e toglie file trappola)
MAS_URL=https://127.0.0.1:8443 MAS_CODICE=... node tools/prova-sito.mjs   # solo su un database di prova appena creato
```

`prova-sito.mjs` contro un server esterno installa l'utente con il codice dato e ne cambia
la password durante la prova: **non** va mai lanciato sul sito vero.

## Sul server (prima volta)

1. Creare un database MySQL/MariaDB dal pannello dell'hosting. Se il pannello lo permette,
   all'utente del sito bastano `SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX` su quel
   solo database (niente `DROP`, `ALTER`, `GRANT`).
2. Caricare il contenuto di `dist/` nella cartella pubblica del dominio
   (oppure configurare i secret del deploy automatico, vedi sotto).
3. Sul server, copiare `api/config.esempio.php` in `api/config.php` e compilarlo:
   dati del database, casella email per i messaggi, una `sale` casuale e un
   `installazione` casuale (almeno 20 caratteri, diverso da quello d'esempio).
4. Aprire `https://DOMINIO/api/installa.php`, inserire il codice di installazione e
   creare l'utente del negozio (password di almeno 10 caratteri).
5. Svuotare `installazione` in `config.php` (`'installazione' => ''`).
6. Entrare da `https://DOMINIO/area-riservata/` e caricare pezzi e marchi.

## Deploy automatico

`.github/workflows/masgioielli.yml`: a ogni push sul branch `masgioielli-produzione`
che tocca `masgioielli/`, esegue il collaudo dell'API e la build; se vanno a buon fine
carica `dist/` via FTP. Il deploy parte solo quando su GitHub ci sono i secret
`MAS_FTP_HOST`, `MAS_FTP_USER`, `MAS_FTP_PASS` e `MAS_FTP_DIR` (cartella pubblica).
Il dominio definitivo si imposta con la variabile di repository `MAS_SITO_URL`.
Il deploy non tocca mai `api/config.php` né le foto in `uploads/pezzi/`.

## Sicurezza, in breve

- Credenziali solo in `api/config.php` sul server (escluso da git e bloccato da `.htaccess`).
- Password con `password_hash`; sessione con cookie HttpOnly, Secure, SameSite=Strict;
  identificativo rigenerato all'accesso; uscita automatica dopo 2 ore di inattività.
- Token CSRF su ogni modifica; massimo 8 tentativi di accesso ogni 15 minuti.
- Query sempre preparate; testi validati e limitati sul server; nell'HTML tutto passa da `esc()`.
- Foto: controllate sul contenuto (JPEG/PNG/WebP), ricodificate con GD (via EXIF/GPS),
  nome casuale; in `uploads/` nessuno script può girare.
- Moduli pubblici: campo trappola, tempo minimo, 5 invii l'ora per indirizzo.
- Errori: mai dettagli tecnici al browser, solo nel log del server.
- `.htaccess`: HTTPS obbligatorio su www.masgioielli.it, HSTS, CSP senza script esterni o in linea,
  nosniff, frame-ancestors, file nascosti vietati (`/.well-known/` resta aperto per il certificato).

## Indirizzi del vecchio sito

Il `.htaccess` porta con un 301 gli indirizzi del vecchio WordPress (italiani e `?lang=en`)
alle pagine nuove: `/negozio/` → `/`, `/gioielleria/` → `/selezione/`,
`/orologeria/` → `/selezione/?cat=Orologi`, `/laboratorio/` `/creazioni/`
`/pendoleria-orologeria/` → `/atelier/`, `/privacy-policy/` → `/privacy/`,
`/wp-sitemap.xml` → `/sitemap-index.xml`. `/perizie/` e `/contatti/` restano uguali.
`/bozza/`, `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php` rispondono 410 (non esistono più).
