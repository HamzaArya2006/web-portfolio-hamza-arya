export function bindParallax() {
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!parallaxEls.length) return;
  let ticking = false;
  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    for (const el of parallaxEls) {
      const speedAttr = el.getAttribute('data-parallax') || '0';
      const speed = parseFloat(speedAttr) || 0;
      el.style.transform = `translate3d(0, ${Math.round(scrollY * speed)}px, 0)`;
    }
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

export function bindHeroSpotlight() {
  const hero = document.querySelector('section#top');
  const overlay = hero ? hero.querySelector('[data-hero-spotlight]') : null;
  if (!hero || !overlay) return;
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    overlay.style.opacity = '0';
    return;
  }
  overlay.style.pointerEvents = 'none';
  overlay.style.opacity = '1';
  const getBaseRadius = () => Math.max(220, Math.min(360, Math.floor(window.innerWidth * 0.18)));
  let baseRadius = getBaseRadius();
  let featherWidth = Math.floor(baseRadius * 1.6);
  const centerAlpha = 0.10;
  const midAlpha = 0.28;
  const outsideAlpha = 0.50;
  const state = {
    currentX: hero.clientWidth / 2,
    currentY: hero.clientHeight / 2,
    targetX: hero.clientWidth / 2,
    targetY: hero.clientHeight / 2,
    vx: 0,
    vy: 0,
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const setGradient = (x, y, extra = 0) => {
    const inner = baseRadius + extra;
    const outer = inner + featherWidth;
    // Single radial gradient (no blend mode) to reduce repaint cost
    overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,${centerAlpha}) 0px, rgba(0,0,0,${midAlpha}) ${inner}px, rgba(0,0,0,${outsideAlpha}) ${outer}px)`;
  };
  let rafId = 0;
  let active = false;
  let lastDrawX = -1;
  let lastDrawY = -1;
  let lastDrawExtra = -1;
  let lastFrameTime = 0;
  const animate = (now = 0) => {
    if (!active) return;
    // Cap to ~30fps
    if (now - lastFrameTime < 33) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = now;
    state.currentX = lerp(state.currentX, state.targetX, 0.14);
    state.currentY = lerp(state.currentY, state.targetY, 0.14);
    state.vx = state.targetX - state.currentX;
    state.vy = state.targetY - state.currentY;
    const speed = Math.min(60, Math.hypot(state.vx, state.vy));
    const extra = speed * 0.25;
    const quantize = (v) => Math.round(v / 2) * 2; // reduce sub-pixel churn
    const drawX = quantize(state.currentX);
    const drawY = quantize(state.currentY);
    const drawExtra = Math.round(extra);
    if (drawX !== lastDrawX || drawY !== lastDrawY || drawExtra !== lastDrawExtra) {
      lastDrawX = drawX;
      lastDrawY = drawY;
      lastDrawExtra = drawExtra;
      setGradient(drawX, drawY, drawExtra);
    }
    // Stop the loop when motion settles and pointer not inside
    const settled = Math.abs(state.vx) < 0.5 && Math.abs(state.vy) < 0.5;
    if (!isPointerInside && settled) {
      active = false;
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(animate);
  };
  let isPointerInside = false;
  const onPointerMove = (e) => {
    const rect = hero.getBoundingClientRect();
    state.targetX = e.clientX - rect.left;
    state.targetY = e.clientY - rect.top;
    if (!active) {
      active = true;
      rafId = requestAnimationFrame(animate);
    }
  };
  const centerSpotlight = () => {
    state.targetX = hero.clientWidth / 2;
    state.targetY = hero.clientHeight / 2;
  };
  const onPointerEnter = (e) => {
    const rect = hero.getBoundingClientRect();
    state.currentX = state.targetX = e.clientX - rect.left;
    state.currentY = state.targetY = e.clientY - rect.top;
    overlay.style.transition = 'opacity 200ms ease';
    overlay.style.opacity = '1';
    isPointerInside = true;
    if (!active) {
      active = true;
      rafId = requestAnimationFrame(animate);
    }
  };
  const onPointerLeave = () => {
    centerSpotlight();
    overlay.style.transition = 'opacity 400ms ease';
    overlay.style.opacity = '0.85';
    isPointerInside = false;
  };
  const onResize = () => {
    baseRadius = getBaseRadius();
    featherWidth = Math.floor(baseRadius * 1.6);
    centerSpotlight();
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (isPointerInside && !rafId) {
      active = true;
      rafId = requestAnimationFrame(animate);
    }
  };
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerenter', onPointerEnter);
  hero.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  centerSpotlight();
  setGradient(state.currentX, state.currentY, 0);
}

export function deferHeroAnimations() {
  const hero = document.querySelector('section#top');
  let resumed = false;
  const resume = () => {
    if (resumed) return;
    resumed = true;
    if (hero) hero.classList.remove('hero-anim-off');
    bindParallax();
    bindHeroSpotlight();
  };
  // Activate on first interaction or when hero is actually visible
  window.addEventListener('scroll', resume, { once: true, passive: true });
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
  if ('IntersectionObserver' in window && hero) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          resume();
          io.disconnect();
          break;
        }
      }
    }, { root: null, threshold: 0.01, rootMargin: '0px 0px -20% 0px' });
    io.observe(hero);
  }
}


