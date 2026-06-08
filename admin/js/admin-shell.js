/* ============================================================
   SABDIA CMS — ADMIN SHELL
   Sidebar + Topbar injected into every admin page
   ============================================================ */
(function () {
  const ICON = {
    dash:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    pages:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h5"/></svg>',
    media:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 18l5-5 4 4 3-3 6 6"/></svg>',
    globals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    users:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-3-5.2"/></svg>',
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 8v5l3 2"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    logout:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    site:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3h7v7M10 21H3v-7M21 3l-9 9M3 21l9-9"/></svg>',
    menu:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
  };

  function initials(name) {
    return (name || '?').split(/\s+/).map(s => s[0]).join('').slice(0,2).toUpperCase();
  }

  window.AdminShell = {
    /**
     * Mount the admin sidebar + topbar.
     * @param {string} active - active nav key
     * @param {object} opts - { title, crumbs:[], actions: HTMLElement[] }
     */
    mount(active, opts) {
      opts = opts || {};
      const session = CMS.requireAuth();
      if (!session) return null;

      const navItems = [
        { key: 'dashboard', href: 'index.html',  label: 'Dashboard',     icon: ICON.dash,    perm: null },
        { key: 'pages',     href: 'pages.html',  label: 'Pages',         icon: ICON.pages,   perm: 'pages.view' },
        { key: 'media',     href: 'media.html',  label: 'Media',         icon: ICON.media,   perm: 'media.view' },
        { key: 'globals',   href: 'globals.html',label: 'Global Content',icon: ICON.globals, perm: 'globals.view' },
        { key: 'history',   href: 'history.html',label: 'Version History',icon: ICON.history,perm: 'history.view' },
        { key: 'users',     href: 'users.html',  label: 'Users & Roles', icon: ICON.users,   perm: 'users.view' },
        { key: 'settings',  href: 'settings.html',label:'Settings',      icon: ICON.settings,perm: 'settings.edit' }
      ];

      const navHTML = navItems
        .filter(i => !i.perm || CMS.can(i.perm))
        .map(i => `<a href="${i.href}" class="${active === i.key ? 'active' : ''}" data-nav="${i.key}">${i.icon}<span>${i.label}</span></a>`)
        .join('');

      const shell = CMS.el(`
        <div class="app">
          <aside class="sidebar" id="sb">
            <div class="sb-brand">
              <div class="sb-brand-name">Sabdia CMS</div>
              <div class="sb-brand-sub">Admin · v1.0</div>
            </div>
            <nav class="sb-nav">${navHTML}</nav>
            <div class="sb-foot">
              <div class="sb-user">
                <div class="sb-avatar">${initials(session.name)}</div>
                <div class="sb-user-info">
                  <div class="sb-user-name">${CMS.escape(session.name)}</div>
                  <div class="sb-user-role">${CMS.escape(session.role)}</div>
                </div>
              </div>
              <button class="sb-logout" id="sbLogout" aria-label="Sign out">${ICON.logout}</button>
            </div>
          </aside>
          <div class="main">
            <header class="topbar">
              <div class="topbar-l">
                <button class="btn btn-icon mob-menu-btn" id="mobMenuBtn" aria-label="Menu">${ICON.menu}</button>
                <div>
                  <div class="tb-crumbs">${(opts.crumbs || ['Admin']).map((c, i, arr) => i === arr.length - 1 ? `<span>${CMS.escape(c)}</span>` : CMS.escape(c) + ' / ').join('')}</div>
                  <h1 class="tb-title">${CMS.escape(opts.title || 'Dashboard')}</h1>
                </div>
              </div>
              <div class="topbar-r" id="topActions"></div>
            </header>
            <div class="content" id="content"></div>
          </div>
        </div>
      `);

      document.body.innerHTML = '';
      document.body.appendChild(shell);

      // Top actions
      const topActions = shell.querySelector('#topActions');
      if (opts.actions) {
        opts.actions.forEach(a => topActions.appendChild(a));
      }
      // Universal "View Site" action
      const viewSite = CMS.el(`<a href="../index.html" target="_blank" class="btn btn-sm">${ICON.site}<span>View Site</span></a>`);
      topActions.appendChild(viewSite);

      shell.querySelector('#sbLogout').addEventListener('click', () => {
        CMS.logout();
        window.location.href = 'login.html';
      });
      const mobBtn = shell.querySelector('#mobMenuBtn');
      mobBtn && mobBtn.addEventListener('click', () => {
        shell.querySelector('#sb').classList.toggle('open');
      });

      return shell.querySelector('#content');
    },

    /** Quick button factory for topbar actions */
    button(label, opts) {
      opts = opts || {};
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm' + (opts.primary ? ' btn-primary' : '') + (opts.danger ? ' btn-danger' : '');
      btn.textContent = label;
      if (opts.onClick) btn.addEventListener('click', opts.onClick);
      return btn;
    }
  };
})();
