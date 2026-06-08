/* ============================================================
   SABDIA CMS — CORE
   Storage, Auth, RBAC, Data Model, Helpers
   ============================================================ */
(function (global) {
  'use strict';

  const STORAGE_KEY  = 'sabdia.cms.v1';
  const SESSION_KEY  = 'sabdia.cms.session';
  const SESSION_TTL  = 12 * 60 * 60 * 1000; // 12 hours

  // ------------------------------------------------------------
  //  DEFAULT DATA — mirrors the live website's structure
  // ------------------------------------------------------------
  const DEFAULTS = () => ({
    version: 1,
    createdAt: Date.now(),
    site: {
      name: 'Sabdia Constructions',
      tagline: 'Boutique Luxury Builder & Developer · Brisbane',
      logo: 'https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png',
      themeColor: '#0E0D0B'
    },
    contact: {
      email: 'hello@sabdiaconstructions.com.au',
      phone: '',
      address: 'Brisbane, QLD, Australia',
      instagram: 'https://www.instagram.com/_sabdia/',
      facebook: 'https://www.facebook.com/sabdiaconstructions/',
      linkedin: 'https://www.linkedin.com/company/sabdia-constructions/'
    },
    nav: [
      { label: 'For Sale', href: 'properties/' },
      { label: 'Services', href: 'services.html' },
      { label: 'About', href: 'about.html' },
      { label: 'Projects', href: 'projects.html' },
      { label: 'Collection', href: 'collection.html' },
      { label: 'Agent Access', href: 'agent-access.html' }
    ],
    navCTA: { label: 'Enquire', href: 'contact.html' },
    footer: {
      tagline: 'Design. Develop. Construct.',
      sub: 'Boutique luxury home builder & developer delivering award-winning residences across inner Brisbane since 2013.',
      copyright: '© 2025 Sabdia Constructions Pty Ltd. All rights reserved.'
    },
    siteCTA: {
      heading: 'Begin a conversation.',
      sub: 'For private viewings, off-market opportunities, or to discuss your next residence.',
      primary: { label: 'Enquire Now', href: 'contact.html' },
      secondary: { label: 'View Properties', href: 'properties/' }
    },
    pages: [
      page('home', 'Home', 'index.html', 'standard', [
        sec('hero', 'Hero Slideshow', {
          eyebrow: 'Boutique Luxury Home Builder & Developer — Brisbane',
          title: 'Design · Develop · Construct',
          subtitle: 'Redefining luxury through design, detail, and craftsmanship. For over ten years, Sabdia has delivered award-winning residences that set a new benchmark for contemporary living in Brisbane.',
          ctaPrimary: { label: 'View Properties', href: 'properties/' },
          ctaSecondary: { label: 'Begin a Conversation', href: 'contact.html' },
          slides: [
            { name: 'QASR · Coorparoo', image: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg' },
            { name: 'SOLACE · Camp Hill', image: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg' },
            { name: 'SIERRA · Holland Park West', image: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg' }
          ]
        }),
        sec('stats', 'Stats Band', {
          items: [
            { value: '100+', label: 'Residences Delivered' },
            { value: '10+',  label: 'Years in Brisbane' },
            { value: '5★',   label: 'Multi-Award Winning' },
            { value: '100%', label: 'In-House Delivery' }
          ]
        }),
        sec('text', 'Studio Introduction', {
          eyebrow: 'The Studio',
          heading: 'A boutique studio for those who value craft.',
          body: 'Sabdia Constructions is a Brisbane-based luxury home builder and developer. We design, develop, and construct residences in inner Brisbane for clients who appreciate detail, restraint, and longevity.'
        }),
        sec('cta', 'Closing CTA', {
          eyebrow: 'Begin',
          heading: 'Begin a conversation.',
          sub: 'For private viewings, off-market opportunities, or to discuss your next residence.',
          primary: { label: 'Enquire Now', href: 'contact.html' },
          secondary: { label: 'View Properties', href: 'properties/' }
        })
      ], {
        title: 'Sabdia Constructions | Luxury Home Builders & Developers, Brisbane',
        description: 'Boutique luxury home builder and developer in inner Brisbane. Multi-award winning, 100+ residences delivered since 2013. Design, Develop, Construct.',
        ogImage: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg',
        keywords: 'luxury home builder, Brisbane, developer, Sabdia'
      }),
      page('about', 'About', 'about.html', 'standard', [
        sec('hero', 'About Hero', {
          eyebrow: 'About', title: 'About\nSabdia', subtitle: 'Boutique luxury home builder and developer in inner Brisbane since 2013.'
        }),
        sec('text', 'Vision & Precision', {
          eyebrow: 'The Studio', heading: 'Built on vision, delivered with precision.',
          body: 'For over a decade, Sabdia has crafted residences that pair architectural ambition with meticulous construction. Each project is a quiet study in restraint, materiality, and lasting craft.'
        }),
        sec('text', 'A Decade of Milestones', {
          eyebrow: 'Milestones', heading: 'A decade of milestones.',
          body: '100+ residences delivered. Multi-award winning. In-house design, development, and construction across inner Brisbane.'
        }),
        sec('features', 'Awards & Excellence', {
          heading: 'Award-winning excellence.',
          items: [
            { title: 'HIA Awards', body: 'Multiple Housing Industry Association winners.' },
            { title: 'Master Builders', body: 'Recognised by Master Builders Queensland.' },
            { title: 'Design Awards', body: 'Featured in leading Australian architecture publications.' }
          ]
        }),
        sec('cta', 'Closing CTA', {
          heading: 'Ready to create something extraordinary?', sub: 'We work with a small number of clients each year.', primary: { label: 'Begin a Conversation', href: 'contact.html' }
        })
      ], { title: 'About | Sabdia Constructions', description: 'Boutique luxury home builder and developer in inner Brisbane since 2013. Learn about Sabdia\'s story, values, and integrated approach to luxury residential development.', ogImage: '', keywords: 'about, Sabdia, Brisbane builder, luxury homes' }),
      page('services', 'Services', 'services.html', 'standard', [
        sec('hero', 'Services Hero', { eyebrow: 'Services', title: 'Our\nServices', subtitle: 'Design, develop, construct. Every element, under one roof.' }),
        sec('features', 'Services Grid', {
          heading: 'Every element, under one roof.',
          items: [
            { title: 'Luxury Residential Design', body: 'Concept through documentation, in collaboration with leading architects and interior designers.' },
            { title: 'Development Management', body: 'Site acquisition, feasibility, planning approvals, and full project management.' },
            { title: 'Interior Architecture', body: 'Considered interiors that complement the architecture and reflect the way our clients live.' },
            { title: 'Expert Construction', body: 'In-house construction with a curated network of trusted Queensland trades.' }
          ]
        }),
        sec('cta', 'Closing CTA', { heading: 'Tell us about your project.', sub: 'A short conversation is the best place to start.', primary: { label: 'Enquire', href: 'contact.html' } })
      ], { title: 'Services | Sabdia Constructions', description: 'Full-spectrum luxury residential development services — design, development management, interior architecture, and expert construction by Sabdia Constructions, Brisbane.', ogImage: '', keywords: 'services, design, development, construction, Brisbane builder' }),
      page('projects', 'Projects', 'projects.html', 'wide', [
        sec('hero', 'Projects Hero', { eyebrow: 'Projects', title: 'Our\nProjects', subtitle: '100+ residences delivered across inner Brisbane since 2013.' }),
        sec('gallery', 'Current Projects', {
          heading: 'Current properties',
          items: [
            { name: 'QASR · Coorparoo', image: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', href: 'properties/qasr.html' },
            { name: 'SOLACE · Camp Hill', image: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', href: 'properties/solace.html' },
            { name: 'SIERRA · Holland Park West', image: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg', href: 'properties/sierra.html' }
          ]
        }),
        sec('cta', 'Closing CTA', { heading: 'Ready to find your next home?', primary: { label: 'View Properties', href: 'properties/' }, secondary: { label: 'Get in touch', href: 'contact.html' } })
      ], { title: 'Projects | Sabdia Constructions', description: "Browse Sabdia Constructions' portfolio of completed luxury residential developments across inner Brisbane. 100+ residences since 2013.", ogImage: '', keywords: 'projects, residential, Brisbane' }),
      page('collection', 'Collection', 'collection.html', 'wide', [
        sec('hero', 'Collection Hero', { eyebrow: 'Collection', title: 'The Sabdia\nCollection', subtitle: 'A growing portfolio of delivered residences across inner Brisbane.' }),
        sec('gallery', 'Collection Grid', { items: [] })
      ], { title: 'Collection | Sabdia Constructions', description: 'The Sabdia Collection — a portfolio of completed luxury residences across inner Brisbane. Award-winning homes designed, developed, and constructed by Sabdia.', ogImage: '', keywords: 'collection, portfolio, luxury homes' }),
      page('contact', 'Contact', 'contact.html', 'narrow', [
        sec('hero', 'Contact Hero', { eyebrow: 'Contact', title: "Let's start\na conversation", subtitle: 'For private viewings, off-market opportunities, or new project enquiries.' }),
        sec('text', 'Contact Info', { eyebrow: 'Get in touch', heading: 'We respond within one business day.', body: 'Reach the studio by email or phone, or use the form below. We take on a limited number of new projects each year.' })
      ], { title: 'Contact | Sabdia Constructions', description: "Get in touch with Sabdia Constructions. Brisbane's leading boutique luxury home builder and developer. Enquire about properties, custom builds, or development partnerships.", ogImage: '', keywords: 'contact, enquire, Brisbane builder' }),
      page('agent', 'Agent Access', 'agent-access.html', 'standard', [
        sec('hero', 'Agent Hero', { eyebrow: 'Agent Access', title: 'Exclusive\nAgent Access', subtitle: 'Pre-launch information, priority access, and partner programs for real estate professionals.' }),
        sec('text', 'The Edge', { eyebrow: 'The Program', heading: 'The Sabdia agent program gives you a genuine edge.', body: 'Early access to upcoming listings, exclusive marketing assets, and a direct line to the developer.' }),
        sec('cta', 'Join CTA', { heading: 'Join the network.', primary: { label: 'Register Interest', href: 'contact.html' } })
      ], { title: 'Agent Access | Sabdia Constructions', description: 'Exclusive agent access for real estate professionals. Pre-launch information, priority access, and commission structures for Sabdia Constructions luxury developments.', ogImage: '', keywords: 'agent access, real estate, partner program' })
    ],
    media: [],
    users: [
      { id: 'u_naomi', email: 'naomi@sabdia.com.au', name: 'Naomi', role: 'super', password: 'sabdia2025', createdAt: Date.now() },
      { id: 'u_root', email: 'admin@sabdia.local', name: 'Super Admin', role: 'super', password: 'admin', createdAt: Date.now() },
      { id: 'u_editor', email: 'editor@sabdia.local', name: 'Demo Editor', role: 'editor', password: 'editor', createdAt: Date.now() }
    ],
    versions: [],
    activity: []
  });

  function page(id, title, slug, layout, sections, seo) {
    return {
      id, title, slug, layout,
      status: 'published',
      sections,
      draftSections: null,
      seo: seo || { title, description: '', ogImage: '', keywords: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      updatedBy: 'system'
    };
  }
  function sec(type, name, content) {
    return {
      id: 's_' + Math.random().toString(36).slice(2, 9),
      type, name, visible: true,
      content: content || {}
    };
  }

  // ------------------------------------------------------------
  //  STORAGE
  // ------------------------------------------------------------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const data = DEFAULTS();
        save(data);
        return data;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('CMS load failed:', e);
      return DEFAULTS();
    }
  }
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('CMS save failed:', e);
      alert('Storage full — try removing some media or exporting and clearing.');
      return false;
    }
  }
  function reset() {
    if (!confirm('Reset all CMS data to defaults? This cannot be undone.')) return false;
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  // ------------------------------------------------------------
  //  AUTH & SESSION
  // ------------------------------------------------------------
  function login(email, password) {
    const data = load();
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    const session = {
      userId: user.id, role: user.role, name: user.name, email: user.email,
      issuedAt: Date.now(), expires: Date.now() + SESSION_TTL
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    logActivity('login', `${user.name} signed in`);
    return { ok: true, session };
  }
  function logout() {
    const s = currentSession();
    if (s) logActivity('logout', `${s.name} signed out`);
    sessionStorage.removeItem(SESSION_KEY);
  }
  function currentSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (s.expires < Date.now()) { sessionStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch { return null; }
  }
  function requireAuth() {
    const s = currentSession();
    if (!s) { window.location.href = 'login.html'; return null; }
    return s;
  }

  // ------------------------------------------------------------
  //  RBAC
  // ------------------------------------------------------------
  // super: everything
  // admin: pages, media, globals, publish, drafts; cannot manage users or reset
  // editor: edit page content + media; cannot publish, manage users, manage globals
  const PERMISSIONS = {
    super:  ['pages.view','pages.create','pages.edit','pages.delete','pages.duplicate','pages.publish','pages.archive','media.view','media.upload','media.delete','globals.view','globals.edit','users.view','users.edit','history.view','history.restore','settings.edit','export','import','reset'],
    admin:  ['pages.view','pages.create','pages.edit','pages.delete','pages.duplicate','pages.publish','pages.archive','media.view','media.upload','media.delete','globals.view','globals.edit','history.view','history.restore','export','import'],
    editor: ['pages.view','pages.edit','media.view','media.upload','globals.view','history.view']
  };
  function can(action) {
    const s = currentSession(); if (!s) return false;
    return (PERMISSIONS[s.role] || []).includes(action);
  }
  function gate(action) {
    if (can(action)) return true;
    toast('You don\'t have permission to do that.', 'err');
    return false;
  }

  // ------------------------------------------------------------
  //  ACTIVITY LOG
  // ------------------------------------------------------------
  function logActivity(type, message, meta) {
    const data = load();
    const s = currentSession();
    data.activity = data.activity || [];
    data.activity.unshift({
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
      type, message,
      user: s ? s.name : 'system',
      timestamp: Date.now(),
      meta: meta || null
    });
    if (data.activity.length > 200) data.activity.length = 200;
    save(data);
  }

  // ------------------------------------------------------------
  //  VERSIONS
  // ------------------------------------------------------------
  function snapshot(pageId, label) {
    const data = load();
    const page = data.pages.find(p => p.id === pageId);
    if (!page) return;
    const s = currentSession();
    data.versions.unshift({
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
      pageId, label: label || 'Auto-saved snapshot',
      timestamp: Date.now(),
      user: s ? s.name : 'system',
      data: JSON.parse(JSON.stringify(page))
    });
    if (data.versions.length > 100) data.versions.length = 100;
    save(data);
  }
  function restoreVersion(versionId) {
    const data = load();
    const v = data.versions.find(x => x.id === versionId);
    if (!v) return false;
    const idx = data.pages.findIndex(p => p.id === v.pageId);
    if (idx === -1) return false;
    // Snapshot current state before restoring
    snapshot(v.pageId, 'Pre-restore snapshot');
    const restored = JSON.parse(JSON.stringify(v.data));
    restored.updatedAt = Date.now();
    const s = currentSession();
    restored.updatedBy = s ? s.name : 'system';
    data.pages[idx] = restored;
    save(data);
    logActivity('restore', `Restored ${v.pageId} to ${new Date(v.timestamp).toLocaleString()}`);
    return true;
  }

  // ------------------------------------------------------------
  //  HELPERS — toasts, modal, DOM
  // ------------------------------------------------------------
  function toast(message, kind) {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.textContent = message;
    stack.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; }, 2500);
    setTimeout(() => t.remove(), 2800);
  }
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function escape(str) {
    return String(str == null ? '' : str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function modal(opts) {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `
      <div class="modal ${opts.size === 'lg' ? 'lg' : ''}" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h2 class="modal-title">${escape(opts.title || '')}</h2>
          <button class="modal-close" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body"></div>
        ${opts.footer === false ? '' : `<div class="modal-foot">
          <button class="btn modal-cancel">${escape(opts.cancelLabel || 'Cancel')}</button>
          <button class="btn btn-primary modal-confirm">${escape(opts.confirmLabel || 'Save')}</button>
        </div>`}
      </div>`;
    document.body.appendChild(wrap);
    const body = wrap.querySelector('.modal-body');
    if (typeof opts.body === 'string') body.innerHTML = opts.body;
    else if (opts.body instanceof Node) body.appendChild(opts.body);

    const close = () => wrap.remove();
    wrap.querySelector('.modal-close').addEventListener('click', close);
    if (opts.footer !== false) {
      wrap.querySelector('.modal-cancel').addEventListener('click', () => { close(); opts.onCancel && opts.onCancel(); });
      wrap.querySelector('.modal-confirm').addEventListener('click', () => {
        const ok = opts.onConfirm ? opts.onConfirm(body, wrap) : true;
        if (ok !== false) close();
      });
    }
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    return { wrap, body, close };
  }
  function confirmDialog(message, onYes) {
    modal({
      title: 'Confirm',
      body: `<p>${escape(message)}</p>`,
      confirmLabel: 'Yes, continue',
      onConfirm: () => { onYes(); return true; }
    });
  }
  function relTime(ts) {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    if (diff < 86400 * 30) return Math.floor(diff/86400) + 'd ago';
    return new Date(ts).toLocaleDateString();
  }

  // ------------------------------------------------------------
  //  EXPORT / IMPORT
  // ------------------------------------------------------------
  function exportJSON() {
    const data = load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sabdia-cms-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(file, onDone) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.pages || !data.users) throw new Error('Invalid CMS export');
        save(data);
        onDone && onDone(true);
      } catch (err) {
        onDone && onDone(false, err.message);
      }
    };
    reader.readAsText(file);
  }

  // ------------------------------------------------------------
  //  PAGE HELPERS
  // ------------------------------------------------------------
  function getPage(id) { return load().pages.find(p => p.id === id); }
  function updatePage(id, mutator) {
    const data = load();
    const idx = data.pages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const s = currentSession();
    mutator(data.pages[idx]);
    data.pages[idx].updatedAt = Date.now();
    data.pages[idx].updatedBy = s ? s.name : 'system';
    save(data);
    return data.pages[idx];
  }

  // ------------------------------------------------------------
  //  SECTION LIBRARY (available types)
  // ------------------------------------------------------------
  const SECTION_TYPES = {
    hero: {
      label: 'Hero', icon: '🖼',
      fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'textarea' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { key: 'ctaPrimary.label', label: 'Primary CTA label', type: 'text' },
        { key: 'ctaPrimary.href', label: 'Primary CTA link', type: 'text' },
        { key: 'ctaSecondary.label', label: 'Secondary CTA label', type: 'text' },
        { key: 'ctaSecondary.href', label: 'Secondary CTA link', type: 'text' },
        { key: 'slides', label: 'Slides (images)', type: 'imagelist' }
      ]
    },
    stats: { label: 'Stats Band', icon: '#', fields: [{ key: 'items', label: 'Stats', type: 'itemlist', schema: ['value','label'] }] },
    text:  { label: 'Text Block',  icon: 'T', fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' }
    ]},
    image: { label: 'Image',       icon: '◧', fields: [
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt text', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' }
    ]},
    cta:   { label: 'Call to Action', icon: '!', fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'sub', label: 'Subheading', type: 'textarea' },
      { key: 'primary.label', label: 'Primary CTA label', type: 'text' },
      { key: 'primary.href', label: 'Primary CTA link', type: 'text' },
      { key: 'secondary.label', label: 'Secondary CTA label', type: 'text' },
      { key: 'secondary.href', label: 'Secondary CTA link', type: 'text' }
    ]},
    gallery: { label: 'Gallery', icon: '▦', fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'items', label: 'Images', type: 'itemlist', schema: ['name','image','href'] }
    ]},
    features: { label: 'Features Grid', icon: '⊞', fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'items', label: 'Features', type: 'itemlist', schema: ['title','body'] }
    ]}
  };

  const LAYOUTS = [
    { id: 'standard', label: 'Standard',  description: 'Default content width' },
    { id: 'wide',     label: 'Wide',      description: 'Edge-to-edge layout' },
    { id: 'narrow',   label: 'Narrow',    description: 'Editorial / focused' }
  ];

  // ------------------------------------------------------------
  //  PUBLIC API
  // ------------------------------------------------------------
  global.CMS = {
    STORAGE_KEY, SECTION_TYPES, LAYOUTS,
    load, save, reset,
    login, logout, currentSession, requireAuth, can, gate,
    logActivity, snapshot, restoreVersion,
    toast, el, escape, modal, confirmDialog, relTime,
    exportJSON, importJSON,
    getPage, updatePage,
    sec, page // factories
  };

})(window);
