export const prefersReducedMotion = () =>
  document.documentElement.classList.contains('reduce-motion');

export const isFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
