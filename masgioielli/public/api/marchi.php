<?php
declare(strict_types=1);
// /api/marchi.php — marchi trattati, fascia in home (area riservata, CSRF).
//   POST {azione:'crea', nome, reparto, nota}
//   POST {azione:'modifica', id, nome, reparto, nota}
//   POST {azione:'elimina', id}
//   POST {azione:'ripristina', nome, reparto, nota, posizione}   (per "Annulla")
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
solo_metodi('GET', 'POST');
richiedi_accesso();
$pdo = db();

if (metodo() === 'POST') {
    $d = corpo_json();
    $azione = $d['azione'] ?? '';
    if (in_array($azione, ['crea', 'modifica', 'ripristina'], true)) {
        $nome = testo($d['nome'] ?? '', 'nome', 60, true);
        $reparto = testo($d['reparto'] ?? '', 'reparto', 30, true);
        if (!in_array($reparto, REPARTI, true)) errore('Reparto non valido', 422);
        $nota = testo($d['nota'] ?? '', 'nota', 120);
    }
    switch ($azione) {
        case 'crea':
            $ultimo = (int) $pdo->query('SELECT COALESCE(MAX(ordine), 0) FROM marchi')->fetchColumn();
            $pdo->prepare('INSERT INTO marchi (nome, reparto, nota, ordine) VALUES (?, ?, ?, ?)')->execute([$nome, $reparto, $nota, $ultimo + 1]);
            break;
        case 'ripristina':
            // torna nella posizione da cui era stato tolto
            $pos = max(0, intero($d['posizione'] ?? 0, 'posizione'));
            $ids = $pdo->query('SELECT id FROM marchi ORDER BY ordine, id')->fetchAll(PDO::FETCH_COLUMN);
            $pdo->beginTransaction();
            $pdo->prepare('INSERT INTO marchi (nome, reparto, nota, ordine) VALUES (?, ?, ?, 0)')->execute([$nome, $reparto, $nota]);
            array_splice($ids, min($pos, count($ids)), 0, [(int) $pdo->lastInsertId()]);
            $q = $pdo->prepare('UPDATE marchi SET ordine = ? WHERE id = ?');
            foreach ($ids as $i => $id) $q->execute([$i, $id]);
            $pdo->commit();
            break;
        case 'modifica':
            $pdo->prepare('UPDATE marchi SET nome = ?, reparto = ?, nota = ? WHERE id = ?')->execute([$nome, $reparto, $nota, intero($d['id'] ?? '', 'id')]);
            break;
        case 'elimina':
            $pdo->prepare('DELETE FROM marchi WHERE id = ?')->execute([intero($d['id'] ?? '', 'id')]);
            break;
        default:
            errore('Azione non valida');
    }
}

rispondi(['marchi' => array_map(fn ($m) => ['id' => (int) $m['id']] + $m, $pdo->query('SELECT id, nome, reparto, nota FROM marchi ORDER BY ordine, id')->fetchAll())]);
