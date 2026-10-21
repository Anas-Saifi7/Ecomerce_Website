import mongoose from "mongoose";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import generateOrderNumber from "../utils/orderNumber.js";
import { getRazorpayClient, isRazorpayConfigured } from "../utils/razorpay.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";

export const createOrderValidators = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("currency")
    .isIn(["INR", "USD"])
    .withMessage("Currency must be INR or USD"),
  body("paymentMethod")
    .isIn(["cod", "razorpay", "upi", "card"])
    .withMessage("Invalid payment method"),
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),
  body("idempotencyKey")
    .isUUID()
    .withMessage("A valid idempotencyKey is required"),
];

const calcShipping = (settings, currency, subtotal, country) => {
  const rates = settings.shipping[currency] || settings.shipping.INR;
  const isIndia = ["india", "in"].includes((country || "").toLowerCase());
  if (isIndia) {
    if (subtotal >= rates.freeAbove) return 0;
    return rates.domestic;
  }
  return rates.international;
};

export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    currency,
    paymentMethod,
    shippingAddress,
    billingAddress,
    couponCode,
    idempotencyKey,
  } = req.body;

  const existingOrder = await Order.findOne({
    user: req.user._id,
    idempotencyKey,
  });
  if (existingOrder) {
    return res.status(200).json({
      success: true,
      order: existingOrder,
      razorpay: existingOrder.payment.razorpayOrderId
        ? {
            orderId: existingOrder.payment.razorpayOrderId,
            amount: Math.round(existingOrder.pricing.total * 100),
            currency: existingOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
          }
        : null,
    });
  }

  const settings = await Settings.getSiteSettings();

  if (!settings.currencies.includes(currency)) {
    throw new AppError(`Currency ${currency} is not supported`, 400);
  }

  if (paymentMethod === "cod") {
    if (!settings.codEnabled) {
      throw new AppError("Cash on delivery is disabled", 400);
    }
    const country = shippingAddress.country || "";
    const allowed = settings.codCountries.some(
      (c) => c.toLowerCase() === country.toLowerCase(),
    );
    if (!allowed) {
      throw new AppError("COD is not available for this country", 400);
    }
    if (currency !== "INR") {
      throw new AppError("COD is only available for INR orders", 400);
    }
  }

  if (
    ["razorpay", "upi", "card"].includes(paymentMethod) &&
    !isRazorpayConfigured()
  ) {
    throw new AppError(
      "Payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      503,
    );
  }

  const priceField = currency === "USD" ? "priceUSD" : "priceINR";
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      throw new AppError("Each item needs a product id and quantity", 400);
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      throw new AppError(`Product not found: ${item.product}`, 404);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const unitPrice = product[priceField];
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      quantity: item.quantity,
      price: unitPrice,
      currency,
      size: item.size || "",
    });
    subtotal += unitPrice * item.quantity;
  }

  subtotal = Math.round(subtotal * 100) / 100;

  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    appliedCoupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!appliedCoupon) throw new AppError("Invalid coupon code", 400);
    const check = appliedCoupon.isValidForOrder(subtotal, currency);
    if (!check.valid) throw new AppError(check.message, 400);
    discount = appliedCoupon.calculateDiscount(subtotal);
  }

  const shipping = calcShipping(
    settings,
    currency,
    subtotal - discount,
    shippingAddress.country,
  );
  const taxRate = settings.tax?.[currency] || 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * (taxRate / 100) * 100) / 100;
  const total = Math.round((taxable + shipping + tax) * 100) / 100;

  const reservedItems = [];
  let order;
  let couponCounted = false;
  try {
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
        { new: true },
      );
      if (!updated) {
        throw new AppError(`Insufficient stock for ${item.name}`, 400);
      }
      reservedItems.push(item);
    }

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, {
        $inc: { usedCount: 1 },
      });
      couponCounted = true;
    }

    const orderNumber = await generateOrderNumber();
    const orderPayload = {
      orderNumber,
      idempotencyKey,
      user: req.user._id,
      items: orderItems,
      currency,
      pricing: { subtotal, discount, shipping, tax, total },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method:
          paymentMethod === "upi" || paymentMethod === "card"
            ? "razorpay"
            : paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending",
      },
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      tracking: [
        {
          status: paymentMethod === "cod" ? "confirmed" : "pending",
          note: "Order placed",
          at: new Date(),
        },
      ],
      confirmedAt: paymentMethod === "cod" ? new Date() : undefined,
    };

    order = await Order.create(orderPayload);

    let razorpayOrder = null;
    if (["razorpay", "upi", "card"].includes(paymentMethod)) {
      const razorpay = getRazorpayClient();
      const amountInPaise = Math.round(total * 100);
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: orderNumber,
        notes: { orderNumber },
      });

      order.payment.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(201).json({
      success: true,
      order,
      razorpay: razorpayOrder
        ? {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
          }
        : null,
    });
  } catch (error) {
    if (order?._id) await Order.deleteOne({ _id: order._id }).catch(() => {});
    for (const item of reservedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      }).catch(() => {});
    }
    if (couponCounted && appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, {
        $inc: { usedCount: -1 },
      }).catch(() => {});
    }
    if (error.code === 11000) {
      const duplicate = await Order.findOne({
        user: req.user._id,
        idempotencyKey,
      });
      if (duplicate) {
        return res.status(200).json({
          success: true,
          order: duplicate,
          razorpay: duplicate.payment.razorpayOrderId
            ? {
                orderId: duplicate.payment.razorpayOrderId,
                amount: Math.round(duplicate.pricing.total * 100),
                currency: duplicate.currency,
                key: process.env.RAZORPAY_KEY_ID,
              }
            : null,
        });
      }
    }
    throw error;
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const { idOrNumber } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrNumber)
    ? { $or: [{ _id: idOrNumber }, { orderNumber: idOrNumber.toUpperCase() }] }
    : { orderNumber: idOrNumber.toUpperCase() };

  const order = await Order.findOne(query).populate("user", "name email");
  if (!order) throw new AppError("Order not found", 404);

  const isOwner = order.user._id.equals(req.user._id);
  const isAdmin = ["admin", "manager"].includes(req.user.role);
  if (!isOwner && !isAdmin) {
    throw new AppError("Not authorized to view this order", 403);
  }

  res.status(200).json({ success: true, order });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  const { email } = req.query;

  if (!email) throw new AppError("Email query parameter is required", 400);

  const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() })
    .populate("user", "email name")
    .populate("items.product", "name image images");
  if (!order) throw new AppError("Order not found", 404);

  if (order.user.email.toLowerCase() !== String(email).toLowerCase()) {
    throw new AppError("Email does not match this order", 403);
  }

  res.status(200).json({
    success: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      tracking: order.tracking,
      pricing: order.pricing,
      currency: order.currency,
      items: order.items,
      createdAt: order.createdAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
    },
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  if (!order.user.equals(req.user._id)) {
    throw new AppError("Not authorized", 403);
  }

  if (!["pending", "confirmed", "processing"].includes(order.status)) {
    throw new AppError("Order cannot be cancelled at this stage", 400);
  }

  const now = new Date();
  const reason = req.body.reason || "Customer cancelled";
  const updates = {
    status: "cancelled",
    cancellation: { reason, requestedAt: now, status: "approved" },
    cancelledAt: now,
  };
  if (order.payment.status === "paid" && order.payment.method === "razorpay") {
    updates.refund = {
      reason: "Refund requested after cancellation",
      amount: order.pricing.total,
      refundedAmount: Number(order.refund?.refundedAmount || 0),
      status: "requested",
      requestedAt: now,
    };
  }
  const cancelledOrder = await Order.findOneAndUpdate(
    {
      _id: order._id,
      user: req.user._id,
      status: { $in: ["pending", "confirmed", "processing"] },
    },
    {
      $set: updates,
      $push: { tracking: { status: "cancelled", note: reason, at: now } },
    },
    { new: true, runValidators: true },
  );
  if (!cancelledOrder)
    throw new AppError("Order cannot be cancelled at this stage", 409);

  for (const item of cancelledOrder.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  res.status(200).json({ success: true, order: cancelledOrder });
});

