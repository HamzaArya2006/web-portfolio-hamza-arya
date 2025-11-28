// Netlify Function: GET /api/public/projects
import { pathToFileURL } from 'url';
import { join } from 'path';

// Path resolution for Netlify Functions
const PROJECTS_PATH = join(process.cwd(), 'src', 'data', 'projects.js');

async function loadProjects() {
  const fileUrl = pathToFileURL(PROJECTS_PATH).href + `?v=${Date.now()}`;
  const module = await import(fileUrl);
  if (!Array.isArray(module.projects)) {
    throw new Error('projects export missing or malformed');
  }
  return structuredClone(module.projects);
}

export const handler = async (event) => {
  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

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
};

