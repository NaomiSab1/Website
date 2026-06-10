import { unstable_cache } from 'next/cache';
import { createAnonClient } from '@/lib/supabase/server';
import type { Page, Project, Section, SiteSettings } from '@/lib/types';

export const SETTINGS_TAG = 'site-settings';
export const PROJECTS_TAG = 'projects';
export const pageTag = (slug: string) => `page:${slug}`;

const DEFAULT_SETTINGS: SiteSettings = {
  nav: { links: [], cta: { label: 'Contact', href: '/contact' } },
  footer: { tagline: '', location: 'Brisbane, QLD', socials: [], legal: '' },
  theme: {
    colors: {},
    fonts: { display: 'Fraunces', body: 'Inter Tight' },
  },
  brand: { name: 'Sabdia Constructions', logo_url: null },
};

/** Published page + its published section snapshot, ISR-cached per slug. */
export function getPublishedPage(slug: string) {
  return unstable_cache(
    async (): Promise<(Page & { sections: Section[] }) | null> => {
      try {
        const supabase = createAnonClient();
        const { data } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        if (!data) return null;
        return { ...(data as Page), sections: (data.published_snapshot ?? []) as Section[] };
      } catch {
        return null; // unreachable DB (e.g. envless CI build) → 404 until revalidated
      }
    },
    [`published-page-${slug}`],
    { tags: [pageTag(slug)], revalidate: 3600 }
  )();
}

export function getPublishedSlugs() {
  return unstable_cache(
    async () => {
      try {
        const supabase = createAnonClient();
        const { data } = await supabase
          .from('pages')
          .select('slug, updated_at, show_in_nav, nav_order, title')
          .eq('status', 'published')
          .order('nav_order');
        return data ?? [];
      } catch {
        return [];
      }
    },
    ['published-slugs'],
    { tags: ['pages-index'], revalidate: 3600 }
  )();
}

export function getSiteSettings() {
  return unstable_cache(
    async (): Promise<SiteSettings> => {
      try {
        const supabase = createAnonClient();
        const { data } = await supabase
          .from('site_settings')
          .select('data')
          .eq('id', 'default')
          .maybeSingle();
        const stored = (data?.data ?? {}) as Partial<SiteSettings>;
        return {
          ...DEFAULT_SETTINGS,
          ...stored,
          theme: { ...DEFAULT_SETTINGS.theme, ...stored.theme },
        };
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    ['site-settings'],
    { tags: [SETTINGS_TAG], revalidate: 3600 }
  )();
}

export function getProjects(source: string, limit: number) {
  return unstable_cache(
    async (): Promise<Project[]> => {
      try {
        const supabase = createAnonClient();
        let q = supabase.from('projects').select('*').order('sort_order');
        if (source && source !== 'all') q = q.eq('status', source);
        if (limit > 0) q = q.limit(limit);
        const { data } = await q;
        return (data ?? []) as Project[];
      } catch {
        return [];
      }
    },
    [`projects-${source}-${limit}`],
    { tags: [PROJECTS_TAG], revalidate: 3600 }
  )();
}
