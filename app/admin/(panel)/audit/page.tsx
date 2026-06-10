import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/auth';

export default async function AuditPage() {
  const profile = await getProfile();
  if (profile?.role !== 'admin') redirect('/admin');
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300);

  return (
    <div>
      <div className="adm-head">
        <h1>Activity</h1>
        <p className="adm-sub">Who changed what, and when.</p>
      </div>
      <table className="adm-table">
        <thead>
          <tr><th>When</th><th>Who</th><th>Action</th><th>What</th><th>Detail</th></tr>
        </thead>
        <tbody>
          {(entries ?? []).map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.created_at).toLocaleString()}</td>
              <td>{e.actor_email || '—'}</td>
              <td><span className="adm-badge adm-badge-draft">{e.action}</span></td>
              <td className="adm-mono">{e.entity}{e.entity_id ? ` · ${String(e.entity_id).slice(0, 8)}` : ''}</td>
              <td className="adm-mono adm-msg">{JSON.stringify(e.detail)}</td>
            </tr>
          ))}
          {(entries ?? []).length === 0 && (
            <tr><td colSpan={5} className="adm-empty">No activity recorded yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
