import mongoose from 'mongoose';
import { body } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import BlogPost from '../models/BlogPost.js';

export const blogValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

export const getPosts = asyncHandler(async (req, res) => {
  const canViewDrafts = ['admin', 'manager'].includes(req.user?.role) && req.query.all === 'true';
  const filter = canViewDrafts ? {} : { isPublished: true };
  if (req.query.tag) filter.tags = req.query.tag;

  const posts = await BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  res.status(200).json({ success: true, posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const post = await BlogPost.findOne(query);
  if (!post) throw new AppError('Post not found', 404);
  if (!post.isPublished && !['admin', 'manager'].includes(req.user?.role)) {
    throw new AppError('Post not found', 404);
  }

  res.status(200).json({ success: true, post });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.status(201).json({ success: true, post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) throw new AppError('Post not found', 404);
  res.status(200).json({ success: true, post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  res.status(200).json({ success: true, message: 'Post deleted' });
});
