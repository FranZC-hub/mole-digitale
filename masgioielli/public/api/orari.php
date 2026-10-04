<?php
declare(strict_types=1);
// /api/orari.php — orario settimanale e chiusure straordinarie (area riservata, CSRF).
//   POST {azione:'settimana', orari:{"0":null|[[9.5,12.5],[15.5,19.5]], ... "6":...}}
//   POST {azione:'chiusura', dal:'2026-08-10', al:'2026-08-24', motivo:'ferie'}
//   POST {azione:'elimina-chiusura', id}
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
solo_metodi('GET', 'POST');
richiedi_accesso();
$pdo = db();

if (metodo() === 'POST') {
    $d = corpo_json();
    switch ($d['azione'] ?? '') {
        case 'settimana':
            $o = $d['orari'] ?? null;
            if (!is_array($o)) errore('Orari non validi', 422);
            $righe = [];
            for ($g = 0; $g <= 6; $g++) $righe[$g] = fasce_valide($o[(string) $g] ?? $o[$g] ?? null, $g);
            $pdo->beginTransaction();
            $pdo->exec('DELETE FROM orari');
            $q = $pdo->prepare('INSERT INTO orari (giorno, fasce) VALUES (?, ?)');
            foreach ($righe as $g => $f) $q->execute([$g, $f === null ? '' : json_encode($f)]);
            $pdo->commit();
            break;

        case 'chiusura':
            $dal = data_iso($d['dal'] ?? '', 'dal');
            $al = data_iso(($d['al'] ?? '') !== '' ? $d['al'] : $dal, 'al');
            if ($al < $dal) errore('La riapertura viene prima della chiusura', 422);
            if ($al < gmdate('Y-m-d', time() - 86400)) errore('Queste date sono già passate', 422);
            $motivo = testo($d['motivo'] ?? '', 'motivo', 60);
            $pdo->prepare('INSERT INTO chiusure (dal, al, motivo) VALUES (?, ?, ?)')->execute([$dal, $al, $motivo]);
            break;

        case 'elimina-chiusura':
            $pdo->prepare('DELETE FROM chiusure WHERE id = ?')->execute([intero($d['id'] ?? '', 'id')]);
            break;

        default:
            errore('Azione non valida');
    }
}

rispondi(stato($pdo));

/** null = chiuso; altrimenti 1 o 2 fasce [apre, chiude] in ore decimali, in ordine e senza sovrapposizioni. */
function fasce_valide(mixed $f, int $g): ?array
{
    if ($f === null || $f === []) return null;
    if (!is_array($f) || count($f) > 2) errore("Orario del giorno {$g} non valido", 422);
    $out = [];
    foreach (array_values($f) as $fascia) {
        if (!is_array($fascia) || count($fascia) !== 2) errore("Orario del giorno {$g} non valido", 422);
        [$a, $b] = array_map(fn ($x) => is_int($x) || is_float($x) ? (float) $x : -1.0, array_values($fascia));
        if ($a < 0 || $b > 24 || $a >= $b || fmod($a * 4, 1) != 0 || fmod($b * 4, 1) != 0) errore("Orario del giorno {$g} non valido", 422);
        if ($out && $a < end($out)[1]) errore("Orario del giorno {$g}: le fasce si sovrappongono", 422);
        $out[] = [$a, $b];
    }
    return $out;
}

function stato(PDO $pdo): array
{
    $orari = [];
    foreach ($pdo->query('SELECT giorno, fasce FROM orari')->fetchAll() as $r) {
        $orari[(string) $r['giorno']] = $r['fasce'] === '' ? null : json_decode($r['fasce'], true);
    }
    $q = $pdo->prepare('SELECT id, dal, al, motivo FROM chiusure WHERE al >= ? ORDER BY dal');
    $q->execute([gmdate('Y-m-d', time() - 86400)]);
    return [
        'orari' => count($orari) === 7 ? $orari : null,
        'chiusure' => array_map(fn ($c) => ['id' => (int) $c['id']] + $c, $q->fetchAll()),
    ];
}
