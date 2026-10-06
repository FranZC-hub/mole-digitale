<?php
// ESEMPIO di configurazione. Copiatelo e compilatelo, di preferenza in
//   masgioielli-dati/config.php  SOPRA la cartella pubblica (accanto a mail-config.php):
//   il browser non ci arriva e il deploy non la tocca mai, nemmeno con il "full_resync".
// Solo se l'hosting non lo permette: api/config.php (stessa cartella di questo file),
// bloccato da .htaccess; in quel caso togliete la riga 'foto' qui sotto.
// La configurazione vera NON va mai nel repository.
return [
    // Database MySQL / MariaDB: i dati si trovano nel pannello dell'hosting
    // (Aruba: Hosting Linux > Database MySQL; Seeweb: pannello > Database).
    'db' => [
        'dsn' => 'mysql:host=localhost;dbname=NOME_DATABASE;charset=utf8mb4',
        'utente' => 'UTENTE_DATABASE',
        'password' => 'PASSWORD_DATABASE',
    ],

    // Posta in uscita per i messaggi dei moduli Contatti e Perizie.
    // Con 'host' vuoto non parte nessuna email: i messaggi restano solo nel database
    // (tabella messaggi, da phpMyAdmin), perche' l'area riservata non li mostra.
    'posta' => [
        'host' => 'smtps.aruba.it',
        'porta' => 465,
        'utente' => 'sito@masgioielli.it',
        'password' => 'PASSWORD_CASELLA',
        'mittente' => 'sito@masgioielli.it',
        'nome_mittente' => 'Sito MasGioielli',
        'destinatario' => 'info@masgioielli.it',
        // facoltativo: dove arriva il link «password dimenticata» (senza: a 'destinatario')
        // 'recupero' => 'titolare@masgioielli.it',
    ],

    // Indirizzo del sito, senza barra finale: serve al link dell'email «password dimenticata».
    // Sta qui, e non si ricava dalla richiesta, perche' nessuno possa far arrivare al negozio
    // un link verso un altro sito. Su masgioielli.it diventa 'https://www.masgioielli.it'.
    'indirizzo' => 'https://www.moledigitale.it',

    // Stringa casuale lunga (almeno 32 caratteri): serve a rendere irriconoscibili
    // gli indirizzi IP nel conteggio dei tentativi. Generatela una volta e non cambiatela.
    'sale' => 'CAMBIATEMI-con-una-stringa-casuale-lunga',

    // Codice per /api/installa.php (almeno 20 caratteri). A installazione finita: ''.
    'installazione' => 'CAMBIATEMI-codice-di-installazione',

    // Le foto della selezione accanto a questo file, fuori dalla cartella pubblica: le
    // consegna api/foto.php, e un deploy non le cancella. Senza questa riga: uploads/pezzi/.
    'foto' => __DIR__ . '/foto',
];
