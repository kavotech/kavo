KAVO — Local Preview

How to run locally:

1. Install dependencies:

```powershell
npm install
```

2. Create a local env file:

```powershell
Copy-Item .env.example .env
```

3. Start a static server (local port 5000):

```powershell
npm start
```

Then open http://localhost:5000 in your browser.

Contact form email setup:

- Set `RESEND_API_KEY` in `.env`.
- Optionally override `CONTACT_FROM_EMAIL`, `CONTACT_ADMIN_EMAIL`, and `PUBLIC_SITE_URL`.
- The frontend submits to `/api/contact`.
- On Vercel, this is handled by `api/contact.js`.
- On Netlify, `netlify.toml` rewrites `/api/contact` to the Netlify function.

Files of interest:
- `index.html` — main page
- `css/styles.css` — styles
- `js/main.js` — interactions
- `api/contact.js` — Vercel contact endpoint
- `netlify/functions/contact.js` — Netlify contact endpoint
- `server/contact-email.js` — shared Resend email logic

Client reviews (no database):

- Clients open a plain link, `/review.html?t=<code>`. Each code works once; the repo only stores the code's SHA-256 hash in `data/review-invites.json`.
- Reviews are saved to `data/reviews.json` via the GitHub API, Vercel redeploys, and they show on the home and projects pages.
- Only one Vercel env var is needed: `GITHUB_TOKEN` (fine-grained token, Contents: read & write, limited to this repo). Optional: `GITHUB_REPO` (default `kavotech/kavo`), `GITHUB_BRANCH` (default `master`).
- New links: generate a code with `newCode()`/`inviteFor()` from `server/reviews-core.js` and add the invite to `data/review-invites.json`.
- Remove a review: delete its entry in `data/reviews.json` and commit.
