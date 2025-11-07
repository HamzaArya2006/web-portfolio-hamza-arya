import { validationResult } from 'express-validator';

import pool from '../config/database.js';
import { generateToken, hashPassword, comparePassword } from '../config/auth.js';

export async function loginAdmin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT id, email, password_hash FROM admin_users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = rows[0];
    const isMatch = await comparePassword(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(admin.id, admin.email);

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const adminId = req.user.userId;

    const [rows] = await pool.query(
      'SELECT id, email, display_name, avatar_url, created_at, updated_at FROM admin_users WHERE id = ?',
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password_hash FROM admin_users WHERE id = ?', [adminId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const admin = rows[0];
    const isMatch = await comparePassword(currentPassword, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    const newHash = await hashPassword(newPassword);
    await pool.query('UPDATE admin_users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [newHash, adminId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}


