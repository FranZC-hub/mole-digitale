<?php
// Solo per il server locale (php -S, vedi server-locale.mjs): le foto caricate stanno
// in .locale/ e non in dist/, che la build di Astro svuota ogni volta.
// Tutto il resto (pagine, API) lo serve php -S come sempre.
$percorso = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (is_string($percorso) && preg_match('#^/uploads/pezzi/([a-f0-9]{24}\.(jpg|png|webp))$#', $percorso, $m)) {
    $conf = require getenv('MAS_CONFIG');
    $file = ($conf['foto'] ?? '') . '/' . $m[1];
    if (!isset($conf['foto']) || !is_file($file)) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: ' . ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'][$m[2]]);
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}
// come Apache con ErrorDocument: un indirizzo che non esiste da' la pagina 404 del sito
// (php -S da solo risponderebbe con la home)
$radice = $_SERVER['DOCUMENT_ROOT'];
$cercato = $radice . rawurldecode((string) $percorso);
if (str_contains($cercato, '..') || (!is_file($cercato) && !is_file(rtrim($cercato, '/') . '/index.html'))) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($radice . '/404.html');
    exit;
}
return false;
