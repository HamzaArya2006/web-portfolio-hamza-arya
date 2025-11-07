import { notify } from './notifications.js';

const PUBLIC_API_BASE = (import.meta.env.VITE_PUBLIC_API_URL || import.meta.env.VITE_ADMIN_API_URL || '').replace(/\/$/, '');

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
    console.warn('[customizations] Using default values:', error.message);
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
  if (el) el.innerHTML = value;
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
  target.innerHTML = html || '';
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


