# Kavo Technologies — website

The marketing site for [Kavo Technologies](https://kavotech.uk), built with [Astro](https://astro.build) as a static site, plus a serverless contact endpoint.

## Getting started

```bash
npm install
cp .env.example .env   # only needed to test the contact form locally
npm run dev            # http://localhost:5000
```

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Local dev server with hot reload              |
| `npm run build`   | Production build into `dist/`                 |
| `npm run preview` | Serve the production build locally            |
| `npm run check`   | Type-check Astro, TypeScript and content      |

## Project structure

```
src/
  components/     Reusable UI (Header, MegaMenu, MobileMenu, Footer, CTA,
                  ProjectCard, ProjectVisual, ServiceList, RevealText, …)
  components/home Homepage-only sections
  content/insights Markdown articles (one file per article)
  data/           Editable content: site details, services, projects
  layouts/        BaseLayout — SEO, schema, header/footer, motion bootstrap
  pages/          Routes (/, /services, /services/[slug], /work, /work/[slug],
                  /about, /insights, /insights/[slug], /contact, 404)
  scripts/        Motion + interaction (GSAP, ScrollTrigger, SplitText, Lenis)
  styles/         Global design tokens and base styles
static/           Files served as-is (robots.txt, favicon, /public/kavologo.png)
api/              Vercel serverless contact endpoint
netlify/          Netlify function equivalent
server/           Shared Resend email logic + validation
```

### Editing content

- **Services** — `src/data/services.ts`. Each entry generates `/services/<slug>` and appears in the mega menu.
- **Projects** — `src/data/projects.ts`. Each entry generates `/work/<slug>`. Project visuals are CSS-built mock interfaces themed by `visual`; pass real imagery into `<ProjectVisual>` (default slot) when available. Add `year` once confirmed.
- **Insights** — add a Markdown file to `src/content/insights/` with `title`, `description`, `date`, `category` (and optional `cover`, `coverInk`, `featured`).
- **Contact details & socials** — `src/data/site.ts`.

### Design system

Colour, type, spacing, radius and motion tokens live at the top of `src/styles/global.css`. Sections pick a colour block with `.theme-light | .theme-bone | .theme-dark | .theme-volt | .theme-cobalt | .theme-coral`, and set `data-theme="dark|light"` so the header adapts its colour while scrolling.

Motion respects `prefers-reduced-motion`; smooth scrolling is enabled only for mouse/trackpad users.

## Contact form

The form on `/contact` posts JSON to `/api/contact`:

- **Vercel** — handled by `api/contact.js` (verifies reCAPTCHA v3).
- **Netlify** — `netlify.toml` rewrites `/api/contact` to `netlify/functions/contact.js`.

Both use `server/contact-email.js` to validate and send emails via Resend. Environment variables:

- `RESEND_API_KEY` (required)
- `RECAPTCHA_SECRET_KEY` (Vercel endpoint)
- `CONTACT_FROM_EMAIL`, `CONTACT_ADMIN_EMAIL`, `PUBLIC_SITE_URL` (optional overrides)

## Deployment

Both `vercel.json` and `netlify.toml` run `npm run build` and publish `dist/`. Legacy `.html` URLs (`/services.html`, `/about.html`, `/contact.html`, `/pricing.html`) redirect to the new routes.
