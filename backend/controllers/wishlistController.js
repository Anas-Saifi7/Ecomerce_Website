import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { isActive: true },
  });
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new AppError('productId is required', 400);

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new AppError('Product not found', 404);

  const user = await User.findById(req.user._id);
  if (!user.wishlist.some((id) => id.equals(productId))) {
    user.wishlist.push(productId);
    await user.save();
  }

  await user.populate('wishlist');
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => !id.equals(req.params.productId));
  await user.save();
  await user.populate('wishlist');
  res.status(200).json({ success: true, wishlist: user.wishlist });
});
