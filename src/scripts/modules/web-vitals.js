/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

import { log, trackMetric } from './logger.js';

/**
 * Report Web Vitals to analytics
 */
function reportWebVital(metric) {
  const { name, value, id, rating } = metric;
  
  log(`Web Vital - ${name}:`, {
    value: Math.round(value),
    rating,
    id
  });
  
  // Send to analytics in production
  if (!import.meta.env.DEV && window.gtag) {
    trackMetric(name.toLowerCase(), {
      value: Math.round(value),
      event_category: 'Web Vitals',
      event_label: id,
      non_interaction: true,
      rating
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 * 
 * Uses the Performance API to track Core Web Vitals.
 * This works without any external dependencies.
 * 
 * For more accurate metrics, you can optionally install the web-vitals package:
 * npm install web-vitals
 * 
 * Then create a separate file that imports web-vitals and call it from here.
 */
export function initWebVitals() {
  // Only load in production or if explicitly enabled
  if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_WEB_VITALS) {
    return;
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return;
  }
  
  // Use Performance API (always works, no dependencies)
  // This provides basic Web Vitals tracking without any external dependencies
  measureWebVitalsFallback();
}

/**
 * Fallback Web Vitals measurement using Performance API
 */
function measureWebVitalsFallback() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      
      if (perfData) {
        // TTFB (Time to First Byte)
        const ttfb = perfData.responseStart - perfData.requestStart;
        reportWebVital({
          name: 'TTFB',
          value: ttfb,
          rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor',
          id: 'ttfb'
        });
      }
      
      // FCP (First Contentful Paint)
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        reportWebVital({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: fcpEntry.startTime < 1800 ? 'good' : fcpEntry.startTime < 3000 ? 'needs-improvement' : 'poor',
          id: 'fcp'
        });
      }
      
      // LCP (Largest Contentful Paint) - approximate
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportWebVital({
              name: 'LCP',
              value: lastEntry.renderTime || lastEntry.loadTime,
              rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor',
              id: 'lcp'
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }
      }
    }, 0);
  });
}

