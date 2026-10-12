export const supportFaqs = [
  {
    question: "How can I track my order?",
    answer:
      "Go to the Track Order page and enter your order details. If tracking information is available, you will be able to view the latest shipment status.",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "If your order has not been processed or shipped, cancellation may be possible. Please contact our support team as soon as possible with your order number.",
  },
  {
    question: "How do I return a product?",
    answer:
      "Please review our Return & Refund policy and contact support with your order number and reason for return. Our team will guide you through the applicable process.",
  },
  {
    question: "My product arrived damaged. What should I do?",
    answer:
      "Contact our support team as soon as possible. Please keep the original packaging and provide clear photos or videos of the package and damaged product if requested.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "After an eligible return is received and approved, the refund will be initiated. The time for the amount to appear in your account depends on the payment provider or bank.",
  },
  {
    question: "How can I change my delivery address?",
    answer:
      "Contact support as quickly as possible if you need to change your delivery address. Changes may not be possible once the order has been dispatched.",
  },
];

export const supportCategories = [
  {
    icon: "📦",
    title: "Orders & Delivery",
    description:
      "Questions about your order, delivery status, tracking or address.",
    link: "/track-order",
    linkText: "Track Order →",
  },
  {
    icon: "↩",
    title: "Returns & Refunds",
    description:
      "Get help with returns, replacements, damaged items and refunds.",
    link: "/return-refund",
    linkText: "Return Policy →",
  },
  {
    icon: "🚚",
    title: "Shipping",
    description:
      "Learn about processing times, delivery and shipping information.",
    link: "/shipping-policy",
    linkText: "Shipping Policy →",
  },
  {
    icon: "💬",
    title: "General Support",
    description:
      "Can't find what you need? Send us a message and our team will help.",
    link: "/support#contact-support",
    linkText: "Contact Us →",
  },
];

export const supportQuickActions = [
  {
    icon: "📍",
    title: "Track My Order",
    description: "Check your latest order status.",
    link: "/track-order",
  },
  {
    icon: "↩",
    title: "Return & Refund",
    description: "Get help with returns and refunds.",
    link: "/return-refund",
  },
  {
    icon: "🚚",
    title: "Shipping Information",
    description: "Learn about delivery and shipping.",
    link: "/shipping-policy",
  },
];

export const supportContactInfo = {
  email: "support@Halla Bol.com",
  days: "Monday – Saturday",
  hours: "10:00 AM – 6:00 PM",
  responseTime: "We aim to respond as soon as possible during support hours.",
};

export const supportSubjects = [
  { value: "Order", label: "Order Issue" },
  { value: "Shipping", label: "Shipping & Delivery" },
  { value: "Return", label: "Return & Refund" },
  { value: "Product", label: "Product Question" },
  { value: "Payment", label: "Payment Issue" },
  { value: "Other", label: "Other" },
];

export const supportImages = {
  hero: "/images/Export_SupportHero.jpg",
};

export const SUPPORT_STORAGE_KEY = "Halla Bol_support_enquiries";

export function getSupportEnquiries() {
  try {
    const saved = localStorage.getItem(SUPPORT_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSupportEnquiry(formData) {
  const enquiries = getSupportEnquiries();

  const enquiry = {
    ...formData,
    id: `ENQ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "New",
  };

  localStorage.setItem(
    SUPPORT_STORAGE_KEY,
    JSON.stringify([enquiry, ...enquiries])
  );

  return enquiry;
}