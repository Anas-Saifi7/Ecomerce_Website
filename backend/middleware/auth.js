import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

const getTokenFromRequest = (req) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  return null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new AppError("Not authorized, please login", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      throw new AppError("User not found or inactive", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Not authorized, token invalid", 401);
  }
});

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }
    return next();
  };

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user?.isActive) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token for optional auth
  }

  next();
});
