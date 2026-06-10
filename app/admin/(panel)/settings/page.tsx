import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getSiteSettings } from '@/lib/queries';
import { SettingsForm } from '@/components/admin/SettingsForm.client';

export default async function SettingsPage() {
  const profile = await getProfile();
  if (profile?.role !== 'admin') redirect('/admin');
  const settings = await getSiteSettings();
  return (
    <div>
      <div className="adm-head">
        <h1>Site settings</h1>
        <p className="adm-sub">Navigation, footer, and brand theme. Changes go live on save.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
