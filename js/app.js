// Shared app utilities
// Conservative particle initializer: does not change logic, only exposes
// a function pages can call with their canvas id.
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.4, 1.6),
      vx: randomBetween(-0.12, 0.12),
      vy: randomBetween(-0.25, -0.06),
      alpha: randomBetween(0.1, 0.55),
      fadeDir: Math.random() > 0.5 ? 1 : -1,
      fadeSpeed: randomBetween(0.002, 0.006),
      hue: randomBetween(40, 55)
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor((W * H) / 8000);
    for (let i = 0; i < count; i++) particles.push(createParticle());
    window.addEventListener('resize', resize);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.fadeDir * p.fadeSpeed;
      if (p.alpha <= 0.05 || p.alpha >= 0.6) p.fadeDir *= -1;
      if (p.y < -4) { particles[i] = createParticle(); particles[i].y = H + 4; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  init();
  tick();
}

// Expose to global
window.initParticles = initParticles;
