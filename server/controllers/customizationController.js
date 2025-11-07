import { validationResult } from 'express-validator';

import pool from '../config/database.js';

function mapCustomization(row) {
  return {
    id: row.id,
    key: row.setting_key,
    type: row.value_type,
    value: parseValue(row.value, row.value_type),
    updated_at: row.updated_at,
  };
}

function parseValue(value, type) {
  if (value === null || value === undefined) return null;
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true' || value === true;
    case 'json':
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    default:
      return value;
  }
}

function stringifyValue(value, type) {
  if (value === null || value === undefined) return null;
  switch (type) {
    case 'number':
    case 'boolean':
      return String(value);
    case 'json':
      return JSON.stringify(value);
    default:
      return value;
  }
}

export async function getAllCustomizations(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM site_customizations ORDER BY setting_key ASC');
    res.json(rows.map(mapCustomization));
  } catch (error) {
    next(error);
  }
}

export async function getCustomizationByKey(req, res, next) {
  try {
    const { key } = req.params;
    const [rows] = await pool.query('SELECT * FROM site_customizations WHERE setting_key = ?', [key]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json(mapCustomization(rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function updateCustomization(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { key } = req.params;
    const { value, type = 'string' } = req.body;

    await pool.query(
      `INSERT INTO site_customizations (setting_key, value, value_type, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE value = VALUES(value), value_type = VALUES(value_type), updated_at = NOW()`
      ,
      [key, stringifyValue(value, type), type]
    );

    const [rows] = await pool.query('SELECT * FROM site_customizations WHERE setting_key = ?', [key]);
    res.json(mapCustomization(rows[0]));
  } catch (error) {
    next(error);
  }
}

export async function getProjectCustomization(req, res, next) {
  try {
    const { projectId } = req.params;
    const [rows] = await pool.query('SELECT * FROM project_customizations WHERE project_id = ?', [projectId]);

    if (rows.length === 0) {
      return res.json({ project_id: Number(projectId), settings: {} });
    }

    const row = rows[0];
    res.json({
      project_id: row.project_id,
      settings: row.settings ? JSON.parse(row.settings) : {},
      updated_at: row.updated_at,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectCustomization(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { settings } = req.body;

    await pool.query(
      `INSERT INTO project_customizations (project_id, settings, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE settings = VALUES(settings), updated_at = NOW()`
      ,
      [projectId, JSON.stringify(settings)]
    );

    const [rows] = await pool.query('SELECT * FROM project_customizations WHERE project_id = ?', [projectId]);

    res.json({
      project_id: rows[0].project_id,
      settings: rows[0].settings ? JSON.parse(rows[0].settings) : {},
      updated_at: rows[0].updated_at,
    });
  } catch (error) {
    next(error);
  }
}


