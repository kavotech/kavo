import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Review page: validates the invite link with /api/reviews?invite=…, pre-fills
 * what Kavo entered when creating the link, then posts the review.
 */
const ENDPOINT = '/api/reviews';
const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export function initReviewForm() {
  const form = document.querySelector<HTMLFormElement>('[data-review-form]');
  const loading = document.querySelector<HTMLElement>('[data-review-loading]');
  const invalid = document.querySelector<HTMLElement>('[data-review-invalid]');
  const invalidMsg = document.querySelector<HTMLElement>('[data-review-invalid-msg]');
  const done = document.querySelector<HTMLElement>('[data-review-done]');
  if (!form || !loading || !invalid || !done) return;

  const token = new URLSearchParams(location.search).get('invite') || '';
  const status = form.querySelector<HTMLElement>('[data-review-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const field = <T extends HTMLElement>(name: string) => form.querySelector<T>(`[name="${name}"]`);

  const showInvalid = (message: string) => {
    loading.hidden = true;
    form.hidden = true;
    invalid.hidden = false;
    if (invalidMsg) invalidMsg.textContent = message;
    ScrollTrigger.refresh();
  };

  const setStatus = (msg: string, state: 'error' | 'pending' | '' = '') => {
    if (!status) return;
    status.textContent = msg;
    if (state) status.dataset.state = state; else delete status.dataset.state;
  };

  const setError = (id: string, message: string, input?: HTMLElement | null) => {
    const el = document.getElementById(`${id}-error`);
    if (el) el.textContent = message;
    input?.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  // Rating label + character counter
  const ratingLabel = form.querySelector<HTMLElement>('[data-rating-label]');
  form.querySelectorAll<HTMLInputElement>('input[name="rating"]').forEach((r) =>
    r.addEventListener('change', () => {
      if (ratingLabel) ratingLabel.textContent = `${r.value} out of 5 — ${RATING_LABELS[Number(r.value)]}`;
      setError('rating', '');
    }),
  );
  const body = field<HTMLTextAreaElement>('body');
  const counter = form.querySelector<HTMLElement>('[data-body-count]');
  body?.addEventListener('input', () => { if (counter) counter.textContent = `${body.value.length} / 1500`; });

  if (!token) {
    showInvalid('Review links are sent to our clients directly. If you were expecting one, please get in touch and we’ll send it over.');
    return;
  }

  (async () => {
    try {
      const res = await fetch(`${ENDPOINT}?invite=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.valid) {
        showInvalid(data.error || 'Please ask us for a new review link.');
        return;
      }
      const p = data.prefill || {};
      const fill = (name: string, value: string) => { const el = field<HTMLInputElement | HTMLSelectElement>(name); if (el && value) el.value = value; };
      fill('name', p.name);
      fill('company', p.company);
      fill('projectType', p.projectType);
      fill('projectName', p.projectName);
      loading.hidden = true;
      form.hidden = false;
      ScrollTrigger.refresh();
    } catch {
      showInvalid('We couldn’t check your link just now. Please refresh the page or try again later.');
    }
  })();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      token,
      rating: Number(fd.get('rating') || 0),
      name: String(fd.get('name') || '').trim(),
      role: String(fd.get('role') || '').trim(),
      company: String(fd.get('company') || '').trim(),
      projectType: String(fd.get('projectType') || ''),
      projectName: String(fd.get('projectName') || '').trim(),
      body: String(fd.get('body') || '').trim(),
      consent: Boolean(fd.get('consent')),
      honeypot: String(fd.get('honeypot') || ''),
    };

    const errors: [string, string, HTMLElement | null][] = [
      ['rating', payload.rating >= 1 && payload.rating <= 5 ? '' : 'Please choose a star rating.', form.querySelector('input[name="rating"]')],
      ['name', payload.name ? '' : 'Please add your name.', field('name')],
      ['company', payload.company ? '' : 'Please add your company name.', field('company')],
      ['type', payload.projectType ? '' : 'Please choose what we built for you.', field('projectType')],
      ['body', payload.body.length >= 20 ? '' : 'Please write a few more words (at least 20 characters).', field('body')],
      ['consent', payload.consent ? '' : 'Please confirm we can publish your review.', field('consent')],
    ];
    errors.forEach(([id, msg, input]) => setError(id, msg, input));
    const firstBad = errors.find(([, msg]) => msg);
    if (firstBad) {
      setStatus('Please check the highlighted fields.', 'error');
      firstBad[2]?.focus();
      return;
    }

    if (button) button.disabled = true;
    if (label) label.textContent = 'Publishing…';
    setStatus('Publishing your review…', 'pending');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'We couldn’t publish your review just now. Please try again.');
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ScrollTrigger.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      if (button) button.disabled = false;
      if (label) label.textContent = 'Publish my review';
    }
  });
}
