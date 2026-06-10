import { createClient } from '@/lib/supabase/server';

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="adm-head">
        <h1>Leads</h1>
        <p className="adm-sub">Contact form submissions (also forwarded to email / Monday.com when configured).</p>
      </div>
      <table className="adm-table">
        <thead>
          <tr><th>Received</th><th>Name</th><th>Email</th><th>Phone</th><th>Interest</th><th>Message</th></tr>
        </thead>
        <tbody>
          {(leads ?? []).map((l) => (
            <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString()}</td>
              <td className="adm-table-title">{l.first_name} {l.last_name}</td>
              <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
              <td>{l.phone || '—'}</td>
              <td>{l.interest || '—'}</td>
              <td className="adm-msg">{l.message}</td>
            </tr>
          ))}
          {(leads ?? []).length === 0 && (
            <tr><td colSpan={6} className="adm-empty">No submissions yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
