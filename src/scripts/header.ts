import { gsap } from 'gsap';
import { lockScroll, unlockScroll } from './smooth-scroll';
import { prefersReducedMotion } from './env';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  /* ---------- Scroll behaviour: hide on scroll down, reveal on scroll up ---------- */
  let lastY = window.scrollY;
  let ticking = false;
  const headerMid = () => header.offsetHeight / 2;

  const themed = () => Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
  let sections = themed();

  const updateTheme = () => {
    const y = headerMid();
    let theme = document.body.dataset.headerTheme || 'light';
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { theme = s.dataset.theme || theme; break; }
    }
    header.classList.toggle('is-dark', theme === 'dark');
  };

  const onScroll = () => {
    const y = window.scrollY;
    const menuOpen = header.classList.contains('is-menu-open') || header.classList.contains('is-mega-open');
    if (!menuOpen) {
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 160) header.classList.add('is-hidden');
      else if (goingUp || y < 160) header.classList.remove('is-hidden');
      header.classList.toggle('is-solid', y > 40);
    }
    updateTheme();
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', () => { sections = themed(); updateTheme(); });
  onScroll();

  initMegaMenu(header);
  initMobileMenu(header);
}

/* ------------------------------------------------------------------ Mega menu */
function initMegaMenu(header: HTMLElement) {
  const trigger = header.querySelector<HTMLButtonElement>('[data-mega-trigger]');
  const panel = header.querySelector<HTMLElement>('[data-mega]');
  const overlay = document.querySelector<HTMLElement>('[data-mega-overlay]');
  if (!trigger || !panel) return;

  let open = false;
  let openedAtY = 0;
  let closeTimer: number | undefined;
  let hideTimer: number | undefined;
  const items = () => panel.querySelectorAll<HTMLElement>('[data-mega-item]');

  const show = (focusFirst = false) => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(hideTimer);
    if (open) return;
    open = true;
    openedAtY = window.scrollY;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    header.classList.add('is-mega-open');
    overlay?.classList.add('is-visible');
    requestAnimationFrame(() => panel.classList.add('is-open'));
    if (!prefersReducedMotion()) {
      gsap.fromTo(items(), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.025, delay: 0.08, overwrite: true });
    }
    if (focusFirst) panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };

  const hide = (returnFocus = false) => {
    if (!open) return;
    open = false;
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    header.classList.remove('is-mega-open');
    overlay?.classList.remove('is-visible');
    hideTimer = window.setTimeout(() => { if (!open) panel.hidden = true; }, 700);
    if (returnFocus) trigger.focus();
  };

  const scheduleHide = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => hide(), 180);
  };

  trigger.addEventListener('click', (e) => {
    const viaKeyboard = (e as PointerEvent).detail === 0;
    if (open) hide(); else show(viaKeyboard);
  });
  const hoverCapable = window.matchMedia('(hover: hover)');
  [trigger, panel].forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (hoverCapable.matches && e.pointerType === 'mouse') show(); });
    el.addEventListener('pointerleave', (e) => { if (hoverCapable.matches && e.pointerType === 'mouse') scheduleHide(); });
  });
  // Hovering other nav items closes the panel
  header.querySelectorAll<HTMLElement>('.site-nav__link:not([data-mega-trigger]), .site-header__logo').forEach((el) =>
    el.addEventListener('pointerenter', () => { if (open) hide(); }),
  );
  overlay?.addEventListener('click', () => hide());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) hide(true); });
  header.addEventListener('focusout', (e) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && !panel.contains(next) && next !== trigger) hide();
  });
  window.addEventListener('scroll', () => { if (open && Math.abs(window.scrollY - openedAtY) > 80) hide(); }, { passive: true });
}

/* ---------------------------------------------------------------- Mobile menu */
function initMobileMenu(header: HTMLElement) {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const sr = header.querySelector<HTMLElement>('[data-menu-toggle-sr]');
  if (!toggle || !menu) return;
  let open = false;
  let hideTimer: number | undefined;

  const setOpen = (value: boolean) => {
    open = value;
    toggle.setAttribute('aria-expanded', String(value));
    if (sr) sr.textContent = value ? 'Close menu' : 'Open menu';
    header.classList.toggle('is-menu-open', value);
    window.clearTimeout(hideTimer);
    if (value) {
      menu.hidden = false;
      lockScroll();
      requestAnimationFrame(() => menu.classList.add('is-open'));
      if (!prefersReducedMotion()) {
        gsap.fromTo(menu.querySelectorAll('[data-mm-item]'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.25, overwrite: true });
      }
    } else {
      menu.classList.remove('is-open');
      unlockScroll();
      hideTimer = window.setTimeout(() => { if (!open) menu.hidden = true; }, 750);
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); toggle.focus(); return; }
    if (e.key === 'Tab') {
      const nodes = [toggle, ...Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE))].filter((n) => n.offsetParent !== null);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches && open) setOpen(false); });

  // Services accordion
  menu.querySelectorAll<HTMLButtonElement>('[data-mm-accordion]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!panel) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (prefersReducedMotion()) { panel.hidden = expanded; return; }
      if (expanded) {
        gsap.to(panel, { height: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); } });
      } else {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0, overflow: 'hidden' }, { height: 'auto', duration: 0.6, ease: 'expo.out', clearProps: 'height,overflow' });
      }
    });
  });
}
