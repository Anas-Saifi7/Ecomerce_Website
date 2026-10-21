import { get, patch } from './api.js';

export const getDashboard = () => get('/admin/dashboard');
export const getCustomers = (params = {}) => get(`/admin/customers${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
export const updateCustomerStatus = (id, isActive) => patch(`/admin/customers/${id}/status`, { isActive });

export default { getDashboard, getCustomers, updateCustomerStatus };
