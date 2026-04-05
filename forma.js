/**
 * FORMA.js — Design Motion Layer
 * v1.0 | Zero dependencies. No build step. ~4KB minified.
 *
 * Features via HTML data attributes:
 *   data-reveal            — fade + translateY on scroll
 *   data-reveal="left"     — slide from left
 *   data-reveal="right"    — slide from right
 *   data-reveal="scale"    — scale up from 95%
 *   data-reveal="clip"     — clip-path wipe
 *   data-stagger           — stagger children on reveal
 *   data-parallax="0.3"    — parallax scroll (value = speed, 0–1)
 *   data-magnetic          — element follows cursor in proximity
 *   data-cursor            — enable custom cursor on this root element
 *   data-counter           — animate number from 0 to data-value
 *   data-split-text        — split words for individual animation
 */

(function() {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  const CONFIG = {
    revealThreshold: 0.15,     // % of element visible to trigger
    revealRootMargin: '0px 0px -60px 0px',
    staggerDelay: 80,          // ms between staggered children
    parallaxScaleFactor: 0.5,  // dampens parallax movement
    magneticRadius: 120,       // px proximity to activate magnetic
    magneticStrength: 0.35,    // 0–1, how strongly element pulls
    counterDuration: 1800,     // ms for number counter animation
    cursorLag: 0.12,           // 0–1, cursor follow lag factor
  };

  // ── State ────────────────────────────────────────────────
  let mouse = { x: 0, y: 0 };
  let cursorPos = { x: 0, y: 0 };
  let cursorEl = null;
  let rafId = null;

  // ── Utilities ────────────────────────────────────────────
  const qs  = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── 1. Scroll Reveals ────────────────────────────────────
  function initReveal() {
    const els = qsa('[data-reveal], [data-stagger]');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.hasAttribute('data-stagger')) {
          // Stagger children
          const children = [...el.children];
          children.forEach((child, i) => {
            child.style.setProperty('--stagger-delay', `${i * CONFIG.staggerDelay}ms`);
          });
          requestAnimationFrame(() => el.classList.add('revealed'));
        } else {
          const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
          setTimeout(() => el.classList.add('revealed'), delay);
        }

        obs.unobserve(el);
      });
    }, {
      threshold: CONFIG.revealThreshold,
      rootMargin: CONFIG.revealRootMargin,
    });

    els.forEach(el => obs.observe(el));
  }

  // ── 2. Parallax ──────────────────────────────────────────
  function initParallax() {
    const els = qsa('[data-parallax]');
    if (!els.length) return;

    function updateParallax() {
      const scrollY = window.scrollY;

      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const relY = (centerY - window.innerHeight / 2) * speed * CONFIG.parallaxScaleFactor;
        el.style.transform = `translateY(${relY}px)`;
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // ── 3. Magnetic Elements ─────────────────────────────────
  function initMagnetic() {
    const els = qsa('[data-magnetic]');
    if (!els.length) return;

    els.forEach(el => {
      el.style.transition = `transform 0.4s ${getComputedStyle(document.documentElement).getPropertyValue('--ease-spring') || 'cubic-bezier(0.34, 1.56, 0.64, 1)'}`;

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < CONFIG.magneticRadius) {
          const strength = (1 - dist / CONFIG.magneticRadius) * CONFIG.magneticStrength;
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ── 4. Custom Cursor ─────────────────────────────────────
  function initCursor() {
    if (!qs('[data-cursor]')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

    cursorEl = document.createElement('div');
    cursorEl.className = 'cursor';
    document.body.appendChild(cursorEl);

    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Track hover targets
    qsa('a, button, [data-magnetic], [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
    });

    function animateCursor() {
      cursorPos.x = lerp(cursorPos.x, mouse.x, CONFIG.cursorLag * 4);
      cursorPos.y = lerp(cursorPos.y, mouse.y, CONFIG.cursorLag * 4);
      cursorEl.style.left = cursorPos.x + 'px';
      cursorEl.style.top  = cursorPos.y + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ── 5. Number Counters ───────────────────────────────────
  function initCounters() {
    const els = qsa('[data-counter]');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.value || el.textContent);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = CONFIG.counterDuration;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = clamp(elapsed / duration, 0, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          el.textContent = prefix + current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach(el => obs.observe(el));
  }

  // ── 6. Split Text ────────────────────────────────────────
  function initSplitText() {
    const els = qsa('[data-split-text]');
    if (!els.length) return;

    els.forEach(el => {
      const mode = el.dataset.splitText || 'words'; // 'words' | 'chars'
      const text = el.textContent;

      if (mode === 'words') {
        el.innerHTML = text.split(' ').map(word =>
          `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
          `<span style="display:inline-block;transform:translateY(110%);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);">${word}</span>` +
          `</span>`
        ).join(' ');
      } else {
        el.innerHTML = text.split('').map(char =>
          char === ' ' ? ' ' :
          `<span class="split-char" style="display:inline-block;overflow:hidden;">` +
          `<span style="display:inline-block;transform:translateY(110%);transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);">${char}</span>` +
          `</span>`
        ).join('');
      }

      // Animate on reveal
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const spans = [...el.querySelectorAll('.split-word > span, .split-char > span')];
          spans.forEach((s, i) => {
            setTimeout(() => { s.style.transform = 'translateY(0)'; }, i * (mode === 'words' ? 60 : 25));
          });
          obs.unobserve(el);
        });
      }, { threshold: 0.3 });

      obs.observe(el);
    });
  }

  // ── 7. Marquee Auto-Clone ─────────────────────────────────
  function initMarquee() {
    const tracks = qsa('.marquee-track');
    tracks.forEach(track => {
      // Clone content for seamless loop
      const clone = track.cloneNode(true);
      track.parentElement.appendChild(clone);
    });
  }

  // ── 8. Smooth Scroll for Anchors ─────────────────────────
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = qs(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── 9. Scroll Progress Bar ────────────────────────────────
  function initProgressBar() {
    const bar = qs('[data-progress]');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = clamp(window.scrollY / max, 0, 1);
      bar.style.setProperty('--progress', progress);
      bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  // ── 10. Gradient Mesh Cursor Tracking ────────────────────
  function initGradientMesh() {
    const meshEls = qsa('[data-gradient-mesh]');
    if (!meshEls.length) return;

    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth * 100).toFixed(1);
      const y = (e.clientY / window.innerHeight * 100).toFixed(1);
      meshEls.forEach(el => {
        el.style.setProperty('--mouse-x', x + '%');
        el.style.setProperty('--mouse-y', y + '%');
      });
    }, { passive: true });
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    initReveal();
    initParallax();
    initMagnetic();
    initCursor();
    initCounters();
    initSplitText();
    initMarquee();
    initSmoothScroll();
    initProgressBar();
    initGradientMesh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Public API ───────────────────────────────────────────
  window.FORMA = {
    reinit: init,
    config: CONFIG,
  };

})();
