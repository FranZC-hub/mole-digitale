<?php
declare(strict_types=1);
// GET /api/dati.php — pubblico: quello che il negozio aggiorna dall'area riservata.
// Niente cache "a tempo": il negozio salva, apre il sito e deve vedere subito la
// modifica. Il browser ricontrolla a ogni visita, ma se nulla e' cambiato riceve
// solo un "304 invariato" (ETag), senza riscaricare i dati.
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
solo_metodi('GET');

$json = json_encode(dati_pubblici(db()), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$etag = '"' . md5($json) . '"';
header('Cache-Control: no-cache');
header('ETag: ' . $etag);
header('X-Content-Type-Options: nosniff');
if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}
header('Content-Type: application/json; charset=utf-8');
echo $json;
exit;

function dati_pubblici(PDO $pdo): array
{
    $pezzi = array_map(fn ($p) => [
        'id' => (int) $p['id'],
        'nome' => $p['nome'],
        'cat' => $p['categoria'],
        'materiale' => $p['materiale'],
        'desc' => $p['descrizione'],
        'img' => url_foto($p['immagine']),
        'alt' => $p['alt'] !== '' ? $p['alt'] : $p['nome'],
    ], $pdo->query('SELECT * FROM pezzi ORDER BY ordine, id')->fetchAll());

    $orari = null;
    $righe = $pdo->query('SELECT giorno, fasce FROM orari ORDER BY giorno')->fetchAll();
    if (count($righe) === 7) {
        $orari = [];
        foreach ($righe as $r) $orari[(string) $r['giorno']] = $r['fasce'] === '' ? null : json_decode($r['fasce'], true);
    }

    // solo le chiusure non ancora finite
    $q = $pdo->prepare('SELECT dal, al, motivo FROM chiusure WHERE al >= ? ORDER BY dal');
    $q->execute([gmdate('Y-m-d', time() - 86400)]);

    $agg = $pdo->query("SELECT valore FROM impostazioni WHERE chiave = 'agg_pezzi'")->fetchColumn();

    return [
        'pezzi' => $pezzi,
        'aggiornato' => $agg ?: null,
        'orari' => $orari,
        'chiusure' => $q->fetchAll(),
        'marchi' => $pdo->query('SELECT nome, reparto FROM marchi ORDER BY ordine, id')->fetchAll(),
    ];
}
