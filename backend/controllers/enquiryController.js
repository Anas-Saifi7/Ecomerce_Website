import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Enquiry from "../models/Enquiry.js";

export const enquiryValidators = [
  body("type")
    .isIn(["contact", "support", "export", "wholesale", "return"])
    .withMessage("Invalid enquiry type"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create({
    ...req.body,
    user: req.user?._id || null,
  });
  res.status(201).json({ success: true, enquiry });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, enquiries });
});

export const getEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) throw new AppError("Enquiry not found", 404);
  res.status(200).json({ success: true, enquiry });
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!enquiry) throw new AppError("Enquiry not found", 404);
  res.status(200).json({ success: true, enquiry });
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw new AppError("Enquiry not found", 404);
  res.status(200).json({ success: true, message: "Enquiry deleted" });
});
