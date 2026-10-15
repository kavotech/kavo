import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isFinePointer, prefersReducedMotion } from './env';

/** Thin progress bar at the top of the page showing how far you've scrolled. */
export function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  update();
}

/** Numbers that count up from zero when they scroll into view. */
export function initCountUps() {
  document.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
    const target = Number(el.dataset.countup);
    if (!Number.isFinite(target) || prefersReducedMotion()) return;
    const state = { n: 0 };
    el.textContent = '0';
    gsap.to(state, {
      n: target, duration: 1.6, ease: 'expo.out', delay: 0.4,
      onUpdate: () => { el.textContent = String(Math.round(state.n)); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/** Subtle 3D tilt that follows the pointer on desktop. */
export function initTilt() {
  if (!isFinePointer() || prefersReducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(py * -7);
      ry(px * 9);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/** Headline words that cycle (e.g. "websites → apps → platforms"). */
export function initWordCycle() {
  document.querySelectorAll<HTMLElement>('[data-cycle]').forEach((el) => {
    const words = (el.dataset.cycle || '').split('|').filter(Boolean);
    if (words.length < 2 || prefersReducedMotion()) return;
    const inner = el.querySelector<HTMLElement>('[data-cycle-word]');
    if (!inner) return;
    let i = 0;
    const next = () => {
      i = (i + 1) % words.length;
      gsap.timeline()
        .to(inner, { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .add(() => { inner.textContent = words[i]; })
        .fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
    };
    let timer = window.setInterval(next, 2600);
    // Pause while off-screen to save work
    ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { window.clearInterval(timer); if (self.isActive) timer = window.setInterval(next, 2600); },
    });
  });
}
