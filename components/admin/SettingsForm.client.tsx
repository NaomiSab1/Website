'use client';

import { useState } from 'react';
import { saveSiteSettings } from '@/app/admin/actions';
import type { SiteSettings } from '@/lib/types';
import { FieldInput } from './FieldInput.client';

const THEME_COLORS: { key: string; label: string }[] = [
  { key: 'ink', label: 'Text' },
  { key: 'paper', label: 'Background' },
  { key: 'paper-alt', label: 'Background (tint)' },
  { key: 'dark', label: 'Dark sections' },
  { key: 'accent', label: 'Accent' },
  { key: 'taupe', label: 'Muted text' },
];

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave() {
    setBusy(true);
    setMsg(null);
    const res = await saveSiteSettings(s as unknown as Record<string, unknown>);
    setBusy(false);
    setMsg(res.ok ? 'Saved — live site updated' : `Save failed: ${res.error}`);
  }

  return (
    <div className="settings-form">
      <div className="adm-card">
        <h2>Brand</h2>
        <label className="adm-field">
          <span>Site name</span>
          <input value={s.brand.name} onChange={(e) => setS({ ...s, brand: { ...s.brand, name: e.target.value } })} />
        </label>
        <FieldInput
          field={{ key: 'logo', label: 'Logo (optional — name is shown if empty)', type: 'image' }}
          value={s.brand.logo_url ?? ''}
          onChange={(v) => setS({ ...s, brand: { ...s.brand, logo_url: v || null } })}
        />
      </div>

      <div className="adm-card">
        <h2>Navigation</h2>
        <FieldInput
          field={{
            key: 'links',
            label: 'Menu links',
            type: 'repeater',
            fields: [
              { key: 'label', label: 'Label', type: 'text' },
              { key: 'href', label: 'URL (e.g. /about)', type: 'text' },
            ],
          }}
          value={s.nav.links}
          onChange={(v) => setS({ ...s, nav: { ...s.nav, links: v } })}
        />
        <FieldInput
          field={{ key: 'cta', label: 'Header button', type: 'link' }}
          value={s.nav.cta}
          onChange={(v) => setS({ ...s, nav: { ...s.nav, cta: v } })}
        />
      </div>

      <div className="adm-card">
        <h2>Footer</h2>
        <label className="adm-field">
          <span>Tagline</span>
          <textarea rows={2} value={s.footer.tagline} onChange={(e) => setS({ ...s, footer: { ...s.footer, tagline: e.target.value } })} />
        </label>
        <label className="adm-field">
          <span>Location line</span>
          <input value={s.footer.location} onChange={(e) => setS({ ...s, footer: { ...s.footer, location: e.target.value } })} />
        </label>
        <FieldInput
          field={{
            key: 'socials',
            label: 'Social links',
            type: 'repeater',
            fields: [
              { key: 'label', label: 'Label', type: 'text' },
              { key: 'href', label: 'URL', type: 'text' },
            ],
          }}
          value={s.footer.socials}
          onChange={(v) => setS({ ...s, footer: { ...s.footer, socials: v } })}
        />
        <label className="adm-field">
          <span>Legal line (blank = auto copyright)</span>
          <input value={s.footer.legal} onChange={(e) => setS({ ...s, footer: { ...s.footer, legal: e.target.value } })} />
        </label>
      </div>

      <div className="adm-card">
        <h2>Theme</h2>
        <div className="adm-grid-2">
          {THEME_COLORS.map((c) => (
            <label key={c.key} className="adm-field adm-field-color">
              <span>{c.label}</span>
              <input
                type="color"
                value={s.theme.colors[c.key] ?? '#000000'}
                onChange={(e) => setS({ ...s, theme: { ...s.theme, colors: { ...s.theme.colors, [c.key]: e.target.value } } })}
              />
            </label>
          ))}
          <label className="adm-field">
            <span>Display font (Google Fonts name)</span>
            <input value={s.theme.fonts.display} onChange={(e) => setS({ ...s, theme: { ...s.theme, fonts: { ...s.theme.fonts, display: e.target.value } } })} />
          </label>
          <label className="adm-field">
            <span>Body font (Google Fonts name)</span>
            <input value={s.theme.fonts.body} onChange={(e) => setS({ ...s, theme: { ...s.theme, fonts: { ...s.theme.fonts, body: e.target.value } } })} />
          </label>
        </div>
      </div>

      {msg && <p className={msg.startsWith('Saved') ? 'adm-success' : 'adm-error'}>{msg}</p>}
      <button className="adm-btn adm-btn-primary" disabled={busy} onClick={onSave}>
        {busy ? 'Saving…' : 'Save & publish settings'}
      </button>
    </div>
  );
}
