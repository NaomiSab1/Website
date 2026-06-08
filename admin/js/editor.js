/* ============================================================
   SABDIA CMS — VISUAL PAGE EDITOR
   ============================================================ */
(function () {
  const params = new URLSearchParams(location.search);
  const pageId = params.get('page');

  // ---------- session/page lookup ----------
  if (!CMS.requireAuth()) return;
  let data = CMS.load();
  let page = data.pages.find(p => p.id === pageId);
  if (!page) {
    document.body.innerHTML = '<div style="padding:40px;text-align:center"><h2>Page not found</h2><p><a href="pages.html">Back to pages</a></p></div>';
    return;
  }

  // Working copy = draft if present, otherwise published
  let working = page.draftSections ? JSON.parse(JSON.stringify(page.draftSections)) : JSON.parse(JSON.stringify(page.sections));
  let workingMeta = {
    title: page.title,
    slug: page.slug,
    layout: page.layout,
    seo: JSON.parse(JSON.stringify(page.seo))
  };
  let activeSecId = working[0] && working[0].id;
  let canEdit = CMS.can('pages.edit');
  let canPublish = CMS.can('pages.publish');

  // ---------- shell ----------
  const saveBtn    = AdminShell.button('Save Draft', { onClick: saveDraft });
  const publishBtn = AdminShell.button('Publish', { primary: true, onClick: publishChanges });
  const previewBtn = AdminShell.button('Preview', { onClick: openPreview });
  if (!canEdit) { saveBtn.style.display = 'none'; }
  if (!canPublish) { publishBtn.style.display = 'none'; }

  const content = AdminShell.mount('pages', {
    title: page.title,
    crumbs: ['Admin', 'Pages', page.title],
    actions: [previewBtn, saveBtn, publishBtn]
  });
  if (!content) return;

  if (!canEdit) {
    const warn = CMS.el('<div class="permission-warning">You have read-only access. Sign in as an Admin or Editor to make changes.</div>');
    content.appendChild(warn);
  }

  // ---------- main layout ----------
  content.appendChild(CMS.el(`
    <div class="editor-layout">
      <div class="editor-sections" id="secList"></div>
      <div class="editor-canvas">
        <div class="canvas-tabs">
          <button class="canvas-tab active" data-tab="content">Content</button>
          <button class="canvas-tab" data-tab="layout">Layout</button>
          <button class="canvas-tab" data-tab="seo">SEO</button>
          <button class="canvas-tab" data-tab="settings">Settings</button>
        </div>
        <div class="canvas-body" id="canvasBody"></div>
      </div>
      <div class="editor-right" id="rightPanel"></div>
    </div>
  `));

  let activeTab = 'content';
  document.querySelectorAll('.canvas-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.canvas-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      activeTab = t.dataset.tab;
      renderCanvas();
    });
  });

  renderSectionList();
  renderCanvas();
  renderRightPanel();

  // ============================================================
  //  SECTION LIST (left rail)
  // ============================================================
  function renderSectionList() {
    const list = document.getElementById('secList');
    list.innerHTML = '<h3>Sections</h3>';

    working.forEach((s, idx) => {
      const item = CMS.el(`
        <div class="sec-item ${s.id === activeSecId ? 'active' : ''} ${s.visible ? '' : 'sec-hidden'}" draggable="${canEdit ? 'true' : 'false'}" data-id="${s.id}" data-idx="${idx}">
          <span class="sec-handle">⋮⋮</span>
          <div class="sec-name">
            ${CMS.escape(s.name)}
            <div class="sec-type">${CMS.escape(s.type)}</div>
          </div>
          <div class="sec-actions">
            <button title="${s.visible ? 'Hide' : 'Show'}" data-act="toggle">${s.visible ? '👁' : '⊘'}</button>
            <button title="Duplicate" data-act="dup">⎘</button>
            <button title="Delete" data-act="del">✕</button>
          </div>
        </div>
      `);
      item.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        activeSecId = s.id;
        renderSectionList(); renderCanvas();
      });
      item.querySelector('[data-act="toggle"]').addEventListener('click', () => {
        if (!canEdit) return CMS.toast('Read only', 'err');
        s.visible = !s.visible;
        markDirty(); renderSectionList();
      });
      item.querySelector('[data-act="dup"]').addEventListener('click', () => {
        if (!canEdit) return CMS.toast('Read only', 'err');
        const copy = JSON.parse(JSON.stringify(s));
        copy.id = 's_' + Math.random().toString(36).slice(2,9);
        copy.name = s.name + ' (copy)';
        working.splice(idx + 1, 0, copy);
        activeSecId = copy.id;
        markDirty(); renderSectionList(); renderCanvas();
      });
      item.querySelector('[data-act="del"]').addEventListener('click', () => {
        if (!canEdit) return CMS.toast('Read only', 'err');
        if (working.length <= 1) return CMS.toast('At least one section required', 'err');
        CMS.confirmDialog(`Delete section "${s.name}"?`, () => {
          working.splice(idx, 1);
          if (activeSecId === s.id) activeSecId = working[0].id;
          markDirty(); renderSectionList(); renderCanvas();
        });
      });

      // Drag & drop reordering
      if (canEdit) {
        item.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', String(idx));
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('drag-over'); });
        item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
        item.addEventListener('drop', e => {
          e.preventDefault();
          item.classList.remove('drag-over');
          const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
          const to = idx;
          if (from === to || isNaN(from)) return;
          const [moved] = working.splice(from, 1);
          working.splice(to, 0, moved);
          markDirty(); renderSectionList(); renderCanvas();
        });
      }

      list.appendChild(item);
    });

    if (canEdit) {
      const add = CMS.el('<div class="add-section">+ Add section</div>');
      add.addEventListener('click', openAddSection);
      list.appendChild(add);
    }
  }

  function openAddSection() {
    const types = Object.entries(CMS.SECTION_TYPES);
    const grid = types.map(([k, def]) => `
      <button class="layout-opt" data-type="${k}">
        <div class="layout-svg" style="font-size:28px;display:grid;place-items:center;background:var(--bg-2);border-radius:4px">${def.icon}</div>
        <div class="layout-name">${def.label}</div>
      </button>
    `).join('');
    const body = CMS.el(`<div><p class="muted small">Choose a section type to add to the page:</p><div class="layout-options">${grid}</div></div>`);

    const m = CMS.modal({
      title: 'Add a section',
      body,
      footer: false
    });

    body.querySelectorAll('.layout-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const def = CMS.SECTION_TYPES[type];
        const newSec = CMS.sec(type, def.label, defaultContent(type));
        working.push(newSec);
        activeSecId = newSec.id;
        markDirty(); renderSectionList(); renderCanvas();
        m.close();
      });
    });
  }

  function defaultContent(type) {
    switch (type) {
      case 'hero': return { eyebrow: '', title: 'New Hero', subtitle: '', ctaPrimary: { label: 'Learn More', href: '#' }, slides: [] };
      case 'stats': return { items: [{ value: '100+', label: 'Projects' }] };
      case 'text': return { eyebrow: '', heading: 'Heading', body: 'Add your text here.' };
      case 'image': return { image: '', alt: '', caption: '' };
      case 'cta': return { heading: 'Begin a conversation', primary: { label: 'Get in touch', href: 'contact.html' } };
      case 'gallery': return { heading: 'Gallery', items: [] };
      case 'features': return { heading: 'Features', items: [{ title: 'Feature', body: 'Description.' }] };
      default: return {};
    }
  }

  // ============================================================
  //  CANVAS — main editor area
  // ============================================================
  function renderCanvas() {
    const body = document.getElementById('canvasBody');
    body.innerHTML = '';
    if (activeTab === 'content') renderContentTab(body);
    else if (activeTab === 'layout') renderLayoutTab(body);
    else if (activeTab === 'seo') renderSeoTab(body);
    else if (activeTab === 'settings') renderSettingsTab(body);
  }

  function renderContentTab(host) {
    const sec = working.find(s => s.id === activeSecId);
    if (!sec) return;
    const def = CMS.SECTION_TYPES[sec.type];
    const wrap = CMS.el(`
      <div class="sec-card">
        <div class="sec-card-head">
          <div>
            <div class="sec-card-title">${CMS.escape(sec.name)}</div>
            <div class="sec-card-meta">${CMS.escape(sec.type)}${sec.visible ? '' : ' · hidden'}</div>
          </div>
          <div class="flex gap-sm">
            <input class="input" id="sec-rename" value="${CMS.escape(sec.name)}" style="width:200px">
          </div>
        </div>
        <div id="fields"></div>
      </div>
    `);
    host.appendChild(wrap);

    wrap.querySelector('#sec-rename').addEventListener('input', e => {
      sec.name = e.target.value;
      markDirty();
      // light update — just re-render left list
      renderSectionList();
    });

    const fieldsHost = wrap.querySelector('#fields');
    def.fields.forEach(f => fieldsHost.appendChild(renderField(sec, f)));
  }

  function renderLayoutTab(host) {
    const wrap = CMS.el(`
      <div>
        <h3 style="font-family:'Fraunces',serif;font-size:16px;margin-bottom:12px">Page layout</h3>
        <div class="layout-options" id="lo"></div>
        <p class="muted small" style="margin-top:14px">Choose how this page is presented. Layouts adjust width, spacing, and typography rhythm.</p>
      </div>
    `);
    host.appendChild(wrap);

    const lo = wrap.querySelector('#lo');
    CMS.LAYOUTS.forEach(l => {
      const svg = l.id === 'standard'
        ? '<svg viewBox="0 0 100 60" class="layout-svg"><rect x="20" y="6" width="60" height="48" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
        : l.id === 'wide'
        ? '<svg viewBox="0 0 100 60" class="layout-svg"><rect x="4" y="6" width="92" height="48" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
        : '<svg viewBox="0 0 100 60" class="layout-svg"><rect x="32" y="6" width="36" height="48" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
      const o = CMS.el(`<div class="layout-opt ${workingMeta.layout === l.id ? 'active' : ''}" data-id="${l.id}">${svg}<div class="layout-name">${l.label}</div><div class="tiny muted">${l.description}</div></div>`);
      o.addEventListener('click', () => {
        if (!canEdit) return CMS.toast('Read only', 'err');
        workingMeta.layout = l.id;
        markDirty();
        renderLayoutTab(host);
      });
      lo.appendChild(o);
    });
  }

  function renderSeoTab(host) {
    const wrap = CMS.el(`
      <div>
        <h3 style="font-family:'Fraunces',serif;font-size:16px;margin-bottom:12px">SEO &amp; Sharing</h3>
        <div class="field"><label class="label">Meta title</label><input class="input" id="seo-title" value="${CMS.escape(workingMeta.seo.title || '')}"></div>
        <div class="field"><label class="label">Meta description</label><textarea class="textarea" id="seo-desc">${CMS.escape(workingMeta.seo.description || '')}</textarea><div class="hint">Aim for 150–160 characters.</div></div>
        <div class="field"><label class="label">Open Graph image URL</label><input class="input" id="seo-og" value="${CMS.escape(workingMeta.seo.ogImage || '')}"><button class="btn btn-sm" id="seo-og-pick" type="button" style="margin-top:6px">Choose from media</button></div>
        <div class="field"><label class="label">Keywords (comma separated)</label><input class="input" id="seo-kw" value="${CMS.escape(workingMeta.seo.keywords || '')}"></div>
      </div>
    `);
    host.appendChild(wrap);

    const bind = (id, key) => wrap.querySelector(id).addEventListener('input', e => {
      workingMeta.seo[key] = e.target.value; markDirty();
    });
    bind('#seo-title', 'title');
    bind('#seo-desc', 'description');
    bind('#seo-og', 'ogImage');
    bind('#seo-kw', 'keywords');

    wrap.querySelector('#seo-og-pick').addEventListener('click', () => {
      pickMedia(url => { workingMeta.seo.ogImage = url; renderSeoTab(host); markDirty(); });
    });
  }

  function renderSettingsTab(host) {
    const wrap = CMS.el(`
      <div>
        <h3 style="font-family:'Fraunces',serif;font-size:16px;margin-bottom:12px">Page settings</h3>
        <div class="field"><label class="label">Page title</label><input class="input" id="set-title" value="${CMS.escape(workingMeta.title)}"></div>
        <div class="field"><label class="label">Slug / filename</label><input class="input mono" id="set-slug" value="${CMS.escape(workingMeta.slug)}"></div>
        <div class="field"><label class="label">Status</label>
          <select class="select" id="set-status">
            <option value="published" ${page.status === 'published' ? 'selected' : ''}>Published</option>
            <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="archived" ${page.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="field"><label class="label">Page ID</label><input class="input mono" value="${CMS.escape(page.id)}" readonly></div>
        <div class="field"><label class="label">Created</label><div class="small">${new Date(page.createdAt).toLocaleString()}</div></div>
        <div class="field"><label class="label">Last updated</label><div class="small">${new Date(page.updatedAt).toLocaleString()} by ${CMS.escape(page.updatedBy || '')}</div></div>
      </div>
    `);
    host.appendChild(wrap);

    wrap.querySelector('#set-title').addEventListener('input', e => { workingMeta.title = e.target.value; markDirty(); });
    wrap.querySelector('#set-slug').addEventListener('input', e => { workingMeta.slug = e.target.value; markDirty(); });
    wrap.querySelector('#set-status').addEventListener('change', e => {
      if (!canPublish) { CMS.toast('Publish permission required', 'err'); e.target.value = page.status; return; }
      const newStatus = e.target.value;
      CMS.updatePage(page.id, p => { p.status = newStatus; });
      page.status = newStatus;
      CMS.logActivity('edit', `Status of "${page.title}" set to ${newStatus}`);
      CMS.toast('Status updated', 'ok');
    });
  }

  // ============================================================
  //  FIELD RENDERERS
  // ============================================================
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, val) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] == null || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function renderField(sec, f) {
    const val = getPath(sec.content, f.key);

    if (f.type === 'text') {
      const wrap = CMS.el(`<div class="field"><label class="label">${CMS.escape(f.label)}</label><input class="input" value="${CMS.escape(val || '')}"></div>`);
      wrap.querySelector('input').addEventListener('input', e => { setPath(sec.content, f.key, e.target.value); markDirty(); });
      return wrap;
    }
    if (f.type === 'textarea') {
      const wrap = CMS.el(`<div class="field"><label class="label">${CMS.escape(f.label)}</label><textarea class="textarea" rows="3">${CMS.escape(val || '')}</textarea></div>`);
      wrap.querySelector('textarea').addEventListener('input', e => { setPath(sec.content, f.key, e.target.value); markDirty(); });
      return wrap;
    }
    if (f.type === 'image') {
      const wrap = CMS.el(`<div class="field"><label class="label">${CMS.escape(f.label)}</label>
        <div class="flex gap-sm">
          <input class="input" value="${CMS.escape(val || '')}" placeholder="https://…">
          <button class="btn btn-sm" type="button">Browse</button>
        </div>
        ${val ? `<div style="margin-top:8px"><img src="${CMS.escape(val)}" style="max-width:200px;border-radius:4px;border:1px solid var(--line)"></div>` : ''}
      </div>`);
      wrap.querySelector('input').addEventListener('input', e => { setPath(sec.content, f.key, e.target.value); markDirty(); });
      wrap.querySelector('button').addEventListener('click', () => {
        pickMedia(url => { setPath(sec.content, f.key, url); markDirty(); renderCanvas(); });
      });
      return wrap;
    }
    if (f.type === 'imagelist') {
      // value = [{ name, image }]
      const list = Array.isArray(val) ? val : [];
      const wrap = CMS.el(`<div class="field"><label class="label">${CMS.escape(f.label)}</label><div id="il-${f.key.replace(/\./g,'-')}"></div><button class="btn btn-sm" style="margin-top:8px" type="button">+ Add slide</button></div>`);
      const host = wrap.querySelector('div[id^="il-"]');
      const rerender = () => {
        host.innerHTML = '';
        list.forEach((it, i) => {
          const row = CMS.el(`<div style="display:grid;grid-template-columns:60px 1fr 1fr auto auto;gap:8px;align-items:center;padding:8px;background:var(--bg-2);border-radius:4px;margin-bottom:6px">
            ${it.image ? `<img src="${CMS.escape(it.image)}" style="width:60px;height:40px;object-fit:cover;border-radius:3px">` : '<div style="width:60px;height:40px;background:var(--bg-3);border-radius:3px"></div>'}
            <input class="input" placeholder="Name" value="${CMS.escape(it.name || '')}">
            <input class="input" placeholder="Image URL" value="${CMS.escape(it.image || '')}">
            <button class="btn btn-sm" type="button" data-act="pick">…</button>
            <button class="btn btn-sm btn-danger" type="button" data-act="del">✕</button>
          </div>`);
          const inputs = row.querySelectorAll('input');
          inputs[0].addEventListener('input', e => { it.name = e.target.value; markDirty(); });
          inputs[1].addEventListener('input', e => { it.image = e.target.value; markDirty(); });
          row.querySelector('[data-act="pick"]').addEventListener('click', () => { pickMedia(url => { it.image = url; markDirty(); renderCanvas(); }); });
          row.querySelector('[data-act="del"]').addEventListener('click', () => { list.splice(i,1); setPath(sec.content, f.key, list); markDirty(); renderCanvas(); });
          host.appendChild(row);
        });
      };
      rerender();
      wrap.querySelector('button.btn-sm').addEventListener('click', () => {
        list.push({ name: '', image: '' });
        setPath(sec.content, f.key, list);
        markDirty(); renderCanvas();
      });
      return wrap;
    }
    if (f.type === 'itemlist') {
      const list = Array.isArray(val) ? val : [];
      const wrap = CMS.el(`<div class="field"><label class="label">${CMS.escape(f.label)}</label><div></div><button class="btn btn-sm" style="margin-top:8px" type="button">+ Add item</button></div>`);
      const host = wrap.children[1];
      const rerender = () => {
        host.innerHTML = '';
        list.forEach((it, i) => {
          const row = CMS.el(`<div style="display:grid;grid-template-columns:repeat(${f.schema.length}, 1fr) auto auto;gap:8px;margin-bottom:6px;align-items:center">
            ${f.schema.map(k => `<input class="input" data-k="${k}" placeholder="${k}" value="${CMS.escape(it[k] || '')}">`).join('')}
            ${f.schema.includes('image') ? '<button class="btn btn-sm" type="button" data-act="pick">…</button>' : ''}
            <button class="btn btn-sm btn-danger" type="button" data-act="del">✕</button>
          </div>`);
          row.querySelectorAll('input[data-k]').forEach(inp => inp.addEventListener('input', e => { it[e.target.dataset.k] = e.target.value; markDirty(); }));
          const pick = row.querySelector('[data-act="pick"]');
          if (pick) pick.addEventListener('click', () => pickMedia(url => { it.image = url; markDirty(); renderCanvas(); }));
          row.querySelector('[data-act="del"]').addEventListener('click', () => { list.splice(i,1); setPath(sec.content, f.key, list); markDirty(); renderCanvas(); });
          host.appendChild(row);
        });
      };
      rerender();
      wrap.querySelector('button.btn-sm').addEventListener('click', () => {
        const blank = {}; f.schema.forEach(k => blank[k] = '');
        list.push(blank); setPath(sec.content, f.key, list); markDirty(); renderCanvas();
      });
      return wrap;
    }
    return CMS.el('<div></div>');
  }

  // ============================================================
  //  RIGHT PANEL — status + summary
  // ============================================================
  function renderRightPanel() {
    const panel = document.getElementById('rightPanel');
    const hasDraft = page.draftSections != null;
    panel.innerHTML = `
      <h3 style="font-family:'Fraunces',serif;font-size:15px;margin-bottom:10px">Status</h3>
      <div class="flex flex-between" style="margin-bottom:10px"><span class="muted small">Page status</span><span class="badge dot ${page.status === 'published' ? 'ok' : page.status === 'draft' ? 'draft' : 'archive'}">${page.status}</span></div>
      <div class="flex flex-between" style="margin-bottom:10px"><span class="muted small">Draft changes</span><span class="badge ${hasDraft || dirty ? 'draft' : 'ok'}">${hasDraft || dirty ? 'Unpublished' : 'Up to date'}</span></div>
      <div class="flex flex-between" style="margin-bottom:14px"><span class="muted small">Last updated</span><span class="small">${CMS.relTime(page.updatedAt)}</span></div>
      <div class="divider"></div>
      <h3 style="font-family:'Fraunces',serif;font-size:15px;margin-bottom:10px">Quick info</h3>
      <div class="small muted" style="margin-bottom:6px">Sections: ${working.length} (${working.filter(s => s.visible).length} visible)</div>
      <div class="small muted" style="margin-bottom:6px">Layout: ${CMS.escape(workingMeta.layout)}</div>
      <div class="small muted" style="margin-bottom:14px">Slug: <code>${CMS.escape(workingMeta.slug)}</code></div>
      <div class="divider"></div>
      <h3 style="font-family:'Fraunces',serif;font-size:15px;margin-bottom:10px">Actions</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-sm" id="r-preview">Preview changes</button>
        ${canPublish && hasDraft ? '<button class="btn btn-sm" id="r-discard">Discard draft</button>' : ''}
        <a class="btn btn-sm" href="history.html?page=${encodeURIComponent(page.id)}">Version history</a>
        ${canPublish ? '<button class="btn btn-sm" id="r-snapshot">Save snapshot</button>' : ''}
      </div>
    `;
    panel.querySelector('#r-preview').addEventListener('click', openPreview);
    const discard = panel.querySelector('#r-discard');
    if (discard) discard.addEventListener('click', discardDraft);
    const snap = panel.querySelector('#r-snapshot');
    if (snap) snap.addEventListener('click', () => {
      CMS.snapshot(page.id, 'Manual snapshot');
      CMS.toast('Snapshot saved', 'ok');
    });
  }

  // ============================================================
  //  STATE / SAVE / PUBLISH
  // ============================================================
  let dirty = false;
  function markDirty() {
    dirty = true;
    renderRightPanel();
  }

  function saveDraft() {
    if (!CMS.gate('pages.edit')) return;
    CMS.updatePage(page.id, p => {
      p.draftSections = JSON.parse(JSON.stringify(working));
      p.title = workingMeta.title;
      p.slug = workingMeta.slug;
      p.layout = workingMeta.layout;
      p.seo = JSON.parse(JSON.stringify(workingMeta.seo));
    });
    page = CMS.getPage(page.id);
    CMS.logActivity('edit', `Draft saved for "${page.title}"`);
    CMS.toast('Draft saved', 'ok');
    dirty = false;
    renderRightPanel();
  }

  function publishChanges() {
    if (!CMS.gate('pages.publish')) return;
    CMS.snapshot(page.id, 'Pre-publish snapshot');
    CMS.updatePage(page.id, p => {
      p.sections = JSON.parse(JSON.stringify(working));
      p.title = workingMeta.title;
      p.slug = workingMeta.slug;
      p.layout = workingMeta.layout;
      p.seo = JSON.parse(JSON.stringify(workingMeta.seo));
      p.draftSections = null;
      if (p.status === 'draft') p.status = 'published';
    });
    page = CMS.getPage(page.id);
    CMS.logActivity('publish', `Published "${page.title}"`);
    CMS.toast('Page published to live site', 'ok');
    dirty = false;
    renderRightPanel();
  }

  function discardDraft() {
    if (!CMS.gate('pages.edit')) return;
    CMS.confirmDialog('Discard all unsaved draft changes for this page?', () => {
      CMS.updatePage(page.id, p => { p.draftSections = null; });
      page = CMS.getPage(page.id);
      working = JSON.parse(JSON.stringify(page.sections));
      workingMeta = { title: page.title, slug: page.slug, layout: page.layout, seo: JSON.parse(JSON.stringify(page.seo)) };
      activeSecId = working[0] && working[0].id;
      dirty = false;
      renderSectionList(); renderCanvas(); renderRightPanel();
      CMS.toast('Draft discarded', 'ok');
    });
  }

  function openPreview() {
    // Save a temporary preview snapshot to sessionStorage and open the live page in a new tab with preview mode
    const previewData = {
      pageId: page.id,
      working: working,
      meta: workingMeta,
      generatedAt: Date.now()
    };
    sessionStorage.setItem('sabdia.cms.preview', JSON.stringify(previewData));
    const url = `../${workingMeta.slug || page.slug}?cms_preview=1`;
    window.open(url, '_blank');
  }

  // ============================================================
  //  MEDIA PICKER
  // ============================================================
  function pickMedia(onPick) {
    const data = CMS.load();
    const body = CMS.el(`<div>
      <div class="toolbar" style="margin-bottom:14px"><input class="input" id="mp-q" placeholder="Search media…"></div>
      <div class="media-grid" id="mp-grid"></div>
      <div class="divider"></div>
      <div class="field"><label class="label">Or paste an image URL</label><input class="input" id="mp-url" placeholder="https://…"></div>
    </div>`);

    const m = CMS.modal({
      title: 'Choose media',
      size: 'lg',
      body,
      confirmLabel: 'Use selected',
      onConfirm: () => {
        const url = body.querySelector('#mp-url').value.trim();
        if (url) { onPick(url); return true; }
        const sel = body.querySelector('.media-tile.selected');
        if (!sel) { CMS.toast('Pick an image or paste a URL', 'err'); return false; }
        onPick(sel.dataset.url);
        return true;
      }
    });

    let sel = null;
    function renderGrid(q) {
      const grid = body.querySelector('#mp-grid');
      const list = data.media.filter(x => !q || (x.name || '').toLowerCase().includes(q.toLowerCase()));
      if (!list.length) {
        grid.innerHTML = '<div class="empty-state small" style="grid-column:1/-1"><h3>No media yet</h3><p>Upload images in <a href="media.html">Media Library</a> or paste a URL below.</p></div>';
        return;
      }
      grid.innerHTML = list.map(m => `
        <div class="media-tile" data-id="${m.id}" data-url="${CMS.escape(m.url)}">
          <div class="media-thumb"><img src="${CMS.escape(m.url)}" alt=""></div>
          <div class="media-meta"><div class="media-name">${CMS.escape(m.name)}</div></div>
        </div>
      `).join('');
      grid.querySelectorAll('.media-tile').forEach(t => {
        t.addEventListener('click', () => {
          grid.querySelectorAll('.media-tile').forEach(x => x.classList.remove('selected'));
          t.classList.add('selected');
        });
      });
    }
    renderGrid('');
    body.querySelector('#mp-q').addEventListener('input', e => renderGrid(e.target.value));
  }

  // Warn on unload
  window.addEventListener('beforeunload', e => {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });
})();
