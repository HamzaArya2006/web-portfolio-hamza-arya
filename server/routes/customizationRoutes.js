import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  getAllCustomizations,
  getCustomizationByKey,
  updateCustomization,
  getProjectCustomization,
  updateProjectCustomization,
} from '../controllers/customizationController.js';
import { authenticateToken } from '../config/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllCustomizations);

router.get(
  '/key/:key',
  param('key').isString(),
  validateRequest,
  getCustomizationByKey
);

router.put(
  '/key/:key',
  param('key').isString(),
  [
    body('value').exists().withMessage('Value is required'),
    body('type').optional().isIn(['string', 'number', 'boolean', 'json', 'color']),
  ],
  validateRequest,
  updateCustomization
);

router.get(
  '/projects/:projectId',
  param('projectId').isInt().toInt(),
  validateRequest,
  getProjectCustomization
);

router.put(
  '/projects/:projectId',
  param('projectId').isInt().toInt(),
  [
    body('settings').isObject().withMessage('Settings object required'),
  ],
  validateRequest,
  updateProjectCustomization
);

export default router;


