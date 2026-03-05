import '../styles/main.css';
import { error } from './modules/logger.js';
import { initErrorHandling } from './modules/error-handler.js';
import {
  initTheme,
  bindSmoothScroll,
  bindRevealOnScroll,
} from './modules/core.js';
import {
  bindParallax,
  bindHeroSpotlight,
  deferHeroAnimations,
} from './modules/hero.js';
import { bindLazyImages } from './modules/media.js';
import {
  bindMobileNav,
  bindDesktopDropdown,
  bindMobileSubmenu,
  bindStickyHeader,
} from './modules/nav.js';
import {
  registerServiceWorker,
  initPerformanceMonitoring,
} from './modules/pwa_perf.js';
import { bindThemeToggle } from './modules/theme.js';
import {
  bindViewTransitions,
  addViewTransitionStyles,
} from './modules/view-transitions.js';
import { initPWAInstall } from './modules/pwa-install.js';
import { initNotifications } from './modules/notifications.js';
import { runModernIntroOverlaySequence } from './modules/intro.js';
import {
  renderProjects,
  renderProjectsSync,
  bindProjectFilters,
  renderProjectDetail,
} from './modules/projects.js';
import {
  applySiteCustomizations,
  mountHeroCustomSlot,
} from './modules/siteCustomizations.js';

window.addEventListener('error', e =>
  console.error(
    '%c[DEBUG:ERROR]',
    'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px',
    'Global JS Error',
    {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    }
  )
);
window.addEventListener('unhandledrejection', e =>
  console.error(
    '%c[DEBUG:PROMISE]',
    'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px',
    'Unhandled Promise Rejection',
    { reason: e.reason?.message || e.reason }
  )
);

// Critical: Load immediately
window.addEventListener('DOMContentLoaded', () => {
  // Paint project cards first so they always show (sync, no dependencies)
  try {
    renderProjectsSync();
    bindLazyImages();
    bindRevealOnScroll();
  } catch (e) {
    console.error('[projects] Sync render failed:', e);
  }

  // Perf-lite: smooth experience on low/medium devices, slow connections, or reduced motion
  try {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowConnection = conn && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.saveData === true);
    if (
      prefersReduced ||
      slowConnection ||
      isMobile ||
      cores <= 6 ||
      mem <= 6
    ) {
      document.documentElement.classList.add('perf-lite');
      window.__PERF_LITE__ = true;
    }
  } catch (_) {}

  // Initialize error handling first
  initErrorHandling();

  // Initialize theme system
  initTheme();
  bindThemeToggle();

  // Initialize view transitions
  if (document.startViewTransition) {
    addViewTransitionStyles();
    bindViewTransitions();
  }

  bindSmoothScroll();
  bindRevealOnScroll();

  try {
    bindMobileNav();
  } catch (e) {
    console.error(
      '%c[ERROR:H4]',
      'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px',
      'bindMobileNav FAILED',
      { error: e.message, stack: e.stack }
    );
  }
  try {
    bindDesktopDropdown();
  } catch (e) {
    console.error(
      '%c[ERROR:H5]',
      'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px',
      'bindDesktopDropdown FAILED',
      { error: e.message, stack: e.stack }
    );
  }

  try {
    bindStickyHeader();
  } catch (e) {
    console.error(
      '%c[ERROR:H6]',
      'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px',
      'bindStickyHeader FAILED',
      { error: e.message, stack: e.stack }
    );
  }

  bindMobileSubmenu();
  deferHeroAnimations();
  // Activate subtle spotlight and parallax effects on capable devices only
  const perfLite = Boolean(window.__PERF_LITE__);
  if (!perfLite) {
    try {
      bindHeroSpotlight();
    } catch (_) {}
    try {
      bindParallax();
    } catch (_) {}
  }
  registerServiceWorker();
  initPerformanceMonitoring();
  initPWAInstall();
  initNotifications();
  bindLazyImages();

  // Nova AI: lazy-load on first click, preload after 60% scroll
  initNovaLazy();

  // Eagerly render projects if grid exists to avoid relying solely on intersection
  // Shop page: carousel, featured, offers
  const shopHero = document.getElementById('shop-hero');
  const shopOffersGrid = document.getElementById('shop-offers-grid');
  if (shopHero || shopOffersGrid) {
    import('./modules/shop.js')
      .then(({ initShop }) => initShop())
      .catch((e) => console.error('[shop] init failed:', e));
  }

  const grid = document.getElementById('projects-grid');
  if (grid) {
    // On the Projects listing page, loadHeavySections will run renderProjects + bindProjectFilters when the section is in view; skip here to avoid duplicate listeners.
    const isProjectsListingPage = /\/pages\/projects(\.html)?$/.test(window.location.pathname);
    if (!isProjectsListingPage) {
      try {
        renderProjects()
          .then(() => {
            applySiteCustomizations();
            bindProjectFilters();
          })
          .catch(() => {})
          .finally(() => {
            bindLazyImages();
            bindRevealOnScroll();
          });
      } catch (_) {}
    }
  }
  // Eagerly render testimonials so they show without scrolling
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid) {
    import('./modules/testimonials.js')
      .then(({ renderTestimonials }) => {
        renderTestimonials();
        import('./modules/testimonialsAuto.js')
          .then(({ autoPlayTestimonials }) => {
            try {
              autoPlayTestimonials();
            } catch (_) {}
          })
          .catch(() => {});
      })
      .catch(() => {});
  }
  // Eagerly render skills on pages that have a skills container (e.g. About page)
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    import('./modules/skills.js')
      .then(({ renderSkills }) => {
        try {
          renderSkills();
        } catch (_) {}
      })
      .catch(() => {});
  }
  mountHeroCustomSlot();
  applySiteCustomizations();
  // Ensure heavy sections begin observing as soon as DOM is ready
  loadHeavySections();

  // Dev-only: ensure /pages/* links use the correct URL so middleware serves transformed HTML
  if (import.meta.env && import.meta.env.DEV) {
    document.addEventListener(
      'click',
      e => {
        const anchor =
          e.target && e.target.closest
            ? e.target.closest('a[href^="/pages/"]')
            : null;
        if (!anchor) return;
        const href = anchor.getAttribute('href') || '';
        // Allow modifier clicks (new tab, etc.)
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          anchor.target === '_blank'
        )
          return;
        const url = new URL(href, window.location.origin);
        let path = url.pathname;
        if (!path.endsWith('.html')) {
          path = path.endsWith('/') ? path.slice(0, -1) : path;
          path = `${path}.html`;
        }
        // Use /pages/... so pages-rewrite middleware intercepts and serves transformed HTML
        const fullUrl = `${path}${url.search || ''}${url.hash || ''}`;
        e.preventDefault();
        window.location.href = fullUrl;
      },
      true
    );
  }

  // Intro overlay sequence (run if overlay exists)
  const intro = document.getElementById('intro-overlay');
  if (intro) {
    runModernIntroOverlaySequence();
  }

  // Project detail page: render case study from slug parameter
  try {
    const projectDetailRoot = document.getElementById('project-detail-root');
    if (projectDetailRoot) {
      renderProjectDetail().catch(() => {});
    }
  } catch (_) {}
});

// Nova AI: lazy-load on first click; preload chunk after 60% scroll
let novaPreloadDone = false;
let novaInitialized = false;

