import { projects as localProjects } from '../../data/projects.js';
import { project } from '../../config/links.js';
import { warn } from './logger.js';

// Safely read Vite-style env var even when not running through Vite
const RAW_PUBLIC_API_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_PUBLIC_API_URL) || '';
const PUBLIC_API_BASE = RAW_PUBLIC_API_URL.replace(/\/$/, '');

let projects = [...localProjects];
let remoteLoaded = false;
let remoteFailed = false;

// Current high-level filter (e.g. "client", "ecommerce", etc.)
let currentFilter = 'all';
// Optional secondary tag filter (driven by the Popular Tags chips)
let activeTag = null;

// Keyword helpers for deriving richer categories from project content
const filterKeywords = {
  client: ['client', 'company', 'co. ltd', 'co. ltd.', 'website', 'business'],
  ecommerce: ['e-commerce', 'ecommerce', 'shop', 'store', 'catalog', 'product'],
  landing: ['landing page', 'marketing', 'hero section', 'newsletter', 'signup'],
  apps: ['appstore', 'app store', 'weather app', 'dashboard', 'mobile app'],
};

export function classifyProject(p) {
  const categories = new Set();

  if (p.category) categories.add(String(p.category).toLowerCase());

  if (Array.isArray(p.tags)) {
    p.tags.forEach(tag => categories.add(String(tag).toLowerCase()));
  }

  const hay = `${p.id || ''} ${p.title || ''} ${p.description || ''} ${p.tech || ''} ${
    Array.isArray(p.tags) ? p.tags.join(' ') : ''
  }`.toLowerCase();

  for (const [key, needles] of Object.entries(filterKeywords)) {
    for (const word of needles) {
      if (hay.includes(word)) categories.add(key);
    }
  }

  // Everything here is a web project by default
  categories.add('web');

  return Array.from(categories);
}

function projectMatchesFilter(p) {
  // Primary category filter (All / Client / E‑commerce / Landing / Apps)
  const matchesCategory =
    currentFilter === 'all' || classifyProject(p).includes(currentFilter);

  if (!matchesCategory) return false;

  // Optional secondary tag filter (Popular Tags section)
  if (!activeTag) return true;

  const tagList = Array.isArray(p.tags) ? p.tags : [];
  const tech = p.tech || '';
  const needle = activeTag.toLowerCase();

  return (
    tagList.some(tag => String(tag).toLowerCase() === needle) ||
    tech.toLowerCase().includes(needle)
  );
}

export function withParam(url, key, value) {
  try {
    const u = new URL(url, window.location.href);
    u.searchParams.set(key, String(value));
    if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format');
    if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop');
    if (!u.searchParams.has('q')) u.searchParams.set('q', '75');
    return u.toString();
  } catch (_) {
    const joinChar = url.includes('?') ? '&' : '?';
    return `${url}${joinChar}${key}=${encodeURIComponent(String(value))}`;
  }
}

export function buildResponsiveImageAttrs(originalUrl) {
  try {
    const widths = [400, 800, 1200];
    const srcSet = widths
      .map(w => `${withParam(originalUrl, 'w', w)} ${w}w`)
      .join(', ');
    const sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
    const lazySrc = withParam(originalUrl, 'w', 800);
    return { lazySrc, srcSet, sizes };
  } catch (_) {
    return { lazySrc: originalUrl, srcSet: '', sizes: '' };
  }
}

function normalizeMetrics(metrics) {
  if (!metrics || typeof metrics !== 'object') return [];
  return Object.entries(metrics).map(([key, value]) => {
    const label = String(key)
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: String(value),
    };
  });
}

