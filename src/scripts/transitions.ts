import { gsap } from 'gsap';
import { prefersReducedMotion } from './env';

const KEY = 'kavo:transition';

function isInternalNavigation(link: HTMLAnchorElement, e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download') || link.dataset.noTransition !== undefined) return false;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false; // same-page anchor
  if (url.pathname.startsWith('/api/') || /\.[a-z0-9]{2,4}$/i.test(url.pathname)) return false;
  return true;
}

/** Curtain wipe between pages: covers on exit, lifts on arrival. */
export function initTransitions(): number {
  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  const root = document.documentElement;
  const arriving = root.classList.contains('is-arriving');
  try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }

  let introDelay = 0;
  if (curtain && arriving) {
    introDelay = 0.35;
    gsap.set(curtain, { yPercent: 0, visibility: 'visible' });
    root.classList.remove('is-arriving');
    gsap.to(curtain.firstElementChild, { opacity: 0, duration: 0.3 });
    gsap.to(curtain, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.05, onComplete: () => { gsap.set(curtain, { yPercent: 100, visibility: 'hidden' }); } });
  }

  if (!curtain || prefersReducedMotion()) return introDelay;

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!link || !isInternalNavigation(link, e)) return;
    e.preventDefault();
    const href = link.href;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    gsap.set(curtain, { yPercent: 100, visibility: 'visible' });
    gsap.to(curtain.firstElementChild, { opacity: 1, duration: 0.3, delay: 0.3 });
    gsap.to(curtain, { yPercent: 0, duration: 0.6, ease: 'expo.inOut', onComplete: () => { location.href = href; } });
  });

  // Restore state when returning via back/forward cache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      gsap.set(curtain, { yPercent: 100, visibility: 'hidden' });
      root.classList.remove('is-arriving');
      try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
    }
  });
  return introDelay;
}
