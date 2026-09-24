import { initSmoothScroll, scrollToTop } from './smooth-scroll';
import { initHeader } from './header';
import { initReveals, playIntro, refreshMotion } from './motion';
import { initCursor, initMagnetic } from './cursor';
import { initTransitions } from './transitions';

declare global {
  interface Window { __kavoReady?: boolean }
}

export function initSite() {
  window.__kavoReady = true;
  initSmoothScroll();
  const introDelay = initTransitions();
  initHeader();
  playIntro(introDelay);
  initReveals();
  initCursor();
  initMagnetic();

  document.querySelectorAll('[data-back-to-top]').forEach((btn) =>
    btn.addEventListener('click', () => {
      scrollToTop();
      document.getElementById('main')?.focus({ preventScroll: true });
    }),
  );

  // Fonts can shift line breaks and section heights; re-measure once ready.
  document.fonts?.ready.then(() => refreshMotion());
  window.addEventListener('load', () => refreshMotion());
}
