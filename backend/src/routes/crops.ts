import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const STATIC_CROPS = [
  { id: 'wheat', name: 'Wheat', description: 'Winter cereal crop with high yield potential.', type: 'grain', expectedYield: 45, profitability: 75, sustainability: 80, mspPrice: 2150, seasons: ['rabi'], soilTypes: ['loamy', 'alluvial', 'black-soil'] },
  { id: 'rice', name: 'Rice', description: 'Major staple crop with good market demand.', type: 'grain', expectedYield: 55, profitability: 80, sustainability: 75, mspPrice: 2100, seasons: ['kharif'], soilTypes: ['loamy', 'alluvial', 'clayey'] },
  { id: 'maize', name: 'Maize (Corn)', description: 'Versatile crop with multiple uses.', type: 'grain', expectedYield: 60, profitability: 85, sustainability: 82, mspPrice: 1850, seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'black-soil', 'sandy-loam'] },
  { id: 'chickpea', name: 'Chickpea (Gram)', description: 'Protein-rich pulse, excellent for crop rotation.', type: 'pulse', expectedYield: 22, profitability: 78, sustainability: 88, mspPrice: 5100, seasons: ['rabi'], soilTypes: ['black-soil', 'loamy', 'sandy-loam'] },
  { id: 'lentil', name: 'Lentil (Masoor)', description: 'High protein pulse. Improves soil fertility.', type: 'pulse', expectedYield: 18, profitability: 82, sustainability: 90, mspPrice: 6500, seasons: ['rabi'], soilTypes: ['loamy', 'black-soil', 'alluvial'] },
  { id: 'cotton', name: 'Cotton', description: 'Cash crop with strong global market.', type: 'fabric', expectedYield: 18, profitability: 75, sustainability: 70, mspPrice: 5800, seasons: ['kharif'], soilTypes: ['black-soil', 'loamy'] },
  { id: 'sugarcane', name: 'Sugarcane', description: 'Cash crop with stable returns.', type: 'grain', expectedYield: 75, profitability: 72, sustainability: 68, mspPrice: 310, seasons: ['kharif'], soilTypes: ['alluvial', 'loamy', 'black-soil'] },
  { id: 'sunflower', name: 'Sunflower', description: 'Oil seed crop, drought tolerant.', type: 'oilseed', expectedYield: 18, profitability: 84, sustainability: 79, mspPrice: 6000, seasons: ['rabi', 'kharif'], soilTypes: ['sandy-loam', 'loamy', 'black-soil'] },
  { id: 'mango', name: 'Mango', description: 'King of fruits with excellent market value.', type: 'fruit', expectedYield: 35, profitability: 90, sustainability: 92, mspPrice: 8000, seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'sandy-loam', 'black-soil'] },
  { id: 'banana', name: 'Banana', description: 'Perennial crop with year-round yield.', type: 'fruit', expectedYield: 50, profitability: 88, sustainability: 87, mspPrice: 3000, seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'alluvial', 'sandy-loam'] },
];

// GET /api/crops
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        seasons: { include: { season: true } },
        soilTypes: { include: { soilType: true } },
      },
      orderBy: { name: 'asc' },
    });

    if (crops.length > 0) {
      res.json({
        success: true,
        source: 'database',
        data: crops.map((c) => ({
          id: c.slug,
          name: c.name,
          description: c.description,
          type: c.type,
          expectedYield: c.expectedYield,
          profitability: c.profitability,
          sustainability: c.sustainability,
          mspPrice: c.mspPrice,
          seasons: c.seasons.map((s) => s.season.slug),
          soilTypes: c.soilTypes.map((s) => s.soilType.slug),
        })),
      });
      return;
    }

    res.json({ success: true, source: 'static', data: STATIC_CROPS });
  } catch {
    // DB unavailable – serve static data
    res.json({ success: true, source: 'static', data: STATIC_CROPS });
  }
});

// GET /api/crops/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const crop = await prisma.crop.findUnique({
      where: { slug: id },
      include: {
        seasons: { include: { season: true } },
        soilTypes: { include: { soilType: true } },
      },
    });

    if (!crop) {
      const staticCrop = STATIC_CROPS.find((c) => c.id === id);
      if (!staticCrop) {
        res.status(404).json({ success: false, error: 'Crop not found' });
        return;
      }
      res.json({ success: true, data: staticCrop });
      return;
    }

    res.json({
      success: true,
      data: {
        id: crop.slug,
        name: crop.name,
        description: crop.description,
        type: crop.type,
        expectedYield: crop.expectedYield,
        profitability: crop.profitability,
        sustainability: crop.sustainability,
        mspPrice: crop.mspPrice,
        seasons: crop.seasons.map((s) => s.season.slug),
        soilTypes: crop.soilTypes.map((s) => s.soilType.slug),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
