import {
  loadInitialState,
  getState,
  setToken,
  setAdmin,
  setProjects,
  updateProject,
  removeProject,
  setCustomizations,
  updateCustomizationValue,
  setProjectCustomization,
  recordActivity,
  clearState,
} from './state.js';
import {
  login,
  fetchProfile,
  fetchProjects,
  createProject,
  updateProject as updateProjectApi,
  deleteProjectApi,
  updateProjectOrder,
  fetchCustomizations,
  updateCustomization,
  fetchActivity,
  pingHealth,
  fetchProjectCustomization,
  updateProjectCustomization,
} from './api.js';
import { notify, initNotifications } from '../notifications.js';

const CUSTOMIZATION_GROUPS = [
  {
    id: 'hero',
    title: 'Hero section',
    description: 'Headline copy and supporting text shown above the fold.',
    fields: [
      { key: 'hero.title', label: 'Hero Title', type: 'text', placeholder: 'Fast, reliable web apps for founders.' },
      { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', rows: 3 },
      { key: 'hero.cta.primary', label: 'Primary CTA Label', type: 'text', placeholder: 'View case studies' },
      { key: 'hero.cta.secondary', label: 'Secondary CTA Label', type: 'text', placeholder: 'Book a call' },
    ],
  },
  {
    id: 'theme',
    title: 'Theme colors',
    description: 'Adjust key accent colors across the portfolio.',
    fields: [
      { key: 'theme.primary', label: 'Primary Accent', type: 'color', defaultValue: '#3b82f6' },
      { key: 'theme.secondary', label: 'Secondary Accent', type: 'color', defaultValue: '#6366f1' },
      { key: 'theme.primary.hover', label: 'Primary Hover', type: 'color', defaultValue: '#1d4ed8' },
      { key: 'theme.secondary.hover', label: 'Secondary Hover', type: 'color', defaultValue: '#4338ca' },
    ],
  },
  {
    id: 'meta',
    title: 'Metadata & SEO',
    description: 'Update page titles and descriptions used for SEO.',
    fields: [
      { key: 'meta.home.title', label: 'Home Title', type: 'text' },
      { key: 'meta.home.description', label: 'Home Description', type: 'textarea', rows: 3 },
    ],
  },
];

let loginForm;
let loginError;
let loginView;
let loader;
let dashboard;
let projectsList;
let projectsEmpty;
let customizationGroups;
let customCss;
let customHero;
let activityLog;
let statusApi;
let statusDb;
let statusSync;
let projectsFilterInput;
let projectSearchTerm = '';
let projectSearchTermRaw = '';
let projectsEmptyDefaultText = '';

const state = loadInitialState();

export async function initAdminApp() {
  initNotifications();
  cacheElements();
  attachGlobalHandlers();

  await evaluateHealth();

  if (state.token) {
    try {
      await bootstrapWithToken();
      return;
    } catch (error) {
      console.warn('Stored token invalid:', error.message);
      clearState();
    }
  }

  showLogin();
}

function cacheElements() {
  loader = document.getElementById('admin-loader');
  loginView = document.getElementById('admin-login');
  dashboard = document.getElementById('admin-dashboard');
  loginForm = document.getElementById('login-form');
  loginError = document.getElementById('login-error');
  projectsList = document.getElementById('projects-list');
  projectsEmpty = document.getElementById('projects-empty');
  customizationGroups = document.getElementById('customization-groups');
  customCss = document.getElementById('custom-css');
  customHero = document.getElementById('custom-hero');
  activityLog = document.getElementById('activity-log');
  statusApi = document.getElementById('status-api');
  statusDb = document.getElementById('status-db');
  statusSync = document.getElementById('status-sync');
  projectsFilterInput = document.getElementById('projects-filter');
  projectsEmptyDefaultText = projectsEmpty?.textContent.trim() || '';
}

function attachGlobalHandlers() {
  document.getElementById('admin-logout')?.addEventListener('click', () => {
    clearState();
    showLogin();
    notify.info('Signed out', 'You have been logged out.');
  });

  document.getElementById('sync-customizations')?.addEventListener('click', () => {
    refreshAllData(true);
  });

  const navButtons = document.querySelectorAll('.admin-nav-btn[data-panel]');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      switchPanel(btn.dataset.panel);
    });
  });

  // Sidebar toggle handlers
  document.querySelector('[data-sidebar-toggle]')?.addEventListener('click', toggleSidebar);
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  
  mobileMenuToggle?.addEventListener('click', () => {
    const layout = document.getElementById('admin-layout');
    if (!layout) return;
    const isExpanded = layout.dataset.sidebarState === 'expanded';
    setSidebarState(isExpanded ? 'collapsed' : 'expanded');
    
    // Update overlay
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle('active', !isExpanded);
    }
    
    // Update button state
    mobileMenuToggle.setAttribute('aria-pressed', String(!isExpanded));
  });
  
  // Close sidebar when overlay is clicked
  sidebarOverlay?.addEventListener('click', () => {
    setSidebarState('collapsed');
    sidebarOverlay.classList.remove('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-pressed', 'false');
    }
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    const layout = document.getElementById('admin-layout');
    const sidebar = document.getElementById('admin-sidebar');
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    
    if (isMobile && layout?.dataset.sidebarState === 'expanded' && sidebar) {
      if (!sidebar.contains(e.target) && !mobileMenuToggle?.contains(e.target)) {
        setSidebarState('collapsed');
        sidebarOverlay?.classList.remove('active');
        if (mobileMenuToggle) {
          mobileMenuToggle.setAttribute('aria-pressed', 'false');
        }
      }
    }
  });
  
  document.querySelector('[data-action="sign-out"]')?.addEventListener('click', () => {
    document.getElementById('admin-logout')?.click();
  });
  document.querySelector('[data-action="switch-user"]')?.addEventListener('click', openSwitchUserDialog);
  document.querySelector('[data-action="create-user"]')?.addEventListener('click', openCreateUserDialog);
  document.querySelector('[data-action="manage-users"]')?.addEventListener('click', openManageUsersDialog);

  // Handle sidebar state based on viewport
  const sidebarQuery = window.matchMedia('(max-width: 1024px)');
  const handleSidebarViewportChange = (event) => {
    const isMobile = event.matches;
    // On mobile, sidebar starts collapsed
    setSidebarState(isMobile ? 'collapsed' : 'expanded');
    if (sidebarOverlay) {
      sidebarOverlay.classList.remove('active');
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-pressed', 'false');
    }
  };
  handleSidebarViewportChange(sidebarQuery);
  sidebarQuery.addEventListener('change', handleSidebarViewportChange);

  projectsFilterInput?.addEventListener('input', (event) => {
    projectSearchTermRaw = event.target.value;
    projectSearchTerm = projectSearchTermRaw.trim().toLowerCase();
    renderProjects();
  });

  loginForm?.addEventListener('submit', handleLoginSubmit);

  document.getElementById('create-project')?.addEventListener('click', () => {
    insertNewProjectCard();
  });

  projectsList?.addEventListener('click', handleProjectListClick);
  projectsList?.addEventListener('input', handleProjectFieldChange);

  customizationGroups?.addEventListener('input', handleCustomizationInputChange);
  customizationGroups?.addEventListener('change', handleCustomizationInputChange);

  document.querySelector('[data-save-css]')?.addEventListener('click', () => {
    saveCustomization('custom.css.global', customCss.value, 'string', 'Global CSS overrides saved');
  });

  document.querySelector('[data-save-hero]')?.addEventListener('click', () => {
    saveCustomization('custom.hero.html', customHero.value, 'string', 'Hero markup saved');
  });
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  loginError?.classList.add('hidden');

  const formData = new FormData(loginForm);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    toggleLoader(true, 'Signing you in…');
    const { token, admin } = await login(email, password);
    setToken(token);
    setAdmin(admin);
    await bootstrapWithToken();
    notify.success('Welcome back!', 'You are now signed in.');
  } catch (error) {
    loginError.textContent = error.message || 'Unable to sign in. Please try again.';
    loginError.classList.remove('hidden');
    notify.error('Sign in failed', error.message || 'Invalid credentials');
  } finally {
    toggleLoader(false);
  }
}

