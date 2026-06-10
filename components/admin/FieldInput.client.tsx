'use client';

import { useState } from 'react';
import type { FieldDef } from '@/lib/blocks/registry';
import { RichText } from './RichText.client';
import { MediaPicker } from './MediaPicker.client';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Renders one field from a block's schema and reports changes upward. */
export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const [picking, setPicking] = useState(false);

  switch (field.type) {
    case 'text':
      return (
        <label className="adm-field">
          <span>{field.label}</span>
          <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          {field.help && <small>{field.help}</small>}
        </label>
      );
    case 'textarea':
      return (
        <label className="adm-field">
          <span>{field.label}</span>
          <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          {field.help && <small>{field.help}</small>}
        </label>
      );
    case 'number':
      return (
        <label className="adm-field">
          <span>{field.label}</span>
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </label>
      );
    case 'toggle':
      return (
        <label className="adm-field adm-field-toggle">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>{field.label}</span>
        </label>
      );
    case 'select':
      return (
        <label className="adm-field">
          <span>{field.label}</span>
          <select value={value ?? field.options?.[0]?.value} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    case 'richtext':
      return (
        <div className="adm-field">
          <span>{field.label}</span>
          <RichText value={value ?? ''} onChange={onChange} />
        </div>
      );
    case 'link': {
      const link = value ?? { label: '', href: '' };
      return (
        <div className="adm-field">
          <span>{field.label}</span>
          <div className="adm-field-row">
            <input
              placeholder="Button text"
              value={link.label ?? ''}
              onChange={(e) => onChange({ ...link, label: e.target.value })}
            />
            <input
              placeholder="/page or https://…"
              value={link.href ?? ''}
              onChange={(e) => onChange({ ...link, href: e.target.value })}
            />
          </div>
        </div>
      );
    }
    case 'image':
      return (
        <div className="adm-field">
          <span>{field.label}</span>
          {value ? (
            <div className="adm-img-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" />
              <div className="adm-img-actions">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setPicking(true)}>
                  Replace
                </button>
                <button type="button" className="adm-btn adm-btn-danger" onClick={() => onChange('')}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setPicking(true)}>
              Choose image…
            </button>
          )}
          {picking && (
            <MediaPicker
              onSelect={(url) => {
                onChange(url);
                setPicking(false);
              }}
              onClose={() => setPicking(false)}
            />
          )}
        </div>
      );
    case 'repeater': {
      const items: any[] = Array.isArray(value) ? value : [];
      const blank = Object.fromEntries((field.fields ?? []).map((f) => [f.key, '']));
      return (
        <div className="adm-field adm-repeater">
          <span>{field.label}</span>
          {items.map((item, i) => (
            <div key={i} className="adm-repeater-row">
              <div className="adm-repeater-fields">
                {(field.fields ?? []).map((sub) => (
                  <FieldInput
                    key={sub.key}
                    field={sub}
                    value={item?.[sub.key]}
                    onChange={(v) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
              <div className="adm-repeater-actions">
                <button
                  type="button"
                  title="Move up"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...items];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={i === items.length - 1}
                  onClick={() => {
                    const next = [...items];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="adm-btn adm-btn-ghost"
            onClick={() => onChange([...items, { ...blank }])}
          >
            + Add item
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}
