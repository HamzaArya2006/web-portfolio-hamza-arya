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

  const navButtons = document.querySelectorAll('.admin-nav-btn');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      switchPanel(btn.dataset.panel);
    });
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
  const { projects } = getState();

  if (!projects || projects.length === 0) {
    projectsEmpty.classList.remove('hidden');
    projectsList.innerHTML = '';
    return;
  }

  projectsEmpty.classList.add('hidden');
  const fragment = document.createDocumentFragment();

  projects
    .slice()
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .forEach((project) => {
      fragment.appendChild(createProjectCard(project));
    });

  projectsList.innerHTML = '';
  projectsList.appendChild(fragment);
}

function createProjectCard(project, isNew = false) {
  const card = document.createElement('article');
  card.className = 'group rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur';
  card.dataset.projectId = project.id ?? 'new';
  if (isNew) {
    card.dataset.new = 'true';
  }

  card.innerHTML = `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h4 class="text-base font-semibold text-white">${project.title || 'Untitled project'}</h4>
        <p class="text-xs text-slate-400">${project.slug || 'project-slug'}</p>
      </div>
      <div class="flex items-center gap-2">
        <button data-action="move-up" class="btn-ghost text-xs" title="Move up">▲</button>
        <button data-action="move-down" class="btn-ghost text-xs" title="Move down">▼</button>
        <button data-action="customize" class="btn-secondary text-xs">Customize card</button>
        <button data-action="delete" class="btn-ghost text-xs text-red-400">Delete</button>
      </div>
    </header>

    <form data-project-form class="mt-4 grid gap-3 md:grid-cols-2">
      ${renderInput('Title', 'title', project.title, 'text', true)}
      ${renderInput('Slug', 'slug', project.slug, 'text', true)}
      ${renderTextarea('Description', 'description', project.description, true)}
      ${renderInput('Category', 'category', project.category)}
      ${renderInput('Tech summary', 'tech', project.tech)}
      ${renderInput('Primary image URL', 'image', project.image)}
      ${renderInput('Duration', 'duration', project.duration)}
      ${renderInput('Client', 'client', project.client)}
      ${renderNumber('Display order', 'order_index', project.order_index ?? 0)}
      ${renderCheckbox('Featured on home', 'is_featured', project.is_featured)}
      ${renderJSON('Stack (array)', 'stack', project.stack)}
      ${renderJSON('Tags (array)', 'tags', project.tags)}
      ${renderJSON('Links (object)', 'links', project.links)}
      ${renderJSON('Metrics (object)', 'metrics', project.metrics)}
      ${renderJSON('Features (array)', 'features', project.features)}
    </form>

    <footer class="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
      <small class="text-xs text-slate-500">Last updated: ${project.updated_at ? new Date(project.updated_at).toLocaleString() : '—'}</small>
      <div class="flex items-center gap-2">
        <button data-action="reset" class="btn-ghost text-xs">Reset</button>
        <button data-action="save" class="btn-primary text-xs">Save changes</button>
      </div>
    </footer>
  `;

  return card;
}

function renderInput(label, name, value = '', type = 'text', required = false) {
  return `
    <label class="flex flex-col gap-1 text-xs text-slate-300">
      <span class="font-semibold uppercase tracking-wide text-slate-400">${label}</span>
      <input
        name="${name}"
        type="${type}"
        value="${value ?? ''}"
        ${required ? 'required' : ''}
        class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />
    </label>
  `;
}

function renderTextarea(label, name, value = '', required = false) {
  return `
    <label class="md:col-span-2 flex flex-col gap-1 text-xs text-slate-300">
      <span class="font-semibold uppercase tracking-wide text-slate-400">${label}</span>
      <textarea
        name="${name}"
        rows="4"
        ${required ? 'required' : ''}
        class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >${value ?? ''}</textarea>
    </label>
  `;
}

function renderNumber(label, name, value = 0) {
  return `
    <label class="flex flex-col gap-1 text-xs text-slate-300">
      <span class="font-semibold uppercase tracking-wide text-slate-400">${label}</span>
      <input
        name="${name}"
        type="number"
        value="${value ?? 0}"
        class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />
    </label>
  `;
}

function renderCheckbox(label, name, checked = false) {
  return `
    <label class="flex items-center gap-2 text-xs text-slate-300">
      <input type="checkbox" name="${name}" ${checked ? 'checked' : ''} class="rounded border-white/20 bg-slate-950/70" />
      <span class="font-semibold uppercase tracking-wide text-slate-400">${label}</span>
    </label>
  `;
}

function renderJSON(label, name, value) {
  const pretty = value ? JSON.stringify(value, null, 2) : '';
  return `
    <label class="md:col-span-2 flex flex-col gap-1 text-xs text-slate-300">
      <span class="font-semibold uppercase tracking-wide text-slate-400">${label}</span>
      <textarea
        name="${name}"
        rows="4"
        class="font-mono w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-blue-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        spellcheck="false"
      >${pretty}</textarea>
    </label>
  `;
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
  projectsEmpty.classList.add('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  const headerTitle = card.querySelector('header h4');
  const slugEl = card.querySelector('header p');
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
    <label class="flex flex-col gap-1 text-xs text-slate-300" data-customization-field="${field.key}">
      <span class="font-semibold uppercase tracking-wide text-slate-400">${field.label}</span>
  `;

  let input;
  if (field.type === 'textarea') {
    input = `<textarea rows="${field.rows ?? 3}" class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30">${value ?? ''}</textarea>`;
  } else if (field.type === 'color') {
    input = `<input type="color" value="${value || '#3b82f6'}" class="h-10 w-full rounded-lg border border-white/10 bg-slate-950/60" />`;
  } else if (field.type === 'number') {
    input = `<input type="number" value="${value ?? ''}" step="${field.step ?? 1}" min="${field.min ?? ''}" max="${field.max ?? ''}" class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />`;
  } else {
    input = `<input type="text" value="${value ?? ''}" placeholder="${field.placeholder ?? ''}" class="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />`;
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


