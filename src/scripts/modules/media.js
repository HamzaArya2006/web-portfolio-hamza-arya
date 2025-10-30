export function bindLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
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
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  lazyImages.forEach((img) => imgObserver.observe(img));
}


