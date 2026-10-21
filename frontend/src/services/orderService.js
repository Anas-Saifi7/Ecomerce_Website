import { get, post, patch } from './api.js';

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value));
    }
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
};

export const createOrder = (data) => post('/orders', data);
export const getMyOrders = () => get('/orders/my');
export const getOrder = (idOrNumber) => get(`/orders/${idOrNumber}`);
export const trackOrder = (orderNumber, email) =>
  get(`/orders/track/${orderNumber}${toQuery({ email })}`, { auth: false });
export const cancelOrder = (id) => patch(`/orders/${id}/cancel`, {});
export const requestReturn = (id, data) => post(`/orders/${id}/return`, data);
export const getOrdersAdmin = (params) => get(`/orders${toQuery(params)}`);
export const updateOrderStatus = (id, data) =>
  patch(`/orders/${id}/status`, data);
export const refundOrder = (id, data) => patch(`/orders/${id}/refund`, data || {});

export const verifyRazorpayPayment = (data) =>
  post('/payments/razorpay/verify', data);
export const getPaymentConfig = () => get('/payments/config', { auth: false });

export default {
  createOrder,
  getMyOrders,
  getOrder,
  trackOrder,
  cancelOrder,
  requestReturn,
  getOrdersAdmin,
  updateOrderStatus,
  refundOrder,
  verifyRazorpayPayment,
};
