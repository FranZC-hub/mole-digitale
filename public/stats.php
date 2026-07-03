<?php
// Statistiche first-party di Mole Digitale — privacy-friendly:
// niente cookie, niente IP salvati, niente servizi esterni. Conta solo: giorno, pagina, provenienza.
//
// • Beacon (chiamato dal sito):  /stats.php?p=/pagina/&r=google.com   → riga su ../stats.csv
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

  $days = []; $pages = []; $refs = []; $tot = 0;
  if (is_file($FILE)) {
    foreach (file($FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
      $c = str_getcsv($line);
      if (count($c) < 3) { continue; }
      [$d, $p, $r] = $c;
      $tot++;
      $days[$d]  = ($days[$d]  ?? 0) + 1;
      $pages[$p] = ($pages[$p] ?? 0) + 1;
      if ($r !== '') { $refs[$r] = ($refs[$r] ?? 0) + 1; }
    }
  }
  krsort($days); arsort($pages); arsort($refs);
  $days = array_slice($days, 0, 30, true);
  $pages = array_slice($pages, 0, 20, true);
  $refs = array_slice($refs, 0, 15, true);

  header('Content-Type: text/html; charset=utf-8');
  header('X-Robots-Tag: noindex');
  $row = fn($k, $v) => '<tr><td>' . htmlspecialchars($k) . '</td><td class="n">' . $v . '</td></tr>';
  echo '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
     . '<title>Statistiche — Mole Digitale</title><style>body{font-family:system-ui,sans-serif;background:#0b0f1a;color:#e7ecf3;max-width:720px;margin:0 auto;padding:2rem 1rem}'
     . 'h1{font-size:1.4rem}h2{font-size:1.05rem;margin-top:2rem;color:#22d3ee}table{width:100%;border-collapse:collapse;font-size:.92rem}'
     . 'td{padding:.45rem .6rem;border-bottom:1px solid #243049}.n{text-align:right;font-variant-numeric:tabular-nums;color:#22d3ee;font-weight:700}</style></head><body>'
     . '<h1>📊 Statistiche del sito <small style="color:#aab4c5">(' . $tot . ' visite totali registrate)</small></h1>'
     . '<h2>Visite per giorno (ultimi 30)</h2><table>' . implode('', array_map($row, array_keys($days), $days)) . '</table>'
     . '<h2>Pagine più viste</h2><table>' . implode('', array_map($row, array_keys($pages), $pages)) . '</table>'
     . '<h2>Da dove arrivano</h2><table>' . ($refs ? implode('', array_map($row, array_keys($refs), $refs)) : '<tr><td>Solo visite dirette finora</td></tr>') . '</table>'
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
if ($p === '' || $p[0] !== '/') { exit; }

// pulizia anti-injection CSV
$clean = fn($s) => str_replace(['"', "\r", "\n"], '', $s);
@file_put_contents(
  $FILE,
  '"' . date('Y-m-d') . '","' . $clean($p) . '","' . $clean($r) . "\"\n",
  FILE_APPEND | LOCK_EX
);
