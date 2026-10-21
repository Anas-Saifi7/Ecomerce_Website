import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProduct, uploadBanner, uploadBlog } from '../middleware/upload.js';

const router = express.Router();

router.post(
  '/products',
  protect,
  authorize('admin', 'manager'),
  uploadProduct.array('images', 8),
  uploadImages
);

router.post(
  '/banners',
  protect,
  authorize('admin', 'manager'),
  uploadBanner.array('images', 4),
  uploadImages
);

router.post(
  '/blog',
  protect,
  authorize('admin', 'manager'),
  uploadBlog.array('images', 4),
  uploadImages
);

export default router;
