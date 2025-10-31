export function initAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!domain) return;
  if (document.querySelector('script[data-plausible]')) return;
  const s = document.createElement('script');
  s.setAttribute('data-domain', domain);
  s.setAttribute('data-plausible', 'true');
  s.defer = true;
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
}


