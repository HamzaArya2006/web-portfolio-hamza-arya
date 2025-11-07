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
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

export function bindRevealOnScroll() {
  const revealables = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.remove('opacity-0', 'translate-y-6');
          el.classList.add('fade-in', 'slide-up');
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealables.forEach((el) => observer.observe(el));
}


