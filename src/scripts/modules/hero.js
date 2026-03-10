const PARALLAX_BOUND = Symbol('parallaxBound');

export function bindParallax() {
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!parallaxEls.length) return;
  const key = document.body;
  if (key[PARALLAX_BOUND]) return;
  key[PARALLAX_BOUND] = true;

  let ticking = false;
  let frameCount = 0;
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

const HERO_SPOTLIGHT_BOUND = Symbol('heroSpotlightBound');

export function bindHeroSpotlight() {
  const hero = document.querySelector('section#top');
  const overlay = hero ? hero.querySelector('[data-hero-spotlight]') : null;
  if (!hero || !overlay) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth < 768) {
    overlay.style.opacity = '0';
    return;
  }

  if (hero[HERO_SPOTLIGHT_BOUND]) return;
  hero[HERO_SPOTLIGHT_BOUND] = true;

  // Static gradient only – no pointer tracking for fewer interactions
  overlay.style.pointerEvents = 'none';
  // Defer dimension read and style writes to next frame to avoid forced reflow
  requestAnimationFrame(() => {
    const cx = hero.clientWidth / 2;
    const cy = hero.clientHeight / 2;
    const r = Math.max(180, Math.min(280, Math.floor(hero.clientWidth * 0.2)));
    overlay.style.background = `radial-gradient(circle at ${cx}px ${cy}px,
    rgba(37, 99, 235, 0.12) 0px,
    rgba(37, 99, 235, 0.04) ${r}px,
    transparent ${r + 120}px)`;
    overlay.style.opacity = '1';
  });
}

export function deferHeroAnimations() {
  const hero = document.querySelector('section#top');
  let resumed = false;
  const resume = () => {
    if (resumed) return;
    resumed = true;
    if (hero) hero.classList.remove('hero-anim-off');
    // Spotlight and parallax are already bound in main.js; avoid double-binding
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


