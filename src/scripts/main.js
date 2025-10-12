import '../styles/main.css';
import { projects } from '../data/projects.js';
import { testimonials } from '../data/testimonials.js';

// Set dark mode as default
const rootElement = document.documentElement;

function initTheme() {
  rootElement.classList.add('dark');
}

// Smooth scroll for internal links
function bindSmoothScroll() {
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

 

// IntersectionObserver for fade/slide reveals
function bindRevealOnScroll() {
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

// Lightweight parallax for hero background elements
function bindParallax() {
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!parallaxEls.length) return;
  let ticking = false;
  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    for (const el of parallaxEls) {
      const speedAttr = el.getAttribute('data-parallax') || '0';
      const speed = parseFloat(speedAttr) || 0;
      // Translate only on Y; keep existing transforms intact by appending translate3d
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

// Hero spotlight: hide hero grids except a circular cursor spotlight
function bindHeroSpotlight() {
  const hero = document.querySelector('section#top');
  const overlay = hero ? hero.querySelector('[data-hero-spotlight]') : null;
  if (!hero || !overlay) return;

  // Natural vignette that follows the cursor with no smoothing latency
  overlay.style.pointerEvents = 'none';
  overlay.style.opacity = '1';
  overlay.style.mixBlendMode = 'normal';

  // Larger, softer, darker and more natural (not a bright hole)
  const baseRadius = 240;      // inner influence radius
  const featherWidth = 420;    // very soft falloff
  const centerAlpha = 0.14;    // lighter center
  const midAlpha = 0.38;       // lighter mid
  const outsideAlpha = 0.66;   // lighter edges

  const setGradient = (x, y) => {
    const inner = baseRadius;
    const outer = baseRadius + featherWidth;
    // Multi-stop gradient: subtly dark in the center, smoothly darkening outward
    const gradient = `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,${centerAlpha}) 0px, rgba(0,0,0,${midAlpha}) ${inner}px, rgba(0,0,0,${outsideAlpha}) ${outer}px)`;
    overlay.style.background = gradient;
  };

  let lastX = hero.clientWidth / 2;
  let lastY = hero.clientHeight / 2;

  const onPointerMove = (e) => {
    const rect = hero.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    // Update immediately for zero perceived latency
    setGradient(lastX, lastY);
  };

  const onPointerEnter = (e) => {
    const rect = hero.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    setGradient(lastX, lastY);
  };

  hero.addEventListener('pointermove', onPointerMove);
  hero.addEventListener('pointerenter', onPointerEnter);

  // Initialize centered, so it looks stable before the first move
  setGradient(lastX, lastY);
}

// Defer hero animations/effects until idle or first interaction
function deferHeroAnimations() {
  const hero = document.querySelector('section#top');
  let resumed = false;
  const resume = () => {
    if (resumed) return;
    resumed = true;
    if (hero) hero.classList.remove('hero-anim-off');
    bindParallax();
    bindHeroSpotlight();
  };
  // First input resumes immediately
  window.addEventListener('scroll', resume, { once: true, passive: true });
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
  // Or after idle timeout
  const idle = (window.requestIdleCallback
    ? window.requestIdleCallback(resume, { timeout: 1500 })
    : setTimeout(resume, 1200));
}

// Simple contact form handler (no backend): validate + honeypot
function bindContactForm() {
  const form = document.querySelector('form[data-contact]');
  if (!form) return;
  const statusEl = document.querySelector('[data-contact-status]');
  if (statusEl) {
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
  }
  let submitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    const formData = new FormData(form);
    // Honeypot field to deter bots
    if (formData.get('website')) {
      form.reset();
      submitting = false;
      return;
    }
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const brief = (formData.get('brief') || '').toString().trim();
    const budget = (formData.get('budget') || '').toString().trim();

    if (!name || !email || !brief) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in your name, email, and project brief.';
        statusEl.classList.remove('hidden');
        statusEl.classList.remove('text-emerald-400');
        statusEl.classList.add('text-red-400');
      }
      submitting = false;
      return;
    }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevBtnText = submitBtn ? submitBtn.textContent : '';
    const setLoading = (loading) => {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Sending…' : prevBtnText;
    };
    const showStatus = (msg, kind = 'info') => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.remove('hidden');
      statusEl.classList.remove('text-red-400', 'text-emerald-400');
      statusEl.classList.add(kind === 'error' ? 'text-red-400' : 'text-emerald-400');
    };
    if (endpoint) {
      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, brief, budget }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Request failed');
        }
        showStatus('Thanks! I will get back to you shortly.', 'success');
        form.reset();
        submitting = false;
        return;
      } catch (err) {
        console.warn('Form endpoint failed, falling back to email.', err);
      } finally {
        setLoading(false);
      }
    }
    // Fallback: compose a mailto
    const subject = encodeURIComponent('New project inquiry');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nBrief:\n${brief}`);
    try {
      setLoading(true);
      window.location.href = `mailto:contact@hamzaarya.dev?subject=${subject}&body=${body}`;
      showStatus('Opening your email app… If it does not open, email contact@hamzaarya.dev', 'success');
      form.reset();
    } catch (_) {
      showStatus('Could not open email app. Please email contact@hamzaarya.dev', 'error');
    } finally {
      setLoading(false);
      submitting = false;
    }
  });
}

// Lazy-load images with data-src
function bindLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        const sizes = img.getAttribute('data-sizes');
        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
        }
        if (srcset) {
          img.setAttribute('srcset', srcset);
          img.removeAttribute('data-srcset');
        }
        if (sizes) {
          img.setAttribute('sizes', sizes);
          img.removeAttribute('data-sizes');
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  lazyImages.forEach((img) => imgObserver.observe(img));
}

// Mobile nav toggle
function bindMobileNav() {
  const btn = document.querySelector('[data-mobile-nav-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    menu.classList.toggle('hidden', open);
  });
}

// Desktop services dropdown + click-away + Esc
function bindDesktopDropdown() {
  // Only bind click-behavior dropdowns when explicitly requested
  const container = document.querySelector('[data-dropdown="click"]');
  if (!container) return;
  const toggle = container.querySelector('[data-dropdown-toggle]');
  const menu = container.querySelector('[data-dropdown-menu]');
  const icon = container.querySelector('[data-dropdown-icon]');
  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    if (icon) icon.style.transform = 'rotate(180deg)';
  };
  const closeMenu = () => {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    if (icon) icon.style.transform = '';
  };

  let open = false;
  const setOpen = (next) => {
    open = next;
    if (open) openMenu(); else closeMenu();
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    if (!container.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// Mobile submenu toggle for Services
function bindMobileSubmenu() {
  const toggles = document.querySelectorAll('[data-submenu-toggle]');
  if (!toggles.length) return;
  toggles.forEach((toggle) => {
    const container = toggle.closest('[data-submenu-container]') || toggle.parentElement;
    const submenu = container ? container.querySelector('[data-submenu]') : null;
    if (!submenu) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      submenu.classList.toggle('hidden', expanded);
    });
  });
}

// Renderers
// Projects rendering with filters
let currentFilter = 'all';
const filterKeywords = {
  web: ['vite', 'tailwind', 'website', 'microsite'],
  saas: ['saas', 'platform'],
  commerce: ['commerce', 'storefront', 'stripe'],
  data: ['etl', 'pipeline', 'bigquery', 'redis'],
};

function classifyProject(p) {
  const hay = `${p.title} ${p.description} ${p.tech}`.toLowerCase();
  const tags = new Set(['web']);
  for (const [key, needles] of Object.entries(filterKeywords)) {
    for (const word of needles) {
      if (hay.includes(word)) tags.add(key);
    }
  }
  return Array.from(tags);
}

function projectMatchesFilter(p) {
  if (currentFilter === 'all') return true;
  return classifyProject(p).includes(currentFilter);
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const count = document.getElementById('projects-count');
  const totalCount = document.getElementById('total-projects');
  if (!grid) return;
  
  const filtered = projects.filter(projectMatchesFilter);
  if (count) count.textContent = String(filtered.length);
  if (totalCount) totalCount.textContent = String(projects.length);
  
  grid.innerHTML = filtered
    .map((p) => {
      const categories = classifyProject(p);
      const techArray = p.tech.split(' • ');
      const { lazySrc, srcSet, sizes } = buildResponsiveImageAttrs(p.image);
      
      return `
      <article data-reveal class="opacity-0 translate-y-6 project-card">
        <div class="project-image-container">
          <img 
            width="600" 
            height="400" 
            alt="${p.title}" 
            class="project-image" 
            loading="lazy"
            decoding="async"
            data-src="${lazySrc}"
            data-srcset="${srcSet}"
            data-sizes="${sizes}"
          />
          <div class="project-overlay"></div>
          <div class="project-category">
            <span>${categories[0]}</span>
          </div>
          <div class="project-actions">
            <a href="${p.links.live}" class="project-action-btn" title="View Live Demo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <a href="${p.links.code}" class="project-action-btn" title="View Source Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16,18 22,12 16,6"></polyline>
                <polyline points="8,6 2,12 8,18"></polyline>
              </svg>
            </a>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.description}</p>
          <div class="project-tech">
            ${techArray.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
          </div>
          <div class="project-footer">
            <a href="${p.links.live}" class="project-link primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Live Demo
            </a>
            <a href="${p.links.code}" class="project-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16,18 22,12 16,6"></polyline>
                <polyline points="8,6 2,12 8,18"></polyline>
              </svg>
              Code
            </a>
          </div>
        </div>
      </article>`;
    })
    .join('');
}

// Build responsive image attributes for Unsplash-like URLs
function buildResponsiveImageAttrs(originalUrl) {
  try {
    const widths = [400, 800, 1200];
    const srcSet = widths
      .map((w) => `${withParam(originalUrl, 'w', w)} ${w}w`)
      .join(', ');
    const sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
    const lazySrc = withParam(originalUrl, 'w', 800);
    return { lazySrc, srcSet, sizes };
  } catch (_) {
    return { lazySrc: originalUrl, srcSet: '', sizes: '' };
  }
}

function withParam(url, key, value) {
  try {
    const u = new URL(url, window.location.href);
    u.searchParams.set(key, String(value));
    // Preserve common quality params if present; add defaults if missing
    if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format');
    if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop');
    return u.toString();
  } catch (_) {
    // Fallback: naive append
    const joinChar = url.includes('?') ? '&' : '?';
    return `${url}${joinChar}${key}=${encodeURIComponent(String(value))}`;
  }
}

function bindProjectFilters() {
  const bar = document.getElementById('projects-filters');
  if (!bar) return;
  const buttons = bar.querySelectorAll('button[data-filter]');
  
  const updateActive = () => {
    buttons.forEach((b) => {
      const active = b.getAttribute('data-filter') === currentFilter;
      b.classList.toggle('active', active);
    });
  };
  
  const updateCounts = () => {
    const filterTypes = ['all', 'web', 'saas', 'commerce', 'data'];
    filterTypes.forEach(filter => {
      const countElement = document.getElementById(`count-${filter}`);
      if (countElement) {
        let count = 0;
        if (filter === 'all') {
          count = projects.length;
        } else {
          count = projects.filter(p => classifyProject(p).includes(filter)).length;
        }
        countElement.textContent = count;
      }
    });
  };
  
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
      bindRevealOnScroll();
      bindLazyImages();
      updateActive();
    });
  });
  
  updateActive();
  updateCounts();
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  grid.innerHTML = testimonials
    .map((t) => {
      const stars = '★'.repeat(t.rating);
      return `
      <article data-reveal class="opacity-0 translate-y-6 group">
        <div class="relative h-full glass rounded-2xl p-8 testimonial-card border border-white/10 hover:border-white/20">
          <!-- Quote icon -->
          <div class="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>
          
          <!-- Rating stars -->
          <div class="flex items-center gap-1 mb-4">
            <div class="text-yellow-400 text-sm">${stars}</div>
          </div>
          
          <!-- Quote -->
          <blockquote class="text-gray-100 text-lg leading-relaxed mb-6 relative">
            "${t.quote}"
          </blockquote>
          
          <!-- Author info -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
              ${t.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div class="font-semibold text-gray-100">${t.author}</div>
              <div class="text-sm text-gray-400">${t.role}</div>
              <div class="text-xs text-gray-500">${t.company}</div>
            </div>
          </div>
        </div>
      </article>`;
    })
    .join('');
  
  // Add proximity-based border animation
  bindTestimonialProximity();
}

// Proximity-based border animation for testimonials
function bindTestimonialProximity() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('proximity-active');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('proximity-active');
    });
  });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindSmoothScroll();
  // Render dynamic content before binding observers
  renderProjects();
  bindProjectFilters();
  renderTestimonials();
  bindRevealOnScroll();
  bindContactForm();
  bindLazyImages();
  bindMobileNav();
  bindDesktopDropdown();
  bindMobileSubmenu();
  deferHeroAnimations();
});


