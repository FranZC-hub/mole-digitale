<?php
// Mailer del form — Mole Digitale (hosting PHP/Apache, es. Aruba, via PHPMailer).
// Risponde in JSON alle richieste AJAX (fetch) e in una pagina HTML leggibile al
// fallback senza JavaScript (invio classico del <form>), così nessun lead va perso.

$raw    = file_get_contents('php://input');
$jsonIn = json_decode($raw, true);
$isJson = is_array($jsonIn); // richiesta AJAX (fetch con JSON) vs form classico

// Risposta unica: JSON per l'AJAX, pagina HTML per il form senza JS.
function finish($httpCode, $ok, $msg, $isJson) {
  http_response_code($httpCode);
  if ($isJson) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $msg]);
  } else {
    header('Content-Type: text/html; charset=utf-8');
    $title = $ok ? 'Richiesta inviata' : 'Invio non riuscito';
    $color = $ok ? '#16a34a' : '#dc2626';
    $icon  = $ok ? '✅' : '⚠️';
    $safe  = htmlspecialchars($msg, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="it"><head><meta charset="utf-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<meta name="robots" content="noindex">'
       . '<title>' . $title . ' — Mole Digitale</title>'
       . '<style>body{font-family:system-ui,"Segoe UI",Arial,sans-serif;background:#0b0f1a;color:#e7ecf3;'
       . 'display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:1.5rem}'
       . '.card{max-width:520px;text-align:center;background:#121a2b;border:1px solid #243049;'
       . 'border-radius:18px;padding:2.6rem 2.2rem}.ic{font-size:2.6rem}'
       . 'h1{font-size:1.4rem;margin:.5rem 0 .8rem;color:' . $color . '}p{color:#aab4c5;line-height:1.5}'
       . 'a{display:inline-block;margin-top:1.5rem;color:#06121a;background:#22d3ee;text-decoration:none;'
       . 'font-weight:700;padding:.75rem 1.4rem;border-radius:999px}</style></head><body><div class="card">'
       . '<div class="ic">' . $icon . '</div><h1>' . $title . '</h1><p>' . $safe . '</p>'
       . '<a href="/#contatti">← Torna al sito</a></div></body></html>';
  }
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  finish(405, false, 'Metodo non consentito.', $isJson);
}

// Rate-limit anti-flood: max 5 invii ogni 10 minuti per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$rlFile = sys_get_temp_dir() . '/md_rl_' . md5($ip) . '.txt';
$now = time();
$hits = @is_file($rlFile)
  ? array_filter(array_map('intval', explode(',', (string) @file_get_contents($rlFile))), fn($t) => $t > $now - 600)
  : [];
if (count($hits) >= 5) {
  finish(429, false, 'Troppe richieste, riprova tra qualche minuto.', $isJson);
}
$hits[] = $now;
@file_put_contents($rlFile, implode(',', $hits));

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Credenziali: preferibilmente in mail-config.php SOPRA la cartella pubblica.
// Fallback: mail-config.php nella stessa cartella di questo file.
$config = @include __DIR__ . '/../mail-config.php';
if (!is_array($config)) { $config = @include __DIR__ . '/mail-config.php'; }
if (!is_array($config)) {
  finish(503, false, 'Email non ancora configurata sul server.', $isJson);
}

// Input: JSON (fetch) oppure form classico (senza JS)
$data = $isJson ? $jsonIn : $_POST;

// Tetti di lunghezza: evitano abusi e payload enormi
$nome      = mb_substr(trim($data['nome']      ?? ''), 0, 120);
$attivita  = mb_substr(trim($data['attivita']  ?? ''), 0, 120);
$telefono  = mb_substr(trim($data['telefono']  ?? ''), 0, 120);
$messaggio = mb_substr(trim($data['messaggio'] ?? ''), 0, 3000);
$website   = $data['website'] ?? ''; // honeypot anti-spam

// Un bot ha compilato il campo nascosto: rispondiamo "ok" senza inviare.
if ($website !== '') { finish(200, true, 'Grazie!', $isJson); }

if ($nome === '' || $attivita === '' || $telefono === '') {
  finish(400, false, 'Compila nome, attività e un recapito.', $isJson);
}

