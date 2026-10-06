<?php
declare(strict_types=1);
// Invio delle email al negozio via SMTP (PHPMailer). Se la posta non e' configurata
// o l'invio fallisce, il messaggio resta comunque nel database (tabella messaggi: l'area
// riservata non la mostra, si legge da phpMyAdmin).
// Solo per le prove in locale: con 'cartella_prova' le email non partono, si scrivono
// come file di testo in quella cartella (cosi' si leggono anche i link di recupero).
if (!defined('MAS_API')) { http_response_code(404); exit; }

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as EccezionePosta;

/** C'e' una posta configurata a cui mandare le email? */
function posta_attiva(): bool
{
    $c = config()['posta'] ?? null;
    return $c && !empty($c['destinatario']) && (!empty($c['host']) || !empty($c['cartella_prova']));
}

/** Manda un'email al negozio ($a: un altro indirizzo, es. quello del recupero password). */
function invia_email(string $oggetto, string $corpo, string $rispondiA = '', string $nomeRispondi = '', string $a = ''): bool
{
    if (!posta_attiva()) return false;
    $c = config()['posta'];
    $a = $a !== '' ? $a : $c['destinatario'];

    if (!empty($c['cartella_prova'])) {
        $cartella = $c['cartella_prova'];
        if (!is_dir($cartella)) mkdir($cartella, 0700, true);
        // nome in ordine di arrivo, fino al microsecondo
        $t = microtime(true);
        $file = sprintf('%s/%s-%06d-%s.txt', $cartella, gmdate('Ymd-His', (int) $t), (int) (($t - floor($t)) * 1e6), bin2hex(random_bytes(2)));
        return file_put_contents($file, "A: {$a}\nOggetto: {$oggetto}\n\n{$corpo}\n") !== false;
    }

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
        $m->addAddress($a);
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
