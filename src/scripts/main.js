import "../styles/main.css";
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
import { runModernIntroOverlaySequence } from "./modules/intro.js";
import { renderProjects } from "./modules/projects.js";
// Critical: Load immediately
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  bindSmoothScroll();
  bindRevealOnScroll();
  bindMobileNav();
  bindDesktopDropdown();
  bindMobileSubmenu();
  deferHeroAnimations();
  // Activate subtle spotlight and parallax effects on hero and decorative elements
  try { bindHeroSpotlight(); } catch (_) {}
  try { bindParallax(); } catch (_) {}
  registerServiceWorker();
  initPerformanceMonitoring();
  bindLazyImages();
  // Eagerly render projects if grid exists to avoid relying solely on intersection
  const grid = document.getElementById('projects-grid');
  if (grid) {
    try {
      renderProjects();
    } catch (_) {}
  }
  // Ensure heavy sections begin observing as soon as DOM is ready
  loadHeavySections();
  
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
});

// Conditionally load heavy sections on viewport intersection
function loadHeavySections() {
  const sectionsToLoad = [
    {
      // Support both homepage projects section and projects listing page
      selector: '#projects, #projects-grid',
      load: async () => {
        const { renderProjects, bindProjectFilters } = await import("./modules/projects.js");
        renderProjects();
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
            console.error('Failed to load section:', sectionConfig.selector, err);
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '200px 0px', // Start loading 200px before entering viewport
    threshold: 0.01
  });

  // Observe all section containers
  sectionsToLoad.forEach(sectionConfig => {
    const element = document.querySelector(sectionConfig.selector);
    if (element) {
      observer.observe(element);
    }
  });
}
