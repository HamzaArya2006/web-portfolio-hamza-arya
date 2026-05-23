// src/scripts/scroll.js
import LocomotiveScroll from 'locomotive-scroll';

let scrollInstance = null;

export function initScroll() {
  if (scrollInstance) return scrollInstance;
  // Initialize Locomotive Scroll on the container
  scrollInstance = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    // inertia for Apple‑like feel
    inertia: 0.75,
    // Enable data attributes for parallax
    multiplier: 1,
    class: 'is-inview',
  });

  // Reveal on scroll – simple check using scroll event
  const revealEls = document.querySelectorAll('[data-reveal]');
  const onScroll = () => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !el.classList.contains('is-revealed')) {
        el.classList.add('is-revealed');
        // Trigger Tailwind utilities if desired
        el.classList.remove('opacity-0', 'translate-y-6');
        el.classList.add('fade-in', 'slide-up');
      }
    });
  };
  scrollInstance.on('scroll', onScroll);
  // Initial check
  onScroll();
  return scrollInstance;
}

export function destroyScroll() {
  if (scrollInstance) {
    scrollInstance.destroy();
    scrollInstance = null;
  }
}
