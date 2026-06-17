/* =========================================================
   Mole Digitale — main.js (Astro + Vite bundle)
   Lenis (smooth scroll) + GSAP (hero/parallax) + interazioni
   ========================================================= */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- Anno footer ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const nav = document.getElementById('nav');
const setNav = (y) => nav && nav.classList.toggle('scrolled', y > 30);

/* ---------- Lenis (smooth scroll) + GSAP (solo se movimento consentito) ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  lenis.on('scroll', ({ scroll }) => { setNav(scroll); ScrollTrigger.update(); });

  /* --- Hero: entrata cinematografica con GSAP (solo nelle pagine con hero) --- */
  if (document.querySelector('.hero-title')) {
    const fadeEls = gsap.utils.toArray('.hero-fade').filter((el) => !el.classList.contains('hero-visual'));
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-title .word',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.7 }, 0.1)
      .fromTo(fadeEls,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, 0.45)
      .fromTo('.hero-visual',
        { opacity: 0, x: 40, rotateY: -15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1.1 }, 0.4);

    // Parallasse del mockup hero (solo qui)
    gsap.to('.hero-visual', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  const watermark = document.querySelector('.footer-watermark');
  if (watermark) {
    gsap.to(watermark, {
      xPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }
} else {
  window.addEventListener('scroll', () => setNav(window.scrollY), { passive: true });
}
setNav(window.scrollY);

/* ---------- Scroll fluido sulle ancore interne ---------- */
document.querySelectorAll('a[href*="#"]').forEach((a) => {
  const href = a.getAttribute('href') || '';
  if (!href.includes('#')) return;
  const hash = '#' + href.split('#')[1];
  if (hash === '#') return;
  let target;
  try { target = document.querySelector(hash); } catch { return; }
  if (!target) return; // ancora su un'altra pagina → lascia il comportamento di default
  a.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    nav && nav.classList.remove('menu-open');
  });
});

/* ---------- Menu mobile ---------- */
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- Contatori animati ---------- */
const animateCounter = (el) => {
  const target = parseFloat(el.getAttribute('data-target')) || 0;
  const target2 = el.getAttribute('data-target2');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const dur = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    if (target2 !== null) {
      el.textContent = prefix + Math.round(eased * parseFloat(target2)) + suffix;
    } else {
      el.textContent = Math.round(eased * target) + suffix;
    }
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const counters = document.querySelectorAll('.counter');
if (reduced) {
  counters.forEach((el) => {
    const t2 = el.getAttribute('data-target2');
    const pre = el.getAttribute('data-prefix') || '';
    const suf = el.getAttribute('data-suffix') || '';
    el.textContent = t2 !== null ? pre + t2 + suf : (el.getAttribute('data-target') + suf);
  });
} else {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach((el) => cio.observe(el));
}

/* ---------- Scroll-spy: evidenzia la voce di nav attiva ---------- */
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const navTargets = navLinks
  .map((a) => { const h = (a.getAttribute('href') || '').split('#')[1]; try { return h ? document.getElementById(h) : null; } catch { return null; } })
  .filter(Boolean);
if (navTargets.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach((a) => a.classList.toggle('active', (a.getAttribute('href') || '').endsWith('#' + id)));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  navTargets.forEach((s) => spy.observe(s));
}

/* ---------- FAQ accordion ---------- */
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
  });
});

/* ---------- Cursore luminoso + crescita sugli elementi interattivi ---------- */
const glow = document.querySelector('.cursor-glow');
if (glow && !reduced && finePointer) {
  let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
  addEventListener('mousemove', (e) => { gx = e.clientX; gy = e.clientY; });
  const loop = () => {
    cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .btn, [data-tilt], summary, .compare')) glow.classList.add('big');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .btn, [data-tilt], summary, .compare')) glow.classList.remove('big');
  });
}

