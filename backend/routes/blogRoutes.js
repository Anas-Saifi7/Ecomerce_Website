import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  blogValidators,
} from "../controllers/blogController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", optionalAuth, getPosts);
router.get("/:idOrSlug", optionalAuth, getPost);
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  blogValidators,
  validate,
  createPost,
);
router.put("/:id", protect, authorize("admin", "manager"), updatePost);
router.delete("/:id", protect, authorize("admin", "manager"), deletePost);

export default router;
