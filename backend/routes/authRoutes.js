import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  adminLogin,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  registerValidators,
  loginValidators,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidators, validate, register);
router.post("/login", loginValidators, validate, login);
router.post("/logout", logout);
router.post("/admin/login", loginValidators, validate, adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/password", protect, updatePassword);

router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

export default router;
