// Checklist modificabile di /demoClientiDev/ ("cosa manca" di ogni progetto in sviluppo).
// - Si parte dalle voci di docs/<cliente>/PRODUZIONE.md (lette durante la build).
// - Spunte e modifiche restano in QUESTO browser (localStorage); «Ripristina» torna al documento.
// - «Modifica» apre tutta la lista come testo: si cambia, si aggiunge, si toglie, si incolla
//   una lista presa altrove (WhatsApp, Note, Notion...). «Copia» la porta da un'altra parte.
// Il testo dell'utente non diventa mai HTML: solo `codice` e **grassetto**, come nodi DOM.

const PREFISSO = 'md-checklist:';

// ---------------------------------------------------------------- testo ⇄ lista
const SEGNI_FATTO = /^(\[[xX]\]|☑|✅|✓|✔|☒)$/;
// ️: il selettore "emoji" che WhatsApp e i telefoni aggiungono dopo ✔ e simili
const VOCE = /^\s*(?:[-*•]\s*)?(\[[ xX]?\]|☐|☑|✅|⬜|✓|✔|☒)️?\s*(.*)$/u;
const VOCE_SEMPLICE = /^\s*[-*•]\s+(.*)$/;
const CHI = /\s*\((Noi|Dal negozio)\)\s*$/i;

