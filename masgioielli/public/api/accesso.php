<?php
declare(strict_types=1);
// /api/accesso.php — area riservata.
//   GET                      → stato della sessione (e token CSRF se collegati)
//   POST {utente,password}   → entra
//   POST {azione:'password', attuale, nuova} → cambia la password (serve CSRF)
//   DELETE                   → esce (serve CSRF)
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
solo_metodi('GET', 'POST', 'DELETE');

if (metodo() === 'GET') {
    $u = utente_collegato();
    rispondi($u ? ['collegato' => true, 'utente' => $u, 'csrf' => token_csrf()] : ['collegato' => false]);
}

if (metodo() === 'DELETE') {
    richiedi_accesso();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => $p['path'], 'secure' => $p['secure'], 'httponly' => true, 'samesite' => 'Strict']);
    }
    session_destroy();
    rispondi(['collegato' => false]);
}

$d = corpo_json();

if (($d['azione'] ?? '') === 'password') {
    $u = richiedi_accesso();
    $attuale = is_string($d['attuale'] ?? null) ? $d['attuale'] : '';
    $nuova = is_string($d['nuova'] ?? null) ? $d['nuova'] : '';
    if (strlen($nuova) < 10) errore('La nuova password deve avere almeno 10 caratteri', 422);
    if (strlen($nuova) > 200) errore('La nuova password è troppo lunga', 422);
    $q = db()->prepare('SELECT hash FROM utenti WHERE utente = ?');
    $q->execute([$u]);
    $hash = $q->fetchColumn();
    if (!$hash || !password_verify($attuale, $hash)) errore('La password attuale non è corretta', 403);
    db()->prepare('UPDATE utenti SET hash = ? WHERE utente = ?')->execute([password_hash($nuova, PASSWORD_DEFAULT), $u]);
    session_regenerate_id(true);
    rispondi(['ok' => true]);
}

// ---- accesso
avvia_sessione();
$utente = testo($d['utente'] ?? '', 'utente', 60);
$password = is_string($d['password'] ?? null) ? $d['password'] : '';

// al massimo 8 tentativi ogni 15 minuti, sia per indirizzo sia per nome utente
$chiaveIp = 'accesso-ip:' . impronta_ip();
$chiaveUtente = 'accesso-utente:' . hash('sha256', strtolower($utente));
if (troppi_tentativi($chiaveIp, 8, 900) || troppi_tentativi($chiaveUtente, 8, 900)) {
    errore('Troppi tentativi: riprovate fra un quarto d’ora', 429);
}

$q = db()->prepare('SELECT utente, hash FROM utenti WHERE utente = ?');
$q->execute([$utente]);
$riga = $q->fetch();
// password_verify anche quando l'utente non esiste: stessi tempi di risposta
$ok = password_verify($password, $riga['hash'] ?? '$2y$12$3TAVpRmC2i33wJHGQ/HvLeViKIMtW2ICZZB9SwMcCX4YkGLTsqSpW') && $riga;
if (!$ok) {
    registra_tentativo($chiaveIp);
    registra_tentativo($chiaveUtente);
    errore('Nome utente o password non corretti', 401);
}

if (password_needs_rehash($riga['hash'], PASSWORD_DEFAULT)) {
    db()->prepare('UPDATE utenti SET hash = ? WHERE utente = ?')->execute([password_hash($password, PASSWORD_DEFAULT), $riga['utente']]);
}
session_regenerate_id(true);
$_SESSION['utente'] = $riga['utente'];
$_SESSION['csrf'] = bin2hex(random_bytes(32));
rispondi(['collegato' => true, 'utente' => $riga['utente'], 'csrf' => $_SESSION['csrf']]);