export const requestReturn = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  if (!order.user.equals(req.user._id)) {
    throw new AppError("Not authorized", 403);
  }
  if (order.status !== "delivered") {
    throw new AppError("Only delivered orders can be returned", 400);
  }

  const returnReason = req.body.reason || "Return requested";
  const returnRequest = await Order.findOneAndUpdate(
    { _id: order._id, user: req.user._id, status: "delivered" },
    {
      $set: {
        status: "return_requested",
        refund: {
          reason: returnReason,
          amount: order.pricing.total,
          refundedAmount: Number(order.refund?.refundedAmount || 0),
          status: "requested",
          requestedAt: new Date(),
        },
      },
      $push: { tracking: { status: "return_requested", note: returnReason } },
    },
    { new: true, runValidators: true },
  );
  if (!returnRequest)
    throw new AppError(
      "Return request already exists or order status changed",
      409,
    );

  res.status(200).json({ success: true, order: returnRequest });
});

export const getOrdersAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus)
    filter["payment.status"] = req.query.paymentStatus;
  if (req.query.search) {
    filter.orderNumber = { $regex: req.query.search, $options: "i" };
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
    orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);

  const allowed = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "return_requested",
    "returned",
    "refunded",
  ];
  if (!allowed.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  if (status === "refunded") {
    throw new AppError("Use the refund workflow to update refund status", 400);
  }
  if (order.status === status) {
    throw new AppError(`Order is already ${status}`, 409);
  }
  if (order.status === "cancelled" && status !== "cancelled") {
    throw new AppError("Cancelled orders cannot be reopened", 400);
  }

  if (status === "cancelled" && order.status !== "cancelled") {
    if (!["pending", "confirmed", "processing"].includes(order.status)) {
      throw new AppError(
        "This order cannot be cancelled at its current stage",
        400,
      );
    }
    const cancelledAt = new Date();
    const cancellationNote = note || "Cancelled by admin";
    const cancelledOrder = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      {
        $set: {
          status: "cancelled",
          cancelledAt,
          cancellation: {
            reason: cancellationNote,
            requestedAt: cancelledAt,
            status: "approved",
          },
          ...(order.payment.status === "paid" &&
          order.payment.method === "razorpay"
            ? {
                refund: {
                  reason: "Refund requested after cancellation",
                  amount: order.pricing.total,
                  refundedAmount: Number(order.refund?.refundedAmount || 0),
                  status: "requested",
                  requestedAt: cancelledAt,
                },
              }
            : {}),
        },
        $push: {
          tracking: {
            status: "cancelled",
            note: cancellationNote,
            at: cancelledAt,
          },
        },
      },
      { new: true, runValidators: true },
    );
    if (!cancelledOrder)
      throw new AppError("Order status changed; reload and try again", 409);
    for (const item of cancelledOrder.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }
    return res.status(200).json({ success: true, order: cancelledOrder });
  }

  order.status = status;
  order.tracking.push({ status, note: note || `Status updated to ${status}` });

  if (status === "confirmed") order.confirmedAt = new Date();
  if (status === "shipped") order.shippedAt = new Date();
  if (status === "delivered") order.deliveredAt = new Date();
  if (status === "cancelled") order.cancelledAt = new Date();

  await order.save();
  res.status(200).json({ success: true, order });
});

