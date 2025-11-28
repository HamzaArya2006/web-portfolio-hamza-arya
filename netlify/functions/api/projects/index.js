// Netlify Function: /api/projects (GET, POST, PUT, DELETE)
// Note: File writes won't persist in Netlify Functions. Consider using a database or external storage.

import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

// Path resolution for Netlify Functions
const PROJECTS_PATH = join(process.cwd(), 'src', 'data', 'projects.js');

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required');
})();

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function loadProjects() {
  const fileUrl = pathToFileURL(PROJECTS_PATH).href + `?v=${Date.now()}`;
  const module = await import(fileUrl);
  if (!Array.isArray(module.projects)) {
    throw new Error('projects export missing or malformed');
  }
  return structuredClone(module.projects);
}

async function persistProjects(projects) {
  const contents = `export const projects = ${JSON.stringify(projects, null, 2)};\n`;
  try {
    writeFileSync(PROJECTS_PATH, contents, 'utf-8');
  } catch (err) {
    console.error('Warning: File write may not persist in serverless environment:', err);
    throw new Error('Failed to save projects');
  }
}

export const handler = async (event) => {
  try {
    // Get token from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Access token required' })
      };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid or expired token' })
      };
    }

    const method = event.httpMethod;
    const path = event.path.replace('/api/projects', '') || '/';
    const id = path.split('/').filter(Boolean)[0];

    // GET /api/projects - List all projects
    if (method === 'GET' && !id) {
      try {
        const projects = await loadProjects();
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projects)
        };
      } catch (error) {
        console.error('Error loading projects:', error);
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to load projects' })
        };
      }
    }

    // POST /api/projects - Create project
    if (method === 'POST') {
      try {
        const body = JSON.parse(event.body || '{}');
        const newProject = { ...body };
        const projects = await loadProjects();
        newProject.id = newProject.id || Date.now().toString();
        projects.push(newProject);
        await persistProjects(projects);
        return {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        };
      } catch (error) {
        console.error('Error creating project:', error);
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to create project' })
        };
      }
    }

    // PUT /api/projects/:id - Update project
    if (method === 'PUT' && id) {
      try {
        const body = JSON.parse(event.body || '{}');
        const updated = { ...body };
        const projects = await loadProjects();
        const index = projects.findIndex((p) => String(p.id) === String(id));
        if (index === -1) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project not found' })
          };
        }
        projects[index] = { ...projects[index], ...updated, id: projects[index].id };
        await persistProjects(projects);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projects[index])
        };
      } catch (error) {
        console.error('Error updating project:', error);
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to update project' })
        };
      }
    }

    // DELETE /api/projects/:id - Delete project
    if (method === 'DELETE' && id) {
      try {
        const projects = await loadProjects();
        const filtered = projects.filter((p) => String(p.id) !== String(id));
        if (filtered.length === projects.length) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Project not found' })
          };
        }
        await persistProjects(filtered);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true })
        };
      } catch (error) {
        console.error('Error deleting project:', error);
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to delete project' })
        };
      }
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (error) {
    console.error('Projects API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

