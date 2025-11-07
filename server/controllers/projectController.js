import { validationResult } from 'express-validator';

import pool from '../config/database.js';

function mapProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    role: row.role,
    stack: row.stack ? JSON.parse(row.stack) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
    tech: row.tech,
    image: row.image,
    images: row.images ? JSON.parse(row.images) : [],
    links: row.links ? JSON.parse(row.links) : {},
    category: row.category,
    metrics: row.metrics ? JSON.parse(row.metrics) : {},
    features: row.features ? JSON.parse(row.features) : [],
    duration: row.duration,
    client: row.client,
    order_index: row.order_index,
    is_featured: !!row.is_featured,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getProjects(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY order_index ASC, created_at DESC');
    res.json(rows.map(mapProjectRow));
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(mapProjectRow(rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = req.body;

    const [result] = await pool.query(
      `INSERT INTO projects
        (title, slug, description, role, stack, tags, tech, image, images, links, category, metrics, features, duration, client, order_index, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.title,
        project.slug,
        project.description,
        project.role || null,
        project.stack ? JSON.stringify(project.stack) : null,
        project.tags ? JSON.stringify(project.tags) : null,
        project.tech || null,
        project.image || null,
        project.images ? JSON.stringify(project.images) : null,
        project.links ? JSON.stringify(project.links) : null,
        project.category || null,
        project.metrics ? JSON.stringify(project.metrics) : null,
        project.features ? JSON.stringify(project.features) : null,
        project.duration || null,
        project.client || null,
        project.order_index || 0,
        project.is_featured ? 1 : 0,
      ]
    );

    const newProjectId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [newProjectId]);

    res.status(201).json(mapProjectRow(rows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Project with this slug already exists' });
    }
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const project = req.body;

    const [existing] = await pool.query('SELECT id FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.query(
      `UPDATE projects SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        role = COALESCE(?, role),
        stack = COALESCE(?, stack),
        tags = COALESCE(?, tags),
        tech = COALESCE(?, tech),
        image = COALESCE(?, image),
        images = COALESCE(?, images),
        links = COALESCE(?, links),
        category = COALESCE(?, category),
        metrics = COALESCE(?, metrics),
        features = COALESCE(?, features),
        duration = COALESCE(?, duration),
        client = COALESCE(?, client),
        order_index = COALESCE(?, order_index),
        is_featured = COALESCE(?, is_featured),
        updated_at = NOW()
       WHERE id = ?`,
      [
        project.title || null,
        project.slug || null,
        project.description || null,
        project.role || null,
        project.stack ? JSON.stringify(project.stack) : null,
        project.tags ? JSON.stringify(project.tags) : null,
        project.tech || null,
        project.image || null,
        project.images ? JSON.stringify(project.images) : null,
        project.links ? JSON.stringify(project.links) : null,
        project.category || null,
        project.metrics ? JSON.stringify(project.metrics) : null,
        project.features ? JSON.stringify(project.features) : null,
        project.duration || null,
        project.client || null,
        typeof project.order_index === 'number' ? project.order_index : null,
        typeof project.is_featured === 'boolean' ? (project.is_featured ? 1 : 0) : null,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(mapProjectRow(rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectOrder(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      connection.release();
      return res.status(400).json({ errors: errors.array() });
    }

    const { order } = req.body; // array of { id, order_index }

    await connection.beginTransaction();

    for (const item of order) {
      await connection.query('UPDATE projects SET order_index = ? WHERE id = ?', [item.order_index, item.id]);
    }

    await connection.commit();
    res.json({ message: 'Project order updated successfully' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}


