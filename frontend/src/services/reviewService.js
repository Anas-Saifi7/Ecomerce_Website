import { get, post, patch, del } from './api.js';

const toQuery = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
};

export const getProductReviews = (productId) =>
  get(`/reviews/product/${productId}`, { auth: false });
export const getMyReviews = () => get('/reviews/mine');

export const createReview = (productId, data) =>
  post(`/reviews/product/${productId}`, data);

export const getAllReviews = (params) => get(`/reviews${toQuery(params)}`);
export const moderateReview = (id, data) => patch(`/reviews/${id}`, data);
export const deleteReview = (id) => del(`/reviews/${id}`);

export default {
  getProductReviews,
  getMyReviews,
  createReview,
  getAllReviews,
  moderateReview,
  deleteReview,
};
