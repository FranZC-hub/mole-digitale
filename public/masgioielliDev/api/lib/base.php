<?php
declare(strict_types=1);
// Base comune a tutti gli endpoint: configurazione, database, risposte JSON,
// validazione dei testi, sessione dell'area riservata, limite ai tentativi.
// Non si richiama da solo: ogni endpoint definisce MAS_API prima di includerlo.
if (!defined('MAS_API')) { http_response_code(404); exit; }

const CARTELLA_API = __DIR__ . '/..';

// Mai dettagli tecnici al browser (percorsi, query, stack): vanno solo nel log del server.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
set_exception_handler(function (Throwable $e): void {
    error_log('MasGioielli: ' . $e::class . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code($e instanceof PDOException ? 503 : 500);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
    }
    echo json_encode(['errore' => 'Servizio momentaneamente non disponibile'], JSON_UNESCAPED_UNICODE);
});

// ------------------------------------------------------------------ risposte
function rispondi(array $dati, int $stato = 200, string $cache = 'no-store'): never
{
    http_response_code($stato);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: ' . $cache);
    echo json_encode($dati, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function errore(string $messaggio, int $stato = 400): never
{
    rispondi(['errore' => $messaggio], $stato);
}

function metodo(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

function solo_metodi(string ...$ammessi): void
{
    if (!in_array(metodo(), $ammessi, true)) {
        header('Allow: ' . implode(', ', $ammessi));
        errore('Metodo non ammesso', 405);
    }
}

// ------------------------------------------------------------------ configurazione
function config(): array
{
    static $c = null;
    if ($c === null) {
        // 1. MAS_CONFIG: solo per le prove in locale (configurazione fuori dal sito, cosi'
        //    non finisce mai in dist/ ne' sul server per sbaglio)
        // 2. masgioielli-dati/config.php SOPRA la cartella pubblica, come mail-config.php di
        //    Mole Digitale: il browser non la raggiunge e il deploy non la tocca mai
        //    (nemmeno il "full_resync", che svuota tutta la cartella del sito)
        // 3. api/config.php, se l'hosting non lascia scrivere sopra la cartella pubblica
        $file = getenv('MAS_CONFIG') ?: '';
        if ($file === '') foreach ([cartella_privata() . '/config.php', CARTELLA_API . '/config.php'] as $f) {
            if (is_file($f)) { $file = $f; break; }
        }
        if ($file === '' || !is_file($file)) {
            error_log('MasGioielli: manca la configurazione (vedi api/config.esempio.php)');
            errore('Servizio non ancora configurato', 503);
        }
        $c = require $file;
    }
    return $c;
}

// ------------------------------------------------------------------ database
function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $c = config()['db'];
    try {
        $pdo = new PDO($c['dsn'], $c['utente'] ?? null, $c['password'] ?? null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        // il dettaglio va nel log del server, mai al browser
        error_log('MasGioielli DB: ' . $e->getMessage());
        errore('Servizio momentaneamente non disponibile', 503);
    }
    return $pdo;
}

function adesso(): string
{
    return gmdate('Y-m-d H:i:s');
}

// ------------------------------------------------------------------ corpo della richiesta
function corpo_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    if (strlen($raw) > 200_000) errore('Richiesta troppo grande', 413);
    $d = json_decode($raw, true);
    if (!is_array($d)) errore('Richiesta non valida');
    return $d;
}

// ------------------------------------------------------------------ validazione dei testi
// Lunghezza in caratteri senza dipendere da mbstring (non sempre attivo sugli hosting).
function lunghezza(string $s): int
{
    return (int) preg_match_all('/./us', $s);
}

/**
 * Testo pulito: UTF-8 valido, senza caratteri di controllo, spazi ridotti.
 * $righe = true conserva gli a capo (descrizioni, messaggi).
 */
function testo(mixed $v, string $campo, int $max, bool $obbligatorio = false, bool $righe = false): string
{
    if ($v === null) $v = '';
    if (!is_string($v) && !is_int($v)) errore("Campo «{$campo}» non valido", 422);
    // i browser mandano gli a capo come \r\n: si riportano a \n prima di tutto
    $s = str_replace(["\r\n", "\r"], "\n", (string) $v);
    if (!preg_match('//u', $s)) errore("Campo «{$campo}» non valido", 422);
    $s = preg_replace($righe ? '/[^\P{C}\n]+/u' : '/\p{C}+/u', ' ', $s);
    $s = $righe ? preg_replace("/[ \t]+/u", ' ', $s) : preg_replace('/\s+/u', ' ', $s);
    $s = trim((string) $s);
    if ($righe) $s = preg_replace("/\n{3,}/", "\n\n", $s);
    if ($obbligatorio && $s === '') errore("Manca «{$campo}»", 422);
    if (lunghezza($s) > $max) errore("«{$campo}» è troppo lungo (massimo {$max} caratteri)", 422);
    return $s;
}

function intero(mixed $v, string $campo): int
{
    if (is_int($v)) return $v;
    if (is_string($v) && preg_match('/^\d{1,9}$/', $v)) return (int) $v;
    errore("Campo «{$campo}» non valido", 422);
}

function data_iso(mixed $v, string $campo): string
{
    if (!is_string($v) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $v, $m) || !checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
        errore("Data «{$campo}» non valida", 422);
    }
    return $v;
}

// ------------------------------------------------------------------ indirizzo IP (solo come impronta)
// Non si salva mai l'IP in chiaro: solo un'impronta, per contare i tentativi.
function impronta_ip(): string
{
    $sale = config()['sale'] ?? 'mas';
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . $sale);
}

