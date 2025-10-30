export function bindMobileNav() {
  const btn = document.querySelector('[data-mobile-nav-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    menu.classList.toggle('hidden', open);
    btn.setAttribute('aria-expanded', String(!open));
    if (!open) {
      menu.style.display = 'block';
      menu.offsetHeight;
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
      setTimeout(() => {
        if (menu.getAttribute('data-open') === 'false') {
          menu.style.display = 'none';
        }
      }, 400);
    }
  });
}

export function bindDesktopDropdown() {
  const container = document.querySelector('[data-dropdown="click"]');
  if (!container) return;
  const toggle = container.querySelector('[data-dropdown-toggle]');
  const menu = container.querySelector('[data-dropdown-menu]');
  const icon = container.querySelector('[data-dropdown-icon]');
  if (!toggle || !menu) return;
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
  const setOpen = (next) => {
    open = next;
    if (open) openMenu(); else closeMenu();
  };
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });
  document.addEventListener('click', (e) => {
    if (!open) return;
    if (!container.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
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


