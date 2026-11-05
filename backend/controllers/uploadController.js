import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { v2 as cloudinary } from 'cloudinary';

async function storeImage(file, folder) {
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    throw new AppError(
      'Durable image storage is not configured.',
      503
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `Halla Bol/${folder}`,
          resource_type: 'image',
        },
        (error, uploadedImage) => {
          if (error) return reject(error);
          resolve(uploadedImage);
        }
      );

      stream.end(file.buffer);
    });

    return {
      filename: result.public_id,
      url: result.secure_url,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error('CLOUDINARY UPLOAD ERROR:', error.message);

    throw new AppError(
      error.message || 'Cloudinary image upload failed.',
      502
    );
  }
}

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const folder = req.baseUrl.split('/').at(-1);

  const files = await Promise.all(
    req.files.map((file) => storeImage(file, folder))
  );

  res.status(201).json({
    success: true,
    files,
  });
});
