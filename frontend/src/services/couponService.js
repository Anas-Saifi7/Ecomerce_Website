import { get, post, put, del } from './api.js';

export const validateCoupon = (data) =>
  post('/coupons/validate', data, { auth: false });

export const getCoupons = () => get('/coupons');
export const createCoupon = (data) => post('/coupons', data);
export const updateCoupon = (id, data) => put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => del(`/coupons/${id}`);

export default {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
