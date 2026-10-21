import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import couponRoutes from './couponRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import blogRoutes from './blogRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import adminRoutes from './adminRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import pageRoutes from './pageRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/blog', blogRoutes);
router.use('/banners', bannerRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/pages', pageRoutes);
router.use('/uploads', uploadRoutes);

export default router;