async function bootstrapWithToken() {
  toggleLoader(true, 'Loading admin data…');
  loginView.classList.add('hidden');

  const token = getState().token;
  const [profile] = await Promise.all([
    fetchProfile(token).catch(() => {
      throw new Error('Session expired. Please sign in again.');
    }),
  ]);

  setAdmin(profile);
  dashboard.classList.remove('hidden');
  await refreshAllData();
  toggleLoader(false);
}

async function refreshAllData(showNotification = false) {
  const token = getState().token;
  if (!token) return;

  toggleLoader(true, 'Syncing data…');
  try {
    const [projects, customizations, activity] = await Promise.all([
      fetchProjects(token),
      fetchCustomizations(token),
      fetchActivity(token).catch(() => ({ logs: [] })),
    ]);

    setProjects(projects);
    setCustomizations(customizations);
    if (Array.isArray(activity.logs)) {
      activity.logs.forEach((log) => recordActivity(log));
    }

    renderProjects();
    renderCustomizations();
    renderCodeEditors();
    renderActivityLog();
    statusSync.textContent = new Date().toLocaleTimeString();

    if (showNotification) {
      notify.success('Data synced', 'Latest portfolio data loaded.');
    }
  } catch (error) {
    notify.error('Sync failed', error.message || 'Unable to fetch data');
  } finally {
    toggleLoader(false);
  }
}

