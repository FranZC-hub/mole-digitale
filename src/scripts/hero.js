/* Animazione d'apertura della home (titolo, sottotitolo, anteprima del sito) con GSAP.
   Sta qui e non in main.js perché GSAP serve solo alla home: in main.js lo scaricavano
   tutte le pagine (~27 KB compressi, quasi tutto mai eseguito). La importa solo index.astro.
   Senza JavaScript o con «meno movimento» i testi restano visibili (scroll.css). */
import { gsap } from 'gsap';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && document.querySelector('.hero-title')) {
  const fadeEls = gsap.utils.toArray('.hero-fade').filter((el) => !el.classList.contains('hero-visual'));
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-title .word',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.7 }, 0.1)
    // Il sottotitolo è l'elemento più grande della prima schermata (quello che Google misura
    // come LCP): da opacità 0 contava solo a fine animazione, dopo l'arrivo di GSAP (2,1 s su
    // telefono lento). Partendo già leggibile conta subito; l'effetto resta quasi lo stesso.
    .fromTo(fadeEls,
      { opacity: 0.35, y: 24 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, 0.45)
    .fromTo('.hero-visual',
      { opacity: 0, x: 40, rotateY: -15 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1.1 }, 0.4);

  // Parallasse del mockup: ScrollTrigger (~21 KB) arriva a richiesta, dopo l'animazione.
  // Ascolta lo scroll nativo, che Lenis continua a generare: non serve collegarli.
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-visual', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}
