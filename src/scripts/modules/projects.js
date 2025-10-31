import { projects } from '../../data/projects.js';

let currentFilter = 'all';
const filterKeywords = {
  web: ['vite', 'tailwind', 'website', 'microsite'],
  saas: ['saas', 'platform'],
  commerce: ['commerce', 'storefront', 'stripe'],
  data: ['etl', 'pipeline', 'bigquery', 'redis'],
};

export function classifyProject(p) {
  if (p.category) return [p.category];
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

export function withParam(url, key, value) {
  try {
    const u = new URL(url, window.location.href);
    u.searchParams.set(key, String(value));
    if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format');
    if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop');
    return u.toString();
  } catch (_) {
    const joinChar = url.includes('?') ? '&' : '?';
    return `${url}${joinChar}${key}=${encodeURIComponent(String(value))}`;
  }
}

export function buildResponsiveImageAttrs(originalUrl) {
  try {
    const widths = [400, 800, 1200];
    const srcSet = widths.map((w) => `${withParam(originalUrl, 'w', w)} ${w}w`).join(', ');
    const sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
    const lazySrc = withParam(originalUrl, 'w', 800);
    return { lazySrc, srcSet, sizes };
  } catch (_) {
    return { lazySrc: originalUrl, srcSet: '', sizes: '' };
  }
}

export function renderProjects() {
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
      const isCaseStudy = !!(p.caseStudy || (p.metrics && Object.keys(p.metrics).length >= 3));
      const metricsHtml = p.metrics ? `
        <div class="project-metrics">
          ${Object.entries(p.metrics).map(([key, value]) => `
            <div class="metric-item">
              <span class="metric-value">${value}</span>
              <span class="metric-label">${key}</span>
            </div>
          `).join('')}
        </div>
      ` : '';
      const featuresHtml = p.features ? `
        <div class="project-features">
          <h4 class="features-title">Key Features:</h4>
          <ul class="features-list">
            ${p.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      ` : '';
      return `
      <article data-reveal class="opacity-0 translate-y-6 project-card loading">
        <div class="project-image-container">
          <div class="project-skeleton-image project-skeleton-anim"></div>
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
            onload="this.closest('article') && this.closest('article').classList.remove('loading')"
          />
          <div class="project-overlay"></div>
          <div class="project-category">
            <span>${categories[0]}</span>
          </div>
          ${isCaseStudy ? `
          <div class="case-study-badge" aria-label="Case study">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span>Case Study</span>
          </div>` : ''}
          <div class="project-actions">
            <a href="${p.links.live}" class="project-action-btn" title="View Live Demo" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <a href="${p.links.code}" class="project-action-btn" title="View Source Code" target="_blank" rel="noopener">
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
          <div class="project-skeleton-text wide project-skeleton-anim"></div>
          <div class="project-skeleton-text project-skeleton-anim" style="width: 70%; margin-top: 0.5rem;"></div>
          ${metricsHtml}
          ${featuresHtml}
          <div class="project-meta">
            ${p.duration ? `<span class="project-duration">⏱️ ${p.duration}</span>` : ''}
            ${p.client ? `<span class="project-client">👤 ${p.client}</span>` : ''}
          </div>
          <div class="project-tech">
            ${techArray.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
          </div>
          <div class="project-footer">
            <a href="${p.links.live}" class="project-link primary" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Live Demo
            </a>
            <a href="${p.links.code}" class="project-link" target="_blank" rel="noopener">
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

export function bindProjectFilters() {
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
        if (filter === 'all') count = projects.length;
        else count = projects.filter(p => classifyProject(p).includes(filter)).length;
        countElement.textContent = count;
      }
    });
  };
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
      updateActive();
    });
  });
  updateActive();
  updateCounts();
}


