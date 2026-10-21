import express from 'express';
import {
  verifyRazorpayPayment,
  razorpayWebhook,
  getPaymentConfig,
  verifyValidators,
} from '../controllers/paymentController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.post('/razorpay/verify', protect, verifyValidators, validate, verifyRazorpayPayment);
router.post('/webhook', razorpayWebhook);

export default router;
