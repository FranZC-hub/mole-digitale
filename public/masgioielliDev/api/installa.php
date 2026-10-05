<?php
declare(strict_types=1);
// /api/installa.php — da usare UNA volta, dopo aver caricato il sito e creato config.php.
// Crea le tabelle, mette l'orario di partenza e crea il primo utente dell'area riservata.
// Serve il "codice di installazione" scritto in config.php. Quando esiste gia' un
// utente non crea altro: per sicurezza, a installazione finita svuotate il codice.
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
require __DIR__ . '/lib/schema.php';

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

$codice = (string) (config()['installazione'] ?? '');
$h = fn ($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');

function pagina(string $titolo, string $corpo): never
{
    echo "<!doctype html><html lang=\"it\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex\">
<title>{$titolo}</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:560px;margin:3rem auto;padding:0 1rem;color:#1c1916}
label{display:block;margin:.8rem 0}input{display:block;width:100%;padding:.6rem;font:inherit;border:1px solid #bbb;box-sizing:border-box}
button{margin-top:1rem;padding:.7rem 1.2rem;font:inherit;background:#1c1916;color:#fff;border:0;cursor:pointer}.ok{color:#2c6b3a}.ko{color:#a4442c}</style>
<h1>{$titolo}</h1>{$corpo}</html>";
    exit;
}

if (str_contains($codice, "CAMBIATEMI")) {
    // il repository e' pubblico: il codice d'esempio lo conosce chiunque
    pagina('Installazione bloccata', '<p class="ko">In <code>config.php</code> il codice di installazione è ancora quello d’esempio: sceglietene uno vostro.</p>');
}
if (strlen($codice) < 20) {
    pagina('Installazione disattivata', '<p>Il codice di installazione in <code>config.php</code> è vuoto (o troppo corto): è normale a installazione finita.</p>');
}
// solo POST: il codice non deve finire negli indirizzi ne' nei log del server
$dato = (string) ($_POST['codice'] ?? '');
if (!hash_equals($codice, $dato)) {
    pagina('Installazione', '<form method="post"><label>Codice di installazione<input name="codice" type="password" required></label><button>Continua</button></form>');
}

$pdo = db();
crea_tabelle($pdo);
orari_iniziali($pdo);
$utenti = (int) $pdo->query('SELECT COUNT(*) FROM utenti')->fetchColumn();

if ($utenti > 0) {
    pagina('Installazione completata', '<p class="ok">Le tabelle ci sono e l’area riservata ha già un utente.</p><p><b>Ora svuotate il codice di installazione</b> in <code>config.php</code>.</p>');
}

$messaggio = '';
if (metodo() === 'POST' && isset($_POST['utente'])) {
    $u = trim((string) $_POST['utente']);
    $p = (string) ($_POST['password'] ?? '');
    if (!preg_match('/^[a-zA-Z0-9._-]{3,60}$/', $u)) $messaggio = '<p class="ko">Nome utente: da 3 a 60 caratteri, solo lettere, numeri, punto, trattino.</p>';
    elseif (strlen($p) < 10) $messaggio = '<p class="ko">La password deve avere almeno 10 caratteri.</p>';
    elseif ($p !== (string) ($_POST['ripeti'] ?? '')) $messaggio = '<p class="ko">Le due password non coincidono.</p>';
    else {
        $pdo->prepare('INSERT INTO utenti (utente, hash, creato) VALUES (?, ?, ?)')->execute([$u, password_hash($p, PASSWORD_DEFAULT), adesso()]);
        pagina('Installazione completata', '<p class="ok">Tabelle create e utente <b>' . $h($u) . '</b> pronto.</p><p><b>Ora svuotate il codice di installazione</b> in <code>config.php</code>, poi entrate da <a href="' . $h(base_sito() . '/area-riservata/') . '">' . $h(base_sito() . '/area-riservata/') . '</a>.</p>');
    }
}

pagina('Primo utente dell’area riservata', '<p class="ok">Tabelle create.</p>' . $messaggio . '
<form method="post">
<input type="hidden" name="codice" value="' . $h($dato) . '">
<label>Nome utente<input name="utente" required autocomplete="username" value="' . $h($_POST['utente'] ?? '') . '"></label>
<label>Password (almeno 10 caratteri)<input name="password" type="password" required autocomplete="new-password"></label>
<label>Ripetete la password<input name="ripeti" type="password" required autocomplete="new-password"></label>
<button>Crea l’utente</button></form>');