/** Testo (Markdown, ☐/☑, ⬜/✅ o un elenco qualsiasi) → { sezioni: [{ titolo, chi, voci }] } */
export function leggiTesto(testo) {
  const sezioni = [];
  let sez = null, ultima = null;
  const nuovaSezione = (riga) => {
    const t = riga.replace(/^#+\s*/, '').trim();
    const chi = t.match(CHI)?.[1] || '';
    sez = { titolo: t.replace(CHI, '').trim(), chi: chi && chi[0].toUpperCase() + chi.slice(1).toLowerCase(), voci: [] };
    sezioni.push(sez);
    ultima = null;
  };
  for (const riga of String(testo).replace(/\r\n?/g, '\n').split('\n')) {
    if (!riga.trim()) { ultima = null; continue; }
    const v = riga.match(VOCE) || (riga.match(VOCE_SEMPLICE) && [null, '', riga.match(VOCE_SEMPLICE)[1]]);
    if (v && v[2].trim()) {
      if (!sez) nuovaSezione('Da fare');
      ultima = { testo: v[2].trim(), fatto: SEGNI_FATTO.test(v[1]) };
      sez.voci.push(ultima);
    } else if (ultima && /^\s{2,}\S/.test(riga)) {
      ultima.testo += ' ' + riga.trim();      // riga rientrata: continua la voce sopra
    } else {
      nuovaSezione(riga);
    }
  }
  return { sezioni: sezioni.filter((s) => s.voci.length) };
}

const conChi = (s) => s.titolo + (s.chi ? ` (${s.chi})` : '');
const senzaSegni = (t) => t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');

/** Per Notion, GitHub, Obsidian, Trello: si incolla come lista di caselle vere. */
export function testoMarkdown(lista) {
  return lista.sezioni.map((s) => `## ${conChi(s)}\n` + s.voci.map((v) => `- [${v.fatto ? 'x' : ' '}] ${v.testo}`).join('\n')).join('\n\n') + '\n';
}

/** Per WhatsApp, email, Note: senza simboli di formattazione. */
export function testoSemplice(lista, nome) {
  return `${nome} — cosa manca\n\n` + lista.sezioni.map((s) => `${conChi(s)}\n` + s.voci.map((v) => `${v.fatto ? '☑' : '☐'} ${senzaSegni(v.testo)}`).join('\n')).join('\n\n') + '\n';
}

// ---------------------------------------------------------------- disegno
function testoFormattato(el, t) {
  // solo `codice` e **grassetto**; tutto il resto resta testo
  for (const pezzo of t.split(/(`[^`]+`|\*\*[^*]+\*\*)/)) {
    if (!pezzo) continue;
    if (/^`[^`]+`$/.test(pezzo)) el.append(Object.assign(document.createElement('code'), { textContent: pezzo.slice(1, -1) }));
    else if (/^\*\*[^*]+\*\*$/.test(pezzo)) {
      const b = document.createElement('b');
      testoFormattato(b, pezzo.slice(2, -2));   // **`codice in grassetto`**
      el.append(b);
    }
    else el.append(pezzo);
  }
}

const conta = (lista) => {
  const voci = lista.sezioni.flatMap((s) => s.voci);
  const fatte = voci.filter((v) => v.fatto).length;
  return { daFare: voci.length - fatte, fatte };
};

const leggi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const scrivi = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

async function copia(testo) {
  try { await navigator.clipboard.writeText(testo); return true; } catch { /* sotto: metodo vecchio */ }
  const t = Object.assign(document.createElement('textarea'), { value: testo });
  t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.append(t); t.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { /* niente */ }
  t.remove();
  return ok;
}

// ---------------------------------------------------------------- avvio
export function avviaChecklist(box) {
  const dati = JSON.parse(box.querySelector('.ck-dati').textContent);
  const chiave = PREFISSO + dati.chiave;
  const documento = { sezioni: dati.sezioni };
  const $ = (s) => box.querySelector(s);
  const corpo = $('.ck-corpo'), editor = $('.ck-editor'), area = $('.ck-area');
  const statoEl = $('.ck-stato'), avviso = $('.ck-avviso'), contaEl = $('.ck-conta');

  let salvata = leggi(chiave);
  let lista = salvata?.sezioni ? { sezioni: salvata.sezioni } : structuredClone(documento);

  const salva = () => {
    salvata = { base: dati.base, quando: new Date().toISOString(), sezioni: lista.sezioni };
    if (!scrivi(chiave, salvata)) statoEl.textContent = 'Attenzione: questo browser non lascia salvare (navigazione privata?). Copia la lista per non perderla.';
    else aggiornaStato();
  };

  function aggiornaConta() {
    const c = conta(lista);
    contaEl.textContent = `${c.daFare} da fare · ${c.fatte} fatte`;
  }

  function aggiornaStato() {
    statoEl.replaceChildren();
    if (salvata?.quando) {
      const q = new Date(salvata.quando).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      statoEl.append(`Modifiche salvate in questo browser (${q}). `);
      const r = Object.assign(document.createElement('button'), { type: 'button', className: 'ck-link', textContent: 'Ripristina dal documento' });
      r.addEventListener('click', () => {
        if (!confirm('Tornare alla checklist del documento? Spunte e modifiche fatte qui si perdono (copiale prima, se ti servono).')) return;
        scrivi(chiave, null); salvata = null;
        lista = structuredClone(documento);
        avviso.hidden = true;
        disegna();
      });
      statoEl.append(r);
    } else {
      statoEl.append(`Come in ${dati.fonte}. Spunte e modifiche restano in questo browser: per portarle altrove, «Copia».`);
    }
  }

  function disegna() {
    corpo.replaceChildren();
    // prima le sezioni da finire, poi quelle completate (chiuse), come nella pagina senza JS
    const completa = (s) => s.voci.every((v) => v.fatto);
    const ordine = lista.sezioni.map((s, i) => i).sort((a, b) => completa(lista.sezioni[a]) - completa(lista.sezioni[b]));
    ordine.forEach((i) => {
      const s = lista.sezioni[i];
      const tutteFatte = completa(s);
      const sez = document.createElement(tutteFatte ? 'details' : 'div');
      sez.className = 'ck-sez' + (tutteFatte ? ' ck-chiusa' : '');
      const titolo = document.createElement(tutteFatte ? 'summary' : 'p');
      titolo.className = 'ck-titolo';
      titolo.append(s.titolo);
      const etichetta = tutteFatte ? `${s.voci.length} fatte` : s.chi;
      if (etichetta) titolo.append(Object.assign(document.createElement('span'), { className: 'ck-chi', textContent: etichetta }));
      const ul = document.createElement('ul');
      ul.className = 'ck-lista';
      s.voci.forEach((v, j) => {
        const li = document.createElement('li');
        li.className = 'ck-voce' + (v.fatto ? ' ck-fatto' : '');
        const label = document.createElement('label');
        const cb = Object.assign(document.createElement('input'), { type: 'checkbox', className: 'ck-cb', checked: v.fatto });
        const t = document.createElement('span');
        t.className = 'ck-testo';
        testoFormattato(t, v.testo);
        cb.addEventListener('change', () => {
          lista.sezioni[i].voci[j].fatto = cb.checked;
          li.classList.toggle('ck-fatto', cb.checked);
          aggiornaConta();
          salva();
        });
        label.append(cb, t);
        li.append(label);
        ul.append(li);
      });
      sez.append(titolo, ul);
      corpo.append(sez);
    });
    aggiornaConta();
    aggiornaStato();
  }

  // il documento e' cambiato dopo le modifiche fatte qui
  if (salvata?.base && salvata.base !== dati.base) {
    avviso.hidden = false;
    avviso.querySelector('[data-az="nuova"]').addEventListener('click', () => {
      scrivi(chiave, null); salvata = null; lista = structuredClone(documento); avviso.hidden = true; disegna();
    });
    avviso.querySelector('[data-az="tieni"]').addEventListener('click', () => { salva(); avviso.hidden = true; });
  }

  // ---- azioni
  const feedback = (btn, testo) => {
    const prima = btn.dataset.testo || (btn.dataset.testo = btn.textContent);
    btn.textContent = testo;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = prima; }, 1800);
  };
  box.querySelector('[data-az="copia"]').addEventListener('click', async (e) => {
    feedback(e.currentTarget, (await copia(testoSemplice(lista, dati.nome))) ? 'Copiata ✓' : 'Non riesco a copiare');
  });
  box.querySelector('[data-az="copia-md"]').addEventListener('click', async (e) => {
    feedback(e.currentTarget, (await copia(testoMarkdown(lista))) ? 'Copiata ✓' : 'Non riesco a copiare');
  });
  const apriEditor = (aperto) => {
    editor.hidden = !aperto; corpo.hidden = aperto;
    box.querySelector('[data-az="modifica"]').setAttribute('aria-expanded', String(aperto));
    if (aperto) {
      area.value = testoMarkdown(lista);
      area.style.height = 'auto'; area.style.height = Math.min(area.scrollHeight + 4, innerHeight * 0.7) + 'px';
      area.setSelectionRange(0, 0);   // si comincia a leggere dall'inizio, non dalla fine
      area.focus({ preventScroll: true });
      area.scrollTop = 0;
      editor.scrollIntoView({ block: 'nearest' });
    }
  };
  box.querySelector('[data-az="modifica"]').addEventListener('click', () => apriEditor(editor.hidden));
  box.querySelector('[data-az="annulla"]').addEventListener('click', () => apriEditor(false));
  box.querySelector('[data-az="salva"]').addEventListener('click', () => {
    const nuova = leggiTesto(area.value);
    const err = $('.ck-errore');
    if (!nuova.sezioni.length) { err.textContent = 'Non trovo nessuna voce: una riga per voce, per esempio «- [ ] Fare questo».'; return; }
    err.textContent = '';
    lista = nuova;
    salva();
    apriEditor(false);
    disegna();
  });
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') apriEditor(false);
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) box.querySelector('[data-az="salva"]').click();
  });

  $('.ck-azioni').hidden = false;
  disegna();
}
