/**
 * Shop page: hero carousel, featured items, and offers grid.
 * Checkout: use Stripe (https://stripe.com). Replace data-stripe-price-id with your
 * backend-created Checkout Session URL or Price ID when integrating.
 */
import {
  shopCarouselSlides,
  featuredShopItems,
  shopOffers,
} from '../../data/shop.js';

const CAROUSEL_AUTOPLAY_MS = 6000;

function getSlideHtml(slide, index) {
  const accentClass =
    slide.accent === 'indigo'
      ? 'from-indigo-600/20 to-indigo-500/10'
      : slide.accent === 'cyan'
        ? 'from-cyan-600/20 to-cyan-500/10'
        : 'from-blue-600/20 to-blue-500/10';
  return `
    <div class="shop-carousel-slide relative flex-shrink-0 w-full min-h-[260px] md:min-h-[300px] flex items-center justify-center px-8 md:px-16" data-slide-index="${index}" role="group" aria-roledescription="slide" aria-label="Slide ${index + 1} of ${shopCarouselSlides.length}">
      <div class="absolute inset-0 bg-gradient-to-br ${accentClass} opacity-40 pointer-events-none" aria-hidden="true"></div>
      <div class="relative z-10 text-center max-w-2xl">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">${slide.title}</h2>
        <p class="text-gray-400 text-lg mb-6">${slide.subtitle}</p>
        <a href="${slide.ctaHref}" class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors">${slide.cta}</a>
      </div>
    </div>`;
}

function renderCarousel() {
  const track = document.getElementById('shop-carousel-track');
  const dotsContainer = document.getElementById('shop-carousel-dots');
  if (!track || !dotsContainer) return;

  track.innerHTML = shopCarouselSlides
    .map((slide, i) => getSlideHtml(slide, i))
    .join('');
  track.style.width = `${shopCarouselSlides.length * 100}%`;

  dotsContainer.innerHTML = shopCarouselSlides
    .map(
      (_, i) =>
        `<button type="button" class="shop-carousel-dot w-2.5 h-2.5 rounded-full border border-white/30 transition-colors ${i === 0 ? 'bg-blue-500 border-blue-400' : 'bg-white/20'}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
    )
    .join('');

  let current = 0;
  const total = shopCarouselSlides.length;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${(100 / total) * current}%)`;
    dotsContainer.querySelectorAll('.shop-carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('bg-blue-500', i === current);
      dot.classList.toggle('border-blue-400', i === current);
      dot.classList.toggle('bg-white/20', i !== current);
    });
  }

  let autoplayTimer = null;
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), CAROUSEL_AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  document.getElementById('shop-carousel-prev')?.addEventListener('click', () => {
    goTo(current - 1);
    startAutoplay();
  });
  document.getElementById('shop-carousel-next')?.addEventListener('click', () => {
    goTo(current + 1);
    startAutoplay();
  });
  dotsContainer.querySelectorAll('.shop-carousel-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.getAttribute('data-index')));
      startAutoplay();
    });
  });

  startAutoplay();
}

function getOfferCardHtml(item, isFeatured = false) {
  const tagHtml = item.tag ? `<span class="shop-card-tag">${item.tag}</span>` : '';
  const priceHtml = item.priceLabel
    ? `<div class="shop-card-price">${item.priceLabel}</div>`
    : '';
  const featuresHtml =
    item.features && item.features.length
      ? `<ul class="shop-card-features">${item.features.map((f) => `<li>${f}</li>`).join('')}</ul>`
      : '';
  const stripeAttr = item.stripePriceId
    ? ` data-stripe-price-id="${item.stripePriceId}"`
    : '';
  const checkoutLabel = item.stripePriceId ? 'Checkout with Stripe' : 'Request quote';
  const checkoutHref = item.stripePriceId ? '#' : '/pages/contact.html';

  return `
    <article class="shop-card ${isFeatured ? 'shop-card-featured' : ''}" data-shop-id="${item.id}"${stripeAttr}>
      ${tagHtml}
      <h3 class="shop-card-title">${item.title}</h3>
      <p class="shop-card-desc">${item.description}</p>
      ${featuresHtml}
      ${priceHtml}
      <a href="${checkoutHref}" class="shop-card-cta btn-primary mt-4 inline-block text-center w-full sm:w-auto" data-shop-checkout>${checkoutLabel}</a>
    </article>`;
}

function renderFeatured() {
  const grid = document.getElementById('shop-featured-grid');
  if (!grid) return;
  grid.innerHTML = featuredShopItems
    .map((item) => getOfferCardHtml(item, true))
    .join('');
}

function renderOffers() {
  const grid = document.getElementById('shop-offers-grid');
  if (!grid) return;
  grid.innerHTML = shopOffers.map((item) => getOfferCardHtml(item)).join('');
}

export function initShop() {
  renderCarousel();
  renderFeatured();
  renderOffers();
}
