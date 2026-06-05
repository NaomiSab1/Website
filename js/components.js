/* ============================================================
   SABDIA — NAV & FOOTER COMPONENTS
   Inject shared nav/footer into every page.
   Each page sets: <body data-base=""> (root) or data-base="../" (subdir)
   ============================================================ */

(function () {
  const base = document.documentElement.dataset.base || document.body.dataset.base || '';

  /* ── NAV ── */
  const navHTML = `
<div id="cur"></div>
<div id="cur-r"></div>

<div id="loader">
  <div class="ld-logo">
    <img src="${base}assets/logo.png" alt="Sabdia Constructions"
         onerror="this.onerror=null;this.src='https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_422,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png'">
  </div>
  <div class="ld-rule"></div>
</div>

<div class="mob-nav" id="mobNav">
  <div class="mob-nav-links">
    <a href="${base}properties/">For Sale</a>
    <a href="${base}services.html">Services</a>
    <a href="${base}about.html">About</a>
    <a href="${base}projects.html">Projects</a>
    <a href="${base}agent-access.html">Agent Access</a>
    <a href="${base}contact.html">Contact</a>
  </div>
  <div class="mob-nav-rule"></div>
  <div class="mob-nav-sub">
    <a href="https://www.instagram.com/_sabdia/" target="_blank">Instagram</a>
    <a href="https://www.facebook.com/sabdiaconstructions/" target="_blank">Facebook</a>
    <a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank">LinkedIn</a>
  </div>
</div>

<nav id="mainNav">
  <a href="${base}index.html" class="nav-logo">
    <img class="logo-light"
         src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png"
         alt="Sabdia Constructions"
         style="filter:invert(1) brightness(10)">
    <img class="logo-dark"
         src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png"
         alt="Sabdia Constructions">
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
    <a href="${base}contact.html" class="nav-cta">Enquire</a>
    <button class="mob-btn" id="mobBtn" aria-label="Menu"><span></span><span></span></button>
  </div>
</nav>`;

  /* ── FOOTER ── */
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
      <a href="${base}index.html" class="flogo">
        <img src="https://static.wixstatic.com/media/1cc2db_f012027bbf0c45ebb4ae6d847309d59f~mv2.png/v1/fill/w_211,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DESIGN%20%C2%B7%20DEVELOP%20%C2%B7%20CONSTRUCT.png" alt="Sabdia Constructions">
      </a>
      <p class="ftag">Boutique Luxury Home Builder &amp;<br>Developer — Brisbane, QLD</p>
      <div class="fsoc">
        <a href="https://www.instagram.com/_sabdia/" target="_blank" class="fsl" aria-label="Instagram">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://www.facebook.com/sabdiaconstructions/" target="_blank" class="fsl" aria-label="Facebook">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank" class="fsl" aria-label="LinkedIn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
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
        <li><a href="https://www.instagram.com/_sabdia/" target="_blank">Instagram @_sabdia</a></li>
        <li><a href="https://www.facebook.com/sabdiaconstructions/" target="_blank">Facebook</a></li>
        <li><a href="https://www.linkedin.com/company/sabdia-constructions/" target="_blank">LinkedIn</a></li>
        <li><a href="https://www.sabdiaconstructions.com.au" target="_blank">sabdiaconstructions.com.au</a></li>
      </ul>
    </div>
  </div>
  <div class="fbot">
    <div class="fcopy">&copy; 2025 Sabdia Constructions Pty Ltd. All rights reserved.</div>
    <div class="flinks">
      <a href="${base}contact.html">Accessibility</a>
      <a href="${base}contact.html">Privacy Policy</a>
    </div>
  </div>
</footer>`;

  /* Inject */
  const navEl = document.getElementById('nav-placeholder');
  const footEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.outerHTML = navHTML;
  if (footEl) footEl.outerHTML = footerHTML;
})();
