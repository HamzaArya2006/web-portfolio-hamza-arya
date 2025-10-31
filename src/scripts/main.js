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
import { initAnalytics } from "./modules/analytics.js";
import { renderSkills } from "./modules/skills.js";
import { renderOpenSourceContributions, renderPinnedRepos } from "./modules/openSource.js";
import { renderSpeakingEngagements, renderPublications } from "./modules/speaking.js";
import { renderPressLogos, renderClientLogos } from "./modules/press.js";

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
  initAnalytics();
  // Render new sections
  renderSkills();
  renderOpenSourceContributions();
  renderPinnedRepos();
  renderSpeakingEngagements();
  renderPublications();
  renderPressLogos();
  renderClientLogos();
});

window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-overlay");
  if (intro && intro.querySelector(".intro-terminal-code")) {
    runModernIntroOverlaySequence();
  }
});
