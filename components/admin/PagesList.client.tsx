'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createPage, deletePage, exportContent } from '@/app/admin/actions';
import type { Page } from '@/lib/types';

export function PagesList({ pages, isAdmin }: { pages: Page[]; isAdmin: boolean }) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createPage({
        title: String(form.get('title')),
        slug: String(form.get('slug')),
        show_in_nav: form.get('show_in_nav') === 'on',
        nav_order: pages.length,
      });
      if (!res.ok) return setError(res.error);
      router.push(`/admin/pages/${res.data!.id}`);
    });
  }

  async function onExport() {
    const res = await exportContent();
    if (!res.ok) return setError(res.error);
    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sabdia-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="adm-toolbar">
        {isAdmin && (
          <button className="adm-btn adm-btn-primary" onClick={() => setShowNew(!showNew)}>
            + New page
          </button>
        )}
        <button className="adm-btn adm-btn-ghost" onClick={onExport}>
          Export all content (JSON)
        </button>
      </div>

      {showNew && (
        <form className="adm-card adm-newpage" onSubmit={onCreate}>
          <label>
            Title
            <input name="title" required placeholder="e.g. Our Story" />
          </label>
          <label>
            Slug (URL)
            <input name="slug" required placeholder="e.g. our-story" pattern="[a-z0-9-]+" />
          </label>
          <label className="adm-check">
            <input type="checkbox" name="show_in_nav" /> Show in navigation
          </label>
          <button className="adm-btn adm-btn-primary" disabled={pending} type="submit">
            Create page
          </button>
        </form>
      )}
      {error && <p className="adm-error">{error}</p>}

      <table className="adm-table">
        <thead>
          <tr>
            <th>Page</th>
            <th>URL</th>
            <th>Status</th>
            <th>Last edited</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>
                <Link className="adm-table-title" href={`/admin/pages/${p.id}`}>
                  {p.title}
                </Link>
              </td>
              <td className="adm-mono">/{p.slug === 'home' ? '' : p.slug}</td>
              <td>
                <span className={`adm-badge adm-badge-${p.status}`}>{p.status}</span>
              </td>
              <td>{p.updated_at ? new Date(p.updated_at).toLocaleString() : '—'}</td>
              <td className="adm-row-actions">
                <Link className="adm-btn adm-btn-ghost" href={`/admin/pages/${p.id}`}>
                  Edit
                </Link>
                {isAdmin && p.slug !== 'home' && (
                  <button
                    className="adm-btn adm-btn-danger"
                    onClick={() => {
                      if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                      startTransition(async () => {
                        const res = await deletePage(p.id);
                        if (!res.ok) setError(res.error);
                        router.refresh();
                      });
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
