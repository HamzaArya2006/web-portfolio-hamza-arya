// Core behaviors: theme, smooth scroll, reveal-on-scroll

import { initTheme as initThemeSystem, applyTheme, getTheme } from './theme.js';

export function initTheme() {
  // Use the new theme system
  initThemeSystem();
  // Ensure dark theme is applied initially if no preference
  const currentTheme = getTheme();
  applyTheme(currentTheme);
}

export function bindSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const useSmooth = !document.documentElement.classList.contains('perf-lite');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: useSmooth ? 'smooth' : 'auto', block: 'start' });
      }
    });
  });
}

export function bindRevealOnScroll() {
  const revealables = document.querySelectorAll('[data-reveal]');
  const heroReveals = document.querySelectorAll('section#top [data-reveal]');
  const heroSet = new Set(heroReveals);
  const perfLite = document.documentElement.classList.contains('perf-lite');
  const show = (el) => {
    el.classList.remove('opacity-0', 'translate-y-6');
    if (perfLite) {
      el.style.opacity = '1';
      el.style.transform = '';
    } else {
      el.classList.add('fade-in', 'slide-up');
    }
  };
  const defaultObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
  );
  const heroObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );
  revealables.forEach((el) => {
    if (heroSet.has(el)) heroObserver.observe(el);
    else defaultObserver.observe(el);
  });

  function revealVisible() {
    const rect = (el) => el.getBoundingClientRect();
    const vh = window.innerHeight;
    revealables.forEach((el) => {
      if (heroSet.has(el)) return;
      const r = rect(el);
      if (r.top < vh - 50 && r.bottom > 0) show(el);
    });
  }
  requestAnimationFrame(revealVisible);
  setTimeout(revealVisible, 150);
}


