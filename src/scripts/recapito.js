// Il campo «Telefono o email» è l'unico modo per ricontattare chi scrive: un numero a metà o
// un'email senza chiocciola è una richiesta persa. Stessa regola in /contact.php (lato server).
// Largo di proposito: accetta spazi, prefissi e note («333 1234567, dopo le 18»).
export const RECAPITO_ERRORE = 'Controlla il recapito: serve un numero di telefono completo o un’email.';

export function recapitoValido(valore) {
  const v = String(valore).trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
  const cifre = v.replace(/\D/g, '').length;
  return cifre >= 8 && cifre <= 15;
}
