import { get, post, put, del } from './api.js';

export const getBanners = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/banners${qs ? `?${qs}` : ''}`);
};

export const createBanner = (data) => post('/banners', data);
export const updateBanner = (id, data) => put(`/banners/${id}`, data);
export const deleteBanner = (id) => del(`/banners/${id}`);

export default {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
