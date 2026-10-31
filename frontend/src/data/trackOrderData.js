export const LAST_ORDER_KEY = "last_order";
export const WISHLIST_KEY = "shlist";

export const ORDER_STORAGE_KEYS = [
  LAST_ORDER_KEY,
  "Halla Bol_last_order",
  "Halla Bol_orders",
  "orders",
];

export const fallbackRecommendations = [
  {
    id: 3,
    name: "Pure Organic Honey",
    rating: "4.9",
    reviews: "150",
    price: 20,
    image: "/images/product-3.webp",
  },
  {
    id: 9,
    name: "Organic Green Tea",
    rating: "4.6",
    reviews: "95",
    price: 15,
    image: "/images/blog-green-tea.webp",
  },
  {
    id: 5,
    name: "Handcrafted Wooden Decor",
    rating: "4.5",
    reviews: "60",
    price: 45,
    image: "/images/product-5.webp",
  },
  {
    id: 6,
    name: "Aromatherapy Essential Oils",
    rating: "4.8",
    reviews: "110",
    price: 22,
    image: "/images/product-6.webp",
  },
  {
    id: 8,
    name: "Traditional Pottery Set",
    rating: "4.7",
    reviews: "75",
    price: 35,
    image: "/images/category-5.webp",
  },
  {
    id: 10,
    name: "Handcrafted Home Decor",
    rating: "4.6",
    reviews: "68",
    price: 28,
    image: "/images/product-5.webp",
  },
];

export function formatCurrency(value) {
  return `₹ ${Number(value || 0).toFixed(2)}`;
}

export function normalizeOrder(savedOrder) {
  const rawItems =
    savedOrder?.items ??
    savedOrder?.products ??
    savedOrder?.cart ??
    [];

  const items = Array.isArray(rawItems)
    ? rawItems.map((item, index) => ({
        id: item.id ?? item.productId ?? index + 1,
        name: item.name ?? item.title ?? "Halla Bol Product",
        detail: item.detail ?? item.size ?? item.subtitle ?? "Standard",
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        price: Number(item.price ?? item.salePrice ?? 0),
        image: item.image ?? "/images/product-1.webp",
      }))
    : [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost = Number(
    savedOrder?.shippingCost ?? savedOrder?.shipping ?? 0
  );

  const tax = Number(savedOrder?.tax ?? 0);

  const total = Number(
    savedOrder?.total ??
      savedOrder?.grandTotal ??
      subtotal + shippingCost + tax
  );

  const savedEvents = Array.isArray(savedOrder?.trackingEvents)
    ? savedOrder.trackingEvents
    : [];

  return {
    ...savedOrder,

    orderNumber:
      savedOrder?.orderNumber ??
      savedOrder?.orderId ??
      savedOrder?.id ??
      "",

    placedAt:
      savedOrder?.placedAt ??
      savedOrder?.createdAt ??
      savedOrder?.orderDate ??
      "Date unavailable",

    status: savedOrder?.status ?? "Order Confirmed",

    trackingId: savedOrder?.trackingId ?? "",
    courier: savedOrder?.courier ?? "Not assigned",
    shippingMethod: savedOrder?.shippingMethod ?? "Standard Shipping",
    estimatedDelivery: savedOrder?.estimatedDelivery ?? "Not available",
    location: savedOrder?.location ?? "Not available",
    destination: savedOrder?.destination ?? "Not available",

    customer: {
      ...(savedOrder?.customer ?? {}),
      ...(savedOrder?.shippingAddress ?? {}),
    },

    paymentMethod: savedOrder?.paymentMethod ?? "Not available",
    shippingCost,
    tax,
    total,
    items,

    trackingEvents: savedEvents,
    isDemo: false,
  };
}

export function getStoredOrders() {
  if (typeof window === "undefined") return [];

  const collected = [];

  for (const key of ORDER_STORAGE_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        collected.push(...parsed);
      } else if (parsed && typeof parsed === "object") {

        if (Array.isArray(parsed.orders)) {
          collected.push(...parsed.orders);
        } else {
          collected.push(parsed);
        }
      }
    } catch (error) {
      console.warn(`Could not read order data from "${key}".`, error);
    }
  }

  const unique = new Map();

  collected.forEach((order, index) => {
    const normalized = normalizeOrder(order);
    const key =
      String(normalized.orderNumber || "").trim() ||
      `unknown-${index}`;

    if (normalized.orderNumber) unique.set(key, normalized);
  });

  return [...unique.values()];
}

export function getLatestOrder() {
  return getStoredOrders()[0] ?? null;
}

export function findOrderByNumber(orderNumber) {
  const query = String(orderNumber ?? "").trim().toLowerCase();

  if (!query) return null;

  const savedOrder = getStoredOrders().find(
    (order) =>
      String(order.orderNumber).trim().toLowerCase() === query
  );

  if (savedOrder) return savedOrder;

  // M12567 is a sample order for frontend testing only.
  if (query === demoOrder.orderNumber.toLowerCase()) {
    return demoOrder;
  }

  return null;
}