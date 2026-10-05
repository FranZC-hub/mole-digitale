<?php
declare(strict_types=1);
// POST /api/messaggio.php — pubblico: moduli Contatti e Perizie.
// Il messaggio viene salvato nel database e mandato per email al negozio.
// Contro lo spam: campo trappola invisibile, tempo minimo di compilazione,
// massimo 5 invii l'ora dallo stesso indirizzo.
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
require __DIR__ . '/lib/posta.php';
solo_metodi('POST');

$d = corpo_json();

// campo trappola: le persone non lo vedono, i programmi di spam lo compilano
if (trim((string) ($d['sito_web'] ?? '')) !== '') rispondi(['ok' => true]);
// meno di 3 secondi fra apertura della pagina e invio: non e' una persona
$aperto = (int) ($d['aperto'] ?? 0);
if ($aperto > 0 && (int) round(microtime(true) * 1000) - $aperto < 3000) rispondi(['ok' => true]);

$chiave = 'messaggio:' . impronta_ip();
if (troppi_tentativi($chiave, 5, 3600)) errore('Avete già scritto più volte: vi richiamiamo noi, oppure chiamateci', 429);

$tipo = $d['tipo'] ?? '';
if (!in_array($tipo, ['contatti', 'perizia'], true)) errore('Richiesta non valida');

$nome = testo($d['nome'] ?? '', 'nome', 80, true);
$telefono = testo($d['telefono'] ?? '', 'telefono', 40);
$email = testo($d['email'] ?? '', 'email', 120);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) errore('L’indirizzo email non sembra corretto', 422);
if ($telefono !== '' && !preg_match('/^[+\d][\d\s.\/-]{5,}$/', $telefono)) errore('Il numero di telefono non sembra corretto', 422);
if ($telefono === '' && $email === '') errore('Lasciateci un telefono o un’email per rispondervi', 422);
if (empty($d['privacy'])) errore('Serve il consenso al trattamento dei dati', 422);

if ($tipo === 'contatti') {
    $dati = [
        'Argomento' => testo($d['argomento'] ?? '', 'argomento', 60),
        'Messaggio' => testo($d['messaggio'] ?? '', 'messaggio', 2000, false, true),
    ];
    $oggetto = 'Messaggio dal sito: ' . ($dati['Argomento'] ?: 'contatti');
} else {
    $dati = [
        'Motivo' => testo($d['motivo'] ?? '', 'motivo', 60, true),
        'Quanti pezzi' => testo($d['pezzi'] ?? '', 'pezzi', 30),
        'Dove si trovano' => testo($d['dove'] ?? '', 'dove', 60),
        'Note' => testo($d['note'] ?? '', 'note', 1000, false, true),
    ];
    $oggetto = 'Richiesta di perizia dal sito';
}

registra_tentativo($chiave);
// come promesso nell'informativa privacy: i messaggi piu' vecchi di 24 mesi si cancellano
db()->prepare('DELETE FROM messaggi WHERE creato < ?')->execute([gmdate('Y-m-d H:i:s', strtotime('-24 months'))]);
db()->prepare('INSERT INTO messaggi (tipo, nome, telefono, email, dati, creato) VALUES (?, ?, ?, ?, ?, ?)')
    ->execute([$tipo, $nome, $telefono, $email, json_encode($dati, JSON_UNESCAPED_UNICODE), adesso()]);

$righe = ["Nome: {$nome}"];
if ($telefono !== '') $righe[] = "Telefono: {$telefono}";
if ($email !== '') $righe[] = "Email: {$email}";
foreach ($dati as $k => $v) if ($v !== '') $righe[] = "{$k}: {$v}";
$righe[] = '';
$righe[] = 'Il messaggio è salvato anche nell’area riservata del sito.';
invia_email($oggetto, implode("\n", $righe), $email, $nome);

rispondi(['ok' => true]);
