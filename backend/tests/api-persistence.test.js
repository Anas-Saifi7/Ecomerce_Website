import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';

dotenv.config();

test('API persists products and orders and reflects cancellation in stock', { skip: !process.env.MONGO_URI }, async () => {
  const dbUrl = new URL(process.env.MONGO_URI);
  const databaseName = `molog_api_test_${randomUUID().replaceAll('-', '')}`;
  dbUrl.pathname = `/${databaseName}`;
  const mongoUri = dbUrl.toString();
  const port = 5100 + Math.floor(Math.random() * 500);
  const secret = `isolated-test-${randomUUID()}-secret`;
  const adminPassword = 'Temporary-Test-Password-123';
  let server;

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 7000 });
    const admin = await User.create({ name: 'Temporary Test Admin', email: `admin-${randomUUID()}@example.test`, password: adminPassword, role: 'admin' });
    const category = await Category.create({ name: 'Temporary Test Category', description: 'Isolated API test' });
    await mongoose.disconnect();

    server = spawn(process.execPath, ['server.js'], {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      env: { ...process.env, MONGO_URI: mongoUri, JWT_SECRET: secret, PORT: String(port), FRONTEND_URL: `http://localhost:${port}`, SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '', CLOUDINARY_CLOUD_NAME: '', CLOUDINARY_API_KEY: '', CLOUDINARY_API_SECRET: '', RAZORPAY_KEY_ID: '', RAZORPAY_KEY_SECRET: '', RAZORPAY_WEBHOOK_SECRET: '' },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let startupOutput = '';
    server.stdout.on('data', (chunk) => { startupOutput += chunk.toString(); });
    server.stderr.on('data', (chunk) => { startupOutput += chunk.toString(); });
    const base = `http://127.0.0.1:${port}/api/v1`;
    let healthy = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (server.exitCode !== null) throw new Error(`API server exited during startup (${server.exitCode}): ${startupOutput}`);
      try { const response = await fetch(`http://127.0.0.1:${port}/api/health`); if (response.ok) { healthy = true; break; } } catch { }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.equal(healthy, true, 'isolated API server becomes healthy');
    const paymentConfig = await fetch(`http://127.0.0.1:${port}/api/v1/payments/config`).then((response) => response.json());
    assert.equal(paymentConfig.razorpayEnabled, false, 'public payment config exposes only gateway availability when secrets are absent');
    assert.equal(Object.hasOwn(paymentConfig, 'keySecret'), false, 'public payment config never exposes gateway secrets');

    const request = async (path, { method = 'GET', token, body } = {}) => {
      const response = await fetch(`${base}${path}`, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
      const payload = await response.json();
      assert.equal(response.ok, true, `${method} ${path} returned ${response.status}: ${payload.message || ''}`);
      return payload;
    };
    const adminLogin = await request('/auth/admin/login', { method: 'POST', body: { email: admin.email, password: adminPassword } });
    const adminToken = adminLogin.token;
    const productName = `API persistence test ${randomUUID()}`;
    const createdProduct = await request('/products', { method: 'POST', token: adminToken, body: { name: productName, category: category._id.toString(), priceINR: 125, priceUSD: 2, stock: 3, image: '/images/product-1.jpg' } });
    const productId = createdProduct.product._id;
    await request(`/products/${productId}`, { method: 'PUT', token: adminToken, body: { priceINR: 130 } });
    const catalog = await request('/products?search=' + encodeURIComponent(productName));
    assert.equal(catalog.products.some((product) => product._id === productId), true, 'created product appears in customer catalog');
    assert.equal(catalog.products.find((product) => product._id === productId).priceINR, 130, 'admin price update is visible to customers');

    const customerEmail = `customer-${randomUUID()}@example.test`;
    const customer = await request('/auth/register', { method: 'POST', body: { name: 'Temporary Test Customer', email: customerEmail, password: 'Temporary-Customer-Password-123' } });
    await request('/wishlist', { method: 'POST', token: customer.token, body: { productId } });
    const customerWishlist = await request('/wishlist', { token: customer.token });
    assert.equal(customerWishlist.wishlist.some((product) => product._id === productId), true, 'authenticated wishlist is shared through MongoDB');
    const forbiddenProductEdit = await fetch(`${base}/products/${productId}`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${customer.token}` }, body: JSON.stringify({ priceINR: 1 }) });
    assert.equal(forbiddenProductEdit.status, 403, 'customer role cannot perform product administration');
    const preferenceUpdate = await request('/auth/me', { method: 'PUT', token: customer.token, body: { preferences: { emailNotifications: false, orderUpdates: true, offersPromotions: false } } });
    assert.equal(preferenceUpdate.user.preferences.emailNotifications, false, 'customer notification preferences persist');
    const review = await request(`/reviews/product/${productId}`, { method: 'POST', token: customer.token, body: { rating: 5, title: 'Test review', comment: 'Good product' } });
    assert.equal(review.review.isApproved, false, 'customer reviews enter moderation before publication');
    const customerReviews = await request('/reviews/mine', { token: customer.token });
    assert.equal(customerReviews.reviews.some((entry) => entry._id === review.review._id), true, 'customer account lists its submitted reviews');
    const moderated = await request(`/reviews/${review.review._id}`, { method: 'PATCH', token: adminToken, body: { isApproved: true } });
    assert.equal(moderated.review.isApproved, true, 'admin can approve customer review');
    const publicReviews = await request(`/reviews/product/${productId}`);
    assert.equal(publicReviews.reviews.some((entry) => entry._id === review.review._id), true, 'approved review becomes public');
    const blogPost = await request('/blog', { method: 'POST', token: adminToken, body: { title: `Draft ${randomUUID()}`, content: 'Test content', isPublished: false } });
    const publicBlog = await request('/blog');
    assert.equal(publicBlog.posts.some((entry) => entry._id === blogPost.post._id), false, 'unpublished blog content remains private');
    const adminBlog = await request('/blog?all=true', { token: adminToken });
    assert.equal(adminBlog.posts.some((entry) => entry._id === blogPost.post._id), true, 'admin can review unpublished blog drafts');
    const banner = await request('/banners', { method: 'POST', token: adminToken, body: { title: 'Test banner', image: 'https://example.test/banner.png', isActive: false } });
    const publicBanners = await request('/banners');
    assert.equal(publicBanners.banners.some((entry) => entry._id === banner.banner._id), false, 'inactive banners remain private');
    const coupon = await request('/coupons', { method: 'POST', token: adminToken, body: { code: `T${randomUUID().slice(0, 8)}`, type: 'percent', value: 10, currency: 'INR' } });
    assert.ok(coupon.coupon._id, 'admin coupon CRUD writes to MongoDB');
    const subscriberEmail = `newsletter-${randomUUID()}@example.test`;
    await request('/newsletter/subscribe', { method: 'POST', body: { email: subscriberEmail } });
    const subscribers = await request('/newsletter', { token: adminToken });
    assert.equal(subscribers.subscribers.some((entry) => entry.email === subscriberEmail), true, 'newsletter subscription appears in admin');
    await request('/settings', { method: 'PUT', token: adminToken, body: { storeName: 'Isolated Test Store', lowStockThreshold: 4 } });
    const savedSettings = await request('/settings');
    assert.equal(savedSettings.settings.storeName, 'Isolated Test Store', 'admin store settings persist and are available to the storefront');
    await request('/enquiries', { method: 'POST', body: { type: 'wholesale', name: 'Temporary Buyer', email: `buyer-${randomUUID()}@example.test`, message: 'Wholesale test request' } });
    const wholesaleEnquiries = await request('/enquiries?type=wholesale', { token: adminToken });
    assert.ok(wholesaleEnquiries.enquiries.some((entry) => entry.type === 'wholesale'), 'wholesale enquiries appear in admin management');
    const supportMessage = await request('/enquiries', { method: 'POST', body: { type: 'support', name: 'Temporary Buyer', email: customerEmail, subject: 'Support flow', message: 'API support integration test' } });
    const adminSupport = await request('/enquiries?type=support', { token: adminToken });
    assert.ok(adminSupport.enquiries.some((entry) => entry._id === supportMessage.enquiry._id), 'customer support submissions persist and appear in admin');
    const page = await request('/pages', { method: 'POST', token: adminToken, body: { title: `Draft page ${randomUUID()}`, content: 'Private draft', isPublished: false } });
    const privatePage = await fetch(`${base}/pages/${page.page.slug}`);
    assert.equal(privatePage.status, 404, 'unpublished page is hidden from public reads');
    const publicPages = await request('/pages?all=true');
    assert.equal(publicPages.pages.some((entry) => entry._id === page.page._id), false, 'public page listing cannot expose drafts through query flags');
    const adminPages = await request('/pages?all=true', { token: adminToken });
    assert.equal(adminPages.pages.some((entry) => entry._id === page.page._id), true, 'admin can manage unpublished page drafts');
    const analytics = await request('/admin/analytics', { token: adminToken });
    assert.ok(analytics.analytics.dailySales, 'analytics endpoint returns aggregated sales data');
    const unauthorizedAnalytics = await fetch(`${base}/admin/analytics`);
    assert.equal(unauthorizedAnalytics.status, 401, 'analytics endpoint requires admin authentication');
    const resetRequest = await request('/auth/forgot-password', { method: 'POST', body: { email: customerEmail } });
    assert.match(resetRequest.message, /If that email exists/);
    assert.equal(Object.hasOwn(resetRequest, 'resetToken'), false, 'reset tokens are never returned to callers');
    const razorpayUnavailable = await fetch(`${base}/payments/razorpay/verify`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${customer.token}` }, body: JSON.stringify({ razorpay_order_id: 'order_test', razorpay_payment_id: 'pay_test', razorpay_signature: '00' }) });
    assert.equal(razorpayUnavailable.status, 503, 'payment verification fails closed without gateway credentials');
    const uploadBody = new FormData(); uploadBody.append('images', new Blob(['not really an image'], { type: 'image/png' }), 'test.png');
    const uploadUnavailable = await fetch(`${base}/uploads/products`, { method: 'POST', headers: { authorization: `Bearer ${adminToken}` }, body: uploadBody });
    assert.equal(uploadUnavailable.status, 503, 'image upload fails closed without durable storage credentials');
    const customerRecords = await request(`/admin/customers?search=${encodeURIComponent(customerEmail)}`, { token: adminToken });
    assert.equal(customerRecords.customers.length, 1, 'admin customer list reads registered customer data');
    const savedAddress = await request('/auth/addresses', { method: 'POST', token: customer.token, body: { label: 'Test', fullName: 'Temporary Test Customer', phone: '9876543210', line1: '1 Test Road', city: 'Delhi', state: 'Delhi', postalCode: '110001', country: 'India', isDefault: true } });
    assert.equal(savedAddress.addresses.length, 1, 'customer address is persisted');
    const orderRequest = {
      items: [{ product: productId, quantity: 2 }], currency: 'INR', paymentMethod: 'cod', idempotencyKey: randomUUID(),
      shippingAddress: { fullName: 'Temporary Test Customer', phone: '9876543210', line1: '1 Test Road', city: 'Delhi', state: 'Delhi', postalCode: '110001', country: 'India' },
    };
    const placed = await request('/orders', { method: 'POST', token: customer.token, body: orderRequest });
    assert.ok(placed.order.orderNumber, 'order is assigned a server order number');
    const tracked = await request(`/orders/track/${encodeURIComponent(placed.order.orderNumber)}?email=${encodeURIComponent(customerEmail)}`);
    assert.equal(tracked.order.items[0].product.name, productName, 'order tracking populates the persisted product name');
    assert.equal(tracked.order.items[0].product.image, '/images/product-1.jpg', 'order tracking populates the persisted product image');
    const retry = await request('/orders', { method: 'POST', token: customer.token, body: orderRequest });
    assert.equal(retry.order._id, placed.order._id, 'repeated checkout requests resolve to the original order');
    const customerOrders = await request('/orders/my', { token: customer.token });
    assert.equal(customerOrders.orders.some((order) => order._id === placed.order._id), true, 'customer order is persisted and readable');
    const adminOrders = await request('/orders?search=' + encodeURIComponent(placed.order.orderNumber), { token: adminToken });
    assert.equal(adminOrders.orders.some((order) => order._id === placed.order._id), true, 'customer order appears in admin order list');
    await request(`/orders/${placed.order._id}/status`, { method: 'PATCH', token: adminToken, body: { status: 'processing' } });
    const customerOrderAfterAdminUpdate = await request(`/orders/${placed.order._id}`, { token: customer.token });
    assert.equal(customerOrderAfterAdminUpdate.order.status, 'processing', 'admin order status updates are visible to the customer');

    const stockAfterOrder = await request(`/products/${productId}`);
    assert.equal(stockAfterOrder.product.stock, 1, 'order atomically decrements product stock');
    await request(`/orders/${placed.order._id}/cancel`, { method: 'PATCH', token: customer.token, body: { reason: 'Isolated API test cleanup' } });
    const duplicateCancel = await fetch(`${base}/orders/${placed.order._id}/cancel`, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: `Bearer ${customer.token}` }, body: JSON.stringify({ reason: 'Duplicate cancellation attempt' }) });
    assert.equal(duplicateCancel.status, 400, 'duplicate cancellation is rejected');
    const stockAfterCancel = await request(`/products/${productId}`);
    assert.equal(stockAfterCancel.product.stock, 3, 'customer cancellation restores inventory');
    const returnOrder = await request('/orders', { method: 'POST', token: customer.token, body: { ...orderRequest, idempotencyKey: randomUUID(), items: [{ product: productId, quantity: 1 }] } });
    await request(`/orders/${returnOrder.order._id}/status`, { method: 'PATCH', token: adminToken, body: { status: 'delivered' } });
    const returnRequest = await request(`/orders/${returnOrder.order._id}/return`, { method: 'POST', token: customer.token, body: { reason: 'Test return request' } });
    assert.equal(returnRequest.order.refund.status, 'requested', 'customer returns create a persisted refund request for admin review');
    assert.equal(returnRequest.order.refund.refundedAmount || 0, 0, 'return requests do not claim a refund was processed');
    const duplicateReturn = await fetch(`${base}/orders/${returnOrder.order._id}/return`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${customer.token}` }, body: JSON.stringify({ reason: 'Duplicate return' }) });
    assert.equal(duplicateReturn.status, 400, 'duplicate return requests are rejected');
    await request(`/products/${productId}`, { method: 'DELETE', token: adminToken });
    const afterDeactivate = await fetch(`${base}/products/${productId}`);
    assert.equal(afterDeactivate.status, 404, 'deactivated product is hidden from customers');
  } finally {
    if (server && server.exitCode === null) server.kill();
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (mongoose.connection.readyState === 0) await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 7000 }).catch(() => { });
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase().catch(() => { });
      await mongoose.disconnect();
    }
  }
});
