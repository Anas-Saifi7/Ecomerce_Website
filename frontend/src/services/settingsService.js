import { get, put } from './api.js';

export const getSettings = () => get('/settings', { auth: false });
export const updateSettings = (data) => put('/settings', data);

export default { getSettings, updateSettings };
