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
  ["Pages & Content", "▥", "/admin/pages"],
  ["Banners", "▧", "/admin/banners"],
  ["Reviews", "☆", "/admin/reviews"],
  ["Offers & Coupons", "◇", "/admin/offers"],
  ["Newsletter", "✉", "/admin/newsletter"],
  ["Analytics", "⌁", "/admin/analytics"],
  ["Export & Wholesale", "◎", "/admin/export"],
  ["Settings", "⚙", "/admin/settings"],
];

export const defaultAdminData = {
  summary: {
    totalOrders: 1248,
    totalRevenue: 842350,
    totalCustomers: 3620,
  },

  orders: [
    { id: "#MO12648", image: "/images/product-3.jpg", items: 2, amount: 1250, status: "Delivered", time: "2 mins ago" },
    { id: "#MO12647", image: "/images/product-5.jpg", items: 1, amount: 890, status: "Processing", time: "12 mins ago" },
    { id: "#MO12646", image: "/images/product-1.jpg", items: 3, amount: 2340, status: "Shipped", time: "1 hour ago" },
    { id: "#MO12645", image: "/images/product-3.jpg", items: 1, amount: 450, status: "Delivered", time: "2 hours ago" },
    { id: "#MO12644", image: "/images/product-2.jpg", items: 4, amount: 3120, status: "Processing", time: "3 hours ago" },
  ],

  products: [
    { id: 1, name: "Turmeric Powder (Organic)", category: "Spices", sold: 320, revenue: 95680, stock: 80, image: "/images/product-1.jpg" },
    { id: 2, name: "A2 Desi Cow Ghee", category: "Superfoods", sold: 210, revenue: 126000, stock: 42, image: "/images/product-3.jpg" },
    { id: 3, name: "Red Chilli Powder", category: "Spices", sold: 185, revenue: 46250, stock: 55, image: "/images/product-2.jpg" },
    { id: 4, name: "Organic Honey", category: "Natural Sweeteners", sold: 160, revenue: 72000, stock: 34, image: "/images/product-3.jpg" },
    { id: 5, name: "Moringa Powder", category: "Herbs & Wellness", sold: 140, revenue: 49000, stock: 15, image: "/images/product-5.jpg" },
    { id: 6, name: "Saffron (Kesar)", category: "Spices", sold: 98, revenue: 38000, stock: 8, image: "/images/region-kashmir.jpg" },
    { id: 7, name: "Organic Tulsi Leaves", category: "Herbs & Wellness", sold: 82, revenue: 24600, stock: 12, image: "/images/product-5.jpg" },
    { id: 8, name: "Ashwagandha Powder", category: "Herbs & Wellness", sold: 76, revenue: 22800, stock: 15, image: "/images/product-5.jpg" },
    { id: 9, name: "Cardamom (Elaichi)", category: "Spices", sold: 70, revenue: 21000, stock: 18, image: "/images/product-2.jpg" },
    { id: 10, name: "Black Pepper", category: "Spices", sold: 65, revenue: 19500, stock: 20, image: "/images/product-2.jpg" },
  ],

  enquiries: [
    { id: 1, name: "Priya Sharma", type: "Bulk Order", message: "Looking for turmeric in bulk (1 ton)", date: "Oct 5, 2026", status: "New" },
    { id: 2, name: "Global Foods LLC", type: "Export Enquiry", message: "Interested in spices for USA market", date: "Oct 5, 2026", status: "In Progress" },
    { id: 3, name: "Ramesh Kumar", type: "Distribution", message: "Want to be a distributor in Maharashtra", date: "Oct 4, 2026", status: "Replied" },
    { id: 4, name: "Sara Wilson", type: "Private Label", message: "Custom packaging for our brand", date: "Oct 4, 2026", status: "New" },
    { id: 5, name: "Ahmed Khan", type: "Business Collaboration", message: "Partnership for Middle East market", date: "Oct 3, 2026", status: "Replied" },
  ],

  sales: {
    "7 Days": [45000, 72000, 68000, 82000, 118000, 97000, 110000],
    "30 Days": [52000, 68000, 74000, 61000, 92000, 84000, 106000],
    "6 Months": [82000, 94000, 76000, 112000, 128000, 142000, 156000],
    "1 Year": [62000, 76000, 90000, 84000, 120000, 145000, 170000],
  },

  locations: [
    { name: "India", percent: 68 },
    { name: "USA", percent: 12 },
    { name: "UAE", percent: 8 },
    { name: "UK", percent: 5 },
    { name: "Others", percent: 7 },
  ],
};

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
