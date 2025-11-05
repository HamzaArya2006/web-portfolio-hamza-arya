export function autoPlayTestimonials(options = {}) {
  const container = document.querySelector('#testimonials');
  const track = container && container.querySelector('.testimonials-track');
  if (!container || !track) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const intervalMs = options.intervalMs || 3500;
  const scrollBehavior = { behavior: 'smooth' };

  let timer = null;

  function getSlideWidth() {
    const slide = track.querySelector('.testimonial-slide');
    return slide ? slide.getBoundingClientRect().width : 0;
  }

  function step() {
    const slideWidth = getSlideWidth();
    if (!slideWidth) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const next = track.scrollLeft + slideWidth + 16; // include gap approx
    if (next > maxScroll + 8) {
      // Loop back
      track.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      track.scrollTo({ left: next, ...scrollBehavior });
    }
  }

  function start() {
    if (timer) return;
    timer = window.setInterval(step, intervalMs);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  // Pause on hover/focus inside testimonials
  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);
  container.addEventListener('focusin', stop);
  container.addEventListener('focusout', start);

  // Restart on resize to recalc widths
  window.addEventListener('resize', () => {
    stop();
    // debounce restart
    window.clearTimeout(container.__tAutoRaf);
    container.__tAutoRaf = window.setTimeout(start, 300);
  });

  // Kickoff after small delay to allow layout stabilize
  window.setTimeout(start, 400);
}


