import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authenticateToken } from './config/auth.js';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import authRoutes from './routes/authRoutes.js';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_PATH = path.resolve(__dirname, '../src/data/projects.js');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);

// Public routes (no authentication required)
app.get('/api/public/projects', async (req, res, next) => {
  try {
    const projects = await loadProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

app.get('/api/public/customizations', async (req, res, next) => {
  try {
    // Return empty customizations array for now
    // Can be extended to load from a file or database
    res.json({ customizations: [] });
  } catch (error) {
    next(error);
  }
});

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
  await fs.writeFile(PROJECTS_PATH, contents, 'utf-8');
}

app.get('/api/projects', authenticateToken, async (req, res, next) => {
  try {
    const projects = await loadProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

app.post('/api/projects', authenticateToken, async (req, res, next) => {
  try {
    const newProject = { ...req.body };
    const projects = await loadProjects();
    newProject.id = newProject.id || Date.now().toString();
    projects.push(newProject);
    await persistProjects(projects);
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = { ...req.body };
    const projects = await loadProjects();
    const index = projects.findIndex((project) => String(project.id) === String(id));
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    projects[index] = { ...projects[index], ...updated, id: projects[index].id };
    await persistProjects(projects);
    res.json(projects[index]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await loadProjects();
    const filtered = projects.filter((project) => String(project.id) !== String(id));
    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await persistProjects(filtered);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Admin server running on port ${PORT} (JSON-auth only)`);
});


