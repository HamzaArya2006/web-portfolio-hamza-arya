import { gsap } from 'gsap';

export function initCustomCursor() {
  const isMobile = window.innerWidth < 1024; // Disable on tablet/mobile screens
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (isMobile || prefersReduced) return;

  // Create cursor elements dynamically
  const dot = document.createElement('div');
  dot.id = 'custom-cursor-dot';
  dot.className = 'custom-cursor-dot';
  
  const ring = document.createElement('div');
  ring.id = 'custom-cursor-ring';
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  const mouse = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  let isMoving = false;

  // Hide cursor on mouse leave window
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
  });

  // Track real mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    isMoving = true;

    // Place core dot instantly
    gsap.set(dot, { x: mouse.x, y: mouse.y });
  }, { passive: true });

  // High performance lerp loop for lagging outer ring using GSAP Ticker
  gsap.ticker.add(() => {
    if (!isMoving) return;
    const lerpFactor = 0.16;
    ringPos.x += (mouse.x - ringPos.x) * lerpFactor;
    ringPos.y += (mouse.y - ringPos.y) * lerpFactor;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  // Event Delegation for Hovers:
  // Detects hovering over interactive elements or parent structures dynamically
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    // Match interactive items or containers
    const interactive = target.closest('a, button, [role="button"], .magnetic-btn, .service-card, .bento-tile, .gsap-project-card, input, textarea');
    
    if (interactive) {
      ring.classList.add('active');
      dot.classList.add('active');

      if (interactive.classList.contains('service-card')) {
        ring.classList.add('expand-view');
        ring.setAttribute('data-text', 'EXPLORE');
      } else if (interactive.classList.contains('gsap-project-card')) {
        ring.classList.add('expand-view');
        ring.setAttribute('data-text', 'VIEW');
      } else if (interactive.classList.contains('bento-tile')) {
        ring.classList.add('expand-view');
        ring.setAttribute('data-text', 'INFO');
      } else if (interactive.getAttribute('href') === '/pages/contact.html' || interactive.getAttribute('href') === '#contact') {
        ring.classList.add('expand-view');
        ring.setAttribute('data-text', 'HIRE');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    const interactive = target.closest('a, button, [role="button"], .magnetic-btn, .service-card, .bento-tile, .gsap-project-card, input, textarea');
    
    if (interactive) {
      // Check if we are still inside the interactive element boundary safely
      const related = e.relatedTarget;
      if (related && (related === interactive || interactive.contains(related))) {
        return;
      }

      ring.className = 'custom-cursor-ring';
      dot.className = 'custom-cursor-dot';
      ring.removeAttribute('data-text');
    }
  });

  // Add global class to HTML tag indicating custom cursor is active
  document.documentElement.classList.add('custom-cursor-active');
}
