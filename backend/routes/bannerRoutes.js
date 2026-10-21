import express from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  bannerValidators,
} from "../controllers/bannerController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", optionalAuth, getBanners);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  bannerValidators,
  validate,
  createBanner,
);
router.put("/:id", protect, authorize("admin", "manager"), updateBanner);
router.delete("/:id", protect, authorize("admin", "manager"), deleteBanner);

export default router;
