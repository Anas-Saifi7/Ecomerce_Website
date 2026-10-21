import { get, post, del } from './api.js';

export const subscribe = (email) =>
  post('/newsletter/subscribe', { email }, { auth: false });

export const getSubscribers = () => get('/newsletter');
export const unsubscribe = (email) => del(`/newsletter/${encodeURIComponent(email)}`);

export default { subscribe, getSubscribers, unsubscribe };
