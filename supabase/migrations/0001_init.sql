-- ═══════════════════════════════════════════════════════════════════════
-- Sabdia Constructions CMS — initial schema, RLS, and storage
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Profiles & roles ──────────────────────────────────────────────────
-- Every auth user gets a profile. role: 'admin' (full control) or
-- 'editor' (content only). New signups default to editor; promote via
-- SQL or the Supabase dashboard.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers. SECURITY DEFINER so policies on other tables can read
-- profiles without recursive RLS evaluation.
create or replace function public.current_app_role()
returns text
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.current_app_role() in ('admin', 'editor'), false)
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

-- ── Pages & sections ──────────────────────────────────────────────────
-- sections = the WORKING COPY (draft). pages.published_snapshot = what
-- the public site renders. Publishing copies sections → snapshot.

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  og_image text,
  show_in_nav boolean not null default false,
  nav_order int not null default 0,
  published_snapshot jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  sort_order int not null default 0,
  config jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sections_page_idx on public.sections (page_id, sort_order);

create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  snapshot jsonb not null,
  label text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index page_versions_page_idx on public.page_versions (page_id, created_at desc);

-- ── Media ─────────────────────────────────────────────────────────────

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  url text not null,
  alt text,
  width int,
  height int,
  size_bytes int,
  created_at timestamptz not null default now()
);

-- ── Projects (structured portfolio) ───────────────────────────────────

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  location text,
  status text not null default 'for_sale'
    check (status in ('for_sale', 'sold', 'completed', 'coming_soon')),
  description text,
  specs jsonb not null default '{}'::jsonb,
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Site settings (nav, footer, theme tokens) ─────────────────────────

create table public.site_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Leads & audit ─────────────────────────────────────────────────────

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  interest text,
  message text not null,
  source_path text,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_created_idx on public.audit_log (created_at desc);

-- ── updated_at maintenance ────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_touch before update on public.pages
  for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- ═══════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.sections enable row level security;
alter table public.page_versions enable row level security;
alter table public.media enable row level security;
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.form_submissions enable row level security;
alter table public.audit_log enable row level security;

-- profiles: read own; admins read all; admins manage roles
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles: admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- pages: public sees published; staff see all; editors update; admins create/delete
create policy "pages: public read published" on public.pages
  for select using (status = 'published' or public.is_staff());
create policy "pages: staff update" on public.pages
  for update using (public.is_staff()) with check (public.is_staff());
create policy "pages: admin insert" on public.pages
  for insert with check (public.is_admin());
create policy "pages: admin delete" on public.pages
  for delete using (public.is_admin());

-- sections (working copy): staff only — the public reads the snapshot
create policy "sections: staff all" on public.sections
  for all using (public.is_staff()) with check (public.is_staff());

-- versions: staff read/insert; admin delete
create policy "versions: staff read" on public.page_versions
  for select using (public.is_staff());
create policy "versions: staff insert" on public.page_versions
  for insert with check (public.is_staff());
create policy "versions: admin delete" on public.page_versions
  for delete using (public.is_admin());

-- media: public read (URLs are public regardless); staff manage
create policy "media: public read" on public.media
  for select using (true);
create policy "media: staff insert" on public.media
  for insert with check (public.is_staff());
create policy "media: staff update" on public.media
  for update using (public.is_staff()) with check (public.is_staff());
create policy "media: staff delete" on public.media
  for delete using (public.is_staff());

-- projects: public read; staff write; admin delete
create policy "projects: public read" on public.projects
  for select using (true);
create policy "projects: staff insert" on public.projects
  for insert with check (public.is_staff());
create policy "projects: staff update" on public.projects
  for update using (public.is_staff()) with check (public.is_staff());
create policy "projects: admin delete" on public.projects
  for delete using (public.is_admin());

-- site_settings: public read; admin write
create policy "settings: public read" on public.site_settings
  for select using (true);
create policy "settings: admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- form_submissions: inserted via service role only (bypasses RLS);
-- staff may read in the admin panel
create policy "leads: staff read" on public.form_submissions
  for select using (public.is_staff());

-- audit_log: staff write, admin read
create policy "audit: staff insert" on public.audit_log
  for insert with check (public.is_staff());
create policy "audit: admin read" on public.audit_log
  for select using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════════
-- Storage: public 'media' bucket, staff-managed
-- ═══════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket: public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media bucket: staff upload" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());
create policy "media bucket: staff update" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());
create policy "media bucket: staff delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());
