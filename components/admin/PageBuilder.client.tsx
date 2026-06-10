'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import {
  publishPage,
  rollbackToVersion,
  saveSections,
  updatePageMeta,
  type SectionInput,
} from '@/app/admin/actions';
import { BLOCKS, BLOCK_TYPES } from '@/lib/blocks/registry';
import type { BlockType, Page, PageVersion, Section, SectionConfig } from '@/lib/types';
import { FieldInput } from './FieldInput.client';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DraftSection {
  key: string; // stable local key (db ids change on save)
  type: BlockType;
  config: SectionConfig;
  content: Record<string, any>;
}

let keyCounter = 0;
const newKey = () => `s${Date.now()}-${keyCounter++}`;

const CONFIG_FIELDS = [
  {
    key: 'background',
    label: 'Background',
    options: [
      { value: 'default', label: 'Light' },
      { value: 'alt', label: 'Warm tint' },
      { value: 'dark', label: 'Dark' },
    ],
  },
  {
    key: 'spacing',
    label: 'Spacing',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'compact', label: 'Compact' },
      { value: 'spacious', label: 'Spacious' },
      { value: 'none', label: 'None' },
    ],
  },
  {
    key: 'align',
    label: 'Alignment',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Centred' },
    ],
  },
  {
    key: 'container',
    label: 'Width',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'wide', label: 'Wide' },
      { value: 'full', label: 'Full bleed' },
    ],
  },
] as const;

