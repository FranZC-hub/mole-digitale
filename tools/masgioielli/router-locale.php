<?php
// Solo per il server locale (php -S, vedi server-locale.mjs). Le foto non passano di qui:
// con 'foto' nella configurazione le consegna api/foto.php, come sul server vero.
$percorso = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
// come Apache con ErrorDocument: un indirizzo che non esiste da' la pagina 404
// (php -S da solo risponderebbe con la pagina della cartella sopra): quella di MasGioielli
// nella sua cartella, quella di Mole Digitale altrove
$radice = $_SERVER['DOCUMENT_ROOT'];
$cercato = $radice . rawurldecode((string) $percorso);
if (str_contains($cercato, '..') || (!is_file($cercato) && !is_file(rtrim($cercato, '/') . '/index.html'))) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    $mas = '/masgioielliDev/';
    readfile($radice . (str_starts_with((string) $percorso, $mas) ? $mas . '404/index.html' : '/404.html'));
    exit;
}
return false;
