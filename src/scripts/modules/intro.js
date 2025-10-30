export function runModernIntroOverlaySequence() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;
  const term = overlay.querySelector('.intro-terminal-code');
  const debugLine = overlay.querySelector('.intro-debug');
  const loaderWrap = overlay.querySelector('.intro-loader');
  const loaderBar = overlay.querySelector('.intro-loader-bar');
  const loaderText = overlay.querySelector('.intro-loader-text');
  const logPools = [
    [
      `<span class="token-prompt">➜</span> <span class="token-user">hamza@dev</span>:<span class="token-path">~/web-portfolio</span> <span class="token-cmd">$ vite build</span>`,
      `<span class="intro-spinner"></span><span class="token-info">vite</span> v5.0.0 <span class="token-muted">building for production...</span>`,
      `<span class="token-muted">transforming...</span>`
    ],
    [
      `<span class="token-prompt">➜</span> <span class="token-user">ai</span>:<span class="token-path">~/portfolio</span> <span class="token-cmd">$ analyzing creativity</span>`,
      `<span class="token-info">AI</span> <span class="token-warn">scanning for mind-blowing design...</span>`,
      `<span class="token-muted">optimizing transitions...</span>`
    ]
  ];
  const showLogCount = 3 + Math.floor(Math.random() * 2);
  const logs = logPools[Math.floor(Math.random() * logPools.length)].slice(0, showLogCount);
  async function typeLine(html) {
    return new Promise((resolve) => {
      let i = 0;
      let buf = '';
      function type() {
        if (html[i] === '<') {
          const endIdx = html.indexOf('>', i);
          buf += html.slice(i, endIdx+1);
          i = endIdx+1;
        } else {
          buf += html[i];
          i += 1;
        }
        term.innerHTML = buf + '<span class="typing-cursor">|</span>';
        let delay = 12 + Math.random()*38;
        if (html[i-1] === ' ' || html[i-1] === '.' || html[i-1] === ',') delay += 40;
        if (i < html.length) setTimeout(type, delay);
        else setTimeout(resolve, 135);
      }
      type();
    });
  }
  (async function(){
    term.innerHTML = '';
    debugLine.style.opacity = '0';
    loaderWrap.style.opacity = '0';
    loaderBar.style.width = '0';
    loaderText.classList.remove('visible');
    for (let log of logs) {
      await typeLine(log);
    }
    setTimeout(() => {
      debugLine.style.opacity = '1';
      setTimeout(() => {
        loaderWrap.style.opacity = '1';
        loaderBar.style.width = '100%';
        setTimeout(() => {
          loaderText.classList.add('visible');
          loaderText.textContent = 'Loading experience… 🚀';
          setTimeout(() => {
            loaderText.textContent = 'Almost ready…';
            setTimeout(() => {
              document.body.classList.add('page-ready');
              document.body.classList.remove('page-intro-init');
              overlay.classList.add('intro-exit');
              setTimeout(() => overlay.remove(), 800);
            }, 950);
          }, 950);
        }, 700);
      }, 420);
    }, 320);
  })();
  let devModeActivated = false;
  function injectDevModeLogs() {
    if (devModeActivated) return;
    devModeActivated = true;
    const devLogs = [
      `<span class='token-warn'>DEVELOPER MODE ENABLED</span>`,
      `<span class='token-info'>Performance:</span> <span class='token-ok'>100 FPS</span>`
    ];
    (async function(){
      for (let log of devLogs) {
        await typeLine(log);
      }
    })();
  }
  if (overlay) {
    window.addEventListener('keydown', (e) => {
      if ((e.shiftKey && (e.key === 'D' || e.key === 'd')) && !devModeActivated && overlay.parentNode) {
        injectDevModeLogs();
      }
    });
  }
}


