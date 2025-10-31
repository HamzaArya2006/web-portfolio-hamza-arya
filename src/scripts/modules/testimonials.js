import { testimonials } from '../../data/testimonials.js';

export function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slidesHtml = testimonials
    .map((t, idx) => {
      const stars = '★'.repeat(t.rating);
      const avatar = t.avatar || t.author.split(' ').map(n => n[0]).join('');
      const position = `${idx + 1} of ${testimonials.length}`;
      return `
      <article class="testimonial-slide" role="group" aria-roledescription="slide" aria-label="${position}">
        <div class="relative h-full glass rounded-2xl p-8 testimonial-card border border-white/10 hover:border-white/20">
          <div class="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>
          <div class="flex items-center gap-1 mb-4">
            <div class="text-yellow-400 text-sm" aria-label="${t.rating} out of 5 stars">${stars}</div>
            <span class="text-xs text-gray-400 ml-2">${t.rating}/5</span>
          </div>
          <blockquote class="text-gray-100 text-lg leading-relaxed mb-6 relative">
            "${t.quote}"
          </blockquote>
          ${t.project ? `
            <div class="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div class="text-sm text-blue-300 font-medium">${t.project}</div>
              ${t.result ? `<div class="text-xs text-green-300 mt-1">📈 ${t.result}</div>` : ''}
            </div>
          ` : ''}
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg" aria-hidden="true">
              ${avatar}
            </div>
            <div>
              <div class="font-semibold text-gray-100">${t.author}</div>
              <div class="text-sm text-gray-400">${t.role}</div>
              <div class="text-xs text-gray-500">${t.company}</div>
            </div>
          </div>
        </div>
      </article>`;
    })
    .join('');

  grid.innerHTML = `
    <div class="testimonials-carousel" role="region" aria-roledescription="carousel" aria-label="Client testimonials">
      <div class="testimonials-track" id="testimonials-track" tabindex="0">
        ${slidesHtml}
      </div>
      <div class="testimonials-controls">
        <button class="testimonials-btn prev" type="button" aria-controls="testimonials-track" aria-label="Previous testimonial">◀</button>
        <button class="testimonials-btn play" type="button" aria-pressed="${!prefersReducedMotion}" aria-label="${prefersReducedMotion ? 'Start autoplay' : 'Pause autoplay'}">${prefersReducedMotion ? 'Play' : 'Pause'}</button>
        <button class="testimonials-btn next" type="button" aria-controls="testimonials-track" aria-label="Next testimonial">▶</button>
      </div>
      <div class="testimonials-dots" id="testimonials-dots" role="tablist" aria-label="Testimonials pagination"></div>
      <div class="sr-only" aria-live="polite" aria-atomic="true" id="testimonials-status"></div>
    </div>
  `;

  bindTestimonialsCarousel(prefersReducedMotion);
  bindTestimonialProximity();
}

export function bindTestimonialProximity() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('proximity-active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('proximity-active');
    });
  });
}

export function bindTestimonialsCarousel(prefersReducedMotion) {
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
  const prevBtn = track.parentElement.querySelector('.testimonials-btn.prev');
  const nextBtn = track.parentElement.querySelector('.testimonials-btn.next');
  const playBtn = track.parentElement.querySelector('.testimonials-btn.play');
  const status = document.getElementById('testimonials-status');
  const dotsContainer = document.getElementById('testimonials-dots');

  let index = 0;
  let autoplay = !prefersReducedMotion;
  let timer = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = slides.map((_, i) => `<button type="button" class="testimonials-dot" role="tab" aria-label="Go to testimonial ${i + 1}"></button>`).join('');
  }
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.testimonials-dot')) : [];

  const announce = () => {
    if (status) status.textContent = `Showing testimonial ${index + 1} of ${slides.length}`;
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
  };

  const scrollToIndex = (i) => {
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      announce();
    }
  };

  const start = () => {
    if (timer) return;
    timer = window.setInterval(() => scrollToIndex(index + 1), 5000);
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.textContent = 'Pause';
    playBtn.setAttribute('aria-label', 'Pause autoplay');
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.textContent = 'Play';
    playBtn.setAttribute('aria-label', 'Start autoplay');
  };

  prevBtn.addEventListener('click', () => scrollToIndex(index - 1));
  nextBtn.addEventListener('click', () => scrollToIndex(index + 1));
  playBtn.addEventListener('click', () => {
    if (timer) stop(); else start();
  });

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToIndex(i));
  });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(index - 1); }
  });

  // Sync index on manual scroll
  let scrollDebounce = 0;
  track.addEventListener('scroll', () => {
    window.clearTimeout(scrollDebounce);
    scrollDebounce = window.setTimeout(() => {
      // find nearest slide to left edge
      const left = track.scrollLeft;
      const widths = slides.map(s => s.getBoundingClientRect().width);
      const firstWidth = widths[0] || 1;
      const approx = Math.round(left / (track.clientWidth > 0 ? firstWidth : 1));
      index = Math.max(0, Math.min(slides.length - 1, approx));
      announce();
    }, 120);
  }, { passive: true });

  // Pause on hover/focus for accessibility
  track.addEventListener('mouseenter', stop);
  track.addEventListener('focusin', stop);
  track.addEventListener('mouseleave', () => { if (autoplay) start(); });
  track.addEventListener('focusout', () => { if (autoplay) start(); });

  if (autoplay) start();
  announce();
}


