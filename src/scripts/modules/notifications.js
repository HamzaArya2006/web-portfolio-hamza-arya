/**
 * Modern notification system
 * Displays toast notifications in the bottom-right corner
 */

import { log } from './logger.js';

const NOTIFICATION_CONTAINER_ID = 'notification-container';
const DEFAULT_DURATION = 5000; // 5 seconds
const MAX_NOTIFICATIONS = 5;

/**
 * Notification types
 */
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Create notification container if it doesn't exist
 */
function getOrCreateContainer() {
  let container = document.getElementById(NOTIFICATION_CONTAINER_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = NOTIFICATION_CONTAINER_ID;
    container.className = 'notification-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(container);
  }
  
  return container;
}

/**
 * Remove notification from DOM
 */
function removeNotification(id) {
  const notification = document.getElementById(id);
  if (notification) {
    notification.classList.add('notification-exit');
    setTimeout(() => {
      notification.remove();
      // Remove container if empty
      const container = document.getElementById(NOTIFICATION_CONTAINER_ID);
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300); // Match CSS transition duration
  }
}

/**
 * Limit number of notifications
 */
function limitNotifications() {
  const container = document.getElementById(NOTIFICATION_CONTAINER_ID);
  if (!container) return;
  
  const notifications = Array.from(container.children);
  if (notifications.length >= MAX_NOTIFICATIONS) {
    // Remove oldest notification
    const oldest = notifications[0];
    if (oldest) {
      removeNotification(oldest.id);
    }
  }
}

/**
 * Show a notification
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type (success, error, warning, info)
 * @param {number} options.duration - Duration in milliseconds (0 = persistent)
 * @param {Function} options.onClose - Callback when notification closes
 * @param {boolean} options.dismissible - Whether notification can be dismissed
 * @returns {string} Notification ID
 */
export function showNotification({
  title,
  message,
  type = NotificationType.INFO,
  duration = DEFAULT_DURATION,
  onClose = null,
  dismissible = true
}) {
  const container = getOrCreateContainer();
  limitNotifications();
  
  const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = id;
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', type === NotificationType.ERROR ? 'assertive' : 'polite');
  
  // Icon based on type
  const icons = {
    [NotificationType.SUCCESS]: `<svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
    [NotificationType.ERROR]: `<svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
    [NotificationType.WARNING]: `<svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`,
    [NotificationType.INFO]: `<svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`
  };
  
  // Build notification HTML
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon-wrapper">
        ${icons[type] || icons[NotificationType.INFO]}
      </div>
      <div class="notification-body">
        ${title ? `<div class="notification-title">${escapeHtml(title)}</div>` : ''}
        ${message ? `<div class="notification-message">${escapeHtml(message)}</div>` : ''}
      </div>
      ${dismissible ? `
        <button 
          class="notification-close" 
          aria-label="Close notification"
          onclick="this.closest('.notification').dispatchEvent(new CustomEvent('notification:close'))"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      ` : ''}
    </div>
    ${duration > 0 ? '<div class="notification-progress"></div>' : ''}
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Trigger entrance animation
  requestAnimationFrame(() => {
    notification.classList.add('notification-enter');
  });
  
  // Handle close event
  const handleClose = () => {
    removeNotification(id);
    if (onClose) {
      try {
        onClose();
      } catch (err) {
        log('Notification onClose callback error:', err);
      }
    }
  };
  
  notification.addEventListener('notification:close', handleClose);
  
  // Auto-dismiss if duration is set
  if (duration > 0) {
    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
      progressBar.style.animationDuration = `${duration}ms`;
    }
    
    const timeoutId = setTimeout(handleClose, duration);
    
    // Pause on hover
    notification.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      if (progressBar) {
        progressBar.style.animationPlayState = 'paused';
      }
    });
    
    notification.addEventListener('mouseleave', () => {
      const newTimeoutId = setTimeout(handleClose, duration);
      if (progressBar) {
        progressBar.style.animationPlayState = 'running';
      }
    });
  }
  
  return id;
}

/**
 * Close a specific notification
 */
export function closeNotification(id) {
  removeNotification(id);
}

/**
 * Close all notifications
 */
export function closeAllNotifications() {
  const container = document.getElementById(NOTIFICATION_CONTAINER_ID);
  if (!container) return;
  
  const notifications = Array.from(container.children);
  notifications.forEach(notification => {
    removeNotification(notification.id);
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convenience methods
 */
export const notify = {
  success: (title, message, options = {}) => 
    showNotification({ ...options, title, message, type: NotificationType.SUCCESS }),
  
  error: (title, message, options = {}) => 
    showNotification({ ...options, title, message, type: NotificationType.ERROR }),
  
  warning: (title, message, options = {}) => 
    showNotification({ ...options, title, message, type: NotificationType.WARNING }),
  
  info: (title, message, options = {}) => 
    showNotification({ ...options, title, message, type: NotificationType.INFO })
};

/**
 * Initialize notification system
 */
export function initNotifications() {
  // Container will be created on first notification
  log('Notification system initialized');
}

