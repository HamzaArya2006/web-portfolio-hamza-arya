import "../styles/main.css";
import { error } from "./modules/logger.js";
import { initErrorHandling } from "./modules/error-handler.js";
import {
  initTheme,
  bindSmoothScroll,
  bindRevealOnScroll,
} from "./modules/core.js";
import {
  bindParallax,
  bindHeroSpotlight,
  deferHeroAnimations,
} from "./modules/hero.js";
import { bindContactForm, enhanceContactForm } from "./modules/forms.js";
import { bindLazyImages } from "./modules/media.js";
import {
  bindMobileNav,
  bindDesktopDropdown,
  bindMobileSubmenu,
} from "./modules/nav.js";
import {
  registerServiceWorker,
  initPerformanceMonitoring,
} from "./modules/pwa_perf.js";
import { initWebVitals } from "./modules/web-vitals.js";
import { bindThemeToggle } from "./modules/theme.js";
import { bindViewTransitions, addViewTransitionStyles } from "./modules/view-transitions.js";
import { initPWAInstall } from "./modules/pwa-install.js";
import { initNotifications } from "./modules/notifications.js";
import { runModernIntroOverlaySequence } from "./modules/intro.js";
import { renderProjects, bindProjectFilters } from "./modules/projects.js";
import { applySiteCustomizations, mountHeroCustomSlot } from "./modules/siteCustomizations.js";
import { initAssistant } from "./modules/assistant.js";

