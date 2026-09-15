import { Router, Request, Response, NextFunction } from 'express';
import { getCropRecommendations } from '../services/advisoryService';

const router = Router();

// POST /api/advisory/recommend
router.post('/recommend', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season, soilType, district } = req.body as {
      season?: string;
      soilType?: string;
      district?: string;
    };

    if (!season || !soilType) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: season and soilType',
      });
      return;
    }

    const validSeasons = ['kharif', 'rabi', 'summer', 'zaid'];
    if (!validSeasons.includes(season)) {
      res.status(400).json({
        success: false,
        error: `Invalid season. Must be one of: ${validSeasons.join(', ')}`,
      });
      return;
    }

    const result = await getCropRecommendations({ season, soilType, district });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
