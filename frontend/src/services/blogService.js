import { get, post, put, del } from './api.js';

const toQuery = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
};

export const getPosts = (params) =>
  get(`/blog${toQuery(params)}`);

export const getPost = (idOrSlug) =>
  get(`/blog/${idOrSlug}`, { auth: false });

export const createPost = (data) => post('/blog', data);
export const updatePost = (id, data) => put(`/blog/${id}`, data);
export const deletePost = (id) => del(`/blog/${id}`);

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