/* ---------- Tilt 3D + bottoni magnetici + spotlight (solo desktop, no reduced) ---------- */
if (!reduced && finePointer) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const max = 8;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}
if (finePointer) {
  document.querySelectorAll('.serv-card, .testi-card, .port-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}

/* ---------- Slider Prima / Dopo ---------- */
const compare = document.getElementById('compare');
const after = document.getElementById('compareAfter');
const handle = document.getElementById('compareHandle');
if (compare && after && handle) {
  const syncWidth = () => compare.style.setProperty('--cw', compare.clientWidth + 'px');
  syncWidth();
  window.addEventListener('resize', syncWidth);

  let dragging = false;
  const setPos = (clientX) => {
    const r = compare.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(2, Math.min(98, p));
    after.style.width = p + '%';
    handle.style.left = p + '%';
    compare.setAttribute('aria-valuenow', String(Math.round(p)));
  };
  const startDrag = () => { dragging = true; compare.style.cursor = 'grabbing'; };
  const stopDrag = () => { dragging = false; compare.style.cursor = 'ew-resize'; };
  const move = (e) => { if (!dragging) return; setPos(e.touches ? e.touches[0].clientX : e.clientX); };
  compare.addEventListener('mousedown', (e) => { startDrag(); setPos(e.clientX); });
  compare.addEventListener('touchstart', (e) => { startDrag(); setPos(e.touches[0].clientX); }, { passive: true });
  addEventListener('mousemove', move);
  addEventListener('touchmove', move, { passive: true });
  addEventListener('mouseup', stopDrag);
  addEventListener('touchend', stopDrag);

  compare.addEventListener('keydown', (e) => {
    const steps = { ArrowLeft: -5, ArrowRight: 5, ArrowDown: -5, ArrowUp: 5, Home: -100, End: 100 };
    if (!(e.key in steps)) return;
    e.preventDefault();
    let p = parseFloat(handle.style.left) || 50;
    p = Math.max(2, Math.min(98, p + steps[e.key]));
    after.style.width = p + '%'; handle.style.left = p + '%';
    compare.setAttribute('aria-valuenow', String(Math.round(p)));
  });

  if (!reduced) {
    const demo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          let t = 0;
          const anim = setInterval(() => {
            t += 0.04;
            const p = 50 + Math.sin(t) * 22;
            after.style.width = p + '%'; handle.style.left = p + '%';
            if (t > Math.PI) { clearInterval(anim); after.style.width = '50%'; handle.style.left = '50%'; }
          }, 16);
          demo.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    demo.observe(compare);
  }
}

/* ---------- Form contatti (invio email via /contact.php) ---------- */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
if (form) {
  const setError = (name, msg) => {
    const field = form[name];
    const errEl = document.getElementById('err-' + name);
    if (errEl) errEl.textContent = msg || '';
    if (field && field.setAttribute) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  ['nome', 'attivita', 'telefono', 'privacy'].forEach((n) => {
    if (form[n]) form[n].addEventListener('input', () => setError(n, ''));
  });
  const consentLink = form.querySelector('.consent a');
  if (consentLink) consentLink.addEventListener('click', (e) => e.stopPropagation());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const att = form.attivita.value.trim();
    const tel = form.telefono.value.trim();
    let ok = true;
    if (!nome) { setError('nome', 'Dicci come ti chiami'); ok = false; } else setError('nome', '');
    if (!att) { setError('attivita', 'Qual è il nome della tua attività?'); ok = false; } else setError('attivita', '');
    if (!tel) { setError('telefono', 'Serve un recapito per ricontattarti'); ok = false; } else setError('telefono', '');
    if (!form.privacy.checked) { setError('privacy', 'Devi accettare la privacy per inviare'); ok = false; } else setError('privacy', '');
    if (!ok) {
      feedback.textContent = '';
      const firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }
    // Invio reale all'endpoint PHP /contact.php (PHPMailer + SMTP Aruba)
    const btn = form.querySelector('button[type="submit"]');
    feedback.style.color = '#22d3ee';
    feedback.textContent = 'Invio in corso…';
    if (btn) btn.disabled = true;
    try {
      const res = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          attivita: att,
          telefono: tel,
          messaggio: form.messaggio.value.trim(),
          website: form.website ? form.website.value : '',
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        feedback.style.color = '#22d3ee';
        feedback.textContent = '✅ Grazie! Abbiamo ricevuto la tua richiesta: ti rispondiamo entro 24 ore.';
        try { if (window.clarity) window.clarity('event', 'form_inviato'); } catch (_) {}
        form.reset();
      } else {
        throw new Error(out.error || 'Errore');
      }
    } catch (err) {
      feedback.style.color = '#ff6b88';
      feedback.textContent = '⚠️ Invio non riuscito. Riprova, oppure scrivici su WhatsApp qui sopra.';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}
