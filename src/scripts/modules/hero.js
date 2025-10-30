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
  overlay.style.pointerEvents = 'none';
  overlay.style.opacity = '1';
  const getBaseRadius = () => Math.max(220, Math.min(360, Math.floor(window.innerWidth * 0.18)));
  let baseRadius = getBaseRadius();
  let featherWidth = Math.floor(baseRadius * 1.6);
  const centerAlpha = 0.10;
  const midAlpha = 0.34;
  const outsideAlpha = 0.62;
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
    const rect = hero.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, x / Math.max(1, rect.width)));
    const hue = Math.round(200 + nx * 60);
    const vignette = `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,${centerAlpha}) 0px, rgba(0,0,0,${midAlpha}) ${inner}px, rgba(0,0,0,${outsideAlpha}) ${outer}px)`;
    const tint = `radial-gradient(circle at ${x}px ${y}px, hsla(${hue}, 85%, 60%, 0.18) ${Math.max(0, inner - 40)}px, hsla(${hue}, 85%, 60%, 0) ${outer + 120}px)`;
    overlay.style.background = `${vignette}, ${tint}`;
  };
  let running = true;
  const animate = () => {
    if (!running) return;
    state.currentX = lerp(state.currentX, state.targetX, 0.14);
    state.currentY = lerp(state.currentY, state.targetY, 0.14);
    state.vx = state.targetX - state.currentX;
    state.vy = state.targetY - state.currentY;
    const speed = Math.min(60, Math.hypot(state.vx, state.vy));
    const extra = speed * 0.25;
    setGradient(state.currentX, state.currentY, extra);
    requestAnimationFrame(animate);
  };
  const onPointerMove = (e) => {
    const rect = hero.getBoundingClientRect();
    state.targetX = e.clientX - rect.left;
    state.targetY = e.clientY - rect.top;
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
  };
  const onPointerLeave = () => {
    centerSpotlight();
    overlay.style.transition = 'opacity 400ms ease';
    overlay.style.opacity = '0.85';
  };
  const onResize = () => {
    baseRadius = getBaseRadius();
    featherWidth = Math.floor(baseRadius * 1.6);
    centerSpotlight();
  };
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerenter', onPointerEnter);
  hero.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', onResize);
  centerSpotlight();
  setGradient(state.currentX, state.currentY, 0);
  requestAnimationFrame(animate);
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
  window.addEventListener('scroll', resume, { once: true, passive: true });
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
  const idle = (window.requestIdleCallback
    ? window.requestIdleCallback(resume, { timeout: 1500 })
    : setTimeout(resume, 1200));
}