function renderProjects() {
  const { projects: rawProjects = [] } = getState();

  const hasProjects = rawProjects.length > 0;
  const normalized = rawProjects
    .slice()
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const filtered = projectSearchTerm
    ? normalized.filter(matchesProjectSearch)
    : normalized;

  projectsList.innerHTML = '';

  if (!hasProjects) {
    if (projectsEmpty) {
      projectsEmpty.textContent = projectsEmptyDefaultText || 'No projects found yet. Create one to get started.';
      projectsEmpty.classList.remove('hidden');
    }
    return;
  }

  if (!filtered.length) {
    if (projectsEmpty) {
      const term = projectSearchTermRaw.trim();
      projectsEmpty.textContent = term
        ? `No projects match “${term}”.`
        : 'No projects available.';
      projectsEmpty.classList.remove('hidden');
    }
    return;
  }

  if (projectsEmpty) {
    projectsEmpty.textContent = projectsEmptyDefaultText || '';
    projectsEmpty.classList.add('hidden');
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((project) => {
    fragment.appendChild(createProjectCard(project));
  });

  projectsList.appendChild(fragment);
}

function matchesProjectSearch(project) {
  if (!projectSearchTerm) return true;
  const haystack = [
    project.title,
    project.slug,
    project.category,
    project.tech,
    project.description,
    Array.isArray(project.tags) ? project.tags.join(' ') : '',
    Array.isArray(project.stack) ? project.stack.join(' ') : '',
    project.client,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(projectSearchTerm);
}

function createProjectCard(project, isNew = false) {
  const card = document.createElement('article');
  card.className = 'admin-project-card';
  card.dataset.projectId = project.id ?? 'new';
  if (isNew) {
    card.dataset.new = 'true';
  }

  const structuredOpen =
    Boolean(project.stack?.length) ||
    Boolean(project.tags?.length) ||
    Boolean(project.links && Object.keys(project.links).length) ||
    Boolean(project.metrics && Object.keys(project.metrics).length) ||
    Boolean(project.features?.length) ||
    Boolean(project.image);

  const featuredBadge = project.is_featured ? '<span class="project-badge">Featured</span>' : '';

  card.innerHTML = `
    <header class="project-card-header">
      <div>
        <div class="project-primary">
          <span class="project-name">${project.title || 'Untitled project'}</span>
          ${featuredBadge}
        </div>
        <span class="project-slug">${project.slug || 'project-slug'}</span>
      </div>
      <div class="project-card-actions">
        <button data-action="move-up" type="button" class="icon-btn" title="Move project up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
        <button data-action="move-down" type="button" class="icon-btn" title="Move project down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
        <button data-action="customize" type="button" class="btn-secondary text-xs">Customise card</button>
        <button data-action="delete" type="button" class="icon-btn danger" title="Delete project">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 6 3 18h12l3-18" />
            <path d="M5 6h14" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </header>

    <form data-project-form class="project-form">
      <div class="form-grid">
        ${renderInput('Title', 'title', project.title, 'text', true)}
        ${renderInput('Slug', 'slug', project.slug, 'text', true)}
      </div>

      ${renderTextarea('Description', 'description', project.description, true)}

      <div class="form-grid">
        ${renderInput('Category', 'category', project.category)}
        ${renderInput('Client', 'client', project.client)}
        ${renderInput('Tech summary', 'tech', project.tech)}
        ${renderNumber('Display order', 'order_index', project.order_index ?? 0)}
      </div>

      <div class="form-grid">
        ${renderCheckbox('Featured on home', 'is_featured', project.is_featured)}
      </div>

      <details class="form-advanced"${structuredOpen ? ' open' : ''}>
        <summary>
          <span>Advanced fields</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div class="form-grid">
          ${renderInput('Primary image URL', 'image', project.image)}
          ${renderInput('Duration', 'duration', project.duration)}
        </div>
        <div class="form-grid">
          ${renderJSON('Stack (array)', 'stack', project.stack)}
          ${renderJSON('Tags (array)', 'tags', project.tags)}
          ${renderJSON('Links (object)', 'links', project.links)}
          ${renderJSON('Metrics (object)', 'metrics', project.metrics)}
          ${renderJSON('Features (array)', 'features', project.features)}
        </div>
      </details>
    </form>

    <footer class="project-card-footer">
      <small>Last updated: ${project.updated_at ? new Date(project.updated_at).toLocaleString() : '—'}</small>
      <div class="action-group">
        <button data-action="reset" type="button" class="icon-btn" title="Reset changes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v6h6" />
            <path d="M21 21v-6h-6" />
            <path d="M3 9a9 9 0 0 1 9-9 9 9 0 0 1 6.36 15.36L21 21" />
          </svg>
        </button>
        <button data-action="save" type="button" class="btn-primary text-xs">Save changes</button>
      </div>
    </footer>
  `;

  return card;
}

function renderInput(label, name, value = '', type = 'text', required = false) {
  return `
    <label class="form-field">
      <span class="form-label">${label}${required ? ' *' : ''}</span>
      <input
        name="${name}"
        type="${type}"
        value="${value ?? ''}"
        ${required ? 'required' : ''}
        class="form-input"
      />
    </label>
  `;
}

function renderTextarea(label, name, value = '', required = false) {
  return `
    <label class="form-field md:col-span-2">
      <span class="form-label">${label}${required ? ' *' : ''}</span>
      <textarea
        name="${name}"
        rows="4"
        ${required ? 'required' : ''}
        class="form-textarea"
      >${value ?? ''}</textarea>
    </label>
  `;
}

function renderNumber(label, name, value = 0) {
  return `
    <label class="form-field">
      <span class="form-label">${label}</span>
      <input
        name="${name}"
        type="number"
        value="${value ?? 0}"
        class="form-input"
      />
    </label>
  `;
}

function renderCheckbox(label, name, checked = false) {
  return `
    <label class="form-checkbox md:col-span-2">
      <input type="checkbox" name="${name}" ${checked ? 'checked' : ''} />
      <span>${label}</span>
    </label>
  `;
}

function renderJSON(label, name, value) {
  const pretty = value ? JSON.stringify(value, null, 2) : '';
  return `
    <label class="form-field md:col-span-2">
      <span class="form-label">${label}</span>
      <textarea
        name="${name}"
        rows="4"
        class="form-textarea font-mono"
        spellcheck="false"
      >${pretty}</textarea>
    </label>
  `;
}

function setSidebarState(state) {
  const layout = document.getElementById('admin-layout');
  if (!layout) return;
  const next = state === 'collapsed' ? 'collapsed' : 'expanded';
  layout.dataset.sidebarState = next;

  const toggleBtn = document.querySelector('[data-sidebar-toggle]');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-pressed', String(next === 'collapsed'));
    toggleBtn.setAttribute('aria-label', next === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar');
  }
}

function toggleSidebar() {
  const layout = document.getElementById('admin-layout');
  if (!layout) return;
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const current = layout.dataset.sidebarState === 'collapsed' ? 'collapsed' : 'expanded';
  const next = current === 'collapsed' ? 'expanded' : 'collapsed';
  setSidebarState(next);
  
  // Handle overlay on mobile
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (isMobile && sidebarOverlay) {
    sidebarOverlay.classList.toggle('active', next === 'expanded');
  }
}

function openSwitchUserDialog() {
  const confirmed = window.confirm('Switch to another admin account? This will sign you out of the current session.');
  if (confirmed) {
    document.getElementById('admin-logout')?.click();
  }
}

function openCreateUserDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'admin-dialog';
  dialog.innerHTML = `
    <form class="admin-dialog__panel">
      <header class="admin-dialog__header">
        <h3>Create admin user</h3>
        <p>Generate credentials for a teammate or a new administrator.</p>
      </header>
      <div class="admin-dialog__body">
        <label class="form-field">
          <span class="form-label">Email *</span>
          <input type="email" name="email" class="form-input" required placeholder="admin@example.com" />
        </label>
        <label class="form-field">
          <span class="form-label">Temporary password *</span>
          <input type="password" name="password" class="form-input" required placeholder="••••••••" />
        </label>
        <label class="form-field">
          <span class="form-label">Role</span>
          <select name="role" class="form-input">
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <p class="admin-dialog__note">After creation, share the credentials securely. The user will be prompted to update their password on first login.</p>
      </div>
      <footer class="admin-dialog__footer">
        <button type="button" class="btn-secondary" data-dialog-cancel>Cancel</button>
        <button type="submit" class="btn-primary">Create user</button>
      </footer>
    </form>
  `;

  const cleanup = () => dialog.remove();
  dialog.addEventListener('close', cleanup, { once: true });
  dialog.querySelector('[data-dialog-cancel]')?.addEventListener('click', () => dialog.close('cancel'));
  dialog.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    notify.info('Create user', `Send a request to your backend to create an account for ${email}.`);
    dialog.close('submit');
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}

function openManageUsersDialog() {
  notify.info('Manage users', 'Full user management is coming soon. For now, use your backend interface to update admin accounts.');
}

function insertNewProjectCard() {
  const newProject = {
    title: '',
    slug: '',
    description: '',
    order_index: (getState().projects?.length || 0) + 1,
  };
  const card = createProjectCard(newProject, true);
  projectsList.prepend(card);
  projectsEmpty?.classList.add('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.querySelector('input[name="title"]')?.focus();
}

async function handleProjectListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const card = button.closest('article');
  const projectId = card.dataset.projectId;
  const action = button.dataset.action;

  if (action === 'save') {
    await persistProject(card, projectId === 'new');
  } else if (action === 'delete') {
    await deleteProject(card, projectId);
  } else if (action === 'move-up' || action === 'move-down') {
    reorderProject(projectId, action === 'move-up');
  } else if (action === 'reset') {
    resetProjectCard(card, projectId);
  } else if (action === 'customize') {
    openProjectCustomization(projectId);
  }
}

function handleProjectFieldChange(event) {
  const card = event.target.closest('article');
  if (!card) return;
  const headerTitle = card.querySelector('.project-name');
  const slugEl = card.querySelector('.project-slug');
  const formData = new FormData(card.querySelector('footer').previousElementSibling);
  if (headerTitle) {
    headerTitle.textContent = formData.get('title') || 'Untitled project';
  }
  if (slugEl) {
    slugEl.textContent = formData.get('slug') || 'project-slug';
  }
}

async function persistProject(card, isNew) {
  const token = getState().token;
  const form = card.querySelector('[data-project-form]');
  const formData = new FormData(form);
  const payload = formPayloadToProject(formData);

  if (!payload.title || !payload.slug || !payload.description) {
    notify.warning('Incomplete project', 'Title, slug, and description are required.');
    return;
  }

  try {
    let saved;
    if (isNew) {
      saved = await createProject(token, payload);
      card.dataset.projectId = saved.id;
      delete card.dataset.new;
      notify.success('Project created', `${saved.title} is now live.`);
    } else {
      const projectId = card.dataset.projectId;
      saved = await updateProjectApi(token, projectId, payload);
      notify.success('Project updated', `${saved.title} saved successfully.`);
    }

    updateProject(saved);
    recordActivity({ action: 'project.save', details: { title: saved.title } });
    renderProjects();
  } catch (error) {
    notify.error('Save failed', error.message || 'Unable to persist project');
  }
}

function formPayloadToProject(formData) {
  const payload = {};
  for (const [key, value] of formData.entries()) {
    if (['stack', 'tags', 'links', 'metrics', 'features'].includes(key)) {
      try {
        payload[key] = value ? JSON.parse(value) : null;
      } catch (error) {
        notify.warning('Invalid JSON', `Please check the ${key} field.`);
      }
    } else if (key === 'is_featured') {
      payload[key] = true;
    } else if (key === 'order_index') {
      payload[key] = Number(value) || 0;
    } else {
      payload[key] = value || null;
    }
  }
  if (!formData.has('is_featured')) {
    payload.is_featured = false;
  }
  return payload;
}

async function deleteProject(card, projectId) {
  if (card.dataset.new === 'true') {
    card.remove();
    return;
  }

  if (!confirm('Delete this project? This action cannot be undone.')) {
    return;
  }

  try {
    await deleteProjectApi(getState().token, projectId);
    removeProject(Number(projectId));
    card.remove();
    notify.info('Project removed', 'Project deleted successfully.');
    recordActivity({ action: 'project.delete', details: { id: projectId } });
    if (projectsList.children.length === 0) {
      projectsEmpty.classList.remove('hidden');
    }
  } catch (error) {
    notify.error('Delete failed', error.message || 'Unable to delete the project');
  }
}

function reorderProject(projectId, moveUp) {
  const projects = getState().projects.slice();
  const index = projects.findIndex((p) => String(p.id) === String(projectId));
  if (index === -1) return;

  const newIndex = moveUp ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= projects.length) return;

  const [moved] = projects.splice(index, 1);
  projects.splice(newIndex, 0, moved);

  // reassign order indexes sequentially
  projects.forEach((project, idx) => {
    project.order_index = idx + 1;
  });

  setProjects(projects);
  renderProjects();

  updateProjectOrder(getState().token, projects.map((project) => ({ id: project.id, order_index: project.order_index })))
    .then(() => notify.success('Order updated', 'Project order saved.'))
    .catch((error) => notify.error('Order update failed', error.message || 'Unable to save order.'));
}

