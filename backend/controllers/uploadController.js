import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';

async function storeImage(file, folder) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new AppError('Durable image storage is not configured. Configure the Cloudinary environment variables.', 503);
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash('sha1')
    .update(`folder=molog/${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest('hex');
  const payload = new FormData();
  payload.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  payload.append('api_key', CLOUDINARY_API_KEY);
  payload.append('timestamp', String(timestamp));
  payload.append('folder', `molog/${folder}`);
  payload.append('signature', signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: payload });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new AppError(result.error?.message || 'Image storage provider rejected the upload', 502);
  }
  return { filename: result.public_id, url: result.secure_url, mimetype: file.mimetype, size: file.size };
}

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const folder = req.baseUrl.split('/').at(-1);
  const files = await Promise.all(req.files.map((file) => storeImage(file, folder)));

  res.status(201).json({ success: true, files });
});
