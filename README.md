# Sabdia Constructions — Website + Admin CMS

Self-serve website for [sabdiaconstructions.com.au](https://www.sabdiaconstructions.com.au):
a public site rendered from Supabase data, plus a block-based admin panel at `/admin`
(Shopify/Wix-style: choose sections, arrange them, edit content, preview, publish).

| Layer | Tech |
|---|---|
| Frontend + admin | Next.js 15 (App Router), deployed on Vercel |
| Database / auth / files | Supabase (Postgres + Auth + Storage) |
| Publishing | ISR with on-demand revalidation — publish is live in seconds, no redeploy |

The previous static site is preserved unchanged in [`legacy-static/`](legacy-static/).
A 1-page guide for non-technical editors is at [`docs/EDITOR-GUIDE.md`](docs/EDITOR-GUIDE.md).

---

## How it works

```
┌──────────── /admin (Supabase Auth, role-based) ────────────┐
│ pages ──► sections (working copy / DRAFT)                  │
│   Save draft   → writes sections                           │
│   Preview      → /preview/[id] renders the draft (iframe,  │
│                  desktop/mobile toggle)                    │
│   Publish      → snapshot sections → pages.published_      │
│                  snapshot + page_versions row + revalidate │
│   Restore      → version snapshot → draft + live           │
└────────────────────────────────────────────────────────────┘
              │ revalidateTag('page:slug')
              ▼
┌─────────── public site ────────────────────────────────────┐
│ "/" and "/[slug]" render pages.published_snapshot through  │
│ the block registry (hero, gallery, showcase, …), cached    │
│ with unstable_cache tags per page                          │
└─────────────────────────────────────────────────────────────┘
```

- **Draft vs live are separate**: editing never leaks to the public site until Publish.
- **Versions**: every Publish (and Restore) writes a `page_versions` snapshot; one-click
  rollback restores both the draft and the live page.
- **Audit**: every action (save, publish, rollback, uploads, settings) is logged to
  `audit_log` (Admin → Activity).
- **Roles**: `admin` = full control (create/delete pages, settings, custom HTML);
  `editor` = content only. Enforced in the UI, in server actions, **and in RLS**.
- **Blocks**: one registry (`lib/blocks/registry.ts`) drives both the admin editor forms
  and the public renderers (`components/blocks/`). Adding a block type = add a registry
  entry + a renderer component.

## Setup

### 1. Supabase

1. Create a project at [database.new](https://database.new).
2. Apply the schema (tables, RLS, triggers, storage bucket):
   ```bash
   npm i -g supabase
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push                  # applies supabase/migrations/
   ```
   (or paste `supabase/migrations/0001_init.sql` into the SQL editor).
3. Seed the real Sabdia content (pages, sections, projects, settings — published
   immediately): run `supabase/seed.sql` in the SQL editor, or
   `psql "$DATABASE_URL" -f supabase/seed.sql`.
4. Create your login: Dashboard → Authentication → Users → *Add user* (email +
   password, confirm email). New users default to the `editor` role; promote yourself:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@sabdia.com.au';
   ```

### 2. App

```bash
cp .env.example .env.local   # fill in the Supabase keys (Project Settings → API)
npm install
npm run dev                  # http://localhost:3000  /  http://localhost:3000/admin
```

### 3. Deploy (Vercel)

1. Import the repo into Vercel (framework auto-detected).
2. Add the env vars from `.env.example` (Production + Preview).
3. Deploy. Set `NEXT_PUBLIC_SITE_URL` to the production domain — it drives the
   sitemap, canonical URLs, and OG tags.

### 4. Lead forwarding (optional)

- `LEADS_WEBHOOK_URL` — every contact form submission is POSTed there as JSON
  (point it at a Monday.com webhook / Zapier / Make).
- `RESEND_API_KEY` + `LEADS_NOTIFY_EMAIL` — email notification per lead.
- Either way, all leads are stored in Supabase and visible at Admin → Leads.

## Acceptance test

1. Log in at `/admin`, open **Home**.
2. Change the hero headline; swap the hero image (Choose image → upload).
3. Drag the **Testimonials** section above the **Project showcase** section.
4. **Publish** → the live site shows all three changes within seconds
   (tag-based revalidation, no redeploy).
5. Open **History**, restore the previous version → the live site reverts.

## Data model

| Table | Purpose |
|---|---|
| `pages` | slug, title, status, SEO fields, `published_snapshot` (what the public sees) |
| `sections` | working copy: `type`, `sort_order`, `config` (layout), `content` (jsonb) |
| `page_versions` | full snapshots for one-click rollback |
| `projects` | structured portfolio (QASR, SOLACE, …, 94 Newman, Matong) |
| `media` | Storage-backed library with alt text + dimensions |
| `site_settings` | nav, footer, brand, theme tokens |
| `form_submissions` | contact form leads |
| `audit_log` | who changed what, when |
| `profiles` | role per auth user (`admin` / `editor`) |

RLS is enabled on every table; the service role key is used server-side only
(form inserts + external revalidation endpoint). Public/anon can read **published**
pages, projects, and settings — never drafts.

## SEO & performance

- Per-page meta/OG fields, `sitemap.xml`, `robots.txt`, LocalBusiness JSON-LD on home.
- `next/image` everywhere (responsive `srcset`, lazy loading); uploads are
  client-side compressed (max 2400px, ~85% quality) before hitting Storage.
- Public pages are static (ISR) — no Supabase call on the request path.

## No lock-in

Admin → Pages → **Export all content (JSON)** downloads every page, section, project,
setting and media record. `POST /api/revalidate` (with `REVALIDATE_SECRET`) lets any
external system bust the cache.

## v2 path (intentionally out of scope now)

- **Freeform canvas (Wix-style)**: the `config` jsonb on sections is the escape hatch —
  a v2 canvas can add absolute-positioning data per block without schema changes.
- **E-commerce**: keep Supabase as source of truth; add a `products` table and new
  block types in the registry.
- **Multi-language**: add a `locale` column to `pages` + `site_settings`
  (slug+locale unique); the renderer already resolves pages purely by slug.
