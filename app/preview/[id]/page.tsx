import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/queries';
import type { Section } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Draft preview — renders the WORKING copy (sections table), not the
 * published snapshot. Auth required (gated by middleware + RLS).
 */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: page }, { data: sections }, settings] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).maybeSingle(),
    supabase.from('sections').select('*').eq('page_id', id).order('sort_order'),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  const theme = settings.theme;
  const vars = Object.entries(theme.colors ?? {})
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ');
  return (
    <div className="site">
      <style>{`:root { ${vars} --font-display: '${theme.fonts.display}', serif; --font-body: '${theme.fonts.body}', sans-serif; }`}</style>
      <div className="preview-banner">Draft preview — unsaved on the live site</div>
      <Header settings={settings} />
      <main>
        <BlockRenderer sections={(sections ?? []) as Section[]} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
