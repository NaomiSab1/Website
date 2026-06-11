# Sabdia Constructions — Website

Marketing site for Sabdia Constructions, built with [Astro](https://astro.build)
and deployed on [Vercel](https://vercel.com). The site is statically generated
for speed and SEO, but content is fully data-driven: properties live in a
content collection and can be edited through a CMS without touching any HTML.

## Development

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  content/properties/   # one markdown file per property (the CMS edits these)
  content.config.ts     # property schema (validated at build time)
  layouts/Base.astro    # shared <head>, nav, footer
  components/           # Nav, Footer, PropertyCard, SoldCard
  pages/                # one .astro file per page
  pages/properties/     # listing page + [slug].astro template per property
  lib/wix.js            # Wix image-resize helper + small utils
public/
  css/, js/             # styles and client-side JS, served as-is
  admin/                # Decap CMS (content editor UI at /admin/)
api/
  contact.js            # form submissions → email via Resend
  auth.js, callback.js  # GitHub OAuth for the CMS login
vercel.json             # trailing slashes + redirects from old .html URLs
```

## Deploying on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project** and import
   the `NaomiSab1/Website` GitHub repository.
2. Vercel auto-detects Astro — no build settings needed. Click **Deploy**.
3. Every push to `main` deploys to production; every branch/PR gets its own
   preview URL automatically.
4. Add your custom domain (e.g. `www.sabdiaconstructions.com.au`) under
   **Settings → Domains**.

### Environment variables (Settings → Environment Variables)

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) — powers the contact/enquiry forms |
| `CONTACT_EMAIL` | Address that receives form submissions |
| `CONTACT_FROM` | Optional verified sender, e.g. `Sabdia Website <noreply@sabdiaconstructions.com.au>` |
| `OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth App client ID — powers the CMS login |
| `OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |

## Editing properties

Each property is a markdown file in `src/content/properties/` with frontmatter
(name, suburb, status, beds/baths/cars, land size, images, features, …) and the
description as the body. Adding a file adds the property **everywhere** —
the listing page, the home page grid, the projects page, the footer, the
contact form's enquiry options — and generates its detail page at
`/properties/<slug>/`.

Set `status: sold` to move a property into the "Sold Prior to Completion"
sections and switch its detail page to the sold layout.

### CMS (Decap) setup

`/admin/` hosts Decap CMS configured against `src/content/properties`.
Saving in the CMS commits to GitHub, which triggers a Vercel redeploy.

One-time setup:

1. Create a **GitHub OAuth App** (GitHub → Settings → Developer settings →
   OAuth Apps → New):
   - Homepage URL: your site URL
   - Authorization callback URL: `https://<your-domain>/api/callback`
2. Put the client ID/secret in the Vercel env vars above and redeploy.
3. Make sure `base_url` in `public/admin/config.yml` matches your deployed
   site URL.

Editors log in at `/admin/` with their GitHub account; they need write access
to this repository.

## Forms

All forms (contact, property enquiry, agent application) post to
`/api/contact`, a Vercel serverless function that emails submissions via
[Resend](https://resend.com) (free tier is plenty for a contact form).
A honeypot field filters out basic spam bots. Until `RESEND_API_KEY` and
`CONTACT_EMAIL` are configured, submissions return an error.
