import { API_BASE_URL } from '../config/api.js';
import { STORAGE_KEYS } from '../components/config/storageKeys.js';

function getToken() {
  try {
    return (
      localStorage.getItem(STORAGE_KEYS.TOKEN) ||
      localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ||
      ''
    );
  } catch {
    return '';
  }
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      res.statusText ||
      'Request failed';
    const error = new Error(Array.isArray(message) ? message.join(', ') : message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    isFormData = false,
  } = options;

  const finalHeaders = { ...headers };

  if (!isFormData && body != null && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: finalHeaders,
    body:
      body == null
        ? undefined
        : isFormData
          ? body
          : typeof body === 'string'
            ? body
            : JSON.stringify(body),
  });

  return parseResponse(res);
}

export const get = (path, options) =>
  apiRequest(path, { ...options, method: 'GET' });

export const post = (path, body, options) =>
  apiRequest(path, { ...options, method: 'POST', body });

export const put = (path, body, options) =>
  apiRequest(path, { ...options, method: 'PUT', body });

export const patch = (path, body, options) =>
  apiRequest(path, { ...options, method: 'PATCH', body });

export const del = (path, options) =>
  apiRequest(path, { ...options, method: 'DELETE' });

export async function apiUpload(path, formData, options = {}) {
  return apiRequest(path, {
    ...options,
    method: options.method || 'POST',
    body: formData,
    isFormData: true,
  });
}

export default {
  get,
  post,
  put,
  patch,
  del,
  apiUpload,
  apiRequest,
};
