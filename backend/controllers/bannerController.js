import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Banner from "../models/Banner.js";

export const bannerValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("image").trim().notEmpty().withMessage("Image is required"),
];

export const getBanners = asyncHandler(async (req, res) => {
  const canViewInactive =
    ["admin", "manager"].includes(req.user?.role) && req.query.all === "true";
  const filter = canViewInactive ? {} : { isActive: true };
  if (req.query.placement) filter.placement = req.query.placement;

  const banners = await Banner.find(filter).sort({
    sortOrder: 1,
    createdAt: -1,
  });
  res.status(200).json({ success: true, banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new AppError("Banner not found", 404);
  res.status(200).json({ success: true, banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new AppError("Banner not found", 404);
  res.status(200).json({ success: true, message: "Banner deleted" });
});
