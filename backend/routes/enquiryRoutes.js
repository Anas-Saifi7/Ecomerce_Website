import express from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  enquiryValidators,
} from "../controllers/enquiryController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/", optionalAuth, enquiryValidators, validate, createEnquiry);
router.get("/", protect, authorize("admin", "manager"), getEnquiries);
router.get("/:id", protect, authorize("admin", "manager"), getEnquiry);
router.put("/:id", protect, authorize("admin", "manager"), updateEnquiry);
router.delete("/:id", protect, authorize("admin", "manager"), deleteEnquiry);

export default router;
