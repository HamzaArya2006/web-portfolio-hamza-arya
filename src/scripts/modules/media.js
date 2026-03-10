/** @type {WeakSet<Element>} Images already observed (single shared observer, idempotent re-calls) */
const observedImages = new WeakSet();

const lazyImgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const picture = img.closest('picture');

      const src = img.getAttribute('data-src');
      const srcset = img.getAttribute('data-srcset');
      const sizes = img.getAttribute('data-sizes');

      if (src) {
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
      }
      if (srcset) {
        img.setAttribute('srcset', srcset);
        img.removeAttribute('data-srcset');
      }
      if (sizes) {
        img.setAttribute('sizes', sizes);
        img.removeAttribute('data-sizes');
      }

      if (picture) {
        const sources = picture.querySelectorAll('source[data-srcset]');
        sources.forEach(source => {
          const sourceSrcset = source.getAttribute('data-srcset');
          if (sourceSrcset) {
            source.setAttribute('srcset', sourceSrcset);
            source.removeAttribute('data-srcset');
          }
        });
      }

      img.addEventListener('load', () => {
        if (img.classList.contains('image-blur-up')) {
          img.style.backgroundImage = '';
          img.classList.remove('image-blur-up');
        }
      }, { once: true });

      observedImages.delete(img);
      obs.unobserve(img);
    }
  });
}, { rootMargin: '200px 0px', threshold: 0.01 });

export function bindLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src], picture img[data-src]');
  lazyImages.forEach((img) => {
    if (observedImages.has(img)) return;
    observedImages.add(img);
    lazyImgObserver.observe(img);
  });
}
