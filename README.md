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

## Deploy su Hostinger
1. `npm run build` → cartella `dist/`.
2. Carica **il contenuto di `dist/`** in `public_html/` (incluso `.htaccess`, mostra i file nascosti).
3. Carica **`mail-config.php`** (con la password vera) **un livello sopra** `public_html`
   (o, in alternativa, in `public_html/` — il `.htaccess` ne blocca l'accesso diretto).
4. Collega il dominio e attiva l'**SSL gratuito** di Hostinger.
5. Prova il form: l'email arriva a `MAIL_TO`. Se la porta 465 è bloccata, passa a 587/STARTTLS.

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
- `npm audit` segnala vulnerabilità in **vite/esbuild**: sono **solo di sviluppo**
  (build-time) e **non finiscono nel sito statico** pubblicato. Si risolvono con gli
  aggiornamenti di Astro; non forzare `audit fix --force` (può rompere la build).
- Le 3 demo (`/demo/...`) sono `noindex`: non vanno su Google, servono per i clienti.
