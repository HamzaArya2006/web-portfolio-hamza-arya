const API_BASE = import.meta.env.VITE_ADMIN_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

async function request(endpoint, { token, method = 'GET', body, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const err = new Error(error.error || 'Request failed');
    err.status = response.status;
    err.details = error;
    throw err;
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function fetchProfile(token) {
  return request('/api/auth/profile', { token });
}

export async function changePassword(token, currentPassword, newPassword) {
  return request('/api/auth/password', {
    token,
    method: 'PATCH',
    body: { currentPassword, newPassword },
  });
}

// Projects
export async function fetchProjects(token) {
  return request('/api/projects', { token });
}

export async function createProject(token, data) {
  return request('/api/projects', {
    token,
    method: 'POST',
    body: data,
  });
}

export async function updateProject(token, projectId, data) {
  return request(`/api/projects/${projectId}`, {
    token,
    method: 'PUT',
    body: data,
  });
}

export async function deleteProjectApi(token, projectId) {
  return request(`/api/projects/${projectId}`, {
    token,
    method: 'DELETE',
  });
}

export async function updateProjectOrder(token, order) {
  return request('/api/projects/order', {
    token,
    method: 'POST',
    body: { order },
  });
}

export async function fetchCustomizations(token) {
  return request('/api/customizations', { token });
}

export async function updateCustomization(token, key, value, type = 'string') {
  return request(`/api/customizations/key/${encodeURIComponent(key)}`, {
    token,
    method: 'PUT',
    body: { value, type },
  });
}

export async function fetchProjectCustomization(token, projectId) {
  return request(`/api/customizations/projects/${projectId}`, { token });
}

export async function updateProjectCustomization(token, projectId, settings) {
  return request(`/api/customizations/projects/${projectId}`, {
    token,
    method: 'PUT',
    body: { settings },
  });
}

export async function fetchActivity(token) {
  try {
    return request('/api/customizations/activity', { token });
  } catch (error) {
    // Endpoint may not exist yet; return empty list
    if (error.status === 404) {
      return { logs: [] };
    }
    throw error;
  }
}

export async function pingHealth() {
  return request('/health');
}

export const apiBase = API_BASE;