export const refundOrder = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);

  const alreadyRefunded = Number(order.refund?.refundedAmount || 0);
  const requestedAmount =
    order.refund?.status === "requested"
      ? Number(order.refund.amount)
      : undefined;
  const amount = Number(
    req.body.amount ?? requestedAmount ?? order.pricing.total - alreadyRefunded,
  );
  if (amount <= 0 || amount > order.pricing.total) {
    throw new AppError("Invalid refund amount", 400);
  }

  if (
    order.payment.status !== "paid" &&
    order.payment.status !== "partially_refunded"
  ) {
    throw new AppError("Only captured payments can be refunded", 400);
  }
  if (amount + alreadyRefunded > order.pricing.total) {
    throw new AppError(
      "Refund amount exceeds the remaining captured amount",
      400,
    );
  }

  if (order.payment.method === "razorpay") {
    if (!isRazorpayConfigured()) {
      throw new AppError("Payment gateway is not configured for refunds", 503);
    }
    if (!order.payment.razorpayPaymentId) {
      throw new AppError("No Razorpay payment found to refund", 400);
    }

    const razorpay = getRazorpayClient();
    order = await Order.findOneAndUpdate(
      {
        _id: order._id,
        "refund.status": { $ne: "processing" },
        "payment.status": { $in: ["paid", "partially_refunded"] },
      },
      {
        $set: {
          "refund.status": "processing",
          "refund.reason":
            req.body.reason || order.refund.reason || "Admin refund",
          "refund.requestedAt": order.refund.requestedAt || new Date(),
        },
      },
      { new: true },
    );
    if (!order)
      throw new AppError(
        "A refund is already being processed for this order",
        409,
      );

    const refund = await razorpay.payments.refund(
      order.payment.razorpayPaymentId,
      {
        amount: Math.round(amount * 100),
        notes: {
          orderNumber: order.orderNumber,
          reason: req.body.reason || "",
        },
      },
    );

    const refundedAmount = alreadyRefunded + amount;
    order.refund = {
      reason: req.body.reason || "Admin refund",
      amount: refundedAmount,
      refundedAmount,
      status: "completed",
      requestedAt: order.refund?.requestedAt || new Date(),
      processedAt: new Date(),
      razorpayRefundId: refund.id,
    };
    order.payment.status =
      refundedAmount < order.pricing.total ? "partially_refunded" : "refunded";
    if (refundedAmount >= order.pricing.total) order.status = "refunded";
  } else {
    throw new AppError(
      "Refund provider is not configured for this payment method",
      503,
    );
  }

  order.tracking.push({
    status: order.status,
    note: `Refund of ${amount} ${order.currency} processed`,
  });
  await order.save();

  res.status(200).json({ success: true, order });
});
