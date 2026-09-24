import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isFinePointer, prefersReducedMotion } from './env';

let lenis: Lenis | null = null;

/**
 * Light inertial scrolling for mouse/trackpad users only. Touch devices keep
 * fully native scrolling, and reduced-motion users get none at all.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion() || !isFinePointer()) return null;
  lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, anchors: { offset: -90 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const lockScroll = () => {
  lenis?.stop();
  document.body.classList.add('is-locked');
};
export const unlockScroll = () => {
  document.body.classList.remove('is-locked');
  lenis?.start();
};
export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};
