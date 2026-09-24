import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { isDesktop, prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'expo.out';

/** Split headings into masked lines. Returns the SplitText instances keyed by element. */
function splitLines(el: HTMLElement, onSplit: (lines: Element[]) => gsap.core.Animation | void) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    aria: 'auto',
    onSplit(self: SplitText) {
      el.style.visibility = 'visible';
      return onSplit(self.lines);
    },
  });
}

/* --------------------------------------------------------------- Page intro */
export function playIntro(delay = 0) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (prefersReducedMotion()) {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => (el.style.visibility = 'visible'));
    return;
  }
  const tl = gsap.timeline({ delay, defaults: { ease: EASE } });
  if (header) tl.to(header, { opacity: 1, duration: 0.8 }, 0);

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const loadTitles = Array.from(document.querySelectorAll<HTMLElement>('[data-split="load"]'));
  loadTitles.forEach((el, i) => {
    // Returned tweens let SplitText re-split on resize while preserving progress.
    splitLines(el, (lines) =>
      gsap.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.25, ease: EASE, stagger: 0.09, delay: delay + 0.1 + i * 0.1 }),
    );
  });
  if (hero) {
    const fades = hero.querySelectorAll('[data-hero-fade]');
    if (fades.length) tl.to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.55);
  }
  // Hero visuals may sit just outside the hero section (e.g. full-width media)
  const visual = document.querySelectorAll<HTMLElement>('[data-hero-visual]');
  if (visual.length) tl.fromTo(visual, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.4 }, 0.65);
  return tl;
}

/* -------------------------------------------------------------- Scroll reveals */
export function initReveals() {
  if (prefersReducedMotion()) {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => (el.style.visibility = 'visible'));
    return;
  }

  // Masked line headings
  document.querySelectorAll<HTMLElement>('[data-split="scroll"]').forEach((el) => {
    const delay = Number(el.dataset.delay || 0);
    splitLines(el, (lines) =>
      gsap.fromTo(lines, { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, ease: EASE, stagger: 0.08, delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    );
  });

  // Fade + rise for supporting content, batched for natural staggering
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.07, overwrite: true }),
  });

  // Masked image reveals
  document.querySelectorAll<HTMLElement>('[data-reveal-image]').forEach((el) => {
    const inner = el.firstElementChild;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' }, 0);
    if (inner) tl.to(inner, { scale: 1, duration: 1.8, ease: EASE }, 0.1);
  });

  // Subtle parallax inside frames
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const stage = el.querySelector('[data-pv-stage]') || el;
    gsap.fromTo(stage, { yPercent: 6 }, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  initReel();
  initProcess();
  initMarquees();
  initStickyStack();
}

/* Hero reel: grows from an inset card to full-bleed as it scrolls into view */
function initReel() {
  const reel = document.querySelector<HTMLElement>('[data-reel]');
  if (!reel) return;
  const frame = reel.querySelector<HTMLElement>('[data-reel-frame]');
  if (!frame) return;
  gsap.fromTo(frame,
    { clipPath: 'inset(0% 8% 0% 8% round 32px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top 85%', end: 'top 10%', scrub: true } });
  reel.querySelectorAll<HTMLElement>('[data-reel-layer]').forEach((layer) => {
    const depth = Number(layer.dataset.reelLayer || 1);
    gsap.fromTo(layer, { y: 60 * depth }, { y: -60 * depth, ease: 'none', scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* Process: horizontal track pinned on desktop */
function initProcess() {
  const wrap = document.querySelector<HTMLElement>('[data-process]');
  if (!wrap) return;
  const track = wrap.querySelector<HTMLElement>('[data-process-track]');
  const bar = wrap.querySelector<HTMLElement>('[data-process-bar]');
  if (!track) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: wrap, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.3}`,
        pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => { if (bar) bar.style.transform = `scaleX(${self.progress})`; },
      },
    });
    return () => tween.kill();
  });
  mm.add('(max-width: 1023px)', () => {
    if (!bar) return;
    const st = ScrollTrigger.create({ trigger: track, start: 'top 70%', end: 'bottom 60%', onUpdate: (self) => (bar.style.transform = `scaleX(${self.progress})`) });
    return () => st.kill();
  });
}

/* Typographic rows drifting with scroll */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((row) => {
    const dir = row.dataset.marquee === 'right' ? 1 : -1;
    gsap.fromTo(row, { xPercent: dir > 0 ? -18 : 0 }, {
      xPercent: dir > 0 ? 0 : -18, ease: 'none',
      scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* Stacked cards that scale back slightly as the next one covers them */
function initStickyStack() {
  if (!isDesktop()) return;
  const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card.firstElementChild, {
      scale: 0.94, opacity: 0.55, ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=120', scrub: true },
    });
  });
}

export function refreshMotion() {
  ScrollTrigger.refresh();
}
