import { get, post, put, del } from './api.js';

const toQuery = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
};

export const createEnquiry = (data) =>
  post('/enquiries', data, { auth: false });

export const getEnquiries = (params) => get(`/enquiries${toQuery(params)}`);
export const getEnquiry = (id) => get(`/enquiries/${id}`);
export const updateEnquiry = (id, data) => put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => del(`/enquiries/${id}`);

export default {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