function buildProjectDetailHTML(p) {
  const tags = Array.isArray(p.tags) ? p.tags : [];
  const techStack =
    Array.isArray(p.stack) && p.stack.length
      ? p.stack
      : String(p.tech || '')
          .split('•')
          .map(t => t.trim())
          .filter(Boolean);
  const features = Array.isArray(p.features) ? p.features : [];
  const metrics = normalizeMetrics(p.metrics);
  const mainImage = p.image || (Array.isArray(p.images) && p.images[0]) || '';
  const galleryImages = Array.isArray(p.images) && p.images.length ? p.images : mainImage ? [mainImage] : [];
  const { lazySrc, srcSet, sizes } = mainImage
    ? buildResponsiveImageAttrs(mainImage)
    : { lazySrc: '', srcSet: '', sizes: '' };

  const shareUrl = (() => {
    try {
      return window.location.href;
    } catch (_) {
      return '';
    }
  })();
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(p.title || '');

  return `
    <header class="mb-12">
      ${
        tags.length
          ? `<div class="flex flex-wrap items-center gap-3 mb-6">
        ${tags
          .map(
            tag => `
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium">
            ${tag}
          </span>`
          )
          .join('')}
      </div>`
          : ''
      }
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
        ${p.title || 'Project'}
      </h1>
      ${
        p.description
          ? `<p class="text-xl text-gray-300 mb-8">${p.description}</p>`
          : ''
      }
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
        ${
          p.role
            ? `<div class="flex items-center gap-2">
          <span class="font-semibold text-white">Role:</span>
          <span>${p.role}</span>
        </div>`
            : ''
        }
        ${
          p.client
            ? `<div class="flex items-center gap-2">
          <span class="font-semibold text-white">Client:</span>
          <span>${p.client}</span>
        </div>`
            : ''
        }
        ${
          p.duration
            ? `<div class="flex items-center gap-2">
          <span class="font-semibold text-white">Duration:</span>
          <span>${p.duration}</span>
        </div>`
            : ''
        }
      </div>
    </header>

    ${
      mainImage
        ? `<div class="mb-12 project-image-container">
      <img
        width="1200"
        height="800"
        alt="${p.title || 'Project image'}"
        class="w-full rounded-2xl object-cover project-image"
        decoding="async"
        data-src="${lazySrc}"
        data-srcset="${srcSet}"
        data-sizes="${sizes}"
      />
    </div>`
        : ''
    }

    ${
      techStack.length
        ? `<section class="mb-12" aria-label="Tech stack">
      <h2 class="text-2xl font-bold mb-6">Tech Stack</h2>
      <div class="flex flex-wrap gap-3">
        ${techStack
          .map(
            tech => `
          <span class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 border border-white/10 text-gray-200 text-sm font-medium">
            ${tech}
          </span>`
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      features.length
        ? `<section class="mb-12" aria-label="Key features">
      <h2 class="text-2xl font-bold mb-6">Key Features</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${features
          .map(
            feature => `
          <li class="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 text-green-400" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-200">${feature}</span>
          </li>`
          )
          .join('')}
      </ul>
    </section>`
        : ''
    }

    ${
      metrics.length
        ? `<section class="mb-12" aria-label="Project results">
      <h2 class="text-2xl font-bold mb-6">Results</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${metrics
          .map(
            m => `
          <div class="glass rounded-xl p-6 hover-lift">
            <div class="text-3xl font-bold text-blue-300 mb-2">${m.value}</div>
            <div class="text-sm text-gray-400 font-medium">${m.label}</div>
          </div>`
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      galleryImages.length > 1
        ? `<section class="mb-12" aria-label="Project gallery">
      <h2 class="text-2xl font-bold mb-6">Gallery</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${galleryImages
          .map(
            (img, index) => `
          <img
            src="${img}"
            alt="${p.title || 'Project'} — image ${index + 1}"
            class="w-full rounded-xl object-cover"
            loading="lazy"
          />`
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      p.links && (p.links.live || (p.links.code && p.links.code !== '#'))
        ? `<section class="mb-12" aria-label="Project links">
      <div class="flex flex-wrap gap-4">
        ${
          p.links.live
            ? `<a href="${p.links.live}" target="_blank" rel="noopener" class="btn-primary inline-flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          View Live
        </a>`
            : ''
        }
        ${
          p.links.code && p.links.code !== '#'
            ? `<a href="${p.links.code}" target="_blank" rel="noopener" class="btn-secondary inline-flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          View Code
        </a>`
            : ''
        }
      </div>
    </section>`
        : ''
    }

    <footer class="mt-16 pt-12 border-t border-white/10">
      <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <a href="/pages/projects.html" class="btn-ghost inline-flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="mr-2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Portfolio
        </a>
        ${
          shareUrl
            ? `<div class="flex items-center gap-4 text-sm text-gray-400">
          <span>Share:</span>
          <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedShareUrl}" target="_blank" rel="noopener" class="hover:text-white">
            Twitter
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}" target="_blank" rel="noopener" class="hover:text-white">
            LinkedIn
          </a>
        </div>`
            : ''
        }
      </div>
    </footer>
  `;
}

async function loadProjects(force = false) {
  if (remoteLoaded && !force) return projects;
  if (remoteFailed && !force) return projects;

  // If no API base is configured, skip remote fetch and rely on local data
  if (!PUBLIC_API_BASE) {
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      warn('[projects] No PUBLIC_API_URL set; using local projects only.');
    }
    return projects;
  }

  const endpoint = `${PUBLIC_API_BASE}/api/public/projects`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Failed to fetch remote projects');
    const data = await response.json();
    if (Array.isArray(data) && data.length) {
      projects = data;
      remoteLoaded = true;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    warn('[projects] Falling back to local data:', error.message);
    remoteFailed = true;
  }
  return projects;
}

function buildProjectsHTML(list) {
  return list
    .map(p => {
      const categories = classifyProject(p);
      const tech = p.tech || '';
      const techArray = tech.split(' • ').filter(Boolean);
      const imgUrl = p.image || '';
      const { lazySrc, srcSet, sizes } = buildResponsiveImageAttrs(imgUrl);
      const primaryCategory =
        categories.find(c => c !== 'web') || categories[0] || 'web';
      const metaPieces = [];
      if (p.client) metaPieces.push(p.client);
      if (p.duration) metaPieces.push(p.duration);
      const metaText = metaPieces.join(' • ');
      const detailUrl = p.slug ? project(p.slug) : '';
      return `
      <article data-reveal class="opacity-0 translate-y-6 project-card">
        ${detailUrl ? `<a href="${detailUrl}" class="block group" aria-label="View ${p.title} project details">` : ''}
        <div class="project-image-container">
          <img 
            width="600" 
            height="400" 
            alt="${p.title}" 
            class="project-image" 
            decoding="async"
            loading="lazy"
            data-src="${lazySrc}"
            data-srcset="${srcSet}"
            data-sizes="${sizes}"
          />
          <div class="project-category">
            <span>${primaryCategory}</span>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.description}</p>
          ${
            p.role
              ? `<p class="project-role text-sm text-gray-400">${p.role}</p>`
              : ''
          }
          ${
            metaText
              ? `<p class="project-meta-line text-xs text-gray-400">${metaText}</p>`
              : ''
          }
          <div class="project-tech">
            ${techArray
              .map(t => `<span class="tech-badge">${t}</span>`)
              .join('')}
          </div>
        </div>
        ${detailUrl ? '</a>' : ''}
        <div class="project-links-row">
          ${
            p.links?.live
              ? `<a href="${p.links.live}" class="project-link-minimal" target="_blank" rel="noopener" aria-label="Live demo – ${p.title}">Live demo</a>`
              : ''
          }
          ${
            p.links?.code && p.links.code !== '#'
              ? `<a href="${p.links.code}" class="project-link-minimal" target="_blank" rel="noopener" aria-label="GitHub – ${p.title}">GitHub</a>`
              : ''
          }
          ${detailUrl ? `<a href="${detailUrl}" class="project-link-minimal" aria-label="View details – ${p.title}">View details</a>` : ''}
        </div>
      </article>`;
    })
    .join('');
}

function revealCardsAndBindImages(grid) {
  if (!grid) return;
  try {
    const images = grid.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (!('IntersectionObserver' in window)) {
        const ds = img.getAttribute('data-src');
        if (ds) img.setAttribute('src', ds);
        const dss = img.getAttribute('data-srcset');
        if (dss) img.setAttribute('srcset', dss);
        const dsizes = img.getAttribute('data-sizes');
        if (dsizes) img.setAttribute('sizes', dsizes);
      }
      const article = img.closest('article');
      if (article) {
        setTimeout(() => {
          article.classList.remove('loading');
          article.classList.remove('opacity-0');
          article.classList.remove('translate-y-6');
        }, 2000);
      }
    });
    grid.querySelectorAll('article.project-card').forEach(card => {
      card.classList.remove('opacity-0');
      card.classList.remove('translate-y-6');
    });
  } catch (_) {}
}

/** Sync-only first paint from local data. Call as soon as DOM has #projects-grid. */
export function renderProjectsSync() {
  const grid = document.getElementById('projects-grid');
  const count = document.getElementById('projects-count');
  const totalCount = document.getElementById('total-projects');
  const emptyEl = document.getElementById('projects-empty');
  if (!grid) return;
  const featuredOnly = grid.dataset.featuredOnly === 'true';
  const dataSource = projects.length ? projects : localProjects;
  const baseList = featuredOnly
    ? dataSource.filter(p => p.featured)
    : dataSource;
  const filtered = featuredOnly ? baseList : baseList.filter(projectMatchesFilter);
  if (count) count.textContent = String(filtered.length);
  if (totalCount) totalCount.textContent = String(baseList.length);
  grid.innerHTML = buildProjectsHTML(filtered);
  revealCardsAndBindImages(grid);
  if (emptyEl) {
    emptyEl.classList.toggle('hidden', filtered.length > 0);
  }
}

export async function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const count = document.getElementById('projects-count');
  const totalCount = document.getElementById('total-projects');
  const emptyEl = document.getElementById('projects-empty');
  if (!grid) return;
  const featuredOnly = grid.dataset.featuredOnly === 'true';

  // 1) Sync first paint from current data (local fallback) so cards show immediately
  const dataSource = projects.length ? projects : localProjects;
  const baseInitial = featuredOnly
    ? dataSource.filter(p => p.featured)
    : dataSource;
  const filteredInitial = featuredOnly
    ? baseInitial
    : baseInitial.filter(projectMatchesFilter);
  if (count) count.textContent = String(filteredInitial.length);
  if (totalCount) totalCount.textContent = String(baseInitial.length);
  grid.innerHTML = buildProjectsHTML(filteredInitial);
  revealCardsAndBindImages(grid);
  if (emptyEl) emptyEl.classList.toggle('hidden', filteredInitial.length > 0);

  // 2) Load remote (if any) and re-render when ready
  const data = await loadProjects();
  const baseList = featuredOnly ? data.filter(p => p.featured) : data;
  const filtered = featuredOnly ? baseList : baseList.filter(projectMatchesFilter);
  if (count) count.textContent = String(filtered.length);
  if (totalCount) totalCount.textContent = String(baseList.length);
  grid.innerHTML = buildProjectsHTML(filtered);
  revealCardsAndBindImages(grid);
  if (emptyEl) emptyEl.classList.toggle('hidden', filtered.length > 0);
}

export async function renderProjectDetail() {
  const root = document.getElementById('project-detail-root');
  if (!root) return;

  let slug = null;
  try {
    const url = new URL(window.location.href);
    slug = url.searchParams.get('slug');
  } catch (_) {
    slug = null;
  }

  const breadcrumbTitle = document.getElementById('project-breadcrumb-title');

  if (!slug) {
    root.innerHTML =
      '<p class="text-gray-300 py-12 text-center">Project not found. <a href="/pages/projects.html" class="underline hover:text-white">Back to projects</a></p>';
    if (breadcrumbTitle) breadcrumbTitle.textContent = 'Project not found';
    return;
  }

  const data = await loadProjects();
  const project = data.find(p => p.slug === slug);

  if (!project) {
    root.innerHTML =
      '<p class="text-gray-300 py-12 text-center">Project not found. It may have been removed or renamed. <a href="/pages/projects.html" class="underline hover:text-white">Back to projects</a></p>';
    if (breadcrumbTitle) breadcrumbTitle.textContent = 'Project not found';
    return;
  }

  if (breadcrumbTitle) breadcrumbTitle.textContent = project.title || 'Project';

  try {
    document.title = `${project.title} — Hamza Arya's Portfolio`;
  } catch (_) {}

  try {
    const desc = project.description || '';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && project.title) ogTitle.setAttribute('content', project.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && desc) ogDesc.setAttribute('content', desc);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && project.image) ogImage.setAttribute('content', project.image);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.href);
  } catch (_) {}

  root.innerHTML = buildProjectDetailHTML(project);
  const container = root.closest('.container-pro');
  if (container) {
    try {
      const images = container.querySelectorAll('img[data-src]');
      images.forEach(img => {
        const ds = img.getAttribute('data-src');
        if (ds) img.setAttribute('src', ds);
        const dss = img.getAttribute('data-srcset');
        if (dss) img.setAttribute('srcset', dss);
        const dsizes = img.getAttribute('data-sizes');
        if (dsizes) img.setAttribute('sizes', dsizes);
      });
    } catch (_) {}
  }
}

