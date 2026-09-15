import { Router, Request, Response, NextFunction } from 'express';
import { getMarketPrices } from '../services/marketPriceService';

const router = Router();

// GET /api/market-prices?commodity=rice&market=pune
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commodity, market } = req.query as { commodity?: string; market?: string };
    const result = getMarketPrices(commodity, market);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
