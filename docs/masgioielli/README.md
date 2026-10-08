# MasGioielli — versione in sviluppo

Il sito del negozio MasGioielli (Corso Trapani 146/b, Torino): pagine statiche fatte con
Astro e un'area riservata con cui il negozio aggiorna la vetrina, gli orari, le chiusure e
i marchi. **Senza database, come la bozza**: quello che si cambia dall'area riservata resta
nel browser di chi lo inserisce (localStorage) e il sito lo legge da lì. Lo vede quindi solo
quel dispositivo, non i clienti (vedi `PRODUZIONE.md`).

Vive **dentro il sito di Mole Digitale**, in `https://www.moledigitale.it/masgioielliDev/`,
finché non è pronto per masgioielli.it. È fuori da Google (`noindex`, fuori dalla sitemap).
La raccolta di tutti i progetti in sviluppo è `/demoClientiDev/`; la bozza vista dal cliente
resta in `/demoMasGioielli/`.

Sono solo file statici: va su qualsiasi hosting con Apache e `.htaccess`, senza PHP né database.

## Dove sta

```
src/pages/demoClientiDev/index.astro raccolta: versioni in sviluppo (con credenziali e checklist) e sole bozze
src/pages/masgioielliDev/            le pagine: / selezione/ atelier/ compro-oro/ perizie/
├── _Layout.astro                    contatti/ privacy/ area-riservata/ 404/
├── _sito.js                         dati del negozio, BASE (la cartella), orari, moduli
└── _locale.js                       i dati dell'area riservata nel browser; UTENTE e PASSWORD
src/data/clienti.js                  i clienti, condivisi da /demoClienti/ e /demoClientiDev/
src/scripts/checklist.js             la checklist di /demoClientiDev/: si spunta, si modifica come testo, si copia
                                     (resta nel browser; si parte da docs/masgioielli/PRODUZIONE.md)
public/masgioielliDev/
├── .htaccess                        CSP propria, noindex, 404 (si aggiunge a quello del sito)
└── img/                             foto e logo del negozio
tools/masgioielli/prova-locale.mjs   collaudo nel browser
docs/masgioielli/                    questo file, PRODUZIONE.md, .htaccess per masgioielli.it
```

Tutti gli indirizzi interni partono da `BASE` in `_sito.js`. Nel CSS c'è un solo percorso
scritto per intero (lo sfondo dell'atelier in `index.astro`).

## L'area riservata

- **Accesso:** utente e password sono scritti in `_locale.js` (`UTENTE`, `PASSWORD`), come nella
  bozza. Il repository è pubblico: quella password non va usata per nient'altro. Per cambiarla
  per tutti si modifica lì; dal pannello («Cambia la password») si cambia solo sul dispositivo.
- **Dati:** le chiavi in localStorage cominciano con `masdev:` (quelle della bozza con `mas-`).
  Le foto sono ridotte a 1000 px e salvate nel browser: ci stanno una ventina di pezzi; se lo
  spazio finisce, il pannello lo dice.
- **Password dimenticata:** senza server non parte nessuna email; il pannello fa come se partisse.
- **Moduli Contatti e Perizie:** non inviano nulla; lo dicono e indicano WhatsApp e telefono.

## In locale

```bash
npm run dev        # il sito su http://localhost:4321/masgioielliDev/
npm run mas:prova  # build + collaudo nel browser con la CSP del server
```

## Deploy

È quello di moledigitale.it (`.github/workflows/deploy.yml`, push su `main`): build, controllo
dei link, poi FTP su Aruba. Parte solo con i secret `ARUBA_FTP_HOST`, `ARUBA_FTP_USER`,
`ARUBA_FTP_PASS`.

## Quando si passa a masgioielli.it

Vedi la seconda parte di `PRODUZIONE.md`. In breve: pubblicare le pagine alla radice del dominio
(`BASE = '/'`), togliere `noindex`, usare `docs/masgioielli/masgioielli.it.htaccess` (HTTPS, www,
redirect dal vecchio WordPress).

## Il backend di prima

Fino all'8 ottobre 2026 c'era anche un backend PHP + MySQL (area riservata condivisa da tutti,
moduli che spedivano email, «password dimenticata» con link vero, collaudi). È stato tolto:
si ritrova nella cronologia di git, per esempio al commit `d48aaef`.
