<?php
// Mailer del form — Mole Digitale (hosting PHP/Apache, es. Aruba, via PHPMailer).
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Metodo non consentito']);
  exit;
}

// Rate-limit anti-flood: max 5 invii ogni 10 minuti per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$rlFile = sys_get_temp_dir() . '/md_rl_' . md5($ip) . '.txt';
$now = time();
$hits = @is_file($rlFile)
  ? array_filter(array_map('intval', explode(',', (string) @file_get_contents($rlFile))), fn($t) => $t > $now - 600)
  : [];
if (count($hits) >= 5) {
  http_response_code(429);
  echo json_encode(['ok' => false, 'error' => 'Troppe richieste, riprova tra qualche minuto.']);
  exit;
}
$hits[] = $now;
@file_put_contents($rlFile, implode(',', $hits));

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Credenziali: preferibilmente in mail-config.php SOPRA public_html.
// Fallback: mail-config.php nella stessa cartella.
$config = @include __DIR__ . '/../mail-config.php';
if (!is_array($config)) { $config = @include __DIR__ . '/mail-config.php'; }
if (!is_array($config)) {
  http_response_code(503);
  echo json_encode(['ok' => false, 'error' => 'Email non ancora configurata sul server.']);
  exit;
}

// Input: JSON (fetch) oppure form classico
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

$nome      = trim($data['nome']      ?? '');
$attivita  = trim($data['attivita']  ?? '');
$telefono  = trim($data['telefono']  ?? '');
$messaggio = trim($data['messaggio'] ?? '');
$website   = $data['website'] ?? ''; // honeypot anti-spam

// Un bot ha compilato il campo nascosto: rispondiamo "ok" senza inviare.
if ($website !== '') { echo json_encode(['ok' => true]); exit; }

if ($nome === '' || $attivita === '' || $telefono === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Compila nome, attività e un recapito.']);
  exit;
}

// Backup del lead su CSV (sopra public_html): non si perde nulla anche se l'email fallisce.
$clean = fn($s) => str_replace('"', "'", $s);
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
    @file_get_contents('https://api.telegram.org/bot' . $config['TELEGRAM_TOKEN'] . '/sendMessage?' . http_build_query([
      'chat_id' => $config['TELEGRAM_CHAT'],
      'text' => "🔔 Nuovo lead dal sito\nNome: $nome\nAttività: $attivita\nRecapito: $telefono\nMessaggio: " . ($messaggio !== '' ? $messaggio : '-'),
    ]));
  }

  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Invio non riuscito, riprova più tardi.']);
}
