/* ============================================================
   SABDIA CMS — LIVE-SITE RUNTIME
   Applies CMS-managed content (SEO, globals, section overrides)
   to the static website. Also drives ?cms_preview=1 mode.
   ============================================================ */
(function () {
  const STORAGE_KEY = 'sabdia.cms.v1';
  const PREVIEW_KEY = 'sabdia.cms.preview';
  const isPreview   = new URLSearchParams(location.search).get('cms_preview') === '1';

  // ----------------------------------------------------------
  //  Load CMS data + figure out current page
  // ----------------------------------------------------------
  let cms;
  try { cms = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { cms = null; }
  if (!cms) return; // No CMS configured — leave hand-coded content alone

  // Match this page to a CMS page by slug (filename or "")
  const path = location.pathname.replace(/\/+$/, '/'); // normalize trailing slash
  const file = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
  const isRoot = path === '/' || path.endsWith('/') && !file;
  const slug = file && file.length ? file : 'index.html';

  let pageData = cms.pages.find(p => p.slug === slug || p.slug === '/' + slug || ('/' + p.slug) === path);
  if (!pageData && slug === 'index.html') pageData = cms.pages.find(p => p.id === 'home');

  // ----------------------------------------------------------
  //  Preview mode override
  // ----------------------------------------------------------
  let previewMeta = null;
  if (isPreview) {
    try {
      const pv = JSON.parse(sessionStorage.getItem(PREVIEW_KEY) || 'null');
      if (pv) {
        const target = cms.pages.find(p => p.id === pv.pageId);
        if (target) {
          pageData = JSON.parse(JSON.stringify(target));
          pageData.sections = pv.working;
          pageData.title = pv.meta.title;
          pageData.slug = pv.meta.slug;
          pageData.layout = pv.meta.layout;
          pageData.seo = pv.meta.seo;
          previewMeta = pv;
        }
      }
    } catch (e) {}
  }

  // ----------------------------------------------------------
  //  Skip applying overrides if page is archived
  // ----------------------------------------------------------
  if (pageData && pageData.status === 'archived' && !isPreview) {
    // Optionally redirect or leave as is — we leave it
  }

  // ----------------------------------------------------------
  //  1. SEO / meta overrides
  // ----------------------------------------------------------
  if (pageData && pageData.seo) {
    if (pageData.seo.title) document.title = pageData.seo.title;
    setMeta('description', pageData.seo.description);
    setMeta('keywords', pageData.seo.keywords);
    setProp('og:title', pageData.seo.title || pageData.title);
    setProp('og:description', pageData.seo.description);
    if (pageData.seo.ogImage) setProp('og:image', pageData.seo.ogImage);
  }

  // ----------------------------------------------------------
  //  2. Expose CMS globals for components.js to consume
  // ----------------------------------------------------------
  window.__CMS__ = {
    site: cms.site, nav: cms.nav, navCTA: cms.navCTA,
    footer: cms.footer, contact: cms.contact, siteCTA: cms.siteCTA,
    page: pageData
  };

  // ----------------------------------------------------------
  //  3. Apply section overrides once DOM is ready
  // ----------------------------------------------------------
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(applyAll);

  function applyAll() {
    if (!pageData) return;

    // Apply layout class to <body>
    if (pageData.layout) document.body.classList.add('cms-layout-' + pageData.layout);

    // Apply each section type via known selectors
    const sections = pageData.sections.filter(s => s.visible);
    sections.forEach(applySection);

    // Hide sections that are toggled off in CMS but present in HTML
    pageData.sections.filter(s => !s.visible).forEach(hideSection);

    // Preview bar
    if (isPreview && previewMeta) injectPreviewBar();
  }

  // ----------------------------------------------------------
  //  Section apply helpers
  // ----------------------------------------------------------
  function applySection(sec) {
    try {
      switch (sec.type) {
        case 'hero':     return applyHero(sec);
        case 'stats':    return applyStats(sec);
        case 'text':     return applyText(sec);
        case 'cta':      return applyCTA(sec);
        case 'gallery':  return applyGallery(sec);
        case 'features': return applyFeatures(sec);
        case 'image':    return applyImage(sec);
      }
    } catch (e) { console.warn('CMS apply failed for section', sec, e); }
  }

  function hideSection(sec) {
    // Best-effort: hide HTML region matching this section's type if marked
    const node = document.querySelector(`[data-cms-section="${sec.id}"]`);
    if (node) node.style.display = 'none';
  }

  function applyHero(sec) {
    const hero = document.querySelector('.hero, header.hero, section.hero');
    if (!hero) return;
    const c = sec.content || {};

    const title = hero.querySelector('.h-title');
    if (title && c.title) {
      // Tokenize: support newlines or " · " separators
      const tokens = String(c.title).split(/[\n·]+/).map(s => s.trim()).filter(Boolean);
      const hasDots = !!title.querySelector('.h-title-dot');
      const hasEm   = !!title.querySelector('em');
      if (hasDots) {
        title.innerHTML = tokens.map(t => escapeHTML(t)).join('<span class="h-title-dot"> · </span>');
      } else if (hasEm && tokens.length > 1) {
        // Preserve the old <br><em>middle</em><br> pattern
        title.innerHTML = tokens.map((t, i) => i === 1 ? `<em>${escapeHTML(t)}</em>` : escapeHTML(t)).join('<br>');
      } else if (tokens.length > 1) {
        title.innerHTML = tokens.map(t => escapeHTML(t)).join('<br>');
      } else {
        title.textContent = c.title;
      }
    }

    setText(hero.querySelector('.h-eyebrow-txt'), c.eyebrow);
    setText(hero.querySelector('.h-desc, .h-sub, .h-subtitle'), c.subtitle);

    const actions = hero.querySelector('.h-actions');
    if (actions) {
      const links = actions.querySelectorAll('a');
      if (links[0] && c.ctaPrimary) {
        const arrow = links[0].querySelector('.btn-arrow');
        links[0].href = c.ctaPrimary.href || links[0].href;
        links[0].textContent = (c.ctaPrimary.label || links[0].textContent.trim()) + ' ';
        if (arrow) links[0].appendChild(arrow);
      }
      if (links[1] && c.ctaSecondary) {
        links[1].href = c.ctaSecondary.href || links[1].href;
        links[1].textContent = c.ctaSecondary.label || links[1].textContent.trim();
      }
    }

    // Slides (legacy slideshow layout)
    if (Array.isArray(c.slides) && c.slides.length) {
      const slidesHost = hero.querySelector('.h-slides, #hSlides');
      if (slidesHost) {
        slidesHost.innerHTML = c.slides.map((s, i) => `
          <div class="h-slide ${i === 0 ? 'active' : ''}" data-name="${escapeAttr(s.name || '')}">
            <img src="${escapeAttr(s.image || '')}" alt="${escapeAttr(s.name || '')}" loading="${i === 0 ? 'eager' : 'lazy'}">
          </div>
        `).join('');
        const stripName = document.getElementById('hStripName');
        const stripNum = document.getElementById('hStripNum');
        if (stripName) stripName.textContent = c.slides[0].name || '';
        if (stripNum) stripNum.innerHTML = `01 <span>/ ${String(c.slides.length).padStart(2, '0')}</span>`;
      }
      // New hero layout single bg image
      const heroBg = hero.querySelector('.h-bg img, .h-image img');
      if (heroBg && c.slides[0]) heroBg.src = c.slides[0].image;
    }
  }

  function applyStats(sec) {
    const grid = document.querySelector('.stats-grid');
    if (!grid || !sec.content || !Array.isArray(sec.content.items)) return;
    const tiles = grid.querySelectorAll('.stat');
    sec.content.items.forEach((it, i) => {
      if (!tiles[i]) return;
      const n = tiles[i].querySelector('.stat-n');
      const l = tiles[i].querySelector('.stat-l span');
      if (n) {
        // Strip out counter behavior; just set the value text
        const m = String(it.value || '').match(/^(\d+)?(.*)$/);
        if (m) {
          const counter = n.querySelector('.counter');
          const unit = n.querySelector('.stat-u');
          if (counter && m[1]) { counter.textContent = m[1]; counter.removeAttribute('data-target'); }
          if (unit) unit.textContent = m[2] || '';
          if (!counter) n.textContent = it.value || '';
        }
      }
      if (l) l.textContent = it.label || '';
    });
  }

  function applyText(sec) {
    // Generic: try to find a section with .reveal heading or any matching h2
    const c = sec.content || {};
    // For now, log so we don't silently drop — content text sections are page-specific
    // If we have a marker, use it
    const marker = document.querySelector(`[data-cms-section="${sec.id}"]`);
    if (marker) {
      const eb = marker.querySelector('[data-cms="eyebrow"]'); if (eb) eb.textContent = c.eyebrow || '';
      const h = marker.querySelector('[data-cms="heading"]'); if (h) h.textContent = c.heading || '';
      const b = marker.querySelector('[data-cms="body"]'); if (b) b.textContent = c.body || '';
    }
  }

  function applyCTA(sec) {
    const c = sec.content || {};
    // Look for any .cta-band or closing CTA region
    const node = document.querySelector('[data-cms-section="' + sec.id + '"], .cta-band, .closing-cta');
    if (!node) return;
    const h = node.querySelector('h2, h1');
    if (h && c.heading) h.textContent = c.heading;
    const sub = node.querySelector('p, .sub');
    if (sub && c.sub) sub.textContent = c.sub;
    const links = node.querySelectorAll('a');
    if (links[0] && c.primary) { links[0].textContent = c.primary.label || links[0].textContent; links[0].href = c.primary.href || links[0].href; }
    if (links[1] && c.secondary) { links[1].textContent = c.secondary.label || links[1].textContent; links[1].href = c.secondary.href || links[1].href; }
  }

  function applyGallery(sec) {
    const node = document.querySelector('[data-cms-section="' + sec.id + '"]');
    if (!node) return;
    const items = sec.content.items || [];
    node.innerHTML = items.map(it => `
      <a href="${escapeAttr(it.href || '#')}" class="gallery-item">
        <img src="${escapeAttr(it.image || '')}" alt="${escapeAttr(it.name || '')}">
        <div class="gallery-name">${escapeHTML(it.name || '')}</div>
      </a>`).join('');
  }

  function applyFeatures(sec) {
    const node = document.querySelector('[data-cms-section="' + sec.id + '"]');
    if (!node) return;
    const items = sec.content.items || [];
    node.innerHTML = items.map(it => `
      <div class="feature">
        <h3>${escapeHTML(it.title || '')}</h3>
        <p>${escapeHTML(it.body || '')}</p>
      </div>`).join('');
  }

  function applyImage(sec) {
    const node = document.querySelector('[data-cms-section="' + sec.id + '"]');
    if (!node) return;
    const c = sec.content || {};
    const img = node.querySelector('img');
    if (img) { if (c.image) img.src = c.image; if (c.alt) img.alt = c.alt; }
    const cap = node.querySelector('.caption, figcaption');
    if (cap && c.caption) cap.textContent = c.caption;
  }

  // ----------------------------------------------------------
  //  Preview bar
  // ----------------------------------------------------------
  function injectPreviewBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: #C9A86A; color: #1a1611; padding: 10px 18px;
      font-family: -apple-system, system-ui, sans-serif; font-size: 13px; font-weight: 500;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 12px rgba(0,0,0,.3);
    `;
    bar.innerHTML = `
      <div>● Preview mode — showing unpublished draft for "${escapeHTML(pageData.title)}"</div>
      <div>
        <button id="cmsPvClose" style="background:rgba(0,0,0,.15);border:none;color:#1a1611;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:600">Exit preview</button>
      </div>
    `;
    document.body.appendChild(bar);
    document.body.style.paddingTop = (bar.offsetHeight) + 'px';
    document.getElementById('cmsPvClose').addEventListener('click', () => {
      sessionStorage.removeItem(PREVIEW_KEY);
      location.href = location.pathname;
    });
  }

  // ----------------------------------------------------------
  //  Util
  // ----------------------------------------------------------
  function setMeta(name, value) {
    if (!value) return;
    let m = document.querySelector(`meta[name="${name}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', value);
  }
  function setProp(prop, value) {
    if (!value) return;
    let m = document.querySelector(`meta[property="${prop}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
    m.setAttribute('content', value);
  }
  function setText(node, value) { if (node && value != null && value !== '') node.textContent = value; }
  function escapeHTML(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function escapeAttr(s) { return escapeHTML(s); }
})();
