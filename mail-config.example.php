<?php
// Modello. Copia in "mail-config.php", inserisci la password reale e carica
// il file su Hostinger (un livello sopra public_html, oppure in public_html).
return [
  'SMTP_HOST' => 'smtps.aruba.it',
  'SMTP_PORT' => 465,
  'SMTP_USER' => 'info@moledigitale.it',
  'SMTP_PASS' => 'LA-TUA-PASSWORD-ARUBA',
  'MAIL_TO'   => 'info@moledigitale.it',
  // Opzionale: notifica Telegram immediata a ogni lead.
  // Crea un bot con @BotFather, poi decommenta e compila:
  // 'TELEGRAM_TOKEN' => '123456:ABC...',
  // 'TELEGRAM_CHAT'  => '987654321',
];
