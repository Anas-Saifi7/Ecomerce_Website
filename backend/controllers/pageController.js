import mongoose from "mongoose";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Page from "../models/Page.js";

export const pageValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

export const getPages = asyncHandler(async (req, res) => {
  const canViewDrafts =
    ["admin", "manager"].includes(req.user?.role) && req.query.all === "true";
  const filter = canViewDrafts ? {} : { isPublished: true };
  const pages = await Page.find(filter).sort({ title: 1 });
  res.status(200).json({ success: true, pages });
});

export const getPage = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const page = await Page.findOne(query);
  if (!page) throw new AppError("Page not found", 404);
  if (!page.isPublished && !["admin", "manager"].includes(req.user?.role)) {
    throw new AppError("Page not found", 404);
  }
  res.status(200).json({ success: true, page });
});

export const createPage = asyncHandler(async (req, res) => {
  const page = await Page.create(req.body);
  res.status(201).json({ success: true, page });
});

export const updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!page) throw new AppError("Page not found", 404);
  res.status(200).json({ success: true, page });
});

export const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) throw new AppError("Page not found", 404);
  res.status(200).json({ success: true, message: "Page deleted" });
});
