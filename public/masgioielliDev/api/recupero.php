<?php
declare(strict_types=1);
// /api/recupero.php — password dimenticata (pubblico: chi lo usa non e' collegato).
//   POST {azione:'richiesta', utente}         → se l'utente esiste, manda per email un link
//                                               valido un'ora (la risposta e' sempre la stessa)
//   POST {azione:'verifica', codice}          → il link vale ancora? (per mostrare il modulo)
//   POST {azione:'nuova', codice, password}   → nuova password: il link non vale piu'
// L'email va all'indirizzo scritto nella configurazione (posta.recupero, se c'e', altrimenti
// posta.destinatario): dal sito non si cambia, quindi chi entrasse nell'area riservata non
// potrebbe dirottare i recuperi. Anche l'indirizzo del link viene dalla configurazione
// ('indirizzo'), mai dalla richiesta. Nel database c'e' solo l'impronta del codice; il codice
// sta dopo il # del link, che il browser non manda al server (niente codici nei log).
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
require __DIR__ . '/lib/schema.php';
require __DIR__ . '/lib/posta.php';
solo_metodi('POST');

const DURATA_LINK = 3600;
const NON_ATTIVO = 'Il recupero via email non è ancora attivo: chiedete a chi vi segue il sito di reimpostare la password.';

$pdo = db();
// la tabella dei recuperi e' arrivata dopo l'installazione: sui database gia' installati
// nasce qui (le altre ci sono gia', e CREATE TABLE IF NOT EXISTS non le tocca)
crea_tabelle($pdo);

$d = corpo_json();
$chiaveIp = 'recupero-ip:' . impronta_ip();

/** La riga del recupero, se il codice vale ancora; altrimenti un errore (contato come tentativo). */
function recupero_valido(PDO $pdo, mixed $codice, string $chiaveIp): array
{
    if (troppi_tentativi($chiaveIp . ':codice', 10, 900)) errore('Troppi tentativi: riprovate fra un quarto d’ora', 429);
    $ok = is_string($codice) && preg_match('/^[a-f0-9]{64}$/', $codice);
    $q = $pdo->prepare('SELECT utente FROM recuperi WHERE impronta = ? AND scade > ?');
    $q->execute([$ok ? hash('sha256', $codice) : '', time()]);
    $r = $q->fetch();
    if (!$r) {
        registra_tentativo($chiaveIp . ':codice');
        errore('Questo link non vale più: è scaduto o è già stato usato. Chiedetene uno nuovo qui sotto.', 410);
    }
    return $r;
}

$azione = $d['azione'] ?? '';

if ($azione === 'richiesta') {
    $indirizzo = rtrim((string) (config()['indirizzo'] ?? ''), '/');
    if (!posta_attiva() || !preg_match('#^https?://[a-z0-9.-]+(:\d+)?$#i', $indirizzo)) {
        error_log('MasGioielli: recupero password non attivo (servono la posta e \'indirizzo\' nella configurazione)');
        errore(NON_ATTIVO, 503);
    }
    $utente = testo($d['utente'] ?? '', 'nome utente', 60, true);
    $chiaveUtente = 'recupero-utente:' . hash('sha256', strtolower($utente));
    if (troppi_tentativi($chiaveIp, 5, 3600) || troppi_tentativi($chiaveUtente, 3, 3600)) {
        errore('Avete già chiesto il link più volte: guardate nell’email (anche nello spam) o riprovate fra un’ora', 429);
    }
    registra_tentativo($chiaveIp);
    registra_tentativo($chiaveUtente);

    $q = $pdo->prepare('SELECT utente FROM utenti WHERE utente = ?');
    $q->execute([$utente]);
    $vero = $q->fetchColumn();
    if ($vero !== false) {
        $codice = bin2hex(random_bytes(32));
        // un solo link valido per volta; via anche quelli scaduti
        $pdo->prepare('DELETE FROM recuperi WHERE utente = ? OR scade < ?')->execute([$vero, time()]);
        $pdo->prepare('INSERT INTO recuperi (utente, impronta, scade) VALUES (?, ?, ?)')->execute([$vero, hash('sha256', $codice), time() + DURATA_LINK]);
        $corpo = implode("\n", [
            "Qualcuno ha chiesto di cambiare la password dell’area riservata del sito (utente «{$vero}»).",
            '',
            'Per sceglierne una nuova aprite questo link entro un’ora:',
            $indirizzo . base_sito() . '/area-riservata/#recupero=' . $codice,
            '',
            'Il link vale una volta sola. Se non l’avete chiesto voi, ignorate questa email: la password resta quella di sempre.',
        ]);
        if (!invia_email('Area riservata: scegliete una nuova password', $corpo, '', '', (string) (config()['posta']['recupero'] ?? ''))) {
            error_log('MasGioielli: email di recupero non partita');
        }
    }
    // stessa risposta che l'utente esista o no: dal sito non si scopre chi c'e'
    rispondi(['ok' => true]);
}

if ($azione === 'verifica') {
    $r = recupero_valido($pdo, $d['codice'] ?? null, $chiaveIp);
    rispondi(['ok' => true, 'utente' => $r['utente']]);
}

if ($azione === 'nuova') {
    $r = recupero_valido($pdo, $d['codice'] ?? null, $chiaveIp);
    $password = is_string($d['password'] ?? null) ? $d['password'] : '';
    if (strlen($password) < 10) errore('La nuova password deve avere almeno 10 caratteri', 422);
    if (strlen($password) > 200) errore('La nuova password è troppo lunga', 422);
    $pdo->prepare('UPDATE utenti SET hash = ? WHERE utente = ?')->execute([password_hash($password, PASSWORD_DEFAULT), $r['utente']]);
    $pdo->prepare('DELETE FROM recuperi WHERE utente = ?')->execute([$r['utente']]);
    // chi ha appena dimostrato di leggere l'email del negozio non resta chiuso fuori
    // per i tentativi sbagliati di prima
    $pdo->prepare('DELETE FROM tentativi WHERE chiave IN (?, ?)')->execute([
        'accesso-utente:' . hash('sha256', strtolower($r['utente'])),
        'accesso-ip:' . impronta_ip(),
    ]);
    rispondi(['ok' => true, 'utente' => $r['utente']]);
}

errore('Azione non valida');
