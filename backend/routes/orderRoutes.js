import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  trackOrder,
  cancelOrder,
  requestReturn,
  getOrdersAdmin,
  updateOrderStatus,
  refundOrder,
  createOrderValidators,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, createOrderValidators, validate, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/', protect, authorize('admin', 'manager'), getOrdersAdmin);
router.get('/:idOrNumber', protect, getOrder);
router.patch('/:id/cancel', protect, cancelOrder);
router.post('/:id/return', protect, requestReturn);
router.patch('/:id/status', protect, authorize('admin', 'manager'), updateOrderStatus);
router.patch('/:id/refund', protect, authorize('admin', 'manager'), refundOrder);

export default router;