// ------------------------------------------------------------------ limite ai tentativi
function troppi_tentativi(string $chiave, int $massimo, int $secondi): bool
{
    $q = db()->prepare('SELECT COUNT(*) FROM tentativi WHERE chiave = ? AND quando > ?');
    $q->execute([$chiave, time() - $secondi]);
    return (int) $q->fetchColumn() >= $massimo;
}

function registra_tentativo(string $chiave): void
{
    // l'informativa privacy promette al massimo 24 ore: la pulizia avviene sempre
    db()->prepare('DELETE FROM tentativi WHERE quando < ?')->execute([time() - 86400]);
    db()->prepare('INSERT INTO tentativi (chiave, quando) VALUES (?, ?)')->execute([$chiave, time()]);
}

// ------------------------------------------------------------------ sessione dell'area riservata
function connessione_sicura(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

/** Indirizzo del sito senza barra finale: '' alla radice di un dominio, '/masgioielliDev'
 *  dentro moledigitale.it. Si ricava da quello dello script (…/api/x.php): il sito funziona
 *  ovunque lo si metta, senza configurarlo. */
function base_sito(): string
{
    $api = dirname(str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/api/x.php')));
    return rtrim(str_replace('\\', '/', dirname($api)), '/');
}

/** La cartella dei dati SOPRA quella pubblica del dominio (accanto a mail-config.php):
 *  dalla cartella api/ si risale di tanti livelli quanti sono quelli dell'indirizzo del sito,
 *  poi di uno. Funziona sia in /masgioielliDev/ sia alla radice di un dominio. */
function cartella_privata(): string
{
    $api = realpath(CARTELLA_API) ?: CARTELLA_API;
    return dirname($api, substr_count(base_sito(), '/') + 2) . '/masgioielli-dati';
}

/** Nel database c'e' solo il nome della foto: l'indirizzo si forma qui, cosi' resta giusto
 *  anche spostando il sito (basename accetta pure i vecchi percorsi completi).
 *  Con 'foto' nella configurazione le foto stanno fuori dalla cartella pubblica e le
 *  consegna api/foto.php; altrimenti sono file normali in uploads/pezzi/. */
function url_foto(string $nome): string
{
    return isset(config()['foto'])
        ? base_sito() . '/api/foto.php?f=' . rawurlencode(basename($nome))
        : base_sito() . '/uploads/pezzi/' . basename($nome);
}

function avvia_sessione(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('mas_sessione');
    session_set_cookie_params([
        'lifetime' => 0,
        // solo per questo sito: sullo stesso dominio ci sono anche le altre pagine di Mole Digitale
        'path' => base_sito() . '/',
        'secure' => connessione_sicura(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
    // dopo due ore senza attivita' si rientra
    if (isset($_SESSION['ultimo']) && time() - $_SESSION['ultimo'] > 7200) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['ultimo'] = time();
}

function utente_collegato(): ?string
{
    avvia_sessione();
    return $_SESSION['utente'] ?? null;
}

function token_csrf(): string
{
    avvia_sessione();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

/** Per ogni modifica: serve la sessione e il token CSRF nell'intestazione X-CSRF-Token. */
function richiedi_accesso(): string
{
    $u = utente_collegato();
    if ($u === null) errore('Accesso scaduto: rientrate nell’area riservata', 401);
    if (metodo() !== 'GET') {
        $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!is_string($t) || !hash_equals($_SESSION['csrf'] ?? '', $t)) {
            errore('Richiesta non valida: ricaricate la pagina', 403);
        }
    }
    return $u;
}

// ------------------------------------------------------------------ valori ammessi
const CATEGORIE = ['Anelli', 'Collane', 'Orecchini', 'Bracciali', 'Orologi', 'Argenteria', 'Altro'];
const REPARTI = ['Gioielleria', 'Orologeria', 'Argenteria', 'Pelletteria', 'Altro'];

function segna_aggiornamento(string $cosa): void
{
    $pdo = db();
    $pdo->prepare('DELETE FROM impostazioni WHERE chiave = ?')->execute(['agg_' . $cosa]);
    $pdo->prepare('INSERT INTO impostazioni (chiave, valore) VALUES (?, ?)')->execute(['agg_' . $cosa, gmdate('c')]);
}
