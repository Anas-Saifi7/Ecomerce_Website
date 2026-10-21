import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidators,
} from "../controllers/categoryController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", optionalAuth, getCategories);
router.get("/:idOrSlug", optionalAuth, getCategory);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  categoryValidators,
  validate,
  createCategory,
);
router.put("/:id", protect, authorize("admin", "manager"), updateCategory);
router.delete("/:id", protect, authorize("admin", "manager"), deleteCategory);

export default router;
