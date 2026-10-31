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
