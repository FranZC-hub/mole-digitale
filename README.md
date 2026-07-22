# Mole Digitale — sito + demo

Sito vetrina (Astro, statico) per **Mole Digitale**, studio che crea/rifà siti per
esercenti di Torino. Include 3 **demo** dimostrative da mostrare ai clienti.

## Stack
- **Astro** (build statica) + **GSAP** + **Lenis** + animazioni scroll-driven CSS native
- **Font self-hosted** (Inter, Space Grotesk, Playfair) → niente Google Fonts (privacy + velocità)
- **Invio email** del form: `public/contact.php` (PHP + PHPMailer + SMTP Aruba)

## Comandi
```bash
npm install        # dipendenze
npm run dev        # sviluppo su http://localhost:4321
npm run build      # genera il sito statico in dist/
npm run preview    # anteprima del build
```

## Struttura
```
src/pages/          index.astro, 404.astro, demo/*.astro, [settore].astro, blog/
src/layouts/        Layout.astro (head, nav, footer, SEO, JSON-LD)
src/styles/         global.css, scroll.css
src/scripts/        main.js (Lenis, GSAP, form, slider, ecc.)
public/             immagini, contact.php, phpmailer/, .htaccess, robots, sitemap
mail-config.php     credenziali email (NON committato, NON in dist) — vedi sotto
```

## Deploy su Aruba (automatico via GitHub Actions)
Il workflow `.github/workflows/deploy.yml` builda e carica `dist/` su Aruba via FTP a ogni push su `main`.
1. Aggiungi i 3 secret su GitHub (Settings → Secrets → Actions): `ARUBA_FTP_HOST`, `ARUBA_FTP_USER`, `ARUBA_FTP_PASS`.
2. Carica **`mail-config.php`** (con la password vera) via FTP nella stessa cartella di `contact.php`
   (la cartella pubblica, es. `www.moledigitale.it/`). Il `.htaccess` ne blocca l'accesso diretto.
3. Attiva l'**SSL** sul dominio (il `.htaccess` forza l'HTTPS) e verifica che il PHP sia ≥ 7.4.
4. Prova il form: l'email arriva a `MAIL_TO`. Se la porta 465 è bloccata, passa a 587/STARTTLS.

In alternativa, deploy manuale: `npm run build` e carica il contenuto di `dist/` via FTP nella cartella pubblica.

## Variabili / credenziali email
File `mail-config.php` (modello in `mail-config.example.php`):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`.
⚠️ Non va mai nel repository né servito dal web.

## Immagini
- Le immagini della **home** (hero, portfolio, prima/dopo) sono in `src/assets/img/` e
  vengono ottimizzate da Astro in **WebP responsive** al build. Per sostituirle, metti i
  nuovi file lì con lo stesso nome.
- Le immagini delle **demo** sono in `public/img/demo*/` (servite così come sono).

## Analytics (facoltativo, gratis, privacy-friendly)
**Cloudflare Web Analytics** (niente cookie, niente banner): crea un account gratuito,
aggiungi il sito, copia il **token** e incollalo in `src/layouts/Layout.astro`
(`const cfAnalyticsToken = '...'`). Vuoto = disattivato.

## Da personalizzare prima del lancio (cerca `⚠️` nel codice)
- Dominio reale in `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`
- (Quando ci sarà una P.IVA/ragione sociale reale, valuta di reintrodurre footer legale + informativa privacy GDPR)
- Recensioni reali al posto degli esempi (sezione testimonianze in `index.astro`)

## Note di manutenzione
- **Astro 7** (aggiornato dalla 6): `npm audit` è pulito, 0 vulnerabilità.
  Se in futuro l'audit segnala vite/esbuild, ricorda che sono **solo di sviluppo**
  (build-time) e **non finiscono nel sito statico** pubblicato.
- Le demo (`/demo/...`, `/demoFarmaciaAusiliatrice/...`) sono `noindex`: non vanno su
  Google, servono per i clienti.
- Dopo modifiche grosse, prima di pubblicare: `npm run build` **e** `node tools/check-links.mjs`
  (quest'ultimo gira anche in CI e blocca il deploy se un link interno è rotto).
