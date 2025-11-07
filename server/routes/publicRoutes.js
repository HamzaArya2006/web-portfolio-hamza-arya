import { Router } from 'express';

import { getPublicProjects } from '../controllers/publicProjectController.js';
import { getPublicCustomizations } from '../controllers/publicCustomizationController.js';

const router = Router();

router.get('/projects', getPublicProjects);
router.get('/customizations', getPublicCustomizations);

export default router;


