<?php
// Statistiche first-party di Mole Digitale — privacy-friendly:
// niente cookie, niente IP salvati, niente servizi esterni. Conta solo: giorno, pagina, provenienza.
//
// • Beacon (chiamato dal sito):  /stats.php?p=/pagina/&r=google.com   → riga su ../stats.csv
// • Azione (facoltativa):        /stats.php?p=/pagina/&e=lista-inviata  → conteggiata a parte
// • Report (solo per te):        /stats.php?key=LA_TUA_CHIAVE
//   La chiave va aggiunta in mail-config.php:  'STATS_KEY' => 'una-frase-segreta',
//   (finché non c'è, il report è disattivato; il conteggio funziona comunque)

$FILE = __DIR__ . '/../stats.csv'; // sopra la cartella pubblica: non scaricabile dal web

// ---------- REPORT ----------
if (isset($_GET['key'])) {
  $config = @include __DIR__ . '/../mail-config.php';
  if (!is_array($config)) { $config = @include __DIR__ . '/mail-config.php'; }
  $goodKey = is_array($config) && !empty($config['STATS_KEY']) && hash_equals((string) $config['STATS_KEY'], (string) $_GET['key']);
  if (!$goodKey) { http_response_code(403); exit('Accesso negato.'); }

  // Periodo: ultimi 7 / 30 / 90 giorni, oppure tutto. Le date nel file sono AAAA-MM-GG,
  // quindi il confronto tra stringhe basta.
  $scelte = ['7' => '7 giorni', '30' => '30 giorni', '90' => '90 giorni', 'tutto' => 'Tutto'];
  $periodo = (string) ($_GET['giorni'] ?? '30');
  if (!isset($scelte[$periodo])) { $periodo = '30'; }
  $dal = $periodo === 'tutto' ? '' : date('Y-m-d', strtotime('-' . ((int) $periodo - 1) . ' days'));

  // Le azioni che sono un contatto vero. Le altre (es. «lista-inviata» nelle demo) restano a parte.
  $contatti = [
    'whatsapp' => 'Clic su WhatsApp', 'telefono' => 'Clic sul numero di telefono', 'email' => 'Clic sull’email',
    'richiesta-contatti' => 'Modulo contatti inviato', 'richiesta-preventivo' => 'Preventivo richiesto',
    'richiesta-brief' => 'Brief inviato (Inizia da qui)', 'richiesta-analisi' => 'Analisi gratuita richiesta',
  ];
  // Provenienza raggruppata. «interno» = navigazione da una pagina all'altra del sito (dal 28/10/2026;
  // prima finiva tra le vuote insieme alle visite dirette).
  $gruppo = function ($r) {
    if ($r === 'interno') { return 'Dal sito stesso (pagina dopo pagina)'; }
    if ($r === '') { return 'Dirette (link salvato, scritto a mano, app di messaggi)'; }
    if (preg_match('/(^|\.)google\./', $r)) { return 'Google'; }
    if (preg_match('/chatgpt|openai|perplexity|copilot|gemini|claude/', $r)) { return 'Assistenti con intelligenza artificiale'; }
    if (preg_match('/(^|\.)bing\.com$|duckduckgo|ecosia|yahoo|qwant|yandex/', $r)) { return 'Altri motori di ricerca'; }
    if (preg_match('/facebook|instagram|linkedin|(^|\.)t\.co$|twitter|x\.com|tiktok|whatsapp|telegram/', $r)) { return 'Social e messaggi'; }
    return 'Altri siti (directory, link)';
  };

  $giorni = []; $pagine = []; $prov = []; $gruppi = []; $azioni = []; $altre = []; $contPag = [];
  $viste = 0; $nContatti = 0; $esterne = 0;
  if (is_file($FILE)) {
    foreach (file($FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
      // escape esplicito: dalle PHP piu' recenti l'impostazione predefinita e'
      // deprecata e stamperebbe un avviso dentro il rapporto. Stringa vuota =
      // nessun escape, che e' esattamente il formato con cui scriviamo.
      $c = str_getcsv($line, ',', '"', '');
      if (count($c) < 3) { continue; }
      [$d, $p, $r] = $c;
      if ($dal !== '' && $d < $dal) { continue; }
      $e = $c[3] ?? '';                       // 4a colonna: assente nelle righe vecchie
      if ($e !== '') {                        // e' un'azione, non una visita
        if (isset($contatti[$e])) {
          $azioni[$e] = ($azioni[$e] ?? 0) + 1;
          $contPag[$p] = ($contPag[$p] ?? 0) + 1;
          $nContatti++;
        } else {
          $altre[$e] = ($altre[$e] ?? 0) + 1;
        }
        continue;
      }
      $viste++;
      $giorni[$d] = ($giorni[$d] ?? 0) + 1;
      $pagine[$p] = ($pagine[$p] ?? 0) + 1;
      $g = $gruppo($r);
      $gruppi[$g] = ($gruppi[$g] ?? 0) + 1;
      if ($r !== '' && $r !== 'interno') { $prov[$r] = ($prov[$r] ?? 0) + 1; $esterne++; }
    }
  }
  krsort($giorni); arsort($pagine); arsort($prov); arsort($gruppi); arsort($azioni); arsort($altre); arsort($contPag);
  $pagine = array_slice($pagine, 0, 25, true);
  $prov = array_slice($prov, 0, 15, true);

  header('Content-Type: text/html; charset=utf-8');
  header('X-Robots-Tag: noindex');
  $h = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
  $tab = function (array $righe, string $vuoto, array $intest) use ($h) {
    if (!$righe) { return '<p class="vuoto">' . $h($vuoto) . '</p>'; }
    $out = '<table><tr>' . implode('', array_map(fn($t) => '<th>' . $h($t) . '</th>', $intest)) . '</tr>';
    foreach ($righe as $r) {
      $out .= '<tr><td>' . $h($r[0]) . '</td>';
      foreach (array_slice($r, 1) as $v) { $out .= '<td class="n">' . $h($v) . '</td>'; }
      $out .= '</tr>';
    }
    return $out . '</table>';
  };
  $perc = fn($a, $b) => $b ? number_format(100 * $a / $b, 1, ',', '') . '%' : '—';

  $menu = '';
  foreach ($scelte as $k => $t) {
    $menu .= $k === $periodo ? '<b>' . $h($t) . '</b>' : '<a href="?key=' . rawurlencode((string) $_GET['key']) . '&amp;giorni=' . $k . '">' . $h($t) . '</a>';
  }

  echo '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     . '<title>Statistiche — Mole Digitale</title><style>body{font-family:system-ui,sans-serif;background:#0b0f1a;color:#e7ecf3;max-width:780px;margin:0 auto;padding:2rem 1rem;line-height:1.5}'
     . 'h1{font-size:1.4rem}h2{font-size:1.05rem;margin-top:2.2rem;color:#22d3ee}table{width:100%;border-collapse:collapse;font-size:.92rem}'
     . 'th{text-align:left;color:#aab4c5;font-weight:600;font-size:.82rem;padding:.4rem .6rem;border-bottom:1px solid #3a4866}th+th{text-align:right}'
     . 'td{padding:.45rem .6rem;border-bottom:1px solid #243049;word-break:break-word}.n{text-align:right;font-variant-numeric:tabular-nums;color:#22d3ee;font-weight:700;white-space:nowrap}'
     . '.periodo{display:flex;gap:1rem;flex-wrap:wrap;margin:.6rem 0 1.4rem}.periodo a{color:#aab4c5}.periodo b{color:#fff}'
     . '.box{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.8rem}.box div{background:#131a2b;border:1px solid #243049;border-radius:12px;padding:1rem}'
     . '.box b{display:block;font-size:1.6rem;color:#22d3ee}.box span{color:#aab4c5;font-size:.85rem}.vuoto,.nota{color:#aab4c5;font-size:.88rem}</style></head><body>'
     . '<h1>📊 Statistiche del sito</h1><p class="periodo">' . $menu . '</p>'
     . '<div class="box">'
     . '<div><b>' . $viste . '</b><span>pagine viste</span></div>'
     . '<div><b>' . $nContatti . '</b><span>contatti (WhatsApp, telefono, email, moduli)</span></div>'
     . '<div><b>' . $perc($nContatti, $viste) . '</b><span>contatti ogni 100 pagine viste</span></div>'
     . '<div><b>' . $esterne . '</b><span>visite arrivate da altri siti</span></div>'
     . '</div>'
     . '<h2>I contatti, per tipo</h2>' . $tab(array_map(fn($k, $v) => [$contatti[$k], $v], array_keys($azioni), $azioni), 'Nessun contatto registrato nel periodo.', ['Azione', 'Volte'])
     . '<h2>Le pagine da cui partono i contatti</h2>' . $tab(array_map(fn($k, $v) => [$k, $v], array_keys($contPag), $contPag), 'Nessun contatto registrato nel periodo.', ['Pagina', 'Contatti'])
     . '<h2>Da dove arrivano le visite</h2>' . $tab(array_map(fn($k, $v) => [$k, $v, $perc($v, $viste)], array_keys($gruppi), $gruppi), 'Nessuna visita nel periodo.', ['Provenienza', 'Pagine viste', 'Quota'])
     . '<h2>Siti di provenienza, in dettaglio</h2>' . $tab(array_map(fn($k, $v) => [$k, $v], array_keys($prov), $prov), 'Nessuna visita da altri siti nel periodo.', ['Sito', 'Visite'])
     . '<h2>Pagine più viste</h2>' . $tab(array_map(fn($k, $v) => [$k, $v, $contPag[$k] ?? 0], array_keys($pagine), $pagine), 'Nessuna visita nel periodo.', ['Pagina', 'Viste', 'Contatti'])
     . '<h2>Pagine viste per giorno</h2>' . $tab(array_map(fn($k, $v) => [$k, $v], array_keys($giorni), $giorni), 'Nessuna visita nel periodo.', ['Giorno', 'Viste'])
     . ($altre ? '<h2>Altre azioni (demo e bozze)</h2>' . $tab(array_map(fn($k, $v) => [$k, $v], array_keys($altre), $altre), '', ['Azione', 'Volte']) : '')
     . '<p class="nota">Conteggio senza cookie e senza dati personali: «pagine viste» non sono persone diverse. I bot noti sono esclusi.</p>'
     . '</body></html>';
  exit;
}

// ---------- BEACON ----------
http_response_code(204); // risposta vuota, il visitatore non vede nulla

// niente bot noti
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime/i', $ua)) { exit; }

$p = substr((string) ($_GET['p'] ?? ''), 0, 120);
$r = substr((string) ($_GET['r'] ?? ''), 0, 80);
// azione facoltativa: "lista-inviata", "preventivo-whatsapp"... Solo lettere,
// numeri e trattini, cosi' non ci finisce dentro nulla di personale.
$e = preg_replace('/[^a-z0-9-]/', '', strtolower(substr((string) ($_GET['e'] ?? ''), 0, 40)));
if ($p === '' || $p[0] !== '/') { exit; }

// Anti-flood: un conteggio ogni 2 secondi per visitatore (l'IP non viene salvato,
// serve solo come nome del file temporaneo). La finestra e' SEPARATA per le visite e
// per ogni azione: altrimenti il clic fatto subito dopo l'apertura della pagina
// verrebbe scartato insieme alla visita.
$chiave = md5(($_SERVER['REMOTE_ADDR'] ?? 'x') . date('Ymd') . '|' . $e);
$rl = sys_get_temp_dir() . '/md_st_' . $chiave . '.txt';
if (@is_file($rl) && (time() - @filemtime($rl)) < 2) { exit; }
@touch($rl);

// Il file non deve crescere all'infinito: oltre 2 MB (~40k visite) archivio e riparto.
// Il nome dell'archivio è mensile, ma un mese molto trafficato può superare i 2 MB
// più di una volta: rename() sovrascrive senza chiedere, e il primo archivio sparirebbe.
// Se il nome è già occupato aggiungo un progressivo finché ne trovo uno libero.
if (@is_file($FILE) && @filesize($FILE) > 2 * 1024 * 1024) {
  $base = dirname($FILE) . '/stats-' . date('Y-m');
  $dest = $base . '.csv';
  for ($n = 2; @file_exists($dest) && $n < 100; $n++) { $dest = $base . '-' . $n . '.csv'; }
  if (!@file_exists($dest)) { @rename($FILE, $dest); }
}

// pulizia anti-injection CSV: via virgolette e a capo, e (come in contact.php) un apostrofo
// davanti a = + - @, perche' "r" lo manda il browser e aperto in Excel diventerebbe una formula
$clean = function ($s) {
  $s = str_replace(['"', "\r", "\n"], '', $s);
  return ($s !== '' && in_array($s[0], ['=', '+', '-', '@'], true)) ? "'" . $s : $s;
};
@file_put_contents(
  $FILE,
  '"' . date('Y-m-d') . '","' . $clean($p) . '","' . $clean($r) . '","' . $clean($e) . "\"\n",
  FILE_APPEND | LOCK_EX
);
