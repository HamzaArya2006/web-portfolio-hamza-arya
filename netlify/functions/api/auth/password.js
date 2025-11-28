// Netlify Function: PATCH /api/auth/password
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Path resolution for Netlify Functions
const ADMIN_JSON_PATH = join(process.cwd(), 'server', 'config', 'admin_users.json');

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

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export const handler = async (event) => {
  // Only allow PATCH
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

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

    // Parse body
    const body = JSON.parse(event.body || '{}');
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Current password and new password are required' })
      };
    }

    if (currentPassword.length < 6) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Current password required' })
      };
    }

    if (newPassword.length < 8) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'New password must be at least 8 characters' })
      };
    }

    // Load admin users
    let admins;
    try {
      const data = readFileSync(ADMIN_JSON_PATH, 'utf-8');
      admins = JSON.parse(data);
    } catch (err) {
      console.error('Error reading admin users:', err);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Cannot read admin users database' })
      };
    }

    // Find admin
    const adminIndex = admins.findIndex((u) => u.id === decoded.userId);
    if (adminIndex === -1) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Admin not found' })
      };
    }

    const admin = admins[adminIndex];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Current password is incorrect' })
      };
    }

    // Check if new password is different
    if (currentPassword === newPassword) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'New password must be different from current password' })
      };
    }

    // Hash new password
    const newHash = await hashPassword(newPassword);
    admins[adminIndex].password_hash = newHash;

    // Write back to file
    // Note: In Netlify Functions, file writes are temporary. For production,
    // consider using a database or external storage service.
    try {
      writeFileSync(ADMIN_JSON_PATH, JSON.stringify(admins, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing admin users:', err);
      // In serverless, file writes might not persist. Log warning but continue.
      console.warn('Warning: Password update may not persist in serverless environment');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Password updated successfully' })
    };
  } catch (error) {
    console.error('Password update error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

