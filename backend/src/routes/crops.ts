import { Router, Request, Response, NextFunction } from 'express';
import { CROPS } from '../data/agriData';

const router = Router();

// GET /api/crops
router.get('/', (_req: Request, res: Response): void => {
  res.json({ success: true, source: 'static', data: CROPS });
});

// GET /api/crops/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const crop = CROPS.find((c) => c.slug === id);

    if (!crop) {
      res.status(404).json({ success: false, error: 'Crop not found' });
      return;
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
