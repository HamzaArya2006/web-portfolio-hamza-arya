/**
 * Environment-aware logging utility
 * Only logs in development mode, can be extended to send to analytics in production
 */

const isDev = import.meta.env.DEV;

/**
 * Log info messages (only in dev)
 */
export function log(...args) {
  if (isDev) {
    console.log(...args);
  }
}

/**
 * Log warnings (only in dev)
 */
export function warn(...args) {
  if (isDev) {
    console.warn(...args);
  }
}

/**
 * Log errors (always, but can be sent to analytics in production)
 */
export function error(...args) {
  if (isDev) {
    console.error(...args);
  } else {
    // In production, you could send to error tracking service
    // Example: sendToErrorTracking(args);
  }
}

/**
 * Log debug messages (only in dev)
 */
export function debug(...args) {
  if (isDev) {
    console.debug(...args);
  }
}

/**
 * Send metrics to analytics (for production)
 */
export function trackMetric(name, value, labels = {}) {
  if (!isDev && window.gtag) {
    window.gtag('event', name, {
      value,
      ...labels
    });
  }
}

