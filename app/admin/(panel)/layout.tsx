import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { signOut } from '@/app/admin/actions';
import '../admin.css';

export const metadata = { title: 'Sabdia Admin', robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect('/admin/login');

  const nav = [
    { href: '/admin', label: 'Pages' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/media', label: 'Media' },
    { href: '/admin/leads', label: 'Leads' },
    ...(profile.role === 'admin'
      ? [
          { href: '/admin/settings', label: 'Site settings' },
          { href: '/admin/audit', label: 'Activity' },
        ]
      : []),
  ];

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">
          SABDIA<span>CMS</span>
        </div>
        <nav className="adm-nav">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="adm-nav-ext">
            View live site ↗
          </a>
        </nav>
        <div className="adm-user">
          <div className="adm-user-email">{profile.email}</div>
          <div className="adm-user-role">{profile.role}</div>
          <form action={signOut}>
            <button className="adm-btn adm-btn-ghost" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
