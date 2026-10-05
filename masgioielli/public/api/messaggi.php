<?php
declare(strict_types=1);
// /api/messaggi.php — i messaggi arrivati dai moduli (area riservata, CSRF).
//   GET                         → ultimi 100
//   POST {azione:'letto', id}   → segna come letto
//   POST {azione:'elimina', id}
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
solo_metodi('GET', 'POST');
richiedi_accesso();
$pdo = db();

if (metodo() === 'POST') {
    $d = corpo_json();
    $id = intero($d['id'] ?? '', 'id');
    match ($d['azione'] ?? '') {
        'letto' => $pdo->prepare('UPDATE messaggi SET letto = 1 WHERE id = ?')->execute([$id]),
        'elimina' => $pdo->prepare('DELETE FROM messaggi WHERE id = ?')->execute([$id]),
        default => errore('Azione non valida'),
    };
}

$righe = $pdo->query('SELECT * FROM messaggi ORDER BY creato DESC, id DESC LIMIT 100')->fetchAll();
rispondi(['messaggi' => array_map(fn ($m) => [
    'id' => (int) $m['id'],
    'tipo' => $m['tipo'],
    'nome' => $m['nome'],
    'telefono' => $m['telefono'],
    'email' => $m['email'],
    'dati' => json_decode($m['dati'], true) ?: [],
    'creato' => str_replace(' ', 'T', $m['creato']) . 'Z',   // ISO: Safari non legge la forma con lo spazio
    'letto' => (bool) $m['letto'],
], $righe)]);
