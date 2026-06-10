import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { PageBuilder } from '@/components/admin/PageBuilder.client';
import type { Page, PageVersion, Section } from '@/lib/types';

export default async function PageBuilderRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getProfile();

  const [{ data: page }, { data: sections }, { data: versions }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).maybeSingle(),
    supabase.from('sections').select('*').eq('page_id', id).order('sort_order'),
    supabase
      .from('page_versions')
      .select('id, page_id, label, created_at')
      .eq('page_id', id)
      .order('created_at', { ascending: false })
      .limit(25),
  ]);
  if (!page) notFound();

  return (
    <PageBuilder
      page={page as Page}
      initialSections={(sections ?? []) as Section[]}
      versions={(versions ?? []) as PageVersion[]}
      isAdmin={profile?.role === 'admin'}
    />
  );
}
