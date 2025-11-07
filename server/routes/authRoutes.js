import { Router } from 'express';
import { body } from 'express-validator';

import { loginAdmin, getProfile, updatePassword } from '../controllers/authController.js';
import { authenticateToken } from '../config/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password required'),
  ],
  validateRequest,
  loginAdmin
);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

// PATCH /api/auth/password
router.patch(
  '/password',
  authenticateToken,
  [
    body('currentPassword').isLength({ min: 6 }).withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validateRequest,
  updatePassword
);

export default router;