export function PageBuilder({
  page,
  initialSections,
  versions,
  isAdmin,
}: {
  page: Page;
  initialSections: Section[];
  versions: PageVersion[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [sections, setSections] = useState<DraftSection[]>(
    initialSections.map((s) => ({
      key: newKey(),
      type: s.type,
      config: s.config ?? {},
      content: s.content ?? {},
    }))
  );
  const [meta, setMeta] = useState({
    title: page.title,
    slug: page.slug,
    seo_title: page.seo_title ?? '',
    seo_description: page.seo_description ?? '',
    og_image: page.og_image ?? '',
    show_in_nav: page.show_in_nav,
    nav_order: page.nav_order,
  });
  const [selected, setSelected] = useState<string | null>(sections[0]?.key ?? null);
  const [panel, setPanel] = useState<'sections' | 'seo' | 'history'>('sections');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [preview, setPreview] = useState<null | 'desktop' | 'mobile'>(null);
  const [addOpen, setAddOpen] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const selectedSection = useMemo(
    () => sections.find((s) => s.key === selected) ?? null,
    [sections, selected]
  );

  function mutate(fn: (prev: DraftSection[]) => DraftSection[]) {
    setSections(fn);
    setDirty(true);
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function addSection(type: BlockType) {
    const def = BLOCKS[type];
    const sec: DraftSection = {
      key: newKey(),
      type,
      config: { background: 'default', spacing: 'normal' },
      content: JSON.parse(JSON.stringify(def.defaultContent)),
    };
    mutate((prev) => [...prev, sec]);
    setSelected(sec.key);
    setAddOpen(false);
  }

  function duplicateSection(key: string) {
    mutate((prev) => {
      const i = prev.findIndex((s) => s.key === key);
      if (i < 0) return prev;
      const copy = { ...JSON.parse(JSON.stringify(prev[i])), key: newKey() };
      return [...prev.slice(0, i + 1), copy, ...prev.slice(i + 1)];
    });
  }

  function removeSection(key: string) {
    mutate((prev) => prev.filter((s) => s.key !== key));
    if (selected === key) setSelected(null);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length) return;
    mutate((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function persistDraft(): Promise<boolean> {
    const inputs: SectionInput[] = sections.map((s, i) => ({
      type: s.type,
      sort_order: i,
      config: s.config,
      content: s.content,
    }));
    const [metaRes, secRes] = await Promise.all([
      updatePageMeta(page.id, {
        ...meta,
        seo_title: meta.seo_title || null,
        seo_description: meta.seo_description || null,
        og_image: meta.og_image || null,
      }),
      saveSections(page.id, inputs),
    ]);
    if (!metaRes.ok) {
      flash(`Save failed: ${metaRes.error}`);
      return false;
    }
    if (!secRes.ok) {
      flash(`Save failed: ${secRes.error}`);
      return false;
    }
    setDirty(false);
    return true;
  }

  async function onSave() {
    setBusy('save');
    if (await persistDraft()) flash('Draft saved');
    setBusy(null);
  }

  async function onPreview(mode: 'desktop' | 'mobile') {
    setBusy('preview');
    if (await persistDraft()) setPreview(mode);
    setBusy(null);
  }

  async function onPublish() {
    setBusy('publish');
    if (await persistDraft()) {
      const res = await publishPage(page.id);
      flash(res.ok ? 'Published — live site updated' : `Publish failed: ${res.error}`);
      if (res.ok) router.refresh();
    }
    setBusy(null);
  }

  async function onRollback(versionId: string) {
    if (!confirm('Restore this version? It will replace the current draft AND go live immediately.')) return;
    setBusy('rollback');
    const res = await rollbackToVersion(page.id, versionId);
    flash(res.ok ? 'Version restored and published' : `Rollback failed: ${res.error}`);
    setBusy(null);
    if (res.ok) {
      router.refresh();
      // Reload working copy from the server.
      window.location.reload();
    }
  }

  const availableBlocks = BLOCK_TYPES.filter((t) => isAdmin || !BLOCKS[t].adminOnly);

  return (
    <div className="builder">
      {/* ── Top bar ── */}
      <div className="builder-bar">
        <div className="builder-bar-l">
          <button className="adm-btn adm-btn-ghost" onClick={() => router.push('/admin')}>
            ← Pages
          </button>
          <h1>{meta.title}</h1>
          <span className={`adm-badge adm-badge-${page.status}`}>{page.status}</span>
          {dirty && <span className="adm-dirty">unsaved changes</span>}
        </div>
        <div className="builder-bar-r">
          <button className="adm-btn adm-btn-ghost" disabled={!!busy} onClick={() => onPreview('desktop')}>
            Preview
          </button>
          <button className="adm-btn adm-btn-ghost" disabled={!!busy} onClick={onSave}>
            {busy === 'save' ? 'Saving…' : 'Save draft'}
          </button>
          <button className="adm-btn adm-btn-primary" disabled={!!busy} onClick={onPublish}>
            {busy === 'publish' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}

      <div className="builder-body">
        {/* ── Left: section list ── */}
        <div className="builder-list">
          <div className="builder-tabs">
            <button className={panel === 'sections' ? 'on' : ''} onClick={() => setPanel('sections')}>
              Sections
            </button>
            <button className={panel === 'seo' ? 'on' : ''} onClick={() => setPanel('seo')}>
              Page & SEO
            </button>
            <button className={panel === 'history' ? 'on' : ''} onClick={() => setPanel('history')}>
              History
            </button>
          </div>

          {panel === 'sections' && (
            <>
              {sections.map((s, i) => (
                <div
                  key={s.key}
                  className={`sec-card ${selected === s.key ? 'on' : ''}`}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex.current !== null && dragIndex.current !== i) {
                      move(dragIndex.current, i);
                    }
                    dragIndex.current = null;
                  }}
                  onClick={() => setSelected(s.key)}
                >
                  <span className="sec-card-grip" title="Drag to reorder">⋮⋮</span>
                  <div className="sec-card-main">
                    <div className="sec-card-type">{BLOCKS[s.type]?.label ?? s.type}</div>
                    <div className="sec-card-sub">
                      {String(s.content.heading || s.content.eyebrow || '').slice(0, 48)}
                    </div>
                  </div>
                  <div className="sec-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
                    <button title="Move down" disabled={i === sections.length - 1} onClick={() => move(i, i + 1)}>↓</button>
                    <button title="Duplicate" onClick={() => duplicateSection(s.key)}>⧉</button>
                    <button title="Remove" onClick={() => removeSection(s.key)}>✕</button>
                  </div>
                </div>
              ))}

              <div className="sec-add">
                <button className="adm-btn adm-btn-primary" onClick={() => setAddOpen(!addOpen)}>
                  + Add section
                </button>
                {addOpen && (
                  <div className="sec-palette">
                    {availableBlocks.map((t) => (
                      <button key={t} onClick={() => addSection(t)}>
                        <strong>{BLOCKS[t].label}</strong>
                        <small>{BLOCKS[t].description}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {panel === 'seo' && (
            <div className="builder-seo">
              <label className="adm-field">
                <span>Page title</span>
                <input value={meta.title} onChange={(e) => { setMeta({ ...meta, title: e.target.value }); setDirty(true); }} />
              </label>
              <label className="adm-field">
                <span>URL slug</span>
                <input
                  value={meta.slug}
                  disabled={page.slug === 'home'}
                  onChange={(e) => { setMeta({ ...meta, slug: e.target.value }); setDirty(true); }}
                />
                {page.slug === 'home' && <small>The home page URL cannot change.</small>}
              </label>
              <label className="adm-field">
                <span>SEO title</span>
                <input value={meta.seo_title} onChange={(e) => { setMeta({ ...meta, seo_title: e.target.value }); setDirty(true); }} />
              </label>
              <label className="adm-field">
                <span>SEO description</span>
                <textarea rows={3} value={meta.seo_description} onChange={(e) => { setMeta({ ...meta, seo_description: e.target.value }); setDirty(true); }} />
              </label>
              <label className="adm-field">
                <span>Social share image URL</span>
                <input value={meta.og_image} onChange={(e) => { setMeta({ ...meta, og_image: e.target.value }); setDirty(true); }} />
              </label>
              <label className="adm-field adm-field-toggle">
                <input
                  type="checkbox"
                  checked={meta.show_in_nav}
                  onChange={(e) => { setMeta({ ...meta, show_in_nav: e.target.checked }); setDirty(true); }}
                />
                <span>Show in navigation</span>
              </label>
            </div>
          )}

          {panel === 'history' && (
            <div className="builder-history">
              {versions.length === 0 && <p className="adm-empty">No published versions yet.</p>}
              {versions.map((v) => (
                <div key={v.id} className="ver-row">
                  <div>
                    <div className="ver-label">{v.label || 'Version'}</div>
                    <div className="ver-date">{new Date(v.created_at).toLocaleString()}</div>
                  </div>
                  <button className="adm-btn adm-btn-ghost" disabled={!!busy} onClick={() => onRollback(v.id)}>
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: selected section editor ── */}
        <div className="builder-editor">
          {selectedSection ? (
            <SectionEditor
              key={selectedSection.key}
              section={selectedSection}
              onChange={(next) =>
                mutate((prev) => prev.map((s) => (s.key === selectedSection.key ? next : s)))
              }
            />
          ) : (
            <p className="adm-empty">Select a section on the left, or add a new one.</p>
          )}
        </div>
      </div>

      {/* ── Preview overlay ── */}
      {preview && (
        <div className="adm-modal">
          <div className="adm-modal-box adm-modal-preview">
            <div className="adm-modal-head">
              <h2>Preview — {meta.title}</h2>
              <div>
                <button
                  className={`adm-btn ${preview === 'desktop' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                  onClick={() => setPreview('desktop')}
                >
                  Desktop
                </button>
                <button
                  className={`adm-btn ${preview === 'mobile' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                  onClick={() => setPreview('mobile')}
                >
                  Mobile
                </button>
                <button className="adm-btn adm-btn-ghost" onClick={() => setPreview(null)}>
                  Close
                </button>
              </div>
            </div>
            <div className={`preview-frame preview-${preview}`}>
              <iframe src={`/preview/${page.id}`} title="Page preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionEditor({
  section,
  onChange,
}: {
  section: DraftSection;
  onChange: (s: DraftSection) => void;
}) {
  const def = BLOCKS[section.type];
  if (!def) return <p className="adm-empty">Unknown section type: {section.type}</p>;
  return (
    <div>
      <h2 className="editor-title">{def.label}</h2>

      <details className="editor-config" open={false}>
        <summary>Section layout (background, spacing…)</summary>
        <div className="editor-config-grid">
          {CONFIG_FIELDS.map((f) => (
            <label key={f.key} className="adm-field">
              <span>{f.label}</span>
              <select
                value={(section.config as any)[f.key] ?? f.options[0].value}
                onChange={(e) =>
                  onChange({ ...section, config: { ...section.config, [f.key]: e.target.value } })
                }
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {section.type === 'gallery' && (
            <label className="adm-field">
              <span>Columns</span>
              <select
                value={section.config.columns ?? 3}
                onChange={(e) =>
                  onChange({ ...section, config: { ...section.config, columns: Number(e.target.value) } })
                }
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          )}
          <label className="adm-field">
            <span>Anchor id (for #links)</span>
            <input
              value={section.config.anchor ?? ''}
              onChange={(e) =>
                onChange({ ...section, config: { ...section.config, anchor: e.target.value } })
              }
            />
          </label>
        </div>
      </details>

      {def.fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={section.content[field.key]}
          onChange={(v) => onChange({ ...section, content: { ...section.content, [field.key]: v } })}
        />
      ))}
    </div>
  );
}
