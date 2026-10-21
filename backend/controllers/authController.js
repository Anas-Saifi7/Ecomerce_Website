import crypto from 'crypto';
import { body } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id, user.role);
  res.cookie('token', token, cookieOptions);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (role && role !== 'customer') {
    throw new AppError('Admin registration is not allowed via public register', 403);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: 'customer',
  });

  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  sendAuthResponse(res, user);
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!['admin', 'manager'].includes(user.role)) {
    throw new AppError('Access denied: admin credentials required', 403);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  sendAuthResponse(res, user);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });
  if (req.body.preferences !== undefined) {
    const keys = ['emailNotifications', 'orderUpdates', 'offersPromotions'];
    if (!req.body.preferences || typeof req.body.preferences !== 'object' ||
        keys.some((key) => req.body.preferences[key] !== undefined && typeof req.body.preferences[key] !== 'boolean') ||
        Object.keys(req.body.preferences).some((key) => !keys.includes(key))) {
      throw new AppError('Invalid notification preferences', 400);
    }
    req.user.preferences = { ...req.user.preferences?.toObject?.(), ...req.body.preferences };
  }

  await req.user.save();
  res.status(200).json({ success: true, user: req.user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  sendAuthResponse(res, user);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If that email exists, a reset link has been sent',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset - Halla Bol',
    text: `Reset your password using this link (valid 30 minutes): ${resetUrl}`,
    html: `<p>Reset your password using this link (valid 30 minutes):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res.status(200).json({
    success: true,
    message: 'If that email exists, a reset link has been sent',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendAuthResponse(res, user);
});

export const getAddresses = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, addresses: req.user.addresses });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, line1, line2, city, state, postalCode, country, label, isDefault } =
    req.body;

  if (!fullName || !phone || !line1 || !city || !state || !postalCode) {
    throw new AppError('Missing required address fields', 400);
  }

  if (isDefault || req.user.addresses.length === 0) {
    req.user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  req.user.addresses.push({
    label: label || 'Home',
    fullName,
    phone,
    line1,
    line2: line2 || '',
    city,
    state,
    postalCode,
    country: country || 'India',
    isDefault: Boolean(isDefault) || req.user.addresses.length === 0,
  });

  await req.user.save();
  res.status(201).json({ success: true, addresses: req.user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) throw new AppError('Address not found', 404);

  Object.assign(address, req.body);

  if (req.body.isDefault) {
    req.user.addresses.forEach((a) => {
      a.isDefault = a._id.equals(address._id);
    });
  }

  await req.user.save();
  res.status(200).json({ success: true, addresses: req.user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) throw new AppError('Address not found', 404);

  address.deleteOne();
  await req.user.save();
  res.status(200).json({ success: true, addresses: req.user.addresses });
});
