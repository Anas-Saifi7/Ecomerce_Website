import express from 'express';
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  pageValidators,
} from '../controllers/pageController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', optionalAuth, getPages);
router.get('/:idOrSlug', optionalAuth, getPage);
router.post('/', protect, authorize('admin', 'manager'), pageValidators, validate, createPage);
router.put('/:id', protect, authorize('admin', 'manager'), updatePage);
router.delete('/:id', protect, authorize('admin', 'manager'), deletePage);

export default router;
