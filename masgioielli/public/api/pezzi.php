<?php
declare(strict_types=1);
// /api/pezzi.php — la selezione del momento (solo area riservata, con CSRF).
//   POST multipart  azione=crea|modifica, id, nome, categoria, materiale, descrizione,
//                   foto (file) oppure immagine (foto gia' caricata, per "Annulla")
//   POST JSON       {azione:'elimina', id} | {azione:'ordina', ordine:[id, ...]}
// Ogni risposta riporta l'elenco aggiornato: la pagina lo ridisegna da li'.
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
require __DIR__ . '/lib/foto.php';
solo_metodi('GET', 'POST');
richiedi_accesso();
$pdo = db();

if (metodo() === 'GET') rispondi(['pezzi' => elenco($pdo)]);

$json = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json');
$d = $json ? corpo_json() : $_POST;
$azione = $d['azione'] ?? '';

switch ($azione) {
    case 'crea':
    case 'modifica':
        $campi = [
            'nome' => testo($d['nome'] ?? '', 'nome', 80, true),
            'categoria' => testo($d['categoria'] ?? '', 'categoria', 30, true),
            'materiale' => testo($d['materiale'] ?? '', 'materiale', 120),
            'descrizione' => testo($d['descrizione'] ?? '', 'descrizione', 600, false, true),
        ];
        if (!in_array($campi['categoria'], CATEGORIE, true)) errore('Categoria non valida', 422);

        $immagine = null;
        if (!empty($_FILES['foto']) && ($_FILES['foto']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) $immagine = salva_foto($_FILES['foto']);
        elseif (isset($d['immagine'])) $immagine = foto_esistente($d['immagine']);

        if ($azione === 'crea') {
            if ($immagine === null) errore('Manca la foto', 422);
            // il pezzo nuovo va in cima
            $primo = (int) $pdo->query('SELECT COALESCE(MIN(ordine), 0) FROM pezzi')->fetchColumn();
            $pdo->prepare('INSERT INTO pezzi (nome, categoria, materiale, descrizione, immagine, alt, ordine, aggiornato) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([$campi['nome'], $campi['categoria'], $campi['materiale'], $campi['descrizione'], $immagine, $campi['nome'], $primo - 1, adesso()]);
        } else {
            $id = intero($d['id'] ?? '', 'id');
            $vecchio = $pdo->prepare('SELECT * FROM pezzi WHERE id = ?');
            $vecchio->execute([$id]);
            $v = $vecchio->fetch();
            if (!$v) errore('Questo pezzo non c’è più', 404);
            $pdo->prepare('UPDATE pezzi SET nome = ?, categoria = ?, materiale = ?, descrizione = ?, immagine = ?, alt = ?, aggiornato = ? WHERE id = ?')
                ->execute([$campi['nome'], $campi['categoria'], $campi['materiale'], $campi['descrizione'], $immagine ?? $v['immagine'], $campi['nome'], adesso(), $id]);
        }
        break;

    case 'elimina':
        $id = intero($d['id'] ?? '', 'id');
        $pdo->prepare('DELETE FROM pezzi WHERE id = ?')->execute([$id]);
        // la foto resta due giorni, per "Annulla"; poi la pulizia la toglie
        pulisci_foto_orfane($pdo);
        break;

    case 'ordina':
        $ordine = $d['ordine'] ?? null;
        if (!is_array($ordine) || count($ordine) > 500) errore('Ordine non valido', 422);
        $pdo->beginTransaction();
        $q = $pdo->prepare('UPDATE pezzi SET ordine = ? WHERE id = ?');
        foreach (array_values($ordine) as $i => $id) $q->execute([$i, intero($id, 'id')]);
        $pdo->commit();
        break;

    default:
        errore('Azione non valida');
}

segna_aggiornamento('pezzi');
rispondi(['pezzi' => elenco($pdo)]);

function elenco(PDO $pdo): array
{
    return array_map(fn ($p) => [
        'id' => (int) $p['id'],
        'nome' => $p['nome'],
        'cat' => $p['categoria'],
        'materiale' => $p['materiale'],
        'desc' => $p['descrizione'],
        'img' => $p['immagine'],
    ], $pdo->query('SELECT * FROM pezzi ORDER BY ordine, id')->fetchAll());
}
