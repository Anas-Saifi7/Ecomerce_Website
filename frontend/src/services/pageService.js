import { get, post, put, del } from './api.js';

export const getPages = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/pages${qs ? `?${qs}` : ''}`);
};
export const getPage = (idOrSlug) => get(`/pages/${idOrSlug}`, { auth: false });
export const createPage = (data) => post('/pages', data);
export const updatePage = (id, data) => put(`/pages/${id}`, data);
export const deletePage = (id) => del(`/pages/${id}`);

export default {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
};
