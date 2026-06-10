import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';
import { ProjectsManager } from '@/components/admin/ProjectsManager.client';
import type { Project } from '@/lib/types';

export default async function ProjectsAdminPage() {
  const supabase = await createClient();
  const profile = await getProfile();
  const { data } = await supabase.from('projects').select('*').order('sort_order');
  return (
    <div>
      <div className="adm-head">
        <h1>Projects</h1>
        <p className="adm-sub">
          Structured portfolio data — rendered on the site by “Project showcase” sections.
        </p>
      </div>
      <ProjectsManager initial={(data ?? []) as Project[]} isAdmin={profile?.role === 'admin'} />
    </div>
  );
}
