/* ============================================================
   SABDIA — NAV & FOOTER COMPONENTS (v2)
   ============================================================ */

(function () {
  const base = document.documentElement.dataset.base || document.body.dataset.base || '';

  // Brisbane time (UTC+10, no DST)
  const fmtBris = () => {
    try {
      return new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Brisbane',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(new Date()) + ' BNE';
    } catch (e) { return 'BNE'; }
  };

  const navHTML = `
<div id="cur" aria-hidden="true"></div>
<div id="cur-r" aria-hidden="true"></div>

<div id="loader" aria-hidden="true">
  <div class="ld-logo">
    <img src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_422,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png" alt="" loading="eager">
  </div>
  <div class="ld-rule"></div>
  <div class="ld-meta">Sabdia · Est. 2013</div>
</div>

<div class="mob-nav" id="mobNav" aria-hidden="true">
  <nav class="mob-nav-links" aria-label="Mobile">
    <a href="${base}properties/">For Sale</a>
    <a href="${base}services.html">Services</a>
    <a href="${base}about.html">About</a>
    <a href="${base}projects.html">Projects</a>
    <a href="${base}collection.html">Collection</a>
    <a href="${base}agent-access.html">Agent Access</a>
    <a href="${base}contact.html">Contact</a>
  </nav>
  <div class="mob-nav-rule"></div>
  <div class="mob-nav-sub">
    <a href="https://www.instagram.com/_sabdia/" target="_blank" rel="noopener">Instagram</a>
    <a href="https://www.facebook.com/sabdiaconstructions/" target="_blank" rel="noopener">Facebook</a>
    <a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank" rel="noopener">LinkedIn</a>
  </div>
</div>

<nav id="mainNav" aria-label="Primary">
  <a href="${base}index.html" class="nav-logo" aria-label="Sabdia Constructions — Home">
    <img class="logo-light"
         src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png"
         alt="Sabdia Constructions — Design Develop Construct"
         style="filter:invert(1) brightness(10)">
    <img class="logo-dark"
         src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png"
         alt="Sabdia Constructions — Design Develop Construct">
  </a>
  <ul class="nav-center">
    <li><a href="${base}properties/">For Sale</a></li>
    <li><a href="${base}services.html">Services</a></li>
    <li><a href="${base}about.html">About</a></li>
    <li><a href="${base}projects.html">Projects</a></li>
    <li><a href="${base}collection.html">Collection</a></li>
    <li><a href="${base}agent-access.html">Agent Access</a></li>
  </ul>
  <div class="nav-right">
    <span class="nav-time mono" id="navTime" aria-hidden="true">${fmtBris()}</span>
    <a href="${base}contact.html" class="nav-cta">Enquire</a>
    <button class="mob-btn" id="mobBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobNav"><span></span><span></span></button>
  </div>
</nav>`;

  const footerHTML = `
<footer>
  <div class="footer-tagline">
    <div class="footer-tagline-inner">
      <h2 class="footer-tag-h">Design. <em>Develop.</em><br>Construct.</h2>
      <p class="footer-tag-sub">Boutique luxury home builder &amp; developer delivering award-winning residences across inner Brisbane since 2013.</p>
    </div>
  </div>
  <div class="fg-grid">
    <div>
      <a href="${base}index.html" class="flogo" aria-label="Sabdia Constructions">
        <img src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png" alt="Sabdia Constructions">
      </a>
      <p class="ftag">Boutique Luxury Home Builder &amp;<br>Developer — Brisbane, QLD</p>
      <div class="fsoc">
        <a href="https://www.instagram.com/_sabdia/" target="_blank" rel="noopener" class="fsl" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://www.facebook.com/sabdiaconstructions/" target="_blank" rel="noopener" class="fsl" aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank" rel="noopener" class="fsl" aria-label="LinkedIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      </div>
    </div>
    <div>
      <div class="fct">For Sale</div>
      <ul class="fcl">
        <li><a href="${base}properties/qasr.html">QASR — Coorparoo</a></li>
        <li><a href="${base}properties/solace.html">SOLACE — Camp Hill</a></li>
        <li><a href="${base}properties/sierra.html">SIERRA — Holland Park West</a></li>
        <li><a href="${base}properties/caspian.html">CASPIAN — Ascot</a></li>
        <li><a href="${base}properties/">View All Properties</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Company</div>
      <ul class="fcl">
        <li><a href="${base}about.html">About Sabdia</a></li>
        <li><a href="${base}services.html">Services</a></li>
        <li><a href="${base}projects.html">Projects</a></li>
        <li><a href="${base}collection.html">Collection</a></li>
        <li><a href="${base}agent-access.html">Agent Access</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Connect</div>
      <ul class="fcl">
        <li><a href="${base}contact.html">Contact Us</a></li>
        <li><a href="https://www.instagram.com/_sabdia/" target="_blank" rel="noopener">Instagram @_sabdia</a></li>
        <li><a href="https://www.facebook.com/sabdiaconstructions/" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="https://www.sabdiaconstructions.com.au" target="_blank" rel="noopener">sabdiaconstructions.com.au</a></li>
      </ul>
    </div>
  </div>
  <div class="fbot">
    <div class="fcopy">&copy; 2025 Sabdia Constructions Pty Ltd. All rights reserved.</div>
    <div class="flinks">
      <a href="${base}contact.html">Accessibility</a>
      <a href="${base}contact.html">Privacy</a>
    </div>
  </div>
</footer>`;

  const navEl = document.getElementById('nav-placeholder');
  const footEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.outerHTML = navHTML;
  if (footEl) footEl.outerHTML = footerHTML;

  // Tick Brisbane clock in nav
  setInterval(() => {
    const el = document.getElementById('navTime');
    if (el) el.textContent = fmtBris();
  }, 30000);
})();
