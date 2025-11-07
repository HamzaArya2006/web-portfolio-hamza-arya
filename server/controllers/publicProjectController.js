import pool from '../config/database.js';

function mapPublicProject(row) {
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
  };
}

export async function getPublicProjects(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects ORDER BY is_featured DESC, order_index ASC, created_at DESC'
    );
    res.json(rows.map(mapPublicProject));
  } catch (error) {
    next(error);
  }
}


