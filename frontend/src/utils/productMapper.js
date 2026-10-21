import { UPLOADS_BASE } from '../config/api.js';
import { getProductOldPrice, getProductPrice } from './currency.js';

const FALLBACK_IMAGES = [
  '/images/product-1.jpg',
  '/images/product-2.jpg',
  '/images/product-3.jpg',
  '/images/product-4.jpg',
  '/images/product-5.jpg',
  '/images/product-6.jpg',
];

export function resolveImageUrl(src, fallbackIndex = 0) {
  if (!src) return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  if (src.startsWith('http') || src.startsWith('/')) return src;
  if (src.startsWith('uploads/') || src.startsWith('uploads\\')) {
    return `${UPLOADS_BASE}/${src.replace(/\\/g, '/')}`;
  }
  return `/images/${src}`;
}

export function mapApiProduct(product, currency = 'INR') {
  if (!product) return null;

  const id = product._id || product.id;
  const imagesRaw = Array.isArray(product.images) && product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const images = imagesRaw.map((img, i) =>
    resolveImageUrl(img, typeof id === 'string' ? id.length + i : Number(id) + i)
  );

  const primary = resolveImageUrl(
    product.image || imagesRaw[0],
    typeof id === 'string' ? id.length : Number(id) || 0
  );

  const categoryName =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : product.category || product.categoryType || '';

  return {
    ...product,
    id,
    _id: product._id || id,
    name: product.name,
    subtitle: product.subtitle || '',
    category: categoryName,
    categoryType: product.categoryType || categoryName,
    region: product.region || '',
    productType: product.productType || 'Retail',
    certifications: product.certifications || [],
    tags: product.tags || [],
    priceINR: Number(product.priceINR ?? product.price ?? 0) || 0,
    priceUSD: Number(product.priceUSD ?? product.price ?? 0) || 0,
    oldPriceINR: product.oldPriceINR ?? product.oldPrice ?? null,
    oldPriceUSD: product.oldPriceUSD ?? product.oldPrice ?? null,
    price: getProductPrice(product, currency),
    oldPrice: getProductOldPrice(product, currency),
    image: images[0] || primary,
    images: images.length ? images : [primary],
    inStock: product.inStock != null
      ? Boolean(product.inStock)
      : Number(product.stock ?? 1) > 0,
    stock: Number(product.stock ?? 0),
    rating: product.ratingAvg ?? product.rating ?? 0,
    reviews: product.ratingCount ?? product.reviews ?? 0,
    sold: product.soldCount
      ? `${product.soldCount}+ sold`
      : product.sold || '',
    description: product.description || '',
    benefits: product.benefits || [],
    usage: product.usage || '',
    slug: product.slug,
  };
}

export function mapApiProducts(products, currency = 'INR') {
  if (!Array.isArray(products)) return [];
  return products.map((p) => mapApiProduct(p, currency)).filter(Boolean);
}
