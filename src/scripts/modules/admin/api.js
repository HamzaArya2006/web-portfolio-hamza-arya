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
    let errorPayload;
    try {
      errorPayload = await response.json();
    } catch (parseError) {
      errorPayload = { error: response.statusText || 'Request failed' };
    }
    const err = new Error(errorPayload.error || 'Request failed');
    err.status = response.status;
    err.details = errorPayload;
    throw err;
  }

  if (response.status === 204) return null;
  try {
    return await response.json();
  } catch (parseError) {
    const err = new Error('Invalid JSON response');
    err.status = response.status;
    err.details = { error: 'Invalid JSON response' };
    throw err;
  }
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

// --- CRUD now enabled ---
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
// --- ---

export async function updateProjectOrder(token, order) {
  throw new Error('Projects reordering is not available in this configuration.');
}

export async function fetchCustomizations(token) {
  try {
    return await request('/api/customizations', { token });
  } catch (error) {
    if (error.status === 404 || error.status === 501) {
      console.warn('[customizations] API not available, using defaults.');
      return [];
    }
    throw error;
  }
}

export async function updateCustomization(token, key, value, type = 'string') {
  throw new Error('Customization API is not available in this configuration.');
}

export async function fetchProjectCustomization(token, projectId) {
  try {
    return await request(`/api/customizations/projects/${projectId}`, { token });
  } catch (error) {
    if (error.status === 404 || error.status === 501) {
      return { project_id: Number(projectId), settings: {} };
    }
    throw error;
  }
}

export async function updateProjectCustomization(token, projectId, settings) {
  throw new Error('Customization API is not available in this configuration.');
}

export async function fetchActivity(token) {
  try {
    return request('/api/customizations/activity', { token });
  } catch (error) {
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


