const TOKEN_KEY = 'portfolio_admin_token';

const state = {
  token: null,
  admin: null,
  projects: [],
  customizations: new Map(),
  projectCustomizations: new Map(),
  activity: [],
};

export function loadInitialState() {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (storedToken) {
    state.token = storedToken;
  }
  return state;
}

export function getState() {
  return state;
}

export function setToken(token) {
  state.token = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function setAdmin(admin) {
  state.admin = admin;
}

export function setProjects(projects) {
  state.projects = projects;
}

export function updateProject(project) {
  const idx = state.projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    state.projects[idx] = project;
  } else {
    state.projects.push(project);
  }
}

export function removeProject(projectId) {
  state.projects = state.projects.filter((p) => p.id !== projectId);
}

export function setCustomizations(customizationsArray) {
  state.customizations = new Map(customizationsArray.map((item) => [item.key, item]));
}

export function updateCustomizationValue(key, customization) {
  state.customizations.set(key, customization);
}

export function setProjectCustomization(projectId, data) {
  state.projectCustomizations.set(projectId, data);
}

export function recordActivity(entry) {
  state.activity.unshift({ ...entry, timestamp: Date.now() });
  state.activity = state.activity.slice(0, 25);
}

export function clearState() {
  state.token = null;
  state.admin = null;
  state.projects = [];
  state.customizations.clear();
  state.projectCustomizations.clear();
  state.activity = [];
  localStorage.removeItem(TOKEN_KEY);
}


