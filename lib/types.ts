export type Role = 'admin' | 'editor';
export type PageStatus = 'draft' | 'published';

export type BlockType =
  | 'hero'
  | 'gallery'
  | 'project_showcase'
  | 'text_image'
  | 'testimonials'
  | 'stats'
  | 'contact_form'
  | 'faq'
  | 'cta'
  | 'map'
  | 'video'
  | 'custom_html';

/** Per-section layout settings, shared by every block type. */
export interface SectionConfig {
  background?: 'default' | 'alt' | 'dark';
  spacing?: 'compact' | 'normal' | 'spacious' | 'none';
  align?: 'left' | 'center';
  columns?: number;
  container?: 'normal' | 'wide' | 'full';
  anchor?: string;
}

export interface Section {
  id: string;
  page_id: string;
  type: BlockType;
  sort_order: number;
  config: SectionConfig;
  content: Record<string, unknown>;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  show_in_nav: boolean;
  nav_order: number;
  published_snapshot: Section[] | null;
  published_at: string | null;
  updated_at: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  snapshot: { page: Partial<Page>; sections: Section[] };
  label: string | null;
  created_by: string | null;
  created_at: string;
}

export interface MediaItem {
  id: string;
  storage_path: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  created_at: string;
}

export type ProjectStatus = 'for_sale' | 'sold' | 'completed' | 'coming_soon';

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  status: ProjectStatus;
  description: string | null;
  specs: { beds?: number; baths?: number; garage?: number; land?: string };
  cover_image: string | null;
  gallery: { url: string; alt?: string }[];
  sort_order: number;
  updated_at: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  nav: { links: NavLink[]; cta: NavLink };
  footer: {
    tagline: string;
    location: string;
    socials: { label: string; href: string }[];
    legal: string;
  };
  theme: {
    colors: Record<string, string>;
    fonts: { display: string; body: string };
  };
  brand: { name: string; logo_url: string | null };
}

export interface Profile {
  id: string;
  email: string | null;
  role: Role;
  display_name: string | null;
}

export interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}