export async function bindProjectFilters() {
  const bar = document.getElementById('projects-filters');
  if (!bar) return;
  const buttons = bar.querySelectorAll('button[data-filter]');

  // Set up ARIA attributes for filter group
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Project category filters');

  const updateActive = () => {
    buttons.forEach(b => {
      const active = b.getAttribute('data-filter') === currentFilter;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
  };
  const updateCounts = async () => {
    await loadProjects();
    const filterTypes = ['all', 'client', 'ecommerce', 'landing', 'apps'];
    filterTypes.forEach(filter => {
      const countElement = document.getElementById(`count-${filter}`);
      if (countElement) {
        let count = 0;
        if (filter === 'all') count = projects.length;
        else
          count = projects.filter(p =>
            classifyProject(p).includes(filter)
          ).length;
        countElement.textContent = count;
      }
    });
  };

  // Filter button interactions
  buttons.forEach(btn => {
    // Set initial ARIA attributes
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-pressed', 'false');

    // Click handler
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
      updateActive();
    });

    // Keyboard navigation
    btn.addEventListener('keydown', e => {
      const buttonsArray = Array.from(buttons);
      const currentIndex = buttonsArray.indexOf(btn);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % buttonsArray.length;
          buttonsArray[nextIndex].focus();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex =
            (currentIndex - 1 + buttonsArray.length) % buttonsArray.length;
          buttonsArray[prevIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          buttonsArray[0].focus();
          break;
        case 'End':
          e.preventDefault();
          buttonsArray[buttonsArray.length - 1].focus();
          break;
      }
    });
  });

  updateActive();
  updateCounts();

  // Optional secondary tag filters (Popular Tags section on projects page)
  const tagContainer = document.getElementById('tag-filters');
  if (tagContainer) {
    tagContainer.setAttribute('role', 'group');
    tagContainer.setAttribute('aria-label', 'Project tag filters');

    const setupTagFilters = async () => {
      await loadProjects();

      // Collect tag frequencies from project data
      const tagFrequency = new Map();
      projects.forEach(p => {
        if (Array.isArray(p.tags)) {
          p.tags.forEach(tag => {
            const key = String(tag);
            tagFrequency.set(key, (tagFrequency.get(key) || 0) + 1);
          });
        }
      });

      const popularTags = Array.from(tagFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);

      if (!popularTags.length) {
        tagContainer.innerHTML =
          '<p class="text-sm text-gray-500">Tags will appear here as projects are added.</p>';
        return;
      }

      tagContainer.innerHTML = popularTags
        .map(
          tag => `
        <button 
          type="button" 
          class="project-filter-btn tag-filter-btn" 
          data-tag="${tag}"
          aria-pressed="false"
        >
          ${tag}
        </button>`
        )
        .join('');

      const tagButtons = tagContainer.querySelectorAll('button[data-tag]');
      const updateTagActive = () => {
        tagButtons.forEach(btn => {
          const tag = btn.getAttribute('data-tag') || '';
          const isActive = activeTag === tag;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });
      };

      tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.getAttribute('data-tag') || '';
          activeTag = activeTag === tag ? null : tag;
          renderProjects();
          updateTagActive();
        });
      });

      updateTagActive();
    };

    // Fire-and-forget; we don't need to await this
    setupTagFilters();
  }
}