// #region agent log
console.log('%c[DEBUG:INIT]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'Main.js module loaded', {timestamp:Date.now()});
window.addEventListener('error', (e) => console.error('%c[DEBUG:ERROR]', 'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px', 'Global JS Error', {message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno}));
window.addEventListener('unhandledrejection', (e) => console.error('%c[DEBUG:PROMISE]', 'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px', 'Unhandled Promise Rejection', {reason:e.reason?.message||e.reason}));
// #endregion

// Critical: Load immediately
window.addEventListener("DOMContentLoaded", () => {
  // #region agent log
  console.log('%c[DEBUG:H8]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'DOMContentLoaded fired', {readyState:document.readyState,bodyExists:!!document.body});
  // #endregion

  // Perf-lite: favor ultra-smooth feel on low/medium devices or when user prefers less motion
  try {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (prefersReduced || cores <= 4 || mem <= 4 || isMobile) {
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
  
  // #region agent log
  try { bindMobileNav(); console.log('%c[DEBUG:H4]', 'background:#059669;color:#fff;padding:2px 6px;border-radius:3px', 'bindMobileNav completed', {mobileNavToggle:!!document.querySelector('[data-mobile-nav-toggle]'),mobileNav:!!document.querySelector('[data-mobile-nav]')}); } catch(e) { console.error('%c[DEBUG:H4]', 'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px', 'bindMobileNav FAILED', {error:e.message,stack:e.stack}); }
  // #endregion
  
  // #region agent log
  try { bindDesktopDropdown(); console.log('%c[DEBUG:H5]', 'background:#059669;color:#fff;padding:2px 6px;border-radius:3px', 'bindDesktopDropdown completed', {dropdownGroup:!!document.querySelector('header nav .group')}); } catch(e) { console.error('%c[DEBUG:H5]', 'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px', 'bindDesktopDropdown FAILED', {error:e.message,stack:e.stack}); }
  // #endregion
  
  bindMobileSubmenu();
  deferHeroAnimations();
  // Activate subtle spotlight and parallax effects on hero and decorative elements
  try { bindHeroSpotlight(); } catch (_) {}
  try { bindParallax(); } catch (_) {}
  registerServiceWorker();
  initPerformanceMonitoring();
  initPWAInstall();
  initNotifications();
  bindLazyImages();
  
  // #region agent log
  try { initAssistant(); console.log('%c[DEBUG:H1]', 'background:#059669;color:#fff;padding:2px 6px;border-radius:3px', 'initAssistant completed', {assistantBtn:!!document.getElementById('ai-assistant-btn'),assistantPopup:!!document.getElementById('ai-assistant-popup')}); } catch(e) { console.error('%c[DEBUG:H1]', 'background:#dc2626;color:#fff;padding:2px 6px;border-radius:3px', 'initAssistant FAILED', {error:e.message,stack:e.stack}); }
  // #endregion
  // Eagerly render projects if grid exists to avoid relying solely on intersection
  const grid = document.getElementById('projects-grid');
  if (grid) {
    try {
      renderProjects()
        .then(() => {
          applySiteCustomizations();
          bindProjectFilters();
          bindLazyImages(); // Lazy images run after inject so new project images get observed
          bindRevealOnScroll(); // Reveal observer for dynamically injected project cards
        })
        .catch(() => {});
    } catch (_) {}
  }
  mountHeroCustomSlot();
  applySiteCustomizations();
  // Ensure heavy sections begin observing as soon as DOM is ready
  loadHeavySections();
  
  // Dev-only: make /pages/* links work by mapping to /src/pages/*.html
  if (import.meta.env && import.meta.env.DEV) {
    document.addEventListener('click', (e) => {
      const anchor = e.target && e.target.closest ? e.target.closest('a[href^="/pages/"]') : null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      // Allow modifier clicks (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || anchor.target === '_blank') return;
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      let path = url.pathname;
      if (!path.endsWith('.html')) {
        path = path.endsWith('/') ? path.slice(0, -1) : path;
        path = `${path}.html`;
      }
      window.location.href = `/src${path}`;
    }, true);
  }

  // Intro overlay sequence (run if overlay exists)
  const intro = document.getElementById("intro-overlay");
  if (intro) {
    runModernIntroOverlaySequence();
  }
});

// Deferred: Load after initial render
window.addEventListener("load", () => {
  // Load heavy sections conditionally when in viewport
  loadHeavySections();
  
  // Load analytics after page load
  import("./modules/analytics.js").then(({ initAnalytics }) => {
    initAnalytics();
  });
  
  // Initialize Web Vitals monitoring
  import("./modules/web-vitals.js").then(({ initWebVitals }) => {
    initWebVitals();
  });
});

// Conditionally load heavy sections on viewport intersection
function loadHeavySections() {
  // #region agent log
  console.log('%c[DEBUG:H8]', 'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px', 'loadHeavySections called');
  // #endregion
  const sectionsToLoad = [
    {
      // Support both homepage projects section and projects listing page
      selector: '#projects, #projects-grid',
      load: async () => {
        // #region agent log
        console.log('%c[DEBUG:H8]', 'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px', 'Projects section loading');
        // #endregion
        const { renderProjects, bindProjectFilters } = await import("./modules/projects.js");
        renderProjects().catch(() => {});
        applySiteCustomizations();
        bindProjectFilters();
        // Ensure newly injected lazy images are observed and loaded
        const { bindLazyImages } = await import("./modules/media.js");
        bindLazyImages();
        // Re-bind reveal observer for dynamically injected project cards
        bindRevealOnScroll();
      }
    },
    {
      selector: '#testimonials',
      load: async () => {
        const { renderTestimonials } = await import("./modules/testimonials.js");
        renderTestimonials();
        try {
          const { autoPlayTestimonials } = await import('./modules/testimonialsAuto.js');
          autoPlayTestimonials();
        } catch (_) {}
      }
    },
    {
      selector: '#about, #services',
      load: async () => {
        const { renderSkills } = await import("./modules/skills.js");
        renderSkills();
      }
    },
    {
      selector: '.blog-section, #blog',
      load: async () => {
        const { 
          renderBlogPosts, 
          bindBlogFilters, 
          bindBlogPostHandlers 
        } = await import("./modules/blog.js");
        renderBlogPosts();
        bindBlogFilters();
        bindBlogPostHandlers();
      }
    },
    {
      selector: '#open-source, .open-source-section',
      load: async () => {
        const { 
          renderOpenSourceContributions, 
          renderPinnedRepos 
        } = await import("./modules/openSource.js");
        renderOpenSourceContributions();
        renderPinnedRepos();
      }
    },
    {
      selector: '#speaking, .speaking-section',
      load: async () => {
        const { 
          renderSpeakingEngagements, 
          renderPublications 
        } = await import("./modules/speaking.js");
        renderSpeakingEngagements();
        renderPublications();
      }
    },
    {
      selector: '.press-section',
      load: async () => {
        const { renderPressLogos, renderClientLogos } = await import("./modules/press.js");
        renderPressLogos();
        renderClientLogos();
      }
    },
    {
      selector: '#contact, form[data-contact]',
      load: async () => {
        const { bindContactForm, enhanceContactForm } = await import("./modules/forms.js");
        bindContactForm();
        enhanceContactForm();
      }
    }
  ];

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionConfig = sectionsToLoad.find(s => {
          const element = document.querySelector(s.selector);
          return element && (element.contains(entry.target) || element === entry.target);
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
  }, {
    rootMargin: '200px 0px', // Start loading 200px before entering viewport
    threshold: 0.01
  });

  // Observe all section containers (handle composite selectors like #about, #services)
  sectionsToLoad.forEach(sectionConfig => {
    const elements = document.querySelectorAll(sectionConfig.selector);
    elements.forEach((element) => {
      observer.observe(element);
    });
  });
}
