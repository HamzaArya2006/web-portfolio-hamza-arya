export function bindMobileNav() {
  const btn = document.querySelector('[data-mobile-nav-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  // #region agent log
  console.log('%c[DEBUG:H4]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'bindMobileNav started', {btnFound:!!btn,menuFound:!!menu});
  // #endregion
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
    // #region agent log
    console.log('%c[DEBUG:H4]', 'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px', 'Mobile nav toggle clicked', {currentState:menu.getAttribute('data-open')});
    // #endregion
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    menu.classList.toggle('hidden', open);
    btn.setAttribute('aria-expanded', String(!open));
    if (!open) {
      lastFocusedElement = document.activeElement;
      menu.style.display = 'block';
      menu.offsetHeight;
      menu.classList.remove('hidden');
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

  // 2) Enhance header "Work" hover/focus dropdown with ARIA + keyboard
  const group = document.querySelector('header nav .group');
  if (!group) return;
  const btn = group.querySelector('button[aria-haspopup="true"]');
  const menu = group.querySelector('[role="menu"]');
  if (!btn || !menu) return;

  const items = Array.from(menu.querySelectorAll('[role="menuitem"], a, button'));
  const setExpanded = (expanded) => btn.setAttribute('aria-expanded', String(expanded));
  const focusFirst = () => { if (items.length) items[0].focus(); };
  const focusLast = () => { if (items.length) items[items.length - 1].focus(); };

  // Mouse sync to keep ARIA truthful
  group.addEventListener('mouseenter', () => setExpanded(true));
  group.addEventListener('mouseleave', () => setExpanded(false));

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
    if (e.key === 'Home') { e.preventDefault(); focusFirst(); }
    if (e.key === 'End') { e.preventDefault(); focusLast(); }
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


