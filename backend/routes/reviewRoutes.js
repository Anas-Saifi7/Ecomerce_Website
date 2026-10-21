import express from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviews,
  getMyReviews,
  moderateReview,
  deleteReview,
  reviewValidators,
} from '../controllers/reviewController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'manager'), getAllReviews);
router.get('/mine', protect, getMyReviews);
router.get('/product/:productId', optionalAuth, getProductReviews);
router.post(
  '/product/:productId',
  protect,
  reviewValidators,
  validate,
  createReview
);
router.patch('/:id', protect, authorize('admin', 'manager'), moderateReview);
router.delete('/:id', protect, deleteReview);

export default router;
