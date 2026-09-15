import { Router, Request, Response, NextFunction } from 'express';
import { upload, handleUploadError } from '../middleware/upload';
import { detectDiseaseFromBuffer } from '../services/diseaseService';

const router = Router();

// POST /api/disease/detect
router.post(
  '/detect',
  upload.single('image'),
  handleUploadError,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No image file provided. Send a file with field name "image".',
        });
        return;
      }

      const result = await detectDiseaseFromBuffer(req.file.buffer, req.file.mimetype);
      res.json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      const err = error as { retryable?: boolean; statusCode?: number; message?: string };
      if (err.retryable) {
        res.status(503).json({
          success: false,
          error: err.message,
          retryable: true,
        });
        return;
      }
      next(error);
    }
  }
);

export default router;
