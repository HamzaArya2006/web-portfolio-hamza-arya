export function bindMobileNav() {
  const btn = document.querySelector('[data-mobile-nav-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  if (!btn || !menu) return;
  let lastFocusedElement = null;
  const getFocusable = () => menu.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const closeMenu = () => {
    menu.setAttribute('data-open', 'false');
    menu.classList.add('hidden');
    setTimeout(() => {
      if (menu.getAttribute('data-open') === 'false') {
        menu.style.display = 'none';
      }
    }, 400);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    if (lastFocusedElement) btn.focus();
    document.removeEventListener('keydown', onKeydown, true);
  };

  const onKeydown = (e) => {
    if (menu.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(getFocusable());
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  btn.addEventListener('click', () => {
    debug('Mobile nav toggle clicked', {currentState:menu.getAttribute('data-open')});
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    menu.classList.toggle('hidden', open);
    btn.setAttribute('aria-expanded', String(!open));
    if (!open) {
      lastFocusedElement = document.activeElement;
      btn.setAttribute('aria-label', 'Close menu');
      menu.style.display = 'block';
      // Defer class change to next frame so transition runs without forcing reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          menu.classList.remove('hidden');
        });
      });
      // Focus first focusable element inside menu
      const focusables = getFocusable();
      if (focusables && focusables.length) {
        focusables[0].focus();
      }
      // Bind keydown for focus trap and Escape
      document.addEventListener('keydown', onKeydown, true);
    } else {
      closeMenu();
    }
  });

  // Close on outside click when open
  document.addEventListener('click', (e) => {
    if (menu.getAttribute('data-open') !== 'true') return;
    if (e.target === btn) return;
    if (!menu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close button inside sidebar
  const closeBtn = menu.querySelector('[data-mobile-nav-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeMenu());
  }
}

export function bindDesktopDropdown() {
  // 1) Support optional click-driven dropdowns (data-* API)
  const container = document.querySelector('[data-dropdown="click"]');
  if (container) {
    const toggle = container.querySelector('[data-dropdown-toggle]');
    const menu = container.querySelector('[data-dropdown-menu]');
    const icon = container.querySelector('[data-dropdown-icon]');
    if (toggle && menu) {
      const openMenu = () => {
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(180deg)';
      };
      const closeMenu = () => {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = '';
      };
      let open = false;
      const setOpen = (next) => { open = next; if (open) openMenu(); else closeMenu(); };
      toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
      document.addEventListener('click', (e) => { if (open && !container.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    }
  }

  // 2) Desktop header dropdowns (About / Work): manage ARIA + keyboard;
  // show/hide is controlled by CSS hover on the button/menu.
  const groups = document.querySelectorAll('header nav .group');
  if (!groups.length) return;

  groups.forEach((group) => {
    const btn = group.querySelector('button[aria-haspopup="true"]');
    const menu = group.querySelector('[role="menu"]');
    if (!btn || !menu) return;

    const items = Array.from(
      menu.querySelectorAll('[role="menuitem"], a, button')
    );

    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', String(expanded));
    };

    const focusFirst = () => {
      if (items.length) items[0].focus();
    };
    const focusLast = () => {
      if (items.length) items[items.length - 1].focus();
    };

    // Hover / pointer: sync ARIA only (CSS controls visibility)
    btn.addEventListener('mouseenter', () => setExpanded(true));
    menu.addEventListener('mouseenter', () => setExpanded(true));
    btn.addEventListener('mouseleave', () => setExpanded(false));
    menu.addEventListener('mouseleave', () => setExpanded(false));

    // Click: keep default navigation behavior but ensure ARIA is true while focused
    btn.addEventListener('focus', () => setExpanded(true));
    btn.addEventListener('blur', () => setExpanded(false));

    // Keyboard support on toggle
    btn.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ': // Space
        case 'ArrowDown':
          e.preventDefault();
          setExpanded(true);
          focusFirst();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setExpanded(true);
          focusLast();
          break;
        case 'Escape':
          e.preventDefault();
          setExpanded(false);
          btn.focus();
          break;
      }
    });

    // Keyboard navigation within menu
    menu.addEventListener('keydown', (e) => {
      const currentIndex = items.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        setExpanded(false);
        btn.focus();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        items[next].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        items[prev].focus();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        focusFirst();
      }
      if (e.key === 'End') {
        e.preventDefault();
        focusLast();
      }
    });
  });
}

export function bindMobileSubmenu() {
  const toggles = document.querySelectorAll('[data-submenu-toggle]');
  if (!toggles.length) return;
  toggles.forEach((toggle) => {
    const container = toggle.closest('[data-submenu-container]') || toggle.parentElement;
    const submenu = container ? container.querySelector('[data-submenu]') : null;
    if (!submenu) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      submenu.classList.toggle('hidden', expanded);
    });
  });
}

export function bindStickyHeader() {
  const header = document.querySelector('header[data-sticky]');
  if (!header) return;

  const hero = document.querySelector('section#top');

  const computeThreshold = () => {
    if (!hero) return 80;
    const heroHeight = hero.offsetHeight || hero.getBoundingClientRect().height;
    // Switch styles after the user has scrolled a reasonable portion of the hero
    return Math.max(80, heroHeight * 0.4);
  };

  let lastIsAtTop = null;

  const updateHeaderState = () => {
    const scrollY =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const threshold = computeThreshold();
    const isAtTop = scrollY < threshold;

    if (isAtTop === lastIsAtTop) return;
    lastIsAtTop = isAtTop;

    if (isAtTop) {
      header.classList.add('at-top');
      header.classList.remove('scrolled');
    } else {
      header.classList.remove('at-top');
      header.classList.add('scrolled');
    }
  };

  // Initial state: defer to next frame to avoid forced reflow with other DOM work
  requestAnimationFrame(updateHeaderState);

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', () => {
    // Recompute threshold on resize and immediately apply
    requestAnimationFrame(updateHeaderState);
  });
}

