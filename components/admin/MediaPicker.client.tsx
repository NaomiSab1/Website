'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { registerMedia } from '@/app/admin/actions';
import type { MediaItem } from '@/lib/types';

const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.85;

/** Downscale + re-encode client-side so originals never bloat storage. */
async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number; ext: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  if (scale === 1 && file.size < 400 * 1024) {
    return { blob: file, width, height, ext: file.name.split('.').pop() || 'jpg' };
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', JPEG_QUALITY)
  );
  return { blob, width, height, ext: 'jpg' };
}

export async function uploadImage(file: File, alt = ''): Promise<MediaItem> {
  const supabase = createClient();
  const { blob, width, height, ext } = await compressImage(file);
  const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 60);
  const path = `${Date.now()}-${safeName}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    cacheControl: '31536000',
  });
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  const url = data.publicUrl;
  const res = await registerMedia({ storage_path: path, url, alt, width, height, size_bytes: blob.size });
  if (!res.ok) throw new Error(res.error);
  return { id: '', storage_path: path, url, alt, width, height, size_bytes: blob.size, created_at: '' };
}

export function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string, alt: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setItems((data ?? []) as MediaItem[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const item = await uploadImage(file);
      onSelect(item.url, item.alt || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setBusy(false);
    }
  }

  return (
    <div className="adm-modal" role="dialog" aria-label="Choose image">
      <div className="adm-modal-box">
        <div className="adm-modal-head">
          <h2>Choose image</h2>
          <div>
            <label className="adm-btn adm-btn-primary adm-upload">
              {busy ? 'Uploading…' : 'Upload new'}
              <input type="file" accept="image/*" onChange={onUpload} disabled={busy} hidden />
            </label>
            <button className="adm-btn adm-btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
        {error && <p className="adm-error">{error}</p>}
        <div className="media-grid">
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              className="media-cell"
              onClick={() => onSelect(m.url, m.alt || '')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt || ''} loading="lazy" />
            </button>
          ))}
          {items.length === 0 && <p className="adm-empty">No images yet — upload one above.</p>}
        </div>
      </div>
    </div>
  );
}
