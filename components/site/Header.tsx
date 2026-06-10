import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { MobileNav } from './MobileNav.client';

export function Header({ settings }: { settings: SiteSettings }) {
  const { nav, brand } = settings;
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={brand.name} className="brand-logo" />
          ) : (
            <span className="brand-name">{brand.name}</span>
          )}
        </Link>
        <nav className="site-nav" aria-label="Main">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          {nav.cta?.label ? (
            <Link href={nav.cta.href} className="btn btn-ghost nav-cta">
              {nav.cta.label}
            </Link>
          ) : null}
        </nav>
        <MobileNav links={nav.links} cta={nav.cta} />
      </div>
    </header>
  );
}
