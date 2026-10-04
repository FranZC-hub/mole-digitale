<?php
declare(strict_types=1);
// Foto dei pezzi caricate dall'area riservata.
// Si accettano solo JPEG, PNG e WebP veri (controllati sul contenuto, non sul nome).
// Con la libreria GD la foto viene ricodificata: sparisce tutto cio' che non e'
// immagine, compresi i dati EXIF con la posizione GPS delle foto del telefono.
if (!defined('MAS_API')) { http_response_code(404); exit; }

const URL_FOTO = '/uploads/pezzi/';
const LATO_MASSIMO = 1600;

/** Dove stanno le foto: uploads/pezzi accanto all'API. Solo il server locale la sposta
 *  ('foto' nella configurazione), perche' la build di Astro svuota dist/. */
function cartella_foto(): string
{
    return config()['foto'] ?? CARTELLA_API . '/../uploads/pezzi';
}

function salva_foto(array $f): string
{
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        errore(match ($f['error'] ?? 0) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'La foto è troppo grande',
            UPLOAD_ERR_NO_FILE => 'Manca la foto',
            default => 'La foto non è arrivata: riprovate',
        }, 422);
    }
    if (!is_uploaded_file($f['tmp_name'])) errore('Foto non valida', 422);
    if ($f['size'] > 8 * 1024 * 1024) errore('La foto è troppo grande (massimo 8 MB)', 422);

    $info = @getimagesize($f['tmp_name']);
    $tipi = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!$info || !isset($tipi[$info[2]])) errore('Il file non è una foto JPEG, PNG o WebP', 422);
    if ($info[0] > 12000 || $info[1] > 12000) errore('La foto è troppo grande', 422);

    if (!is_dir(cartella_foto()) && !mkdir(cartella_foto(), 0755, true)) {
        error_log('MasGioielli: impossibile creare ' . cartella_foto());
        errore('Non riesco a salvare la foto', 500);
    }
    $nome = bin2hex(random_bytes(12));

    if (function_exists('imagecreatefromstring') && function_exists('imagejpeg')) {
        $img = @imagecreatefromstring((string) file_get_contents($f['tmp_name']));
        if (!$img) errore('Il file non è una foto leggibile', 422);
        [$w, $h] = [imagesx($img), imagesy($img)];
        $k = min(1, LATO_MASSIMO / max($w, $h));
        if ($k < 1) {
            $nw = (int) round($w * $k); $nh = (int) round($h * $k);
            $r = imagecreatetruecolor($nw, $nh);
            imagecopyresampled($r, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
            imagedestroy($img);
            $img = $r;
        }
        $file = cartella_foto() . "/{$nome}.jpg";
        $ok = imagejpeg($img, $file, 84);
        imagedestroy($img);
        if (!$ok) errore('Non riesco a salvare la foto', 500);
        return URL_FOTO . "{$nome}.jpg";
    }

    // Senza GD: si conserva il file cosi' com'e' (dal browser arriva gia' ridotto e
    // ripulito dal canvas dell'area riservata).
    $est = $tipi[$info[2]];
    if (!move_uploaded_file($f['tmp_name'], cartella_foto() . "/{$nome}.{$est}")) errore('Non riesco a salvare la foto', 500);
    return URL_FOTO . "{$nome}.{$est}";
}

/** Una foto gia' caricata (per "Annulla" dopo un'eliminazione): solo file nostri e esistenti. */
function foto_esistente(mixed $percorso): ?string
{
    if (!is_string($percorso) || !preg_match('#^/uploads/pezzi/[a-f0-9]{24}\.(jpg|png|webp)$#', $percorso)) return null;
    return is_file(cartella_foto() . '/' . basename($percorso)) ? $percorso : null;
}

/** Le foto non piu' usate da nessun pezzo, dopo due giorni (il tempo di un "Annulla"). */
function pulisci_foto_orfane(PDO $pdo): void
{
    if (!is_dir(cartella_foto())) return;
    $usate = array_flip(array_map('basename', $pdo->query('SELECT immagine FROM pezzi')->fetchAll(PDO::FETCH_COLUMN)));
    // niente GLOB_BRACE: su alcuni Linux (Alpine, musl) non esiste
    foreach (glob(cartella_foto() . '/*') ?: [] as $f) {
        if (!preg_match('/^[a-f0-9]{24}\.(jpg|png|webp)$/', basename($f))) continue;
        if (!isset($usate[basename($f)]) && filemtime($f) < time() - 2 * 86400) @unlink($f);
    }
}
