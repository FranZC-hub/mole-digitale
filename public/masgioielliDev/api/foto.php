<?php
declare(strict_types=1);
// GET /api/foto.php?f=NOME — pubblico: una foto della selezione, quando le foto stanno
// FUORI dalla cartella pubblica ('foto' nella configurazione). Su moledigitale.it e' cosi':
// il deploy puo' svuotare la cartella del sito, le foto del negozio non devono sparire.
// Solo nomi generati dal sito (24 caratteri esadecimali): niente percorsi, niente altri file.
// Il nome non si riusa mai, quindi la foto puo' restare in cache per sempre.
define('MAS_API', true);
require __DIR__ . '/lib/base.php';
require __DIR__ . '/lib/foto.php';
solo_metodi('GET', 'HEAD');

$nome = (string) ($_GET['f'] ?? '');
if (!preg_match('/^[a-f0-9]{24}\.(jpg|png|webp)$/', $nome, $m) || !is_file($file = cartella_foto() . '/' . $nome)) {
    http_response_code(404);
    header('Cache-Control: no-store');
    exit;
}
header('Content-Type: ' . ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'][$m[1]]);
header('Content-Length: ' . filesize($file));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'none'; sandbox");
if (metodo() !== 'HEAD') readfile($file);
