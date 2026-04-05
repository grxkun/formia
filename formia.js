/**
 * formia.js — Frontend Design Engine
 * v1.0 | The runtime that powers FORMA sites.
 * Handles: themes, accents, color mode, viewport preview,
 * studio panel, PWA, GSAP choreography, Three.js scene,
 * custom cursor, scroll progress.
 *
 * Usage:
 *   <script src="formia.js" defer></script>
 *   — Requires GSAP + ScrollTrigger + Three.js loaded first.
 *   — All config via FORMIA.config or data attributes.
 */

(function () {
  'use strict';

  // ── Theme Registry ──────────────────────────────────────
  const THEMES = {
    earth:         { th: null,            ac: '#8fe05e', a2: '#2d5016', pc: 0x8fe05e, label: 'Earth' },
    amber:         { th: 'amber',         ac: '#e8b84b', a2: '#7a5c1e', pc: 0xe8b84b, label: 'Amber Dark' },
    terminal:      { th: 'terminal',      ac: '#c8ff96', a2: '#1a4500', pc: 0xc8ff96, label: 'Terminal' },
    editorial:     { th: 'editorial',     ac: '#b83216', a2: '#7a1e08', pc: 0xb83216, label: 'Editorial' },
    cobalt:        { th: 'cobalt',        ac: '#6080ff', a2: '#2030a0', pc: 0x6080ff, label: 'Cobalt' },
    professional:  { th: 'professional',  ac: '#1a56db', a2: '#0d3a9e', pc: 0x1a56db, label: 'Professional' },
    kindergarten:  { th: 'kindergarten',  ac: '#ff4081', a2: '#1a0e3f', pc: 0xff4081, label: 'Kindergarten' },
    beach:         { th: 'beach',         ac: '#ff6b6b', a2: '#a02828', pc: 0xff6b6b, label: 'Beach Party' },
    forest:        { th: 'forest',        ac: '#7dc97c', a2: '#3a6e39', pc: 0x7dc97c, label: 'Forest' },
    digital:       { th: 'digital',       ac: '#ff00ff', a2: '#550055', pc: 0xff00ff, label: 'Digital' },
    manufacturing: { th: 'manufacturing', ac: '#f5a623', a2: '#7a4e00', pc: 0xf5a623, label: 'Manufacturing' },
  };

  // ── State ───────────────────────────────────────────────
  let currentTheme = 'earth';
  let currentAccent = '#8fe05e';
  let colorMode = 'system';
  let vpToastTimer;
  let pwaEnabled = false;
  let deferredInstallPrompt = null;
  let swRegistered = false;

  // Three.js refs (set during scene init)
  let _pm = null; // PointsMaterial
  let _rm = null; // RingMaterial

  // Cursor state
  let mx = 0, my = 0, cx = 0, cy = 0;

  // ── Helpers ─────────────────────────────────────────────
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function updateBadge(id, text, cls) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'pwab ' + cls;
  }

  // ── 1. Theme Engine ─────────────────────────────────────
  function applyTheme(id) {
    const cfg = THEMES[id];
    if (!cfg) return;
    currentTheme = id;
    currentAccent = cfg.ac;

    // Transition class for smooth swap
    document.body.classList.add('sw');
    setTimeout(() => document.body.classList.remove('sw'), 460);

    // Set or remove data-theme
    if (cfg.th) {
      document.body.setAttribute('data-theme', cfg.th);
    } else {
      document.body.removeAttribute('data-theme');
    }

    // CSS custom properties
    document.documentElement.style.setProperty('--ac', cfg.ac);
    document.documentElement.style.setProperty('--a2', cfg.a2);

    // Three.js materials
    if (_pm) _pm.color.setHex(cfg.pc);
    if (_rm) _rm.color.setHex(cfg.pc);

    syncUI(id, cfg.ac);
    document.title = `FORMA — ${cfg.label}`;
  }

  // ── 2. Accent System ────────────────────────────────────
  function setAccent(color) {
    currentAccent = color;
    document.documentElement.style.setProperty('--ac', color);

    const hex = parseInt(color.replace('#', ''), 16);
    if (_pm) _pm.color.setHex(hex);

    $$('.sw').forEach(s => s.classList.toggle('active', s.dataset.c === color));

    const swp = document.getElementById('swp');
    if (swp) swp.style.background = color;

    const prog = document.getElementById('prog');
    if (prog) prog.style.background = color;
  }

  // ── 3. Color Mode ───────────────────────────────────────
  function setColorMode(mode) {
    colorMode = mode;
    $$('.mb2').forEach(b => b.classList.toggle('active', b.dataset.m === mode));

    if (mode === 'system') {
      document.body.removeAttribute('data-mode');
    } else {
      document.body.setAttribute('data-mode', mode);
    }
  }

  // ── 4. Viewport Preview ─────────────────────────────────
  function setViewport(mode) {
    document.documentElement.classList.remove('vp-phone', 'vp-tablet');
    if (mode !== 'desktop') {
      document.documentElement.classList.add('vp-' + mode);
    }

    $$('.vb2').forEach(b => b.classList.toggle('active', b.dataset.vp === mode));

    const labels = { desktop: '🖥 Desktop — Full Width', tablet: '📱 Tablet — 820px', phone: '📲 Phone — 390px' };
    const toast = document.getElementById('vp-toast');
    if (toast) {
      toast.textContent = labels[mode] || '';
      toast.classList.add('show');
      clearTimeout(vpToastTimer);
      vpToastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  // ── 5. UI Sync ──────────────────────────────────────────
  function syncUI(id, ac) {
    $$('.ts').forEach(c => c.classList.toggle('active', c.dataset.t === id));
    $$('.ptp').forEach(c => c.classList.toggle('active', c.dataset.t === id));
    $$('.sw').forEach(s => s.classList.toggle('active', s.dataset.c === ac));

    const swp = document.getElementById('swp');
    if (swp) swp.style.background = ac;

    const prog = document.getElementById('prog');
    if (prog) prog.style.background = ac;

    const meta = document.getElementById('tc-meta');
    if (meta) meta.setAttribute('content', ac);
  }

  // ── 6. Studio Panel ────────────────────────────────────
  function initStudio() {
    const btn = document.getElementById('studio-btn');
    const panel = document.getElementById('studio');
    const closeBtn = document.getElementById('stx');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => panel.classList.toggle('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));

    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('open');
      }
    });

    // Keyboard shortcut: T to toggle studio
    document.addEventListener('keydown', e => {
      if (e.key === 't' && !e.target.matches('input,textarea')) {
        panel.classList.toggle('open');
      }
    });

    // Template cards (panel)
    $$('.ptp').forEach(c => c.addEventListener('click', () => applyTheme(c.dataset.t)));

    // Template cards (page grid)
    $$('.ts[data-t]').forEach(c => c.addEventListener('click', () => applyTheme(c.dataset.t)));

    // Accent swatches
    $$('.sw[data-c]').forEach(s => s.addEventListener('click', () => setAccent(s.dataset.c)));

    // Viewport buttons
    $$('.vb2[data-vp]').forEach(b => b.addEventListener('click', () => setViewport(b.dataset.vp)));

    // Color mode buttons
    $$('.mb2[data-m]').forEach(b => b.addEventListener('click', () => setColorMode(b.dataset.m)));

    // PWA toggle
    const ptog = document.getElementById('ptog');
    if (ptog) ptog.addEventListener('click', togglePWA);

    // Install button
    const pwai = document.getElementById('pwai');
    if (pwai) pwai.addEventListener('click', triggerInstall);
  }

  // ── 7. PWA Manager ──────────────────────────────────────
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaEnabled) {
      updateBadge('bir', 'READY', 'on');
      const inst = document.getElementById('pwai');
      if (inst) inst.classList.add('show');
    }
  });

  if (window.matchMedia('(display-mode:standalone)').matches) {
    updateBadge('bsa', 'ACTIVE', 'on');
  }

  function togglePWA() {
    pwaEnabled = !pwaEnabled;
    const tog = document.getElementById('ptog');
    if (tog) tog.classList.toggle('on', pwaEnabled);
    pwaEnabled ? enablePWA() : disablePWA();
  }

  function enablePWA() {
    const ac = currentAccent;
    const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#f0ebe0';

    const manifest = {
      name: `FORMA — ${currentTheme[0].toUpperCase() + currentTheme.slice(1)}`,
      short_name: 'FORMA',
      description: 'FORMA Design Framework.',
      start_url: './',
      display: 'standalone',
      theme_color: ac,
      background_color: bg,
      icons: [{
        src: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='40' fill='${encodeURIComponent(ac)}'/><text x='28' y='150' font-family='serif' font-size='150' font-weight='900' fill='${encodeURIComponent(bg)}'>F</text></svg>`,
        sizes: '192x192',
        type: 'image/svg+xml',
      }],
    };

    let link = document.getElementById('pwa-ml');
    if (!link) {
      link = document.createElement('link');
      link.id = 'pwa-ml';
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' }));
    updateBadge('bm', 'ON', 'on');

    // Service Worker
    if ('serviceWorker' in navigator && !swRegistered) {
      const swCode = `const C='fv3';self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./'])));self.skipWaiting()});self.addEventListener('activate',e=>{e.waitUntil(clients.claim())});self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(caches.match('./').then(r=>r||fetch(e.request)))});`;
      navigator.serviceWorker.register(
        URL.createObjectURL(new Blob([swCode], { type: 'application/javascript' })),
        { scope: './' }
      ).then(() => {
        swRegistered = true;
        updateBadge('bsw', 'ON', 'on');
      }).catch(() => updateBadge('bsw', 'BLOCKED', 'off'));
    } else if (swRegistered) {
      updateBadge('bsw', 'ON', 'on');
    }

    updateBadge('bsa', window.matchMedia('(display-mode:standalone)').matches ? 'ACTIVE' : 'READY', 'on');

    if (deferredInstallPrompt) {
      updateBadge('bir', 'READY', 'on');
      const inst = document.getElementById('pwai');
      if (inst) inst.classList.add('show');
    }

    const meta = document.getElementById('tc-meta');
    if (meta) meta.setAttribute('content', ac);
  }

  function disablePWA() {
    ['bm', 'bsw', 'bsa'].forEach(id => updateBadge(id, 'OFF', 'off'));
    updateBadge('bir', '–', 'off');
    const inst = document.getElementById('pwai');
    if (inst) inst.classList.remove('show');
    const link = document.getElementById('pwa-ml');
    if (link) link.remove();
  }

  async function triggerInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      const inst = document.getElementById('pwai');
      if (inst) inst.textContent = '✓ Installed!';
      deferredInstallPrompt = null;
    }
  }

  // ── 8. Custom Cursor ────────────────────────────────────
  function initCursor() {
    const cur = document.getElementById('cur');
    if (!cur) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    $$('a, button, .ts, .ptp').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });

    (function loop() {
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      cur.style.left = cx + 'px';
      cur.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    })();
  }

  // ── 9. Scroll Progress ──────────────────────────────────
  function initProgress() {
    const prog = document.getElementById('prog');
    if (!prog) return;

    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = `scaleX(${Math.min(scrollY / max, 1)})`;
    }, { passive: true });
  }

  // ── 10. Ticker Clone ────────────────────────────────────
  function initTicker() {
    const track = document.getElementById('tt');
    if (!track) return;
    track.appendChild(track.cloneNode(true));
  }

  // ── 11. GSAP Choreography ───────────────────────────────
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    // Nav entrance
    gsap.from('nav', { y: -22, opacity: 0, duration: 0.6, ease: 'expo.out', delay: 0.1 });

    // Hero timeline
    gsap.timeline({ delay: 0.25, defaults: { ease: 'expo.out' } })
      .to('#h-eye', { opacity: 1, duration: 0.5 }, 0)
      .to('#h-head .wi', { yPercent: 0, stagger: 0.07, duration: 0.85 }, 0.15)
      .to('#h-foot', { opacity: 1, duration: 0.6 }, 0.55);

    // Reveal observer (.rv elements)
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        gsap.to(e.target, { opacity: 1, y: 0, x: 0, duration: 0.76, ease: 'expo.out' });
        revealObs.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    $$('.rv').forEach(el => revealObs.observe(el));

    // Section headings
    $$('.sh').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 87%', once: true,
        onEnter: () => gsap.from(el, { y: 22, opacity: 0, duration: 0.8, ease: 'expo.out' }),
      });
    });

    // Hierarchy section
    ScrollTrigger.create({
      trigger: '.hier', start: 'top 74%', once: true,
      onEnter: () => {
        gsap.from('.hbig', { yPercent: 7, opacity: 0, duration: 1.1, ease: 'expo.out' });
        gsap.from('.hrule', { y: 22, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.2 });
      },
    });

    // Counters
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target = parseInt(e.target.dataset.val);
        gsap.to({ v: 0 }, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate: function () { e.target.textContent = Math.round(this.targets()[0].v); },
        });
        counterObs.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    $$('[data-counter]').forEach(el => counterObs.observe(el));

    // Template grid stagger
    ScrollTrigger.create({
      trigger: '#tgrid', start: 'top 83%', once: true,
      onEnter: () => gsap.from('.ts', { y: 26, opacity: 0, scale: 0.95, stagger: 0.04, duration: 0.7, ease: 'expo.out' }),
    });
  }

  // ── 12. Three.js Hero Scene ─────────────────────────────
  function initThreeScene() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('hcvs');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    // Particles
    const N = 480;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    _pm = new THREE.PointsMaterial({ color: 0x8fe05e, size: 0.022, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Points(geo, _pm));

    // Ring
    _rm = new THREE.MeshBasicMaterial({ color: 0x8fe05e, transparent: true, opacity: 0.055 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.005, 8, 80), _rm);
    ring.rotation.x = 0.55;
    scene.add(ring);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / innerWidth - 0.5) * 0.25;
      mouseY = -(e.clientY / innerHeight - 0.5) * 0.25;
    });

    // Resize
    new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }).observe(canvas);

    // Render loop
    (function draw() {
      requestAnimationFrame(draw);
      ring.rotation.z += 0.001;
      ring.rotation.x += (mouseY * 0.5 - ring.rotation.x) * 0.025;
      ring.rotation.y += (mouseX * 0.5 - ring.rotation.y) * 0.025;
      renderer.render(scene, camera);
    })();
  }

  // ── Init ────────────────────────────────────────────────
  function init() {
    initCursor();
    initProgress();
    initTicker();
    initStudio();
    initGSAP();
    initThreeScene();

    // Apply theme from URL ?theme=cobalt
    const urlTheme = new URLSearchParams(location.search).get('theme');
    if (urlTheme && THEMES[urlTheme]) applyTheme(urlTheme);

    // System color mode listener
    window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => {
      if (colorMode === 'system') setColorMode('system');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Public API ──────────────────────────────────────────
  window.FORMIA = {
    applyTheme,
    setAccent,
    setColorMode,
    setViewport,
    togglePWA,
    themes: THEMES,
    get currentTheme() { return currentTheme; },
    get currentAccent() { return currentAccent; },
    get colorMode() { return colorMode; },
  };

})();
