export const sidebarItems = [
  { label: "Dashboard", icon: "⌂" },
  { label: "My Orders", icon: "▣" },
  { label: "My Addresses", icon: "⌖" },
  { label: "My Wishlist", icon: "♡" },
  { label: "My Reviews", icon: "☆" },
  { label: "Personal Information", icon: "♙" },
  { label: "Security", icon: "▢" },
  { label: "Notifications", icon: "♧" },
  { label: "Payment Methods", icon: "▤" },
  { label: "Support", icon: "◉" },
];

export const orders = [
  {
    id: "#M12567",
    date: "15 Nov 2024",
    images: [
      "/images/product-1.jpg",
      "/images/product-2.jpg",
      "/images/product-4.jpg",
    ],
    total: "₹ 139.70",
    status: "In Transit",
  },
  {
    id: "#M12345",
    date: "02 Nov 2024",
    images: [
      "/images/product-3.jpg",
      "/images/product-5.jpg",
      "/images/blog-green-tea.jpg",
    ],
    total: "₹ 85.00",
    status: "Delivered",
  },
  {
    id: "#M12011",
    date: "18 Oct 2024",
    images: ["/images/product-2.jpg", "/images/product-3.jpg"],
    total: "₹ 62.00",
    status: "Delivered",
  },
  {
    id: "#M11890",
    date: "05 Oct 2024",
    images: [
      "/images/blog-handloom.jpg",
      "/images/category-5.jpg",
      "/images/blog-farmer.jpg",
    ],
    total: "₹ 120.00",
    status: "Cancelled",
  },
];

export const initialAddresses = [
  {
    id: 1,
    title: "Home (Default)",
    name: "Jhon doe",
    address: ["Shien baag delhi"],
    phone: "+91 ##########",
    icon: "⌂",
    default: true,
  },
  {
    id: 2,
    title: "Office",
    name: "jhon Doe",
    address: ["Gurgaon"],
    phone: "+91 #########",
    icon: "▥",
    default: false,
  },
];

export const initialWishlist = [
  {
    id: 1,
    name: "Organic Turmeric Powder",
    price: "₹ 12.00",
    image: "/images/product-1.jpg",
  },
  {
    id: 2,
    name: "Mixed Indian Spices",
    price: "₹ 18.00",
    image: "/images/product-2.jpg",
  },
  {
    id: 3,
    name: "Handloom Silk Saree",
    price: "₹ 85.00",
    image: "/images/product-4.jpg",
  },
  {
    id: 4,
    name: "Traditional Pottery Set",
    price: "₹ 35.00",
    image: "/images/category-5.jpg",
  },
];

export const initialProfile = {
  name: "Jhon Doe",
  email: "anas@example.com",
  phone: "+91 #######",
};

export const initialReviews = [
  {
    id: 1,
    productName: "Organic Turmeric Powder",
    rating: 5,
    date: "4 Nov 2024",
    comment: "Excellent quality product. Very fresh and authentic.",
  },
  {
    id: 2,
    productName: "Mixed Indian Spices",
    rating: 5,
    date: "28 Oct 2024",
    comment: "Wonderful aroma and great quality.",
  },
  {
    id: 3,
    productName: "Handloom Silk Saree",
    rating: 4,
    date: "19 Oct 2024",
    comment: "Beautiful craftsmanship and a lovely design.",
  },
];

export const initialPaymentMethods = [
  {
    id: 1,
    type: "VISA",
    lastFour: "XXXX",
    expiry: "XXXX",
    isDefault: true,
  },
];

export const initialNotificationPreferences = {
  emailNotifications: true,
  orderUpdates: true,
  offersPromotions: true,
};
