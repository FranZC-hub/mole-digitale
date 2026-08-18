// Comportamenti condivisi dalle pagine demo (nav mobile, reveal allo scroll, accordion).
// Ogni demo passa il proprio prefisso (es. 'es' per estetica): id/classi seguono la
// convenzione ${p}nav / ${p}Toggle / .${p}links / classe aperta ${p}open.

export function demoNav(p) {
  const nav = document.getElementById(p + 'nav');
  const toggle = document.getElementById(p + 'Toggle');
  if (!nav || !toggle) return;
  const openCls = p + 'open';
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 30), { passive: true });
  toggle.addEventListener('click', () => {
    const o = nav.classList.toggle(openCls);
    toggle.setAttribute('aria-expanded', String(o));
  });
  const close = () => { nav.classList.remove(openCls); toggle.setAttribute('aria-expanded', 'false'); };
  document.querySelectorAll('.' + p + 'links a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('click', (e) => { if (nav.classList.contains(openCls) && !nav.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

export function demoReveal(threshold = 0.1) {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold }
  );
  document.querySelectorAll('.r').forEach((el) => io.observe(el));
}

// Accordion "uno aperto alla volta" su un selettore di <details>
export function demoAccordion(sel) {
  const items = document.querySelectorAll(sel);
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  }));
}

// Moduli delle demo: prima non facevano nulla (onsubmit="return false"), così chi
// provava a prenotare pensava che il sito fosse rotto. Ora confermano la richiesta
// dicendo chiaramente che è una dimostrazione.
export function demoForm(sel, opz = {}) {
  const form = document.querySelector(sel);
  if (!form) return;
  form.removeAttribute('onsubmit');

  // stile neutro: eredita colore e tinta della demo, così sta bene su tutte
  if (!document.getElementById('demo-esito-css')) {
    const st = document.createElement('style');
    st.id = 'demo-esito-css';
    st.textContent = `.demo-esito{margin-top:.9rem;padding:.9rem 1.05rem;border-radius:12px;font-size:.93rem;
      line-height:1.55;border:1px solid;border-color:color-mix(in srgb,currentColor 35%,transparent);
      background:color-mix(in srgb,currentColor 8%,transparent)}
      .demo-esito b{font-weight:700}`;
    document.head.appendChild(st);
  }

  const esito = document.createElement('p');
  esito.className = 'demo-esito';
  esito.setAttribute('role', 'status');
  esito.setAttribute('aria-live', 'polite');
  esito.hidden = true;
  const nota = form.querySelector('p:last-of-type');
  form.insertBefore(esito, nota || null);

  // il campo d'identità può essere un nome o un'email; certi moduli (newsletter,
  // prenotazione a sole tendine) non ne hanno nessuno e vanno bene lo stesso
  const campoId = form.querySelector('input[type=text]') || form.querySelector('input[type=email]');
  if (campoId && !campoId.hasAttribute('required')) campoId.setAttribute('required', '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = (campoId?.value || '').trim();
    if (campoId && !nome) { campoId.focus(); return; }
    const scelta = form.querySelector('select')?.value?.trim();
    const cosa = opz.cosa || 'richiesta';
    esito.innerHTML = (nome ? `Grazie <b>${nome.replace(/[<>&]/g, '')}</b>, ` : '') + `${cosa} registrata`
      + (scelta ? ` — <b>${scelta.replace(/[<>&]/g, '')}</b>` : '')
      + `. ${opz.risposta || 'Ti ricontattiamo noi al più presto.'}`
      + ' <i>(dimostrazione: nessun dato è stato inviato)</i>';
    esito.hidden = false;
    esito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.querySelectorAll('input').forEach((i) => { i.value = ''; });
  });
}
