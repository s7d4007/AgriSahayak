import { Router, Request, Response, NextFunction } from 'express';
import { fetchWeatherData } from '../services/weatherService';

const router = Router();

// GET /api/weather?lat=xx&lon=xx
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat) || isNaN(lon)) {
      res.status(400).json({
        success: false,
        error: 'Missing or invalid query parameters: lat and lon must be numbers.',
      });
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      res.status(400).json({
        success: false,
        error: 'Coordinates out of range. lat: -90 to 90, lon: -180 to 180.',
      });
      return;
    }

    const result = await fetchWeatherData(lat, lon);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
