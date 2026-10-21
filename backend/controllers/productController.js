import mongoose from "mongoose";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const productValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("priceINR")
    .isFloat({ min: 0 })
    .withMessage("Valid priceINR is required"),
  body("priceUSD")
    .isFloat({ min: 0 })
    .withMessage("Valid priceUSD is required"),
];

const buildProductFilter = async (query, user) => {
  const filter = { isActive: true };

  if (
    query.includeInactive === "true" &&
    ["admin", "manager"].includes(user?.role)
  ) {
    delete filter.isActive;
  }

  if (query.category) {
    if (mongoose.Types.ObjectId.isValid(query.category)) {
      filter.category = query.category;
    } else {
      const cat = await Category.findOne({
        $or: [{ slug: query.category }, { name: query.category }],
      });
      if (cat) filter.category = cat._id;
    }
  }

  if (query.categoryType) filter.categoryType = query.categoryType;
  if (query.region) filter.region = query.region;
  if (query.featured === "true") filter.isFeatured = true;
  if (query.productType) filter.productType = query.productType;

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { tags: { $regex: query.search, $options: "i" } },
    ];
  }

  const currency = (query.currency || "INR").toUpperCase();
  const priceField = currency === "USD" ? "priceUSD" : "priceINR";

  if (query.minPrice || query.maxPrice) {
    filter[priceField] = {};
    if (query.minPrice) filter[priceField].$gte = Number(query.minPrice);
    if (query.maxPrice) filter[priceField].$lte = Number(query.maxPrice);
  }

  return { filter, currency, priceField };
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const { filter, currency, priceField } = await buildProductFilter(
    req.query,
    req.user,
  );

  let sort = { createdAt: -1 };
  switch (req.query.sort) {
    case "price_asc":
      sort = { [priceField]: 1 };
      break;
    case "price_desc":
      sort = { [priceField]: -1 };
      break;
    case "rating":
      sort = { ratingAvg: -1 };
      break;
    case "popular":
      sort = { soldCount: -1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    default:
      break;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    currency,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
    products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const product = await Product.findOne(query).populate(
    "category",
    "name slug",
  );
  if (
    !product ||
    (!product.isActive &&
      req.user?.role !== "admin" &&
      req.user?.role !== "manager")
  ) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!product) throw new AppError("Product not found", 404);
  res
    .status(200)
    .json({ success: true, message: "Product deactivated", product });
});

export const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock == null || Number(stock) < 0) {
    throw new AppError("Valid stock value is required", 400);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: Number(stock) },
    { new: true, runValidators: true },
  );
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({ success: true, product });
});
