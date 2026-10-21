import { get, post, put, del } from './api.js';

export const getCategories = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/categories${qs ? `?${qs}` : ''}`);
};

export const getCategory = (idOrSlug) =>
  get(`/categories/${idOrSlug}`, { auth: false });

export const createCategory = (data) => post('/categories', data);
export const updateCategory = (id, data) => put(`/categories/${id}`, data);
export const deleteCategory = (id) => del(`/categories/${id}`);

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
