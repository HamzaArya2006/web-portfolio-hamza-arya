/**
 * View Transitions API for smooth page transitions
 */

import { log } from './logger.js';

/**
 * Check if View Transitions API is supported
 */
export function supportsViewTransitions() {
  return 'startViewTransition' in document;
}

/**
 * Navigate with view transition
 */
export function navigateWithTransition(url, options = {}) {
  if (!supportsViewTransitions()) {
    // Fallback to normal navigation
    window.location.href = url;
    return;
  }
  
  const { skipTransition = false } = options;
  
  if (skipTransition) {
    window.location.href = url;
    return;
  }
  
  try {
    document.startViewTransition(() => {
      window.location.href = url;
    });
  } catch (err) {
    log('View transition failed:', err);
    window.location.href = url;
  }
}

/**
 * Bind view transitions to links
 */
export function bindViewTransitions() {
  if (!supportsViewTransitions()) {
    return;
  }
  
  // Only bind to same-origin links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Skip if external link, hash link, or has data-skip-transition
    if (
      href.startsWith('http') && !href.startsWith(window.location.origin) ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.hasAttribute('data-skip-transition') ||
      link.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin === window.location.origin) {
        e.preventDefault();
        navigateWithTransition(url.href);
      }
    } catch (err) {
      // Invalid URL, let browser handle it
    }
  });
}

/**
 * Add view transition styles
 */
export function addViewTransitionStyles() {
  if (!supportsViewTransitions()) {
    return;
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @view-transition {
      navigation: auto;
    }
    
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 0.3s;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    ::view-transition-old(root) {
      animation-name: fade-out, slide-out;
    }
    
    ::view-transition-new(root) {
      animation-name: fade-in, slide-in;
    }
    
    @keyframes fade-out {
      to { opacity: 0; }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
    }
    
    @keyframes slide-out {
      to { transform: translateX(-20px); }
    }
    
    @keyframes slide-in {
      from { transform: translateX(20px); }
    }
  `;
  document.head.appendChild(style);
}

