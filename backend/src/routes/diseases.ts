import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const STATIC_DISEASES = [
  { id: 'leaf-spot', name: 'Leaf Spot', scientificName: 'Various (Cercospora, Alternaria)', description: 'Fungal disease with circular brown spots on leaves.', cause: 'Various fungal pathogens in warm, humid conditions.', symptoms: ['Brown/black circular spots', 'Yellow halo around lesions', 'Premature leaf drop'], treatment: ['Remove infected leaves', 'Apply copper fungicides', 'Spray at 7-10 day intervals'], prevention: ['Proper plant spacing', 'Avoid overhead watering', 'Remove fallen leaves regularly'], severity: 'mild' },
  { id: 'powdery-mildew', name: 'Powdery Mildew', scientificName: 'Various Erysiphaceae', description: 'White powder-like coating on leaves.', cause: 'Fungal spores spread by wind.', symptoms: ['White/gray powdery coating', 'Leaf distortion', 'Reduced fruit quality'], treatment: ['Spray sulfur fungicides weekly', 'Neem oil spray', 'Remove infected leaves'], prevention: ['Choose resistant varieties', 'Maintain proper spacing', 'Water at soil level'], severity: 'mild' },
  { id: 'rust-disease', name: 'Rust Disease', scientificName: 'Various Pucciniales', description: 'Rust-colored pustules on leaf undersides.', cause: 'Fungal spores, high humidity.', symptoms: ['Rusty-orange pustules', 'Yellow spots on upper surface', 'Premature leaf drop'], treatment: ['Remove affected leaves', 'Apply sulfur fungicides', 'Use myclobutanil'], prevention: ['Plant resistant varieties', 'Proper spacing', 'Avoid overhead watering'], severity: 'moderate' },
  { id: 'blight-disease', name: 'Blight Disease', scientificName: 'Various Phytophthora', description: 'Serious disease causing rapid leaf/stem damage.', cause: 'Fungal pathogens in high humidity.', symptoms: ['Water-soaked spots turning brown', 'Rapid defoliation', 'Stem cankers'], treatment: ['Remove infected parts immediately', 'Apply chlorothalonil', 'Improve drainage'], prevention: ['Resistant varieties', 'Improve drainage', 'Avoid overhead watering'], severity: 'severe' },
  { id: 'mosaic-virus', name: 'Mosaic Virus', scientificName: 'Various Potyvirus', description: 'Viral disease causing mottled foliage.', cause: 'Spread by aphids and contact.', symptoms: ['Mottled green patches', 'Leaf curling', 'Stunted growth'], treatment: ['Remove infected plants', 'Control aphids with neem oil', 'Disinfect tools'], prevention: ['Virus-free certified seeds', 'Control aphid vectors', 'Isolate infected plants'], severity: 'severe' },
  { id: 'anthracnose', name: 'Anthracnose', scientificName: 'Colletotrichum species', description: 'Sunken dark lesions, fruit rot in wet conditions.', cause: 'Fungal spores spread by rain splash.', symptoms: ['Dark sunken lesions', 'Pink spore masses', 'Fruit rot'], treatment: ['Remove infected parts', 'Apply chlorothalonil', 'Spray every 7-10 days'], prevention: ['Resistant varieties', 'Improve air circulation', 'Remove debris'], severity: 'moderate' },
];

// GET /api/diseases
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const diseases = await prisma.disease.findMany({ orderBy: { name: 'asc' } });

    if (diseases.length > 0) {
      res.json({ success: true, source: 'database', data: diseases });
      return;
    }

    res.json({ success: true, source: 'static', data: STATIC_DISEASES });
  } catch {
    res.json({ success: true, source: 'static', data: STATIC_DISEASES });
  }
});

// GET /api/diseases/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const disease = await prisma.disease.findUnique({ where: { slug: id } });

    if (!disease) {
      const staticDisease = STATIC_DISEASES.find((d) => d.id === id);
      if (!staticDisease) {
        res.status(404).json({ success: false, error: 'Disease not found' });
        return;
      }
      res.json({ success: true, data: staticDisease });
      return;
    }

    res.json({ success: true, data: disease });
  } catch (error) {
    next(error);
  }
});

export default router;
