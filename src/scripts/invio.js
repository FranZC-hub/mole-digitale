// Invio di una richiesta a /contact.php: la parte uguale per i quattro moduli del sito
// (contatti in home, preventivo, «Inizia da qui», analisi gratuita). Prima era copiata in
// ognuno: una correzione andava rifatta quattro volte.
// Qui stanno il bottone (fermo e con la rotella durante l'invio), la riga di esito e il conteggio
// dell'azione; ogni modulo passa solo i suoi dati e i suoi testi.
import { azione } from './azione.js';

/**
 * @param {object} o
 * @param {HTMLButtonElement|null} o.bottone  bottone d'invio del modulo
 * @param {HTMLElement} o.esito               riga dove compare «Invio in corso…» e poi l'esito
 * @param {object} o.dati                     { nome, attivita, telefono, messaggio, website }
 * @param {string} o.conferma                 testo se l'invio riesce
 * @param {string} o.errore                   testo se non riesce
 * @param {string} o.evento                   nome dell'azione da contare (vedi azione.js)
 * @returns {Promise<boolean>} true se la richiesta è partita
 */
export async function inviaRichiesta({ bottone, esito, dati, conferma, errore, evento }) {
  const etichetta = bottone ? bottone.innerHTML : '';
  if (bottone) {
    bottone.disabled = true;
    bottone.setAttribute('aria-busy', 'true');
    bottone.innerHTML = '<span class="btn-spin" aria-hidden="true"></span> Invio…';
  }
  esito.classList.remove('ok', 'ko');
  esito.textContent = 'Invio in corso…';
  // Quando è il server a rifiutare la richiesta per un motivo che chi scrive può correggere
  // (recapito incompleto, troppe richieste di fila) il suo messaggio vale più di quello generico.
  let motivo = '';
  try {
    const res = await fetch('/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });
    const out = await res.json().catch(() => ({}));
    if (!(res.ok && out.ok)) {
      if ((res.status === 400 || res.status === 429) && typeof out.error === 'string') motivo = out.error;
      throw new Error(out.error || 'Errore');
    }
    esito.classList.add('ok');
    esito.textContent = conferma;
    azione(evento);
    return true;
  } catch {
    esito.classList.add('ko');
    esito.textContent = motivo ? '⚠️ ' + motivo : errore;
    return false;
  } finally {
    if (bottone) {
      bottone.disabled = false;
      bottone.removeAttribute('aria-busy');
      bottone.innerHTML = etichetta;
    }
  }
}
