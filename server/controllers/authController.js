import { validationResult } from 'express-validator';

import { generateToken, hashPassword, comparePassword } from '../config/auth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_JSON_PATH = path.resolve(__dirname, '../config/admin_users.json');

export async function loginAdmin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let admins;
    try {
      const data = await fs.readFile(ADMIN_JSON_PATH, 'utf-8');
      admins = JSON.parse(data);
    } catch (err) {
      return res.status(500).json({ error: 'Cannot read admin users database.' });
    }
    const admin = admins.find((u) => u.email === email);
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    const token = generateToken(admin.id, admin.email);
    res.json({
      token,
      admin: { id: admin.id, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const adminId = req.user.userId;
    let admins;
    try {
      const data = await fs.readFile(ADMIN_JSON_PATH, 'utf-8');
      admins = JSON.parse(data);
    } catch (err) {
      return res.status(500).json({ error: 'Cannot read admin users database.' });
    }
    const admin = admins.find((u) => u.id == adminId);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ id: admin.id, email: admin.email });
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
    let admins;
    try {
      const data = await fs.readFile(ADMIN_JSON_PATH, 'utf-8');
      admins = JSON.parse(data);
    } catch (err) {
      return res.status(500).json({ error: 'Cannot read admin users database.' });
    }
    const adminIndex = admins.findIndex((u) => u.id == adminId);
    if (adminIndex === -1) return res.status(404).json({ error: 'Admin not found' });
    const admin = admins[adminIndex];
    const isMatch = await comparePassword(currentPassword, admin.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }
    const newHash = await hashPassword(newPassword);
    admins[adminIndex].password_hash = newHash;
    await fs.writeFile(ADMIN_JSON_PATH, JSON.stringify(admins, null, 2), 'utf-8');
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}


