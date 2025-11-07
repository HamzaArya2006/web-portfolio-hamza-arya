import { log, error } from './logger.js';
import { notify } from './notifications.js';

let updateAvailable = false;
let registration = null;

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          log('SW registered: ', reg);
          registration = reg;
          
          // Check for updates periodically (reduced frequency for better performance)
          setInterval(() => {
            reg.update();
          }, 2 * 60 * 60 * 1000); // Check every 2 hours instead of 1
          
          // Listen for update found
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                updateAvailable = true;
                showUpdateToast();
                notify.info('Update available', 'A new version of the site is available. Click reload to update.');
              }
            });
          });
        })
        .catch((registrationError) => {
          error('SW registration failed: ', registrationError);
        });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          log('Service Worker activated:', event.data.version);
        }
      });
      
      // Handle controller change (new SW activated)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          // Optionally reload page
          // window.location.reload();
        }
      });
    });
  }
}

function showUpdateToast() {
  // Remove existing toast if present
  const existingToast = document.getElementById('sw-update-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.id = 'sw-update-toast';
  toast.className = 'sw-update-toast';
  toast.innerHTML = `
    <div class="sw-update-content">
      <span>New version available!</span>
      <button id="sw-update-reload" class="sw-update-btn">Reload</button>
      <button id="sw-update-dismiss" class="sw-update-btn-dismiss" aria-label="Dismiss">×</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Reload button
  toast.querySelector('#sw-update-reload').addEventListener('click', () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
  
  // Dismiss button
  toast.querySelector('#sw-update-dismiss').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
}

export function initPerformanceMonitoring() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        const domContentTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        
        log('Page Load Time:', loadTime);
        log('DOM Content Loaded:', domContentTime);
        
        // Track Web Vitals
        if (performance.getEntriesByType) {
          const paintEntries = performance.getEntriesByType('paint');
          paintEntries.forEach(entry => {
            log(`${entry.name}: ${entry.startTime}ms`);
          });
        }
        
        // Send to analytics if available
        if (window.gtag && !import.meta.env.DEV) {
          window.gtag('event', 'page_load', {
            load_time: loadTime,
            dom_content_time: domContentTime
          });
        }
      }
    }, 0);
  });
}


