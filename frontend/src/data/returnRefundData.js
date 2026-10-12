export const returnPolicy = {
  returnWindowDays: 7,
  title: "Return Policy",
  description:
    "If your product is eligible for return, submit your request within the applicable return period.",
  conditions: [
    "Product should be unused and in its original condition, where applicable.",
    "Retain original packaging, tags and accessories where applicable.",
    "Return requests are subject to review and approval.",
  ],
};

export const refundPolicy = {
  title: "Refund Policy",
  description:
    "After an eligible return is received and approved, the applicable refund will be initiated according to the order and payment method.",
  conditions: [
    "Refunds may be processed after the returned product is inspected.",
    "The time taken for the amount to appear depends on your bank or payment provider.",
    "Shipping charges may not be refundable, depending on the reason for return and applicable policy.",
  ],
};

export const returnEligibility = [
  {
    number: "01",
    title: "Within 7 Days",
    text: "Submit your request within the applicable return period.",
  },
  {
    number: "02",
    title: "Product Condition",
    text: "The product should generally remain unused and in its original condition.",
  },
  {
    number: "03",
    title: "Original Packaging",
    text: "Keep packaging, tags and included accessories where applicable.",
  },
  {
    number: "04",
    title: "Proof of Order",
    text: "Keep your order number or purchase details available.",
  },
];

export const returnSteps = [
  {
    number: "01",
    title: "Contact Us",
    text: "Provide your order number and explain why you want to request a return.",
  },
  {
    number: "02",
    title: "Share Details",
    text: "For damaged, defective or incorrect items, provide clear photos or videos when requested.",
  },
  {
    number: "03",
    title: "Review & Approval",
    text: "The support team reviews your request and confirms the next steps.",
  },
  {
    number: "04",
    title: "Return or Refund",
    text: "After the approved return is completed, the applicable replacement or refund can be processed.",
  },
];

export const nonReturnableItems = [
  "Customized or personalized products",
  "Products that have been used or altered",
  "Items missing original packaging or accessories",
  "Products damaged after delivery due to improper use",
  "Perishable products, where applicable",
  "Items specifically marked as non-returnable",
];

export const returnFaqs = [
  {
    question: "How many days do I have to return a product?",
    answer:
      "The supplied demo policy uses a 7-day return window from delivery, subject to eligibility. Confirm Halla Bol's actual policy before publishing this period.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Contact customer support as soon as possible and share clear photos or videos of the package and product. The team can review the issue and advise on a replacement or refund where applicable.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "After an eligible return is received and approved, the refund can be initiated. The time taken for the amount to appear in your account depends on your bank or payment provider.",
  },
  {
    question: "Can I return a personalized product?",
    answer:
      "Personalized, customized or specially made products may not qualify for standard returns unless they arrive damaged, defective or incorrect, subject to applicable policy and law.",
  },
  {
    question: "Can I exchange a product instead of getting a refund?",
    answer:
      "Exchange availability depends on the product, stock and applicable policy. Contact support with your order details to check available options.",
  },
  {
    question: "How do I start a return request?",
    answer:
      "Use the demo request form on this page or contact the support team. A submitted demo request is saved in this browser only and is not sent to Halla Bol.",
  },
];

export const returnRefundImages = {
  hero: "/images/return-refund-hero.jpg",
  process: "/images/return-refund.jpg",
};

export const returnRefundStorageKey = "Halla Bol_return_requests";

export function getReturnRequests() {
  try {
    const stored = localStorage.getItem(returnRefundStorageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReturnRequest(request) {
  const requests = getReturnRequests();

  const newRequest = {
    ...request,
    id: `RET-${Date.now()}`,
    status: "Demo request submitted",
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    returnRefundStorageKey,
    JSON.stringify([newRequest, ...requests])
  );

  return newRequest;
}