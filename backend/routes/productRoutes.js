import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  productValidators,
} from '../controllers/productController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/:idOrSlug', optionalAuth, getProduct);
router.post('/', protect, authorize('admin', 'manager'), productValidators, validate, createProduct);
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteProduct);
router.patch('/:id/stock', protect, authorize('admin', 'manager'), updateStock);

export default router;
