export function runModernIntroOverlaySequence() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Remove old content; host for logo
  const host = overlay.querySelector('#intro-logo-host') || overlay;

  // Create custom square startup logo (4 tiles)
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('width', '72');
  svg.setAttribute('height', '72');
  svg.setAttribute('class', 'startup-logo');

  function tile(x, y, cls) {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', String(x));
    r.setAttribute('y', String(y));
    r.setAttribute('width', '48');
    r.setAttribute('height', '48');
    r.setAttribute('rx', '8');
    r.setAttribute('class', cls);
    return r;
  }

  // layout like Windows: 2x2 grid with small gap
  svg.appendChild(tile(8, 8, 'tile tile-1'));
  svg.appendChild(tile(64, 8, 'tile tile-2'));
  svg.appendChild(tile(8, 64, 'tile tile-3'));
  svg.appendChild(tile(64, 64, 'tile tile-4'));

  host.appendChild(svg);

  // Trigger reveal after a calmer sequence
  const revealDelay = prefersReduced ? 300 : 900;
  setTimeout(() => {
    document.body.classList.add('page-ready');
    document.body.classList.remove('page-intro-init');
    overlay.classList.add('intro-exit');
    setTimeout(() => overlay.remove(), prefersReduced ? 260 : 700);
  }, revealDelay);
}