// Backup del lead su CSV (sopra la cartella pubblica): non si perde nulla anche se l'email fallisce.
// Una riga = un lead (niente a-capo) e neutralizzo la CSV/formula-injection di Excel.
$clean = function ($s) {
  $s = str_replace(["\r", "\n", "\t"], ' ', (string) $s);
  $s = str_replace('"', "'", $s);
  if ($s !== '' && in_array($s[0], ['=', '+', '-', '@'], true)) { $s = "'" . $s; }
  return $s;
};
@file_put_contents(
  __DIR__ . '/../leads.csv',
  '"' . date('Y-m-d H:i') . '","' . $clean($nome) . '","' . $clean($attivita) . '","' . $clean($telefono) . '","' . $clean($messaggio) . "\"\n",
  FILE_APPEND | LOCK_EX
);

$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host       = $config['SMTP_HOST'];
  $mail->SMTPAuth   = true;
  $mail->Username   = $config['SMTP_USER'];
  $mail->Password   = $config['SMTP_PASS'];
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL/TLS
  $mail->Port       = (int) $config['SMTP_PORT'];  // 465
  $mail->CharSet    = 'UTF-8';

  $mail->setFrom($config['SMTP_USER'], 'Sito Mole Digitale');
  $mail->addAddress($config['MAIL_TO']);
  if (filter_var($telefono, FILTER_VALIDATE_EMAIL)) { $mail->addReplyTo($telefono); }

  $mail->Subject = "Nuova richiesta dal sito — $attivita";
  $mail->Body =
    "Nuova richiesta di preventivo dal sito Mole Digitale\n\n" .
    "Nome:      $nome\n" .
    "Attività:  $attivita\n" .
    "Recapito:  $telefono\n\n" .
    "Messaggio:\n" . ($messaggio !== '' ? $messaggio : '(nessuno)') . "\n";

  $mail->send();

  // Email di conferma automatica al cliente (se ha lasciato un'email)
  if (filter_var($telefono, FILTER_VALIDATE_EMAIL)) {
    try {
      $ack = new PHPMailer(true);
      $ack->isSMTP();
      $ack->Host = $config['SMTP_HOST'];
      $ack->SMTPAuth = true;
      $ack->Username = $config['SMTP_USER'];
      $ack->Password = $config['SMTP_PASS'];
      $ack->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
      $ack->Port = (int) $config['SMTP_PORT'];
      $ack->CharSet = 'UTF-8';
      $ack->setFrom($config['SMTP_USER'], 'Mole Digitale');
      $ack->addAddress($telefono, $nome);
      $ack->Subject = 'Abbiamo ricevuto la tua richiesta — Mole Digitale';
      $ack->Body = "Ciao $nome,\n\ngrazie per averci scritto! Abbiamo ricevuto la tua richiesta per \"$attivita\" e ti rispondiamo entro 24 ore con un'idea e un prezzo chiaro.\n\nA presto,\nMole Digitale\ninfo@moledigitale.it";
      $ack->send();
    } catch (Exception $e) { /* l'autoresponder è opzionale: se fallisce, pazienza */ }
  }

  // Notifica Telegram immediata (solo se configurata in mail-config.php)
  if (!empty($config['TELEGRAM_TOKEN']) && !empty($config['TELEGRAM_CHAT'])) {
    $tgUrl  = 'https://api.telegram.org/bot' . $config['TELEGRAM_TOKEN'] . '/sendMessage';
    $tgText = "🔔 Nuovo lead dal sito\nNome: $nome\nAttività: $attivita\nRecapito: $telefono\nMessaggio: " . ($messaggio !== '' ? $messaggio : '-');
    $tgData = ['chat_id' => $config['TELEGRAM_CHAT'], 'text' => $tgText];
    if (function_exists('curl_init')) {
      $ch = curl_init($tgUrl);
      curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $tgData,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
      ]);
      curl_exec($ch);
      curl_close($ch);
    } else {
      // Fallback se cURL non è disponibile (richiede allow_url_fopen)
      @file_get_contents($tgUrl . '?' . http_build_query($tgData));
    }
  }

  finish(200, true, 'Grazie! Abbiamo ricevuto la tua richiesta: ti rispondiamo entro 24 ore.', $isJson);
} catch (Exception $e) {
  finish(500, false, 'Invio non riuscito, riprova più tardi.', $isJson);
}
