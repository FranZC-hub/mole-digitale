<?php
// ESEMPIO di configurazione. Copiatelo in config.php (stessa cartella) e compilatelo.
// config.php NON va mai nel repository: e' gia' escluso da .gitignore.
// Anche se qualcuno lo aprisse dal browser non vedrebbe nulla (e' PHP), e .htaccess lo blocca.
return [
    // Database MySQL / MariaDB: i dati si trovano nel pannello dell'hosting
    // (Aruba: Hosting Linux > Database MySQL; Seeweb: pannello > Database).
    'db' => [
        'dsn' => 'mysql:host=localhost;dbname=NOME_DATABASE;charset=utf8mb4',
        'utente' => 'UTENTE_DATABASE',
        'password' => 'PASSWORD_DATABASE',
    ],

    // Posta in uscita per i messaggi dei moduli Contatti e Perizie.
    // Lasciate 'host' vuoto per non mandare email: i messaggi restano nell'area riservata.
    'posta' => [
        'host' => 'smtps.aruba.it',
        'porta' => 465,
        'utente' => 'sito@masgioielli.it',
        'password' => 'PASSWORD_CASELLA',
        'mittente' => 'sito@masgioielli.it',
        'nome_mittente' => 'Sito MasGioielli',
        'destinatario' => 'info@masgioielli.it',
    ],

    // Stringa casuale lunga (almeno 32 caratteri): serve a rendere irriconoscibili
    // gli indirizzi IP nel conteggio dei tentativi. Generatela una volta e non cambiatela.
    'sale' => 'CAMBIATEMI-con-una-stringa-casuale-lunga',

    // Codice per /api/installa.php (almeno 20 caratteri). A installazione finita: ''.
    'installazione' => 'CAMBIATEMI-codice-di-installazione',
];
