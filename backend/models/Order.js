import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['INR', 'USD'], required: true },
    size: { type: String, default: '' },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    idempotencyKey: { type: String, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'Order must have at least one item'],
    },
    currency: {
      type: String,
      enum: ['INR', 'USD'],
      required: true,
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      shipping: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    shippingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },
    billingAddress: {
      type: addressSnapshotSchema,
    },
    payment: {
      method: {
        type: String,
        enum: ['cod', 'razorpay', 'upi', 'card'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending',
      },
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'return_requested',
        'returned',
        'refunded',
      ],
      default: 'pending',
    },
    tracking: [trackingSchema],
    couponCode: {
      type: String,
      uppercase: true,
      default: '',
    },
    cancellation: {
      reason: { type: String, default: '' },
      requestedAt: Date,
      status: {
        type: String,
        enum: ['none', 'requested', 'approved', 'rejected'],
        default: 'none',
      },
    },
    refund: {
      reason: { type: String, default: '' },
      amount: { type: Number, default: 0 },
      refundedAmount: { type: Number, default: 0, min: 0 },
      status: {
        type: String,
        enum: ['none', 'requested', 'processing', 'completed', 'failed'],
        default: 'none',
      },
      requestedAt: Date,
      processedAt: Date,
      razorpayRefundId: { type: String, default: '' },
    },
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
