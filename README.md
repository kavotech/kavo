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

- Clients leave reviews at `/review.html?t=<one-time token>`; reviews are saved to `data/reviews.json` in this repo via the GitHub API, then Vercel redeploys and they show on the site.
- Vercel environment variables (Production + Preview): `REVIEW_SECRET` (long random string, signs links), `REVIEW_ADMIN_KEY` (used to create links), `GITHUB_TOKEN` (fine-grained token, Contents: read & write on this repo only). Optional: `GITHUB_REPO` (default `kavotech/kavo`), `GITHUB_BRANCH` (default `master`), `PUBLIC_SITE_URL`.
- Create a link: `https://kavotech.uk/api/review-link?key=<REVIEW_ADMIN_KEY>&client=Company%20Name`
- Remove a review: delete its entry in `data/reviews.json` and commit.
