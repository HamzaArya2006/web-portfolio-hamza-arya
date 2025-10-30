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
import { renderProjects, bindProjectFilters } from "./modules/projects.js";
import { renderTestimonials } from "./modules/testimonials.js";
import {
  renderBlogPosts,
  bindBlogFilters,
  bindBlogPostHandlers,
} from "./modules/blog.js";
import {
  registerServiceWorker,
  initPerformanceMonitoring,
} from "./modules/pwa_perf.js";
import { runModernIntroOverlaySequence } from "./modules/intro.js";

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  bindSmoothScroll();
  // Render dynamic content before binding observers
  renderProjects();
  bindProjectFilters();
  renderTestimonials();
  renderBlogPosts();
  bindBlogFilters();
  bindBlogPostHandlers();
  bindRevealOnScroll();
  bindContactForm();
  enhanceContactForm();
  bindLazyImages();
  bindMobileNav();
  bindDesktopDropdown();
  bindMobileSubmenu();
  // scroll-based navbar and active link detection removed per request
  deferHeroAnimations();
  registerServiceWorker();
  initPerformanceMonitoring();
});

window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-overlay");
  if (intro && intro.querySelector(".intro-terminal-code")) {
    runModernIntroOverlaySequence();
  }
});
