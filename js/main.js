/* ============================================================
   SABDIA CONSTRUCTIONS — MAIN JS
   ============================================================ */

// ── LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (!l) return;
    l.classList.add('out');
    setTimeout(() => l.remove(), 950);
  }, 1800);
});

// ── CURSOR ──────────────────────────────────────────────────
if (window.innerWidth > 768) {
  const cur = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if (cur && curR) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    (function animate() {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
      requestAnimationFrame(animate);
    })();
    document.querySelectorAll('a,button,.pc,.svc-item,.sc-card,.col-item,.proj-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });
  }
}

// ── NAV SCROLL STATE ────────────────────────────────────────
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  const onScroll = () => mainNav.classList.toggle('sc', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── MOBILE NAV ──────────────────────────────────────────────
const mobBtn = document.getElementById('mobBtn');
const mobNav = document.getElementById('mobNav');
if (mobBtn && mobNav) {
  let open = false;
  mobBtn.addEventListener('click', () => {
    open = !open;
    mobNav.classList.toggle('open', open);
    const spans = mobBtn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
    }
  });
  mobNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      mobNav.classList.remove('open');
      mobBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── HERO SLIDESHOW ──────────────────────────────────────────
const slides = document.querySelectorAll('.h-slide');
const dots = document.querySelectorAll('.h-dot');
if (slides.length > 1) {
  let si = 0;
  const goTo = (i) => {
    slides[si].classList.remove('active');
    dots[si]?.classList.remove('active');
    si = i;
    slides[si].classList.add('active');
    dots[si]?.classList.add('active');
  };
  setInterval(() => goTo((si + 1) % slides.length), 5800);
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
}

// ── REVEAL ON SCROLL ────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.reveal,.reveal-x,.reveal-r').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ───────────────────────────────────────
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    const start = performance.now();
    const duration = 2000;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ep = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(ep * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── PARALLAX HERO ───────────────────────────────────────────
if (window.innerWidth > 768) {
  const hContent = document.querySelector('.h-content');
  if (hContent) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        hContent.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }
}

// ── SMOOTH SCROLL ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ── CONTACT FORM ────────────────────────────────────────────
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('fsub');
    if (!btn) return;
    btn.textContent = 'Sending…';
    btn.style.background = '#6B6860';
    setTimeout(() => {
      btn.textContent = 'Thank you — we\'ll be in touch shortly.';
      btn.style.background = 'var(--ink2)';
      btn.disabled = true;
    }, 1500);
  });
}
