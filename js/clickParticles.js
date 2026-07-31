/* clickParticles.js
   Minimal, dependency-free click particle effect.
   Adds a pointerdown listener and spawns particles at the click position.
*/
(function () {
  'use strict';

  const CONTAINER_ID = 'click-particles-container';
  const MIN_PARTICLES = 15;
  const MAX_PARTICLES = 20;
  const MIN_SIZE = 2; // px
  const MAX_SIZE = 5; // px
  const MIN_DIST = 25; // px
  const MAX_DIST = 70; // px
  const MIN_DUR = 500; // ms
  const MAX_DUR = 700; // ms

  // Try to detect a theme primary color variable from :root
  function detectPrimaryColor() {
    const root = getComputedStyle(document.documentElement);
    const candidates = ['--primary-color', '--main-color', '--color-primary', '--theme-color'];
    for (const name of candidates) {
      const val = root.getPropertyValue(name).trim();
      if (val) return val;
    }
    return '';
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function randomInt(min, max) { return Math.floor(rand(min, max + 1)); }

  function makeContainer() {
    let c = document.getElementById(CONTAINER_ID);
    if (!c) {
      c = document.createElement('div');
      c.id = CONTAINER_ID;
      c.className = 'click-particles-container';
      // keep pointer-events none so it never blocks interaction
      c.style.pointerEvents = 'none';
      document.body.appendChild(c);
    }
    return c;
  }

  function toRGBA(hexOrRgb, alpha) {
    alpha = clamp(alpha, 0, 1);
    const s = hexOrRgb.trim();
    // simple rgb() pass-through
    if (s.startsWith('rgb')) {
      try {
        const nums = s.replace(/[rgba()\s]/g, '').split(',').map(Number);
        return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
      } catch (e) { }
    }
    // hex
    const hex = s.replace('#', '');
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (hex.length === 6) {
      const r = parseInt(hex.substr(0,2), 16);
      const g = parseInt(hex.substr(2,2), 16);
      const b = parseInt(hex.substr(4,2), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // fallback white
    return `rgba(255,255,255,${alpha})`;
  }

  function spawnParticles(x, y) {
    const container = makeContainer();
    const primary = detectPrimaryColor() || '#ffd700'; // gold fallback
    const particles = randomInt(MIN_PARTICLES, MAX_PARTICLES);

    for (let i = 0; i < particles; i++) {
      const el = document.createElement('div');
      el.className = 'click-particle';
      // size
      const size = Math.round(rand(MIN_SIZE, MAX_SIZE));
      el.style.setProperty('--size', size + 'px');

      // position
      el.style.left = x + 'px';
      el.style.top = y + 'px';

      // random direction
      const angle = rand(0, Math.PI * 2);
      const dist = rand(MIN_DIST, MAX_DIST);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      el.style.setProperty('--tx', Math.round(dx) + 'px');
      el.style.setProperty('--ty', Math.round(dy) + 'px');

      // duration
      const dur = Math.round(rand(MIN_DUR, MAX_DUR));
      el.style.setProperty('--duration', dur + 'ms');

      // color mix: white to primary with subtle brightness variations
      const whiteAlpha = rand(0.35, 0.85).toFixed(2);
      const stopA = toRGBA('#ffffff', whiteAlpha);
      const stopB = toRGBA(primary, rand(0.8, 1).toFixed(2));
      el.style.background = `radial-gradient(circle at 30% 30%, ${stopA}, ${stopB})`;

      // slight blur/glow (inline style keeps everything scoped)
      const glowAlpha = rand(0.1, 0.35).toFixed(2);
      el.style.boxShadow = `0 0 ${clamp(size * 1.8, 6, 18)}px rgba(255,255,255,${glowAlpha}), 0 0 ${clamp(size * 2.2, 4, 14)}px rgba(0,0,0,0.02)`;

      // ensure non-blocking and high layer
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999';

      // append and remove after animation
      container.appendChild(el);

      const cleanup = () => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      };

      // safety: remove after duration + 100ms
      const to = setTimeout(cleanup, dur + 120);

      el.addEventListener('animationend', () => {
        clearTimeout(to);
        cleanup();
      }, { once: true });
    }
  }

  // Pointer handler: spawn particles at event coordinates
  function handlePointer(e) {
    // Respect embedded frames and such: get client coords
    const x = e.clientX;
    const y = e.clientY;
    // Use rAF to avoid heavy synchronous layout thrash on burst clicks
    window.requestAnimationFrame(() => spawnParticles(x, y));
  }

  // Initialize listener once DOM is ready
  function init() {
    if (typeof document === 'undefined' || !document.body) return;
    // use pointerdown for immediacy and cross-device
    document.addEventListener('pointerdown', handlePointer, { passive: true });
    // also support legacy touchstart as a fallback (passive)
    document.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        window.requestAnimationFrame(() => spawnParticles(t.clientX, t.clientY));
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
