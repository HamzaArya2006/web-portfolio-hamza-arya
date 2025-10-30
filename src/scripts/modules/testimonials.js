import { testimonials } from '../../data/testimonials.js';

export function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  grid.innerHTML = testimonials
    .map((t) => {
      const stars = '★'.repeat(t.rating);
      const avatar = t.avatar || t.author.split(' ').map(n => n[0]).join('');
      return `
      <article data-reveal class="opacity-0 translate-y-6 group">
        <div class="relative h-full glass rounded-2xl p-8 testimonial-card border border-white/10 hover:border-white/20">
          <div class="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>
          <div class="flex items-center gap-1 mb-4">
            <div class="text-yellow-400 text-sm">${stars}</div>
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
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
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


