import mongoose from "mongoose";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Category from "../models/Category.js";

export const categoryValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

export const getCategories = asyncHandler(async (req, res) => {
  const canViewInactive =
    ["admin", "manager"].includes(req.user?.role) && req.query.all === "true";
  const filter = canViewInactive ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({
    sortOrder: 1,
    name: 1,
  });
  res.status(200).json({ success: true, categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const category = await Category.findOne(query);
  if (!category) throw new AppError("Category not found", 404);
  if (!category.isActive && !["admin", "manager"].includes(req.user?.role)) {
    throw new AppError("Category not found", 404);
  }
  res.status(200).json({ success: true, category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError("Category not found", 404);
  res.status(200).json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!category) throw new AppError("Category not found", 404);
  res
    .status(200)
    .json({ success: true, message: "Category deactivated", category });
});
