import { get, post, put, del } from './api.js';

export const register = (data) => post('/auth/register', data, { auth: false });
export const login = (data) => post('/auth/login', data, { auth: false });
export const adminLogin = (data) =>
  post('/auth/admin/login', data, { auth: false });
export const logout = () => post('/auth/logout', {});
export const getMe = () => get('/auth/me');
export const updateMe = (data) => put('/auth/me', data);
export const updatePassword = (data) => put('/auth/password', data);
export const forgotPassword = (email) =>
  post('/auth/forgot-password', { email }, { auth: false });
export const resetPassword = (token, password) =>
  post(`/auth/reset-password/${token}`, { password }, { auth: false });

export const getAddresses = () => get('/auth/addresses');
export const addAddress = (data) => post('/auth/addresses', data);
export const updateAddress = (addressId, data) =>
  put(`/auth/addresses/${addressId}`, data);
export const deleteAddress = (addressId) =>
  del(`/auth/addresses/${addressId}`);

export default {
  register,
  login,
  adminLogin,
  logout,
  getMe,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
