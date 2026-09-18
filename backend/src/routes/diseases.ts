import { Router, Request, Response, NextFunction } from 'express';
import { DISEASES } from '../data/agriData';

const router = Router();

// GET /api/diseases
router.get('/', (_req: Request, res: Response): void => {
  res.json({ success: true, source: 'static', data: DISEASES });
});

// GET /api/diseases/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const disease = DISEASES.find((d) => d.slug === id);

    if (!disease) {
      res.status(404).json({ success: false, error: 'Disease not found' });
      return;
    }

    res.json({ success: true, data: disease });
  } catch (error) {
    next(error);
  }
});

export default router;
