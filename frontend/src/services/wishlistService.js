import { get, post, del } from './api.js';

export const getWishlist = () => get('/wishlist');
export const addToWishlist = (productId) =>
  post('/wishlist', { productId });
export const removeFromWishlist = (productId) =>
  del(`/wishlist/${productId}`);

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
