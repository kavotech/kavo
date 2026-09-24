import { gsap } from 'gsap';
import { isFinePointer, prefersReducedMotion } from './env';

/** Desktop-only contextual cursor: a small dot that becomes a labelled disc over [data-cursor] targets. */
export function initCursor() {
  const el = document.querySelector<HTMLElement>('[data-cursor-el]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!el || !label || !isFinePointer() || prefersReducedMotion()) return;

  const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    el.classList.add('is-active');
    xTo(e.clientX);
    yTo(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => el.classList.remove('is-active'));

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    const value = target?.dataset.cursor;
    el.classList.toggle('has-label', Boolean(value && value !== 'none'));
    el.classList.toggle('is-hidden', value === 'none' || Boolean((e.target as HTMLElement).closest('input, textarea, select')));
    if (value && value !== 'none') label.textContent = value;
  });
}

/** Buttons that lean towards the pointer. */
export function initMagnetic() {
  if (!isFinePointer() || prefersReducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
