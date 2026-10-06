<?php
declare(strict_types=1);
// Tabelle del sito. In produzione MySQL/MariaDB; SQLite serve solo alle prove in locale.
// Le query degli endpoint usano SQL comune ai due (niente costrutti di un solo motore).
if (!defined('MAS_API')) { http_response_code(404); exit; }

function crea_tabelle(PDO $pdo): void
{
    $mysql = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
    $id = $mysql ? 'INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    $fine = $mysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';

    $tabelle = [
        // chi entra nell'area riservata (password con password_hash)
        "CREATE TABLE IF NOT EXISTS utenti (
            id {$id},
            utente VARCHAR(60) NOT NULL UNIQUE,
            hash VARCHAR(255) NOT NULL,
            creato DATETIME NOT NULL
        ){$fine}",
        // la selezione del momento (vetrina e home), in ordine di esposizione
        "CREATE TABLE IF NOT EXISTS pezzi (
            id {$id},
            nome VARCHAR(80) NOT NULL,
            categoria VARCHAR(30) NOT NULL,
            materiale VARCHAR(120) NOT NULL DEFAULT '',
            descrizione TEXT NOT NULL,
            immagine VARCHAR(255) NOT NULL,
            alt VARCHAR(160) NOT NULL DEFAULT '',
            ordine INT NOT NULL DEFAULT 0,
            aggiornato DATETIME NOT NULL
        ){$fine}",
        // marchi trattati (fascia in home)
        "CREATE TABLE IF NOT EXISTS marchi (
            id {$id},
            nome VARCHAR(60) NOT NULL,
            reparto VARCHAR(30) NOT NULL,
            nota VARCHAR(120) NOT NULL DEFAULT '',
            ordine INT NOT NULL DEFAULT 0
        ){$fine}",
        // orario settimanale: un giorno per riga (0 = domenica), fasce in JSON, '' = chiuso
        "CREATE TABLE IF NOT EXISTS orari (
            giorno SMALLINT NOT NULL PRIMARY KEY,
            fasce VARCHAR(255) NOT NULL DEFAULT ''
        ){$fine}",
        // ferie, ponti, chiusure di un giorno: date comprese
        "CREATE TABLE IF NOT EXISTS chiusure (
            id {$id},
            dal DATE NOT NULL,
            al DATE NOT NULL,
            motivo VARCHAR(60) NOT NULL DEFAULT ''
        ){$fine}",
        // messaggi dai moduli Contatti e Perizie: arrivano per email e restano qui
        "CREATE TABLE IF NOT EXISTS messaggi (
            id {$id},
            tipo VARCHAR(20) NOT NULL,
            nome VARCHAR(80) NOT NULL,
            telefono VARCHAR(40) NOT NULL DEFAULT '',
            email VARCHAR(120) NOT NULL DEFAULT '',
            dati TEXT NOT NULL,
            creato DATETIME NOT NULL,
            letto SMALLINT NOT NULL DEFAULT 0
        ){$fine}",
        // tentativi di accesso e invii (impronta dell'IP, mai l'IP in chiaro)
        "CREATE TABLE IF NOT EXISTS tentativi (
            id {$id},
            chiave VARCHAR(100) NOT NULL,
            quando INT NOT NULL
        ){$fine}",
        // link per scegliere una nuova password: solo l'impronta del codice, mai il codice
        "CREATE TABLE IF NOT EXISTS recuperi (
            id {$id},
            utente VARCHAR(60) NOT NULL,
            impronta CHAR(64) NOT NULL UNIQUE,
            scade INT NOT NULL
        ){$fine}",
        "CREATE TABLE IF NOT EXISTS impostazioni (
            chiave VARCHAR(40) NOT NULL PRIMARY KEY,
            valore TEXT NOT NULL
        ){$fine}",
    ];
    foreach ($tabelle as $sql) $pdo->exec($sql);

    // indice per contare i tentativi in fretta
    try { $pdo->exec('CREATE INDEX idx_tentativi ON tentativi (chiave, quando)'); } catch (PDOException) { /* gia' presente */ }
}

/** Orario di partenza (quello pubblicato sul vecchio sito), usato solo se la tabella e' vuota. */
function orari_iniziali(PDO $pdo): void
{
    if ((int) $pdo->query('SELECT COUNT(*) FROM orari')->fetchColumn() > 0) return;
    $due = json_encode([[9.5, 12.5], [15.5, 19.5]]);
    $q = $pdo->prepare('INSERT INTO orari (giorno, fasce) VALUES (?, ?)');
    foreach ([0 => '', 1 => '', 2 => $due, 3 => $due, 4 => $due, 5 => $due, 6 => $due] as $g => $f) $q->execute([$g, $f]);
}
