import asyncHandler from "../utils/asyncHandler.js";
import Settings from "../models/Settings.js";

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSiteSettings();
  res.status(200).json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSiteSettings();
  const allowed = [
    "shipping",
    "codEnabled",
    "codCountries",
    "tax",
    "currencies",
    "storeName",
    "contact",
    "lowStockThreshold",
  ];

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
    }
  });

  await settings.save();
  res.status(200).json({ success: true, settings });
});
