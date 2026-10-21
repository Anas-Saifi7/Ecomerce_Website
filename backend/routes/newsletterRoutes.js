import express from 'express';
import {
  subscribe,
  getSubscribers,
  unsubscribe,
  subscribeValidators,
} from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/subscribe', subscribeValidators, validate, subscribe);
router.get('/', protect, authorize('admin', 'manager'), getSubscribers);
router.delete('/:email', protect, authorize('admin', 'manager'), unsubscribe);

export default router;
