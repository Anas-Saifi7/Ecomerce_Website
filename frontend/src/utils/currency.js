export const CURRENCIES = ['INR', 'USD'];

export function getStoredCurrency() {
  try {
    const value = localStorage.getItem('Halla Bol_currency');
    return value === 'USD' ? 'USD' : 'INR';
  } catch {
    return 'INR';
  }
}

export function getProductPrice(product, currency = 'INR') {
  if (!product) return 0;
  if (currency === 'USD') {
    return Number(product.priceUSD ?? product.price ?? 0) || 0;
  }
  return Number(product.priceINR ?? product.price ?? 0) || 0;
}

export function getProductOldPrice(product, currency = 'INR') {
  if (!product) return null;
  if (currency === 'USD') {
    const v = product.oldPriceUSD ?? product.oldPrice;
    return v == null ? null : Number(v) || null;
  }
  const v = product.oldPriceINR ?? product.oldPrice;
  return v == null ? null : Number(v) || null;
}

export function formatMoney(amount, currency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}
