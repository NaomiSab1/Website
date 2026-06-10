'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProject, upsertProject, type ProjectInput } from '@/app/admin/actions';
import type { Project } from '@/lib/types';
import { FieldInput } from './FieldInput.client';

const STATUSES = [
  { value: 'for_sale', label: 'For sale' },
  { value: 'sold', label: 'Sold' },
  { value: 'completed', label: 'Completed' },
  { value: 'coming_soon', label: 'Coming soon' },
];

const BLANK: ProjectInput = {
  slug: '',
  name: '',
  location: '',
  status: 'for_sale',
  description: '',
  specs: {},
  cover_image: '',
  gallery: [],
  sort_order: 99,
};

export function ProjectsManager({ initial, isAdmin }: { initial: Project[]; isAdmin: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProjectInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    if (!editing) return;
    if (!editing.name || !editing.slug) return setError('Name and slug are required');
    setBusy(true);
    setError(null);
    const res = await upsertProject({
      ...editing,
      slug: editing.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setEditing(null);
    router.refresh();
  }

  if (editing) {
    const specs = (editing.specs ?? {}) as Record<string, unknown>;
    return (
      <div className="adm-card project-editor">
        <h2>{editing.id ? `Edit ${editing.name}` : 'New project'}</h2>
        <div className="adm-grid-2">
          <label className="adm-field">
            <span>Name</span>
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </label>
          <label className="adm-field">
            <span>Slug</span>
            <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </label>
          <label className="adm-field">
            <span>Location</span>
            <input value={editing.location ?? ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          </label>
          <label className="adm-field">
            <span>Status</span>
            <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="adm-field">
            <span>Beds</span>
            <input type="number" value={Number(specs.beds ?? 0)} onChange={(e) => setEditing({ ...editing, specs: { ...specs, beds: Number(e.target.value) } })} />
          </label>
          <label className="adm-field">
            <span>Baths</span>
            <input type="number" value={Number(specs.baths ?? 0)} onChange={(e) => setEditing({ ...editing, specs: { ...specs, baths: Number(e.target.value) } })} />
          </label>
          <label className="adm-field">
            <span>Garage</span>
            <input type="number" value={Number(specs.garage ?? 0)} onChange={(e) => setEditing({ ...editing, specs: { ...specs, garage: Number(e.target.value) } })} />
          </label>
          <label className="adm-field">
            <span>Land / size (e.g. 632m²)</span>
            <input value={String(specs.land ?? '')} onChange={(e) => setEditing({ ...editing, specs: { ...specs, land: e.target.value } })} />
          </label>
          <label className="adm-field">
            <span>Display order</span>
            <input type="number" value={editing.sort_order ?? 99} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
          </label>
        </div>
        <label className="adm-field">
          <span>Description</span>
          <textarea rows={4} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
        </label>
        <FieldInput
          field={{ key: 'cover_image', label: 'Cover image', type: 'image' }}
          value={editing.cover_image}
          onChange={(v) => setEditing({ ...editing, cover_image: v })}
        />
        <FieldInput
          field={{
            key: 'gallery',
            label: 'Gallery',
            type: 'repeater',
            fields: [
              { key: 'url', label: 'Image', type: 'image' },
              { key: 'alt', label: 'Alt text', type: 'text' },
            ],
          }}
          value={editing.gallery}
          onChange={(v) => setEditing({ ...editing, gallery: v })}
        />
        {error && <p className="adm-error">{error}</p>}
        <div className="adm-toolbar">
          <button className="adm-btn adm-btn-primary" disabled={busy} onClick={onSave}>
            {busy ? 'Saving…' : 'Save project'}
          </button>
          <button className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="adm-toolbar">
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing({ ...BLANK })}>
          + New project
        </button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <table className="adm-table">
        <thead>
          <tr><th>Project</th><th>Location</th><th>Status</th><th>Order</th><th /></tr>
        </thead>
        <tbody>
          {initial.map((p) => (
            <tr key={p.id}>
              <td className="adm-table-title">{p.name}</td>
              <td>{p.location}</td>
              <td><span className={`adm-badge adm-badge-${p.status}`}>{p.status.replace('_', ' ')}</span></td>
              <td>{p.sort_order}</td>
              <td className="adm-row-actions">
                <button className="adm-btn adm-btn-ghost" onClick={() => setEditing({ ...p })}>
                  Edit
                </button>
                {isAdmin && (
                  <button
                    className="adm-btn adm-btn-danger"
                    onClick={async () => {
                      if (!confirm(`Delete ${p.name}?`)) return;
                      const res = await deleteProject(p.id);
                      if (!res.ok) setError(res.error);
                      router.refresh();
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
