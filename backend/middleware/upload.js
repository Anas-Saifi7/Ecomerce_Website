import multer from "multer";

const imageFilter = (_req, file, cb) => {
  if (/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const uploadProduct = imageUpload;
export const uploadBanner = imageUpload;
export const uploadBlog = imageUpload;
