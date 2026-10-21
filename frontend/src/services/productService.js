import { get, post, put, patch, del } from './api.js';

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

export const getProducts = (params) =>
  get(`/products${toQuery(params)}`, { auth: String(params?.includeInactive) !== 'true' });

export const getProduct = (idOrSlug) =>
  get(`/products/${idOrSlug}`, { auth: false });

export const createProduct = (data) => post('/products', data);
export const updateProduct = (id, data) => put(`/products/${id}`, data);
export const deleteProduct = (id) => del(`/products/${id}`);
export const updateStock = (id, stock) =>
  patch(`/products/${id}/stock`, { stock });

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
