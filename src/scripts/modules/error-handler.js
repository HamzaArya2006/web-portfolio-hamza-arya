/**
 * Global error handling for uncaught errors and promise rejections
 */

import { error, trackMetric } from './logger.js';

/**
 * Initialize global error handlers
 */
export function initErrorHandling() {
  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack
    };
    
    error('Uncaught error:', errorInfo);
    
    // Track in analytics (production only)
    if (!import.meta.env.DEV && window.gtag) {
      trackMetric('exception', {
        description: event.message,
        fatal: true
      });
    }
    
    // Prevent default browser error handling in dev
    if (import.meta.env.DEV) {
      event.preventDefault();
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      reason: event.reason,
      promise: event.promise
    };
    
    error('Unhandled promise rejection:', errorInfo);
    
    // Track in analytics (production only)
    if (!import.meta.env.DEV && window.gtag) {
      trackMetric('exception', {
        description: event.reason?.message || String(event.reason),
        fatal: false
      });
    }
    
    // Prevent default browser error handling in dev
    if (import.meta.env.DEV) {
      event.preventDefault();
    }
  });
}

