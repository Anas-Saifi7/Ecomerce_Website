export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const UPLOADS_BASE =
  import.meta.env.VITE_UPLOADS_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, '');
