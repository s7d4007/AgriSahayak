import { Router, Request, Response, NextFunction } from 'express';
import { fetchAgriculturalNews } from '../services/newsService';

const router = Router();

// GET /api/news
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await fetchAgriculturalNews();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
