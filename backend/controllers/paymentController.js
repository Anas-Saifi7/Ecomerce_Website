import crypto from "crypto";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { getRazorpayClient, isRazorpayConfigured } from "../utils/razorpay.js";
import Order from "../models/Order.js";

export const verifyValidators = [
  body("razorpay_order_id")
    .notEmpty()
    .withMessage("razorpay_order_id is required"),
  body("razorpay_payment_id")
    .notEmpty()
    .withMessage("razorpay_payment_id is required"),
  body("razorpay_signature")
    .notEmpty()
    .withMessage("razorpay_signature is required"),
];

export const getPaymentConfig = (_req, res) => {
  res
    .status(200)
    .json({ success: true, razorpayEnabled: isRazorpayConfigured() });
};

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    throw new AppError("Payment gateway is not configured", 503);
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(String(razorpay_signature), "hex");
  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new AppError("Invalid payment signature", 400);
  }

  const order = await Order.findOne({
    ...(orderId ? { _id: orderId } : {}),
    "payment.razorpayOrderId": razorpay_order_id,
  });

  if (!order) throw new AppError("Order not found", 404);
  if (!order.user.equals(req.user._id))
    throw new AppError("Not authorized to verify this payment", 403);

  if (order.payment.status === "paid") {
    if (order.payment.razorpayPaymentId !== razorpay_payment_id) {
      throw new AppError(
        "A different payment has already been recorded for this order",
        409,
      );
    }
    return res
      .status(200)
      .json({ success: true, message: "Already paid", order });
  }

  const payment = await getRazorpayClient().payments.fetch(razorpay_payment_id);
  if (
    payment.order_id !== razorpay_order_id ||
    payment.currency !== order.currency ||
    Number(payment.amount) !== Math.round(order.pricing.total * 100) ||
    payment.status !== "captured" ||
    payment.captured !== true
  ) {
    throw new AppError(
      "Razorpay has not confirmed a captured payment for this order",
      409,
    );
  }

  const reusedPayment = await Order.exists({
    _id: { $ne: order._id },
    "payment.razorpayPaymentId": razorpay_payment_id,
  });
  if (reusedPayment)
    throw new AppError("Payment is already associated with another order", 409);

  order.payment.status = "paid";
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.status = "confirmed";
  order.confirmedAt = new Date();
  order.tracking.push({
    status: "confirmed",
    note: "Payment verified via Razorpay",
  });
  await order.save();

  res.status(200).json({ success: true, order });
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new AppError("Webhook secret is not configured", 503);
  }

  const signature = req.headers["x-razorpay-signature"];
  if (!signature) {
    throw new AppError("Missing webhook signature", 400);
  }

  if (typeof req.rawBody !== "string") {
    throw new AppError("Raw webhook body is unavailable", 400);
  }
  const body = Buffer.from(req.rawBody, "utf8");
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(String(signature), "hex");
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const eventType = event.event;
  const paymentEntity = event.payload?.payment?.entity;

  if (eventType === "payment.captured" && paymentEntity) {
    const order = await Order.findOne({
      "payment.razorpayOrderId": paymentEntity.order_id,
    });

    if (
      order &&
      order.payment.status !== "paid" &&
      Number(paymentEntity.amount) === Math.round(order.pricing.total * 100) &&
      paymentEntity.currency === order.currency &&
      paymentEntity.status === "captured" &&
      paymentEntity.captured === true &&
      !(await Order.exists({
        _id: { $ne: order._id },
        "payment.razorpayPaymentId": paymentEntity.id,
      }))
    ) {
      order.payment.status = "paid";
      order.payment.razorpayPaymentId = paymentEntity.id;
      order.status = "confirmed";
      order.confirmedAt = new Date();
      order.tracking.push({
        status: "confirmed",
        note: "Payment captured via Razorpay webhook",
      });
      await order.save();
    }
  }

  if (eventType === "payment.failed" && paymentEntity) {
    const order = await Order.findOne({
      "payment.razorpayOrderId": paymentEntity.order_id,
    });
    if (order && order.payment.status === "pending") {
      order.payment.status = "failed";
      order.tracking.push({ status: "pending", note: "Payment failed" });
      await order.save();
    }
  }

  res.status(200).json({ success: true });
});
