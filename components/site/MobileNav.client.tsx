'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { NavLink } from '@/lib/types';

export function MobileNav({ links, cta }: { links: NavLink[]; cta: NavLink }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <button
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      {open && (
        <nav className="mobile-nav-panel" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {cta?.label ? (
            <Link href={cta.href} className="btn btn-primary" onClick={() => setOpen(false)}>
              {cta.label}
            </Link>
          ) : null}
        </nav>
      )}
    </div>
  );
}
