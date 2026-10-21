import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Enquiry from "../models/Enquiry.js";
import Settings from "../models/Settings.js";
import AppError from "../utils/AppError.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const settings = await Settings.getSiteSettings();
  const threshold = settings.lowStockThreshold || 10;

  const [
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    revenueAgg,
    recentOrders,
    lowStock,
    openEnquiries,
    ordersByStatus,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: "customer" }),
    Order.countDocuments({
      status: { $in: ["pending", "confirmed", "processing"] },
    }),
    Order.aggregate([
      { $match: { "payment.status": "paid" } },
      {
        $group: {
          _id: "$currency",
          total: { $sum: "$pricing.total" },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(8),
    Product.find({ isActive: true, stock: { $lte: threshold } })
      .select("name slug stock image priceINR priceUSD")
      .sort({ stock: 1 })
      .limit(10),
    Enquiry.countDocuments({ status: { $in: ["new", "in_progress"] } }),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      openEnquiries,
      revenue: revenueAgg,
      ordersByStatus,
    },
    recentOrders,
    lowStock,
  });
});

export const getCustomers = asyncHandler(async (req, res) => {
  const filter = { role: "customer" };
  if (req.query.search) {
    const search = String(req.query.search)
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const [customers, total] = await Promise.all([
    User.find(filter)
      .select("name email phone isActive createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);
  res
    .status(200)
    .json({
      success: true,
      customers,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
});

export const updateCustomerStatus = asyncHandler(async (req, res) => {
  if (typeof req.body.isActive !== "boolean")
    throw new AppError("isActive must be a boolean", 400);
  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: "customer" },
    { isActive: req.body.isActive },
    { new: true, runValidators: true },
  ).select("name email phone isActive createdAt");
  if (!customer) throw new AppError("Customer not found", 404);
  res.status(200).json({ success: true, customer });
});
