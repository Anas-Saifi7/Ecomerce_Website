import { STORAGE_KEYS } from '../components/config/storageKeys.js';
import { getProductPrice } from './currency.js';

const LEGACY_CART_KEYS = ['Halla_cart', 'cart key '];

const isBrowser = typeof window !== 'undefined';

export const getCart = () => {
  if (!isBrowser) return [];

  try {
    const currentCart = localStorage.getItem(STORAGE_KEYS.CART);

    if (currentCart !== null) {
      const parsed = JSON.parse(currentCart);
      return Array.isArray(parsed) ? parsed : [];
    }

    for (const key of LEGACY_CART_KEYS) {
      const oldCart = localStorage.getItem(key);

      if (oldCart) {
        const parsed = JSON.parse(oldCart);

        if (Array.isArray(parsed)) {
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(parsed));
          return parsed;
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  if (!isBrowser) return;

  if (!Array.isArray(cart)) {
    throw new Error('Cart must be an array.');
  }

  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const addToCart = (product, quantity = 1, size = 'Standard', currency = 'INR') => {
  if (!product || product.id == null) {
    throw new Error('Valid product is required.');
  }

  if (product.inStock === false) {
    throw new Error('Product is out of stock.');
  }

  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const cart = getCart();

  const priceINR = Number(product.priceINR ?? (currency === 'INR' ? product.price : 0)) || 0;
  const priceUSD = Number(product.priceUSD ?? (currency === 'USD' ? product.price : 0)) || 0;
  const displayPrice = getProductPrice(
    { ...product, priceINR, priceUSD },
    currency
  );

  const existingIndex = cart.findIndex(
    (item) =>
      String(item.id) === String(product.id) &&
      (item.size || 'Standard') === size
  );

  if (existingIndex !== -1) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity:
        Math.max(1, Number(cart[existingIndex].quantity) || 1) + safeQuantity,
      priceINR: priceINR || cart[existingIndex].priceINR,
      priceUSD: priceUSD || cart[existingIndex].priceUSD,
      price: displayPrice || cart[existingIndex].price,
    };
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: displayPrice,
      priceINR,
      priceUSD,
      oldPrice: product.oldPrice ?? null,
      size,
      quantity: safeQuantity,
      tags: product.tags ?? [],
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
    });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (id, size = 'Standard') => {
  const cart = getCart().filter(
    (item) =>
      !(String(item.id) === String(id) && (item.size || 'Standard') === size)
  );
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (id, size = 'Standard', quantity) => {
  const safeQuantity = Math.floor(Number(quantity));

  if (!Number.isFinite(safeQuantity) || safeQuantity < 1) {
    return removeFromCart(id, size);
  }

  const cart = getCart().map((item) =>
    String(item.id) === String(id) && (item.size || 'Standard') === size
      ? { ...item, quantity: safeQuantity }
      : item
  );

  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + Math.max(0, Number(item.quantity) || 0),
    0
  );
};

export const getCartTotal = (currency = 'INR') => {
  return getCart().reduce((total, item) => {
    const unit =
      currency === 'USD'
        ? Number(item.priceUSD ?? item.price) || 0
        : Number(item.priceINR ?? item.price) || 0;
    return total + Math.max(0, unit) * Math.max(0, Number(item.quantity) || 0);
  }, 0);
};

/** Recalculate display `price` on cart items for the selected currency. */
export const syncCartPrices = (currency = 'INR') => {
  const cart = getCart().map((item) => ({
    ...item,
    price:
      currency === 'USD'
        ? Number(item.priceUSD ?? item.price) || 0
        : Number(item.priceINR ?? item.price) || 0,
  }));
  saveCart(cart);
  return cart;
};
