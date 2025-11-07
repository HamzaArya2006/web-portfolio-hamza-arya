/**
 * PWA Install Prompt and Installation Handling
 */

import { log } from './logger.js';
import { notify } from './notifications.js';

let deferredPrompt = null;
let installButton = null;

/**
 * Initialize PWA install functionality
 */
export function initPWAInstall() {
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    deferredPrompt = e;
    
    log('PWA install prompt available');
    
    // Show install button if it exists
    showInstallButton();
    
    // Track install prompt availability
    if (window.gtag && !import.meta.env.DEV) {
      window.gtag('event', 'pwa_install_prompt', {
        event_category: 'PWA',
        non_interaction: true
      });
    }
  });
  
  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    log('PWA installed');
    deferredPrompt = null;
    hideInstallButton();
    
    notify.success('App installed!', 'Thank you for installing the app.');
    
    // Track installation
    if (window.gtag && !import.meta.env.DEV) {
      window.gtag('event', 'pwa_installed', {
        event_category: 'PWA',
        non_interaction: true
      });
    }
  });
  
  // Bind install button if it exists
  bindInstallButton();
  
  // Hide install button if already installed
  if (isPWAInstalled()) {
    hideInstallButton();
  }
}

/**
 * Check if PWA is already installed
 */
function isPWAInstalled() {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check if running in fullscreen mode (iOS)
  if (window.navigator.standalone === true) {
    return true;
  }
  
  return false;
}

/**
 * Show install button
 */
function showInstallButton() {
  const buttons = document.querySelectorAll('[data-pwa-install]');
  buttons.forEach(button => {
    button.classList.remove('hidden');
    button.setAttribute('aria-hidden', 'false');
  });
}

/**
 * Hide install button
 */
function hideInstallButton() {
  const buttons = document.querySelectorAll('[data-pwa-install]');
  buttons.forEach(button => {
    button.classList.add('hidden');
    button.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Bind install button click handler
 */
function bindInstallButton() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('[data-pwa-install]');
    if (!button || !deferredPrompt) return;
    
    e.preventDefault();
    promptInstall();
  });
}

/**
 * Prompt user to install PWA
 */
export async function promptInstall() {
  if (!deferredPrompt) {
    log('Install prompt not available');
    return false;
  }
  
  try {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    log('User install choice:', outcome);
    
    // Track user choice
    if (window.gtag && !import.meta.env.DEV) {
      window.gtag('event', 'pwa_install_' + outcome, {
        event_category: 'PWA',
        event_label: outcome
      });
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    hideInstallButton();
    
    return outcome === 'accepted';
  } catch (err) {
    log('Install prompt error:', err);
    return false;
  }
}

