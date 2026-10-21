import Order from '../models/Order.js';

const generateOrderNumber = async () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = String(Math.floor(1000 + Math.random() * 9000));
    const orderNumber = `HB-${datePart}-${suffix}`;
    const exists = await Order.exists({ orderNumber });
    if (!exists) return orderNumber;
  }

  const fallback = `HB-${datePart}-${Date.now().toString().slice(-4)}`;
  return fallback;
};

export default generateOrderNumber;