function resetProjectCard(card, projectId) {
  if (card.dataset.new === 'true') {
    card.remove();
    if (!projectsList.children.length) projectsEmpty.classList.remove('hidden');
    return;
  }

  const project = getState().projects.find((p) => String(p.id) === String(projectId));
  if (!project) return;

  const freshCard = createProjectCard(project);
  card.replaceWith(freshCard);
  notify.info('Reverted changes', 'Fields reset to last saved values.');
}

async function openProjectCustomization(projectId) {
  if (!projectId || projectId === 'new') {
    notify.warning('Save first', 'Save the project before customizing card details.');
    return;
  }

  const numericId = Number(projectId);
  if (!numericId) return;

  try {
    const existing = await fetchProjectCustomization(getState().token, numericId);
    setProjectCustomization(numericId, existing.settings || {});
    renderProjectCustomizationDialog(numericId, existing.settings || {});
  } catch (error) {
    notify.error('Load failed', error.message || 'Unable to load customization');
  }
}

function renderProjectCustomizationDialog(projectId, settings) {
  const dialog = document.createElement('dialog');
  dialog.className = 'backdrop:bg-slate-950/80 rounded-2xl border border-white/10 bg-slate-900/80 p-0 text-slate-100 backdrop-blur-md';
  const project = getState().projects.find((p) => p.id === projectId);

  dialog.innerHTML = `
    <form method="dialog" class="flex max-h-[80vh] w-[min(580px,90vw)] flex-col">
      <header class="flex items-center justify-between border-b border-white/5 p-4">
        <div>
          <h3 class="text-lg font-semibold text-white">Customize card — ${project?.title ?? ''}</h3>
          <p class="text-xs text-slate-400">Adjust badge colors, overlay text, or add ribbon labels.</p>
        </div>
        <button value="cancel" class="btn-ghost text-xs">Close</button>
      </header>

      <div class="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        ${renderJSON('Badge labels (array)', 'badges', settings.badges || [])}
        ${renderJSON('Highlight metrics (array)', 'highlights', settings.highlights || [])}
        ${renderInput('Overlay text', 'overlay', settings.overlay || '', 'text')}
        ${renderInput('CTA label', 'ctaLabel', settings.ctaLabel || '', 'text')}
        ${renderInput('CTA URL', 'ctaUrl', settings.ctaUrl || '', 'text')}
        ${renderInput('Card accent color', 'accentColor', settings.accentColor || '#3b82f6', 'color')}
      </div>

      <footer class="flex items-center justify-end gap-2 border-t border-white/5 p-4">
        <button value="cancel" class="btn-ghost text-xs">Cancel</button>
        <button type="button" data-dialog-save class="btn-primary text-xs">Save</button>
      </footer>
    </form>
  `;

  document.body.appendChild(dialog);
  dialog.addEventListener('close', () => dialog.remove());

  dialog.querySelector('[data-dialog-save]').addEventListener('click', async () => {
  const form = dialog.querySelector('form');
    const formData = new FormData(form);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      if (!value) continue;
      if (['badges', 'highlights'].includes(key)) {
        try {
          payload[key] = value ? JSON.parse(value) : [];
        } catch (error) {
          notify.warning('Invalid JSON', `Please review the ${key} field.`);
          return;
        }
      } else {
        payload[key] = value;
      }
    }

    try {
      await updateProjectCustomization(getState().token, projectId, payload);
      setProjectCustomization(projectId, payload);
      recordActivity({ action: 'project.customization', details: { projectId } });
      notify.success('Card updated', 'Project card customization saved.');
      dialog.close();
    } catch (error) {
      notify.error('Save failed', error.message || 'Unable to save customization');
    }
  });

  dialog.showModal();
}