function initNovaLazy() {
  if (document.getElementById('ai-assistant-btn')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'ai-assistant-btn';
  button.className = 'ai-assistant-btn';
  button.setAttribute('aria-label', 'Open AI Assistant');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="novaIconGradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#38bdf8"/><stop offset="0.5" stop-color="#6366f1"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><path d="M6.5 5.5A3.5 3.5 0 0 1 10 2h6a3 3 0 0 1 3 3v5.5A3.5 3.5 0 0 1 15.5 14H12l-2.8 2.8c-.5.5-1.2.15-1.2-.47V14H8A3.5 3.5 0 0 1 4.5 10.5v-3A2.5 2.5 0 0 1 6.5 5.5Z" fill="url(#novaIconGradient)"/><path d="M9.25 8.5h.01M13.25 8.5h.01M9.75 10.75c.6.5 1.3.75 2.25.75s1.65-.25 2.25-.75" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="ai-assistant-btn-label">Ask Nova</span><span class="ai-assistant-pulse"></span>`;
  button.style.display = 'flex';
  button.style.visibility = 'visible';
  button.style.opacity = '1';
  document.body.appendChild(button);

  button.addEventListener('click', function onNovaClick() {
    if (novaInitialized) return;
    novaInitialized = true;
    import('./modules/assistant.js')
      .then(({ initAssistant }) => initAssistant())
      .then((instance) => {
        if (instance && typeof instance.open === 'function') instance.open();
      })
      .catch((e) => {
        console.error('[Nova] Failed to load:', e);
        novaInitialized = false;
      });
  });
}

function preloadNovaAtScroll() {
  if (novaPreloadDone) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return;
  if (window.scrollY / scrollHeight >= 0.6) {
    novaPreloadDone = true;
    import('./modules/assistant.js').catch(() => {});
  }
}

window.addEventListener('scroll', preloadNovaAtScroll, { passive: true });
window.addEventListener('load', () => {
  loadHeavySections();
  preloadNovaAtScroll();
  import('./modules/analytics.js').then(({ initAnalytics }) => initAnalytics());
  import('./modules/web-vitals.js').then(({ initWebVitals }) => initWebVitals());
});

// Conditionally load heavy sections on viewport intersection
function loadHeavySections() {
  const sectionsToLoad = [
    {
      // Support both homepage projects section and projects listing page
        selector: '#projects, #projects-grid',
      load: async () => {
        const { renderProjects, bindProjectFilters } =
          await import('./modules/projects.js');
        renderProjects().catch(() => {});
        applySiteCustomizations();
        bindProjectFilters();
        // Ensure newly injected lazy images are observed and loaded
        const { bindLazyImages } = await import('./modules/media.js');
        bindLazyImages();
        // Re-bind reveal observer for dynamically injected project cards
        bindRevealOnScroll();
      },
    },
    {
      selector: '#testimonials',
      load: async () => {
        const { renderTestimonials } =
          await import('./modules/testimonials.js');
        renderTestimonials();
        try {
          const { autoPlayTestimonials } =
            await import('./modules/testimonialsAuto.js');
          autoPlayTestimonials();
        } catch (_) {}
      },
    },
    {
      // Load skills grid when either the about/services sections or the skills container itself enters view
      selector: '#about, #services, #skills-container',
      load: async () => {
        const { renderSkills } = await import('./modules/skills.js');
        renderSkills();
      },
    },
    {
      selector: '.blog-section, #blog',
      load: async () => {
        const { renderBlogPosts, bindBlogFilters, bindBlogPostHandlers } =
          await import('./modules/blog.js');
        renderBlogPosts();
        bindBlogFilters();
        bindBlogPostHandlers();
      },
    },
    {
      selector: '#speaking, .speaking-section',
      load: async () => {
        const { renderSpeakingEngagements, renderPublications } =
          await import('./modules/speaking.js');
        renderSpeakingEngagements();
        renderPublications();
      },
    },
    {
      selector: '.press-section',
      load: async () => {
        const { renderPressLogos, renderClientLogos } =
          await import('./modules/press.js');
        renderPressLogos();
        renderClientLogos();
      },
    },
    {
      selector: '#contact, form[data-contact]',
      load: async () => {
        const { bindContactForm, enhanceContactForm } =
          await import('./modules/forms.js');
        bindContactForm();
        enhanceContactForm();
      },
    },
  ];

  // Create intersection observer
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionConfig = sectionsToLoad.find(s => {
            const element = document.querySelector(s.selector);
            return (
              element &&
              (element.contains(entry.target) || element === entry.target)
            );
          });

          if (sectionConfig && !sectionConfig.loaded) {
            sectionConfig.loaded = true;
            sectionConfig.load().catch(err => {
              error('Failed to load section:', sectionConfig.selector, err);
            });
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '200px 0px', // Start loading 200px before entering viewport
      threshold: 0.01,
    }
  );

  // Observe all section containers (handle composite selectors like #about, #services)
  sectionsToLoad.forEach(sectionConfig => {
    const elements = document.querySelectorAll(sectionConfig.selector);
    elements.forEach(element => {
      observer.observe(element);
    });
  });
}
