<?php
declare(strict_types=1);
// Invio delle email al negozio via SMTP (PHPMailer). Se la posta non e' configurata
// o l'invio fallisce, il messaggio resta comunque nel database (area riservata).
if (!defined('MAS_API')) { http_response_code(404); exit; }

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as EccezionePosta;

function invia_email(string $oggetto, string $corpo, string $rispondiA = '', string $nomeRispondi = ''): bool
{
    $c = config()['posta'] ?? null;
    if (!$c || empty($c['host']) || empty($c['destinatario'])) return false;

    require_once CARTELLA_API . '/phpmailer/src/Exception.php';
    require_once CARTELLA_API . '/phpmailer/src/PHPMailer.php';
    require_once CARTELLA_API . '/phpmailer/src/SMTP.php';

    $m = new PHPMailer(true);
    try {
        $m->isSMTP();
        $m->Host = $c['host'];
        $m->Port = (int) ($c['porta'] ?? 465);
        $m->SMTPAuth = true;
        $m->Username = $c['utente'];
        $m->Password = $c['password'];
        $m->SMTPSecure = ((int) ($c['porta'] ?? 465)) === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $m->CharSet = 'UTF-8';
        $m->Timeout = 15;
        $m->setFrom($c['mittente'] ?? $c['utente'], $c['nome_mittente'] ?? 'Sito MasGioielli');
        $m->addAddress($c['destinatario']);
        if ($rispondiA !== '' && filter_var($rispondiA, FILTER_VALIDATE_EMAIL)) $m->addReplyTo($rispondiA, $nomeRispondi);
        $m->Subject = $oggetto;
        $m->Body = $corpo;
        $m->isHTML(false);
        $m->send();
        return true;
    } catch (EccezionePosta $e) {
        error_log('MasGioielli posta: ' . $m->ErrorInfo);
        return false;
    }
}
