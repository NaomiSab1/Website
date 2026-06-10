'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile, requireAdmin, requireStaff } from '@/lib/auth';
import { PROJECTS_TAG, SETTINGS_TAG, pageTag } from '@/lib/queries';
import type { Page, Section, SectionConfig } from '@/lib/types';

type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

async function logAudit(action: string, entity: string, entityId: string | null, detail: Record<string, unknown> = {}) {
  const profile = await getProfile();
  const supabase = await createClient();
  await supabase.from('audit_log').insert({
    actor_id: profile?.id ?? null,
    actor_email: profile?.email ?? null,
    action,
    entity,
    entity_id: entityId,
    detail,
  });
}

function fail(e: unknown): { ok: false; error: string } {
  return { ok: false, error: e instanceof Error ? e.message : String(e) };
}

/* ─────────────────────────── auth ─────────────────────────── */

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/* ─────────────────────────── pages ─────────────────────────── */

export interface PageMetaInput {
  title: string;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
  show_in_nav?: boolean;
  nav_order?: number;
}

export async function createPage(meta: PageMetaInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const slug = meta.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug) return { ok: false, error: 'Slug is required' };
    const { data, error } = await supabase
      .from('pages')
      .insert({ ...meta, slug, status: 'draft' })
      .select('id')
      .single();
    if (error) throw error;
    await logAudit('create', 'page', data.id, { slug, title: meta.title });
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function updatePageMeta(pageId: string, meta: PageMetaInput): Promise<ActionResult> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const { error } = await supabase.from('pages').update(meta).eq('id', pageId);
    if (error) throw error;
    await logAudit('update_meta', 'page', pageId, { title: meta.title, slug: meta.slug });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePage(pageId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { data: page } = await supabase.from('pages').select('slug').eq('id', pageId).single();
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    if (error) throw error;
    await logAudit('delete', 'page', pageId, { slug: page?.slug });
    if (page) {
      revalidateTag(pageTag(page.slug));
      revalidateTag('pages-index');
    }
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export interface SectionInput {
  id?: string;
  type: string;
  sort_order: number;
  config: SectionConfig;
  content: Record<string, unknown>;
}

/** Replaces the page's working copy (draft) with the given sections. */
export async function saveSections(pageId: string, sections: SectionInput[]): Promise<ActionResult<{ sections: Section[] }>> {
  try {
    await requireStaff();
    const supabase = await createClient();

    const { error: delError } = await supabase.from('sections').delete().eq('page_id', pageId);
    if (delError) throw delError;

    const rows = sections.map((s, i) => ({
      page_id: pageId,
      type: s.type,
      sort_order: i,
      config: s.config ?? {},
      content: s.content ?? {},
    }));
    let saved: Section[] = [];
    if (rows.length > 0) {
      const { data, error } = await supabase.from('sections').insert(rows).select('*');
      if (error) throw error;
      saved = (data ?? []) as Section[];
    }
    await supabase.from('pages').update({ updated_at: new Date().toISOString() }).eq('id', pageId);
    await logAudit('save_draft', 'page', pageId, { section_count: rows.length });
    return { ok: true, data: { sections: saved.sort((a, b) => a.sort_order - b.sort_order) } };
  } catch (e) {
    return fail(e);
  }
}

/**
 * Publish: snapshot the working copy into pages.published_snapshot,
 * record a version for rollback, and revalidate the live page.
 */
export async function publishPage(pageId: string): Promise<ActionResult> {
  try {
    const profile = await requireStaff();
    const supabase = await createClient();

    const [{ data: page }, { data: sections }] = await Promise.all([
      supabase.from('pages').select('*').eq('id', pageId).single(),
      supabase.from('sections').select('*').eq('page_id', pageId).order('sort_order'),
    ]);
    if (!page) return { ok: false, error: 'Page not found' };

    const snapshot = {
      page: {
        title: page.title,
        slug: page.slug,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        og_image: page.og_image,
      },
      sections: sections ?? [],
    };

    const { error: verError } = await supabase.from('page_versions').insert({
      page_id: pageId,
      snapshot,
      label: `Published by ${profile.email ?? 'unknown'}`,
      created_by: profile.id,
    });
    if (verError) throw verError;

    const { error } = await supabase
      .from('pages')
      .update({
        status: 'published',
        published_snapshot: sections ?? [],
        published_at: new Date().toISOString(),
      })
      .eq('id', pageId);
    if (error) throw error;

    await logAudit('publish', 'page', pageId, { slug: page.slug });
    revalidateTag(pageTag(page.slug));
    revalidateTag('pages-index');
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function unpublishPage(pageId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { data: page } = await supabase.from('pages').select('slug').eq('id', pageId).single();
    const { error } = await supabase.from('pages').update({ status: 'draft' }).eq('id', pageId);
    if (error) throw error;
    await logAudit('unpublish', 'page', pageId, { slug: page?.slug });
    if (page) {
      revalidateTag(pageTag(page.slug));
      revalidateTag('pages-index');
    }
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Restore a version into both the working copy and the live site. */
export async function rollbackToVersion(pageId: string, versionId: string): Promise<ActionResult> {
  try {
    const profile = await requireStaff();
    const supabase = await createClient();

    const { data: version, error: vErr } = await supabase
      .from('page_versions')
      .select('*')
      .eq('id', versionId)
      .eq('page_id', pageId)
      .single();
    if (vErr || !version) return { ok: false, error: 'Version not found' };

    const snapSections = (version.snapshot?.sections ?? []) as Section[];
    const snapPage = (version.snapshot?.page ?? {}) as Partial<Page>;

    // Replace the working copy with the snapshot's sections.
    await supabase.from('sections').delete().eq('page_id', pageId);
    if (snapSections.length > 0) {
      const rows = snapSections.map((s, i) => ({
        page_id: pageId,
        type: s.type,
        sort_order: i,
        config: s.config ?? {},
        content: s.content ?? {},
      }));
      const { error } = await supabase.from('sections').insert(rows);
      if (error) throw error;
    }

    // Re-fetch with fresh ids so the published snapshot matches the working copy.
    const { data: restored } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .order('sort_order');

    const { data: page, error } = await supabase
      .from('pages')
      .update({
        title: snapPage.title,
        seo_title: snapPage.seo_title,
        seo_description: snapPage.seo_description,
        og_image: snapPage.og_image,
        status: 'published',
        published_snapshot: restored ?? [],
        published_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select('slug')
      .single();
    if (error) throw error;

    await supabase.from('page_versions').insert({
      page_id: pageId,
      snapshot: version.snapshot,
      label: `Rollback by ${profile.email ?? 'unknown'}`,
      created_by: profile.id,
    });

    await logAudit('rollback', 'page', pageId, { version_id: versionId });
    revalidateTag(pageTag(page.slug));
    revalidateTag('pages-index');
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ─────────────────────────── settings ─────────────────────────── */

export async function saveSiteSettings(data: Record<string, unknown>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'default', data, updated_at: new Date().toISOString() });
    if (error) throw error;
    await logAudit('update', 'site_settings', 'default');
    revalidateTag(SETTINGS_TAG);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ─────────────────────────── projects ─────────────────────────── */

export interface ProjectInput {
  id?: string;
  slug: string;
  name: string;
  location?: string | null;
  status: string;
  description?: string | null;
  specs?: Record<string, unknown>;
  cover_image?: string | null;
  gallery?: { url: string; alt?: string }[];
  sort_order?: number;
}

export async function upsertProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const row = { ...input, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('projects').upsert(row).select('id').single();
    if (error) throw error;
    await logAudit(input.id ? 'update' : 'create', 'project', data.id, { name: input.name });
    revalidateTag(PROJECTS_TAG);
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    await logAudit('delete', 'project', id);
    revalidateTag(PROJECTS_TAG);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ─────────────────────────── media ─────────────────────────── */

export async function registerMedia(input: {
  storage_path: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  size_bytes?: number;
}): Promise<ActionResult> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const { error } = await supabase.from('media').insert(input);
    if (error) throw error;
    await logAudit('upload', 'media', null, { path: input.storage_path });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const { error } = await supabase.from('media').update({ alt }).eq('id', id);
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const { data: item } = await supabase.from('media').select('storage_path').eq('id', id).single();
    if (item) await supabase.storage.from('media').remove([item.storage_path]);
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    await logAudit('delete', 'media', id, { path: item?.storage_path });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ─────────────────────────── export ─────────────────────────── */

/** Full-content JSON export (no vendor lock-in). */
export async function exportContent(): Promise<ActionResult<Record<string, unknown>>> {
  try {
    await requireStaff();
    const supabase = await createClient();
    const [pages, sections, projects, settings, media] = await Promise.all([
      supabase.from('pages').select('*'),
      supabase.from('sections').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('site_settings').select('*'),
      supabase.from('media').select('*'),
    ]);
    return {
      ok: true,
      data: {
        exported_at: new Date().toISOString(),
        pages: pages.data,
        sections: sections.data,
        projects: projects.data,
        site_settings: settings.data,
        media: media.data,
      },
    };
  } catch (e) {
    return fail(e);
  }
}
