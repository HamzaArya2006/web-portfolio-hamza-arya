import pool from '../config/database.js';

function mapCustomization(row) {
  return {
    key: row.setting_key,
    type: row.value_type,
    value: parseValue(row.value, row.value_type),
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

export async function getPublicCustomizations(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT setting_key, value_type, value FROM site_customizations');
    const data = rows.map(mapCustomization);
    res.json({ customizations: data });
  } catch (error) {
    next(error);
  }
}


