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
              ? `<p class="project-meta-line text-xs text-gray-500">${metaText}</p>`
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
              ? `<a href="${p.links.live}" class="project-link-minimal" target="_blank" rel="noopener">Live site</a>`
              : ''
          }
          ${
            p.links?.code && p.links.code !== '#'
              ? `<a href="${p.links.code}" class="project-link-minimal" target="_blank" rel="noopener">Code</a>`
              : ''
          }
          ${detailUrl ? `<a href="${detailUrl}" class="project-link-minimal">View details</a>` : ''}
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
  if (!grid) return;
  const dataSource = projects.length ? projects : localProjects;
  const filtered = dataSource.filter(projectMatchesFilter);
  if (count) count.textContent = String(filtered.length);
  if (totalCount) totalCount.textContent = String(dataSource.length);
  grid.innerHTML = buildProjectsHTML(filtered);
  revealCardsAndBindImages(grid);
}

export async function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const count = document.getElementById('projects-count');
  const totalCount = document.getElementById('total-projects');
  if (!grid) return;

  // 1) Sync first paint from current data (local fallback) so cards show immediately
  const dataSource = projects.length ? projects : localProjects;
  const filteredInitial = dataSource.filter(projectMatchesFilter);
  if (count) count.textContent = String(filteredInitial.length);
  if (totalCount) totalCount.textContent = String(dataSource.length);
  grid.innerHTML = buildProjectsHTML(filteredInitial);
  revealCardsAndBindImages(grid);

  // 2) Load remote (if any) and re-render when ready
  const data = await loadProjects();
  const filtered = data.filter(projectMatchesFilter);
  if (count) count.textContent = String(filtered.length);
  if (totalCount) totalCount.textContent = String(data.length);
  grid.innerHTML = buildProjectsHTML(filtered);
  revealCardsAndBindImages(grid);
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
