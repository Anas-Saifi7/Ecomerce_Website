import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const reviewValidators = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("comment").optional().isString(),
];

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        ratingAvg: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length) {
    await Product.findByIdAndUpdate(productId, {
      ratingAvg: Math.round(stats[0].ratingAvg * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAvg: 0,
      reviewCount: 0,
    });
  }
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const productQuery = String(productId).match(/^[0-9a-f]{24}$/i)
    ? { $or: [{ _id: productId }, { slug: productId }] }
    : { slug: productId };
  const product = await Product.findOne(productQuery).select("_id");
  if (!product) throw new AppError("Product not found", 404);
  const filter = { product: product._id, isApproved: true };
  if (
    req.query.all === "true" &&
    ["admin", "manager"].includes(req.user?.role)
  ) {
    delete filter.isApproved;
  }

  const reviews = await Review.find(filter)
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [
      ...(String(req.params.productId).match(/^[0-9a-f]{24}$/i)
        ? [{ _id: req.params.productId }]
        : []),
      { slug: req.params.productId },
    ],
  });
  if (!product || !product.isActive)
    throw new AppError("Product not found", 404);

  const existing = await Review.findOne({
    product: product._id,
    user: req.user._id,
  });
  if (existing) throw new AppError("You already reviewed this product", 400);

  const review = await Review.create({
    product: product._id,
    user: req.user._id,
    rating: req.body.rating,
    title: req.body.title || "",
    comment: req.body.comment || "",
    isApproved: false,
  });

  res.status(201).json({ success: true, review });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.approved === "true") filter.isApproved = true;
  if (req.query.approved === "false") filter.isApproved = false;

  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .populate("product", "name slug")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, reviews });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate("product", "name slug image")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, reviews });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  if (req.body.isApproved !== undefined) {
    review.isApproved = Boolean(req.body.isApproved);
  }
  await review.save();
  await recalculateProductRating(review.product);

  res.status(200).json({ success: true, review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  const isOwner = review.user.equals(req.user._id);
  const isAdmin = ["admin", "manager"].includes(req.user.role);
  if (!isOwner && !isAdmin) throw new AppError("Not authorized", 403);

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  res.status(200).json({ success: true, message: "Review deleted" });
});
