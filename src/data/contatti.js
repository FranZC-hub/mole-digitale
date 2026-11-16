// I recapiti di Mole Digitale, in un posto solo: se cambia il numero o l'email si cambia qui,
// e tutte le pagine (link, bottoni WhatsApp, dati per Google) seguono.
// Resta a parte solo public/contact.php, che legge i suoi dati da mail-config.php sul server.

/** Numero in formato internazionale, per i link «tel:» */
export const TELEFONO = '+393662102203';
/** Lo stesso numero come si legge */
export const TELEFONO_VISIBILE = '+39 366 210 2203';
/** Senza prefisso, per i testi brevi */
export const TELEFONO_BREVE = '366 210 2203';
export const EMAIL = 'info@moledigitale.it';

/** Link a WhatsApp, con un messaggio già scritto (facoltativo). */
export const whatsapp = (testo = '') =>
  `https://wa.me/${TELEFONO.replace('+', '')}` + (testo ? `?text=${encodeURIComponent(testo)}` : '');
