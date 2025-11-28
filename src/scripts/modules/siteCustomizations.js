import { notify } from './notifications.js';
import { warn } from './logger.js';

const PUBLIC_API_BASE = (import.meta.env.VITE_PUBLIC_API_URL || import.meta.env.VITE_ADMIN_API_URL || '').replace(/\/$/, '');

// Basic HTML sanitizer to prevent XSS attacks
// Note: For production, consider using DOMPurify library (npm install dompurify) for more robust sanitization
function sanitizeHTML(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove script tags and their contents
  const scripts = div.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove event handlers from all elements
  const allElements = div.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || attr.name === 'href' && attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return div.innerHTML;
}

const APPLIERS = {
  'hero.title': (value) => updateHTML('hero-title', value),
  'hero.subtitle': (value) => updateText('hero-subtitle', value),
  'hero.status': (value) => updateText('hero-status', value),
  'hero.cta.primary': (value) => updateText('hero-primary-cta', value),
  'hero.cta.secondary': (value) => updateText('hero-secondary-cta', value),
  'hero.cta.tertiary': (value) => updateText('hero-tertiary-cta', value),
  'theme.primary': (value) => setColorVariable('--accent-primary', value),
  'theme.secondary': (value) => setColorVariable('--accent-secondary', value),
  'theme.primary.hover': (value) => setColorVariable('--accent-primary-hover', value),
  'theme.secondary.hover': (value) => setColorVariable('--accent-secondary-hover', value),
  'custom.css.global': (value) => injectStyle('global-custom-css', value),
  'custom.hero.html': (value) => injectHeroHTML(value),
  'meta.home.title': (value) => updateDocumentTitle(value),
  'meta.home.description': (value) => updateMetaDescription(value),
};

let applied = false;

export async function applySiteCustomizations() {
  if (applied) return;
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/api/public/customizations`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load customizations');
    const data = await response.json();
    if (!data?.customizations) return;

    data.customizations.forEach((item) => {
      const handler = APPLIERS[item.key];
      if (handler) {
        handler(item.value);
      }
    });
    applied = true;
  } catch (error) {
    warn('[customizations] Using default values:', error.message);
  }
}

function updateText(id, value) {
  if (!value) return;
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateHTML(id, value) {
  if (!value) return;
  const el = document.getElementById(id);
  if (el) {
    // Sanitize HTML before inserting to prevent XSS attacks
    el.innerHTML = sanitizeHTML(value);
  }
}

function setColorVariable(variable, value) {
  if (!value) return;
  document.documentElement.style.setProperty(variable, value);
}

function injectStyle(id, css) {
  let style = document.getElementById(id);
  if (!css) {
    if (style) style.remove();
    return;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function injectHeroHTML(html) {
  const target = document.querySelector('[data-custom-hero]');
  if (!target) return;
  // Sanitize HTML before inserting to prevent XSS attacks
  target.innerHTML = html ? sanitizeHTML(html) : '';
}

function updateDocumentTitle(value) {
  if (value) document.title = value;
}

function updateMetaDescription(value) {
  if (!value) return;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
}

export function mountHeroCustomSlot() {
  const existing = document.querySelector('[data-custom-hero]');
  if (!existing) {
    const hero = document.querySelector('#top [data-reveal]');
    if (hero) {
      const slot = document.createElement('div');
      slot.dataset.customHero = '';
      slot.className = 'space-y-2';
      hero.appendChild(slot);
    }
  }
}

export function reportCustomizationError(message) {
  notify?.error?.('Customization error', message);
}


