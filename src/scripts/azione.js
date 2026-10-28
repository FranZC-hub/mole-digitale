// Conta un'azione che conta (clic su WhatsApp, telefono, email, richiesta inviata) nello stesso
// contatore delle visite (/stats.php): niente cookie, niente dati personali, solo il nome
// dell'azione e la pagina. Il report è in /stats.php?key=… sotto «Azioni dei visitatori».
export function azione(nome) {
  try {
    if (navigator.webdriver || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
    fetch('/stats.php?p=' + encodeURIComponent(location.pathname) + '&e=' + encodeURIComponent(nome), { keepalive: true }).catch(() => {});
  } catch (_) { /* il conteggio non deve mai disturbare la pagina */ }
}
