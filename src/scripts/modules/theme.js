/**
 * Light/Dark theme toggle functionality
 */

import { log } from './logger.js';

const THEME_KEY = 'theme-preference';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/**
 * Get system theme preference
 */
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

/**
 * Get current theme (stored preference or system)
 */
export function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored && Object.values(THEMES).includes(stored)) {
    return stored === THEMES.SYSTEM ? getSystemTheme() : stored;
  }
  return getSystemTheme();
}

/**
 * Apply theme to document
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  const actualTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
  
  root.classList.remove('light', 'dark');
  root.classList.add(actualTheme);
  root.setAttribute('data-theme', actualTheme);
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', actualTheme === THEMES.DARK ? '#0f172a' : '#ffffff');
  }
}

/**
 * Initialize theme system
 */
export function initTheme() {
  // Apply saved theme or system preference
  const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.DARK;
  applyTheme(savedTheme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const currentPreference = localStorage.getItem(THEME_KEY);
      if (!currentPreference || currentPreference === THEMES.SYSTEM) {
        applyTheme(THEMES.SYSTEM);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  }
}

/**
 * Set theme preference
 */
export function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) {
    log('Invalid theme:', theme);
    return;
  }
  
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  
  // Dispatch custom event for theme change
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Toggle between light and dark
 */
export function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || THEMES.SYSTEM;
  let nextTheme;
  
  if (current === THEMES.SYSTEM) {
    nextTheme = getSystemTheme() === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  } else if (current === THEMES.DARK) {
    nextTheme = THEMES.LIGHT;
  } else {
    nextTheme = THEMES.DARK;
  }
  
  setTheme(nextTheme);
  return nextTheme;
}

/**
 * Bind theme toggle button
 */
export function bindThemeToggle() {
  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const newTheme = toggleTheme();
      button.setAttribute('aria-label', `Switch to ${newTheme === THEMES.DARK ? 'light' : 'dark'} mode`);
      
      // Update icon if present
      const icon = button.querySelector('svg, [data-theme-icon]');
      if (icon) {
        icon.setAttribute('data-theme-icon', newTheme);
      }
    });
  });
  
  // Update button state on theme change
  window.addEventListener('themechange', (e) => {
    const theme = e.detail.theme === THEMES.SYSTEM ? getSystemTheme() : e.detail.theme;
    toggleButtons.forEach(button => {
      button.setAttribute('aria-pressed', theme === THEMES.DARK ? 'true' : 'false');
      button.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
    });
  });
}

