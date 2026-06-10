'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia, updateMediaAlt } from '@/app/admin/actions';
import { uploadImage } from './MediaPicker.client';
import type { MediaItem } from '@/lib/types';

export function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of files) await uploadImage(file);
      router.refresh();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="adm-toolbar">
        <label className="adm-btn adm-btn-primary adm-upload">
          {busy ? 'Uploading…' : '+ Upload images'}
          <input type="file" accept="image/*" multiple hidden onChange={onUpload} disabled={busy} />
        </label>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="media-grid media-grid-lg">
        {items.map((m) => (
          <div key={m.id} className="media-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt || ''} loading="lazy" />
            <input
              defaultValue={m.alt || ''}
              placeholder="Alt text…"
              onBlur={async (e) => {
                if (e.target.value !== (m.alt || '')) await updateMediaAlt(m.id, e.target.value);
              }}
            />
            <div className="media-card-meta">
              {m.width && m.height ? `${m.width}×${m.height}` : ''}
              <button
                className="adm-btn adm-btn-danger"
                onClick={async () => {
                  if (!confirm('Delete this image? Pages using it will show a broken image.')) return;
                  const res = await deleteMedia(m.id);
                  if (res.ok) setItems((prev) => prev.filter((x) => x.id !== m.id));
                  else setError(res.error);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="adm-empty">No images yet.</p>}
      </div>
    </div>
  );
}
