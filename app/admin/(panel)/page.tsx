import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { PagesList } from '@/components/admin/PagesList.client';
import type { Page } from '@/lib/types';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const profile = await getProfile();
  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, title, status, show_in_nav, nav_order, published_at, updated_at')
    .order('nav_order');

  return (
    <div>
      <div className="adm-head">
        <h1>Pages</h1>
        <p className="adm-sub">Click a page to edit its content and layout.</p>
      </div>
      <PagesList pages={(pages ?? []) as Page[]} isAdmin={profile?.role === 'admin'} />
    </div>
  );
}
