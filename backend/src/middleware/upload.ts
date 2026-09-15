import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `Invalid file type. Only JPEG, PNG, and WebP images are allowed. Got: ${file.mimetype}`
        )
      );
    }
  },
});

/** Multer error handler – must be registered after upload middleware */
export const handleUploadError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
      });
      return;
    }
    res.status(400).json({ success: false, error: err.message });
    return;
  }
  if (err) {
    res.status(400).json({ success: false, error: err.message });
    return;
  }
  next();
};
