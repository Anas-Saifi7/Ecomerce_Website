import express from "express";
import {
  getDashboard,
  getCustomers,
  updateCustomerStatus,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Enquiry from "../models/Enquiry.js";
import Review from "../models/Review.js";
import Coupon from "../models/Coupon.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin", "manager"), getDashboard);
router.get("/customers", protect, authorize("admin", "manager"), getCustomers);
router.patch(
  "/customers/:id/status",
  protect,
  authorize("admin", "manager"),
  updateCustomerStatus,
);
router.get(
  "/analytics",
  protect,
  authorize("admin", "manager"),
  asyncHandler(async (_req, res) => {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [
      dailySales,
      products,
      customers,
      orders,
      enquiries,
      reviews,
      coupons,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, "payment.status": "paid" } },
        {
          $group: {
            _id: {
              day: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              currency: "$currency",
            },
            revenue: { $sum: "$pricing.total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: "$isActive",
            products: { $sum: 1 },
            stockUnits: { $sum: "$stock" },
            inventoryValueINR: { $sum: { $multiply: ["$stock", "$priceINR"] } },
          },
        },
      ]),
      User.countDocuments({ role: "customer", createdAt: { $gte: since } }),
      Order.countDocuments({ createdAt: { $gte: since } }),
      Enquiry.countDocuments({ status: { $in: ["new", "in_progress"] } }),
      Review.countDocuments({ isApproved: false }),
      Coupon.countDocuments({ isActive: true }),
    ]);
    res.json({
      success: true,
      analytics: {
        periodDays: 30,
        dailySales,
        inventory: products,
        newCustomers: customers,
        ordersLast30Days: orders,
        openEnquiries: enquiries,
        pendingReviews: reviews,
        activeCoupons: coupons,
      },
    });
  }),
);

export default router;
