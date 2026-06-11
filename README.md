# Sabdia Constructions — Website

Marketing site for Sabdia Constructions, built with [Astro](https://astro.build).
The site is statically generated for speed and SEO, but content is fully
data-driven: properties live in a content collection and can be edited through
a CMS without touching any HTML.

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
netlify.toml            # build settings + redirects from old .html URLs
```

## Editing properties

Each property is a markdown file in `src/content/properties/` with frontmatter
(name, suburb, status, beds/baths/cars, land size, images, features, …) and the
description as the body. Adding a file adds the property **everywhere** —
the listing page, the home page grid, the projects page, the footer, the
contact form's enquiry options — and generates its detail page at
`/properties/<slug>/`.

Set `status: sold` to move a property into the "Sold Prior to Completion"
sections and switch its detail page to the sold layout.

### CMS (Decap)

`/admin/` hosts Decap CMS configured against `src/content/properties`.
To activate it on Netlify:

1. Enable **Identity** in the Netlify site settings (invite-only registration).
2. Enable **Git Gateway** under Identity → Services.
3. Invite editors via Identity; they log in at `/admin/`.

Every CMS save commits to the repo, which triggers a rebuild and deploy.

## Forms

All forms (contact, property enquiry, agent application) post to
[Netlify Forms](https://docs.netlify.com/forms/setup/) — no backend required.
Submissions appear in the Netlify dashboard under Forms, where email
notifications can be configured. Forms submit via AJAX from `public/js/main.js`.

## Hosting

Deploy on Netlify: connect the repo, and `netlify.toml` supplies the build
command (`npm run build`) and publish directory (`dist`). It also contains
301 redirects from the old `*.html` URLs to the new clean URLs.
