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
import passport from "../config/passport.js";
import generateToken from "../utils/generateToken.js";

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


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// Start Google OAuth
router.get("/google", (req, res, next) => {
  const requestedPath = req.query.returnTo;

  const safePath =
    typeof requestedPath === "string" &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.includes("\\")
      ? requestedPath
      : "/check-out";

  res.cookie("oauthReturnTo", safePath, {
    ...cookieOptions,
    maxAge: 10 * 60 * 1000,
  });

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/login?error=google_login_failed`,
  }),
  (req, res, next) => {
    try {
      const token = generateToken(req.user._id, req.user.role);

      res.cookie("token", token, cookieOptions);

      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:5173";

      const returnTo = req.cookies?.oauthReturnTo || "/check-out";

   
      const safeReturnTo =
        typeof returnTo === "string" &&
        returnTo.startsWith("/") &&
        !returnTo.startsWith("//") &&
        !returnTo.includes("\\")
          ? returnTo
          : "/check-out";

      res.clearCookie("oauthReturnTo", {
        ...cookieOptions,
        maxAge: undefined,
      });

      return res.redirect(`${frontendUrl}${safeReturnTo}`);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
