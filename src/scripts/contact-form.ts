import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Contact form → POST /api/contact (Vercel: api/contact.js, Netlify:
 * netlify/functions/contact.js). The payload shape matches
 * server/contact-email.js `validateSubmission`.
 */
const ENDPOINT = '/api/contact';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> };
  }
}

function getRecaptchaToken(key: string): Promise<string> {
  return new Promise((resolve) => {
    const g = window.grecaptcha;
    if (!g) return resolve('');
    const timer = window.setTimeout(() => resolve(''), 8000);
    g.ready(() => {
      g.execute(key, { action: 'contact_form' })
        .then((token) => { window.clearTimeout(timer); resolve(token); })
        .catch(() => { window.clearTimeout(timer); resolve(''); });
    });
  });
}

function errorMessage(status: number, fallback?: string) {
  if (status === 429) return 'That was a little quick — please wait a moment and try again.';
  if (status >= 500) return 'We couldn’t send your message right now. Please try again shortly, or email us directly.';
  return fallback || 'Something went wrong. Please check the form and try again.';
}

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const startedAt = form.querySelector<HTMLInputElement>('input[name="formStartedAt"]');
  const key = form.dataset.recaptchaKey || '';

  const stamp = () => { if (startedAt) startedAt.value = String(Date.now()); };
  stamp();

  const setError = (id: string, message: string) => {
    const el = document.getElementById(`${id}-error`);
    if (el) el.textContent = message;
    const field = form.querySelector<HTMLElement>(`#${id}`);
    field?.classList.toggle('is-invalid', Boolean(message));
    field?.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const values = () => {
    const fd = new FormData(form);
    const needs = fd.getAll('needs').map(String);
    return {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      companyName: String(fd.get('companyName') || '').trim(),
      needs,
      budget: String(fd.get('budget') || ''),
      timeline: String(fd.get('timeline') || ''),
      referralSource: String(fd.get('referralSource') || ''),
      message: String(fd.get('details') || '').trim(),
      consent: (form.querySelector('#consent') as HTMLInputElement | null)?.checked ?? false,
      honeypot: String(fd.get('websiteTrap') || '').trim(),
      formStartedAt: startedAt?.value || '',
    };
  };

  const validate = (v: ReturnType<typeof values>) => {
    const errors: Record<string, string> = {
      name: v.name ? '' : 'Please tell us your name.',
      email: !v.email ? 'Please add your email address.' : EMAIL.test(v.email) ? '' : 'That email address doesn’t look quite right.',
      needs: v.needs.length ? '' : 'Choose at least one option.',
      budget: v.budget ? '' : 'Choose a budget range.',
      timeline: v.timeline ? '' : 'Choose a timeline.',
      details: v.message.length >= 10 ? '' : 'Please add a few more details (at least 10 characters).',
      consent: v.consent ? '' : 'Please confirm we can contact you.',
    };
    Object.entries(errors).forEach(([id, msg]) => setError(id, msg));
    return Object.entries(errors).filter(([, msg]) => msg);
  };

  // Clear errors as people fix them
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    const id = t.name === 'needs' ? 'needs' : t.name === 'budget' ? 'budget' : t.name === 'timeline' ? 'timeline' : t.id;
    if (id && document.getElementById(`${id}-error`)?.textContent) setError(id, '');
  });

  const setStatus = (msg: string, state: 'error' | 'pending' | '' = '') => {
    if (!status) return;
    status.textContent = msg;
    if (state) status.dataset.state = state; else delete status.dataset.state;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = values();
    const invalid = validate(v);
    if (invalid.length) {
      setStatus('Please check the highlighted fields.', 'error');
      const first = invalid[0][0];
      const target = first === 'needs' || first === 'budget' || first === 'timeline'
        ? form.querySelector<HTMLElement>(`input[name="${first}"]`)
        : form.querySelector<HTMLElement>(`#${first}`);
      target?.focus();
      return;
    }

    const service = v.needs.join(', ');
    const payload = {
      name: v.name,
      email: v.email,
      phone: v.phone,
      companyName: v.companyName,
      service,
      serviceAnswers: [
        { label: 'Services requested', value: service },
        { label: 'Timeline', value: v.timeline },
      ],
      budget: v.budget,
      timeline: v.timeline,
      referralSource: v.referralSource,
      message: v.message,
      consent: v.consent,
      honeypot: v.honeypot,
      formStartedAt: v.formStartedAt,
      recaptchaToken: '',
    };

    if (button) button.disabled = true;
    const label = form.querySelector<HTMLElement>('[data-submit-label]');
    if (label) label.textContent = 'Sending…';
    setStatus('Sending your message…', 'pending');

    try {
      payload.recaptchaToken = await getRecaptchaToken(key);
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) throw new Error(errorMessage(res.status, result.error));

      form.reset();
      stamp();
      setStatus('');
      if (success) {
        const title = success.querySelector<HTMLElement>('[data-success-title]');
        if (title) title.textContent = `Thank you, ${v.name.split(' ')[0]}.`;
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (!document.documentElement.classList.contains('reduce-motion')) {
          gsap.fromTo(success, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' });
        }
        ScrollTrigger.refresh();
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : errorMessage(0), 'error');
    } finally {
      if (button) button.disabled = false;
      if (label) label.textContent = 'Start a conversation';
    }
  });

  document.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    if (success) success.hidden = true;
    form.hidden = false;
    stamp();
    form.querySelector<HTMLInputElement>('#name')?.focus();
    ScrollTrigger.refresh();
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { if (success) success.hidden = true; form.hidden = false; stamp(); }
  });
}
