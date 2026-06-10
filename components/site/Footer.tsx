import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export function Footer({ settings }: { settings: SiteSettings }) {
  const { footer, brand } = settings;
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <div className="footer-brand">{brand.name}</div>
          {footer.tagline ? <p className="footer-tagline">{footer.tagline}</p> : null}
          {footer.location ? <p className="footer-location">{footer.location}</p> : null}
        </div>
        <div className="footer-socials">
          {footer.socials.map((s) => (
            <Link key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="container footer-legal">
        {footer.legal || `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}
      </div>
    </footer>
  );
}
