import express from "express";
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  couponValidators,
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/validate", validateCoupon);
router.get("/", protect, authorize("admin", "manager"), getCoupons);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  couponValidators,
  validate,
  createCoupon,
);
router.put("/:id", protect, authorize("admin", "manager"), updateCoupon);
router.delete("/:id", protect, authorize("admin", "manager"), deleteCoupon);

export default router;
