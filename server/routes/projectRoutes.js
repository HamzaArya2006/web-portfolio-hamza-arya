import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
} from '../controllers/projectController.js';
import { authenticateToken } from '../config/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getProjects);
router.get(
  '/:id',
  param('id').isInt().toInt(),
  validateRequest,
  getProjectById
);

router.post(
  '/',
  [
    body('title').isLength({ min: 3 }).withMessage('Title is required'),
    body('slug').isSlug().withMessage('Valid slug required'),
    body('description').isLength({ min: 10 }).withMessage('Description is required'),
  ],
  validateRequest,
  createProject
);

router.put(
  '/:id',
  param('id').isInt().toInt(),
  [
    body('title').optional().isLength({ min: 3 }),
    body('slug').optional().isSlug(),
  ],
  validateRequest,
  updateProject
);

router.delete(
  '/:id',
  param('id').isInt().toInt(),
  validateRequest,
  deleteProject
);

router.post(
  '/order',
  body('order').isArray({ min: 1 }).withMessage('Order array required'),
  validateRequest,
  updateProjectOrder
);

export default router;


