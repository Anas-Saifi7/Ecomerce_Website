import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Coupon from "../models/Coupon.js";

export const couponValidators = [
  body("code").trim().notEmpty().withMessage("Code is required"),
  body("type")
    .isIn(["percent", "fixed"])
    .withMessage("Type must be percent or fixed"),
  body("value").isFloat({ min: 0 }).withMessage("Value is required"),
];

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal, currency } = req.body;
  if (!code) throw new AppError("Coupon code is required", 400);

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) throw new AppError("Invalid coupon", 404);

  const check = coupon.isValidForOrder(
    Number(subtotal) || 0,
    currency || "INR",
  );
  if (!check.valid) throw new AppError(check.message, 400);

  const discount = coupon.calculateDiscount(Number(subtotal) || 0);
  res.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    },
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase(),
  });
  res.status(201).json({ success: true, coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  if (req.body.code) req.body.code = req.body.code.toUpperCase();
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new AppError("Coupon not found", 404);
  res.status(200).json({ success: true, coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new AppError("Coupon not found", 404);
  res.status(200).json({ success: true, message: "Coupon deleted" });
});
