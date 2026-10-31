export const ADMIN_STORAGE_KEY = "Halla Bol_admin_data";

export const adminMenu = [
  ["Dashboard", "▦", "/admin"],
  ["Orders", "▣", "/admin/orders"],
  ["Products", "◇", "/admin/products"],
  ["Inventory", "▤", "/admin/inventory"],
  ["Categories", "▱", "/admin/categories"],
  ["Customers", "♙", "/admin/customers"],
  ["Enquiries", "▧", "/admin/enquiries"],
  ["Blog Posts", "▤", "/admin/blog"],
  // ["Pages & Content", "▥", "/admin/pages"],
  ["Banners", "▧", "/admin/banners"],
  ["Reviews", "☆", "/admin/reviews"],
  ["Offers & Coupons", "◇", "/admin/offers"],
  ["Newsletter", "✉", "/admin/newsletter"],
  ["Analytics", "⌁", "/admin/analytics"],
  ["Export & Wholesale", "◎", "/admin/export"],
  ["Settings", "⚙", "/admin/settings"],
];

export function loadAdminData() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) return defaultAdminData;

    const parsed = JSON.parse(stored);

    return {
      ...defaultAdminData,
      ...parsed,
      summary: {
        ...defaultAdminData.summary,
        ...(parsed.summary || {}),
      },
      orders: Array.isArray(parsed.orders) ? parsed.orders : defaultAdminData.orders,
      products: Array.isArray(parsed.products) ? parsed.products : defaultAdminData.products,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : defaultAdminData.enquiries,
      sales: { ...defaultAdminData.sales, ...(parsed.sales || {}) },
      locations: Array.isArray(parsed.locations) ? parsed.locations : defaultAdminData.locations,
    };
  } catch {
    return defaultAdminData;
  }
}

export function saveAdminData(data) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("Halla BolAdminUpdate"));
}