function renderCustomizations() {
  const { customizations } = getState();
  if (!customizations || !customizations.size) {
    customizationGroups.innerHTML = '<p class="text-sm text-slate-400">No customizations available yet.</p>';
    return;
  }

  const html = CUSTOMIZATION_GROUPS.map((group) => {
    const fields = group.fields
      .map((field) => {
        const current = customizations.get(field.key)?.value ?? field.defaultValue ?? '';
        return renderCustomizationField(field, current);
      })
      .join('');

    return `
      <section class="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-semibold text-white">${group.title}</h4>
            <p class="text-xs text-slate-400">${group.description}</p>
          </div>
          <button class="btn-secondary text-xs" data-save-group="${group.id}">Save group</button>
        </div>
        <div class="grid gap-3 md:grid-cols-2" data-customization-group="${group.id}">
          ${fields}
        </div>
      </section>
    `;
  }).join('');

  customizationGroups.innerHTML = html;

  customizationGroups.querySelectorAll('button[data-save-group]').forEach((button) => {
    button.addEventListener('click', () => saveCustomizationGroup(button.dataset.saveGroup));
  });
}

function renderCustomizationField(field, value) {
  const base = `
    <label class="form-field" data-customization-field="${field.key}">
      <span class="form-label">${field.label}</span>
  `;

  let input;
  if (field.type === 'textarea') {
    input = `<textarea rows="${field.rows ?? 3}" class="form-textarea">${value ?? ''}</textarea>`;
  } else if (field.type === 'color') {
    input = `<input type="color" value="${value || '#3b82f6'}" class="form-input h-10" />`;
  } else if (field.type === 'number') {
    input = `<input type="number" value="${value ?? ''}" step="${field.step ?? 1}" min="${field.min ?? ''}" max="${field.max ?? ''}" class="form-input" />`;
  } else {
    input = `<input type="text" value="${value ?? ''}" placeholder="${field.placeholder ?? ''}" class="form-input" />`;
  }

  return `${base}${input}</label>`;
}

function handleCustomizationInputChange(event) {
  const field = event.target.closest('[data-customization-field]');
  if (!field) return;
  field.dataset.dirty = 'true';
}

function saveCustomizationGroup(groupId) {
  const group = customizationGroups.querySelector(`[data-customization-group="${groupId}"]`);
  if (!group) return;

  const fields = group.querySelectorAll('[data-customization-field]');
  fields.forEach((field) => {
    if (field.dataset.dirty === 'true') {
      const key = field.dataset.customizationField;
      const input = field.querySelector('input, textarea');
      let value = input.value;
      let type = 'string';
      if (input.type === 'number') type = 'number';
      if (input.type === 'color') type = 'string';
      saveCustomization(key, value, type);
      field.dataset.dirty = 'false';
    }
  });
}

async function saveCustomization(key, value, type, successMessage = 'Customization saved') {
  try {
    const response = await updateCustomization(getState().token, key, value, type);
    updateCustomizationValue(key, response);
    notify.success('Saved', successMessage);
    recordActivity({ action: 'customization.save', details: { key } });
  } catch (error) {
    notify.error('Save failed', error.message || 'Unable to save customization');
  }
}

function renderCodeEditors() {
  const { customizations } = getState();
  customCss.value = customizations.get('custom.css.global')?.value ?? '';
  customHero.value = customizations.get('custom.hero.html')?.value ?? '';
}

function renderActivityLog() {
  const { activity } = getState();
  if (!activity.length) {
    activityLog.innerHTML = '<p class="text-sm text-slate-500">No activity recorded yet.</p>';
    return;
  }

  const items = activity
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleString();
      return `<div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
        <p class="text-xs font-semibold text-slate-200">${entry.action}</p>
        <p class="text-xs text-slate-400">${JSON.stringify(entry.details || {})}</p>
        <span class="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">${time}</span>
      </div>`;
    })
    .join('');

  activityLog.innerHTML = items;
}

function switchPanel(panel) {
  document.querySelectorAll('[data-panel-target]').forEach((section) => {
    section.classList.toggle('hidden', section.dataset.panelTarget !== panel);
  });
}

function showLogin() {
  loader.classList.add('hidden');
  loginView.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function toggleLoader(show, message) {
  if (!loader) return;
  loader.classList.toggle('hidden', !show);
  if (message) {
    loader.querySelector('p')?.classList.remove('hidden');
    loader.querySelector('p').textContent = message;
  }
}

async function evaluateHealth() {
  try {
    const health = await pingHealth();
    statusApi.textContent = 'Online';
    statusApi.className = 'text-emerald-400';
    statusDb.textContent = 'Connected';
    statusDb.className = 'text-emerald-400';
    if (health?.timestamp) {
      statusSync.textContent = new Date(health.timestamp).toLocaleTimeString();
    }
  } catch (error) {
    statusApi.textContent = 'Offline';
    statusApi.className = 'text-red-400';
    statusDb.textContent = 'Unknown';
    statusDb.className = 'text-slate-400';
  }
}


