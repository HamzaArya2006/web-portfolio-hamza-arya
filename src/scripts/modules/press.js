import { pressLogos, clientLogos } from '../../data/pressLogos.js';

export function renderPressLogos() {
  const container = document.getElementById('press-logos');
  if (!container) return;
  
  container.innerHTML = pressLogos.map(press => `
    <a href="${press.link}" target="_blank" rel="noopener" 
       class="flex items-center justify-center p-4 glass rounded-lg border border-white/10 hover:border-white/20 transition-all group"
       title="${press.alt}">
      <img src="${press.logo}" alt="${press.alt}" class="h-8 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
    </a>
  `).join('');
}

export function renderClientLogos() {
  const container = document.getElementById('client-logos');
  if (!container) return;
  
  container.innerHTML = clientLogos.map(client => `
    <div class="flex items-center justify-center p-4 glass rounded-lg border border-white/10 hover:border-white/20 transition-all group"
         title="${client.alt}">
      <img src="${client.logo}" alt="${client.alt}" class="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
    </div>
  `).join('');
}

