import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Newsletter from "../models/Newsletter.js";

export const subscribeValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const subscribe = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  let entry = await Newsletter.findOne({ email });

  if (entry) {
    if (!entry.isActive) {
      entry.isActive = true;
      await entry.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "Subscribed successfully" });
  }

  entry = await Newsletter.create({ email });
  res
    .status(201)
    .json({ success: true, message: "Subscribed successfully", entry });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, subscribers });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const entry = await Newsletter.findOneAndUpdate(
    { email: req.params.email.toLowerCase() },
    { isActive: false },
    { new: true },
  );
  if (!entry) throw new AppError("Subscriber not found", 404);
  res.status(200).json({ success: true, message: "Unsubscribed" });
});
