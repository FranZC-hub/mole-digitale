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
