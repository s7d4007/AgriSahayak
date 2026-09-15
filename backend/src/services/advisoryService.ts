import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AdvisoryRequest {
  district?: string;
  season: string;
  soilType: string;
}

/**
 * Get crop recommendations from PostgreSQL based on season and soil type.
 * Falls back to static data if the database tables are empty.
 */
export const getCropRecommendations = async (params: AdvisoryRequest) => {
  const { season, soilType } = params;

  try {
    // Query crops that match both season and soil type via join tables
    const crops = await prisma.crop.findMany({
      where: {
        seasons: { some: { season: { slug: season } } },
        soilTypes: { some: { soilType: { slug: soilType } } },
      },
      include: {
        seasons: { include: { season: true } },
        soilTypes: { include: { soilType: true } },
      },
      orderBy: { profitability: 'desc' },
      take: 8,
    });

    if (crops.length > 0) {
      return {
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
          seasons: c.seasons.map((cs) => cs.season.slug),
          soilTypes: c.soilTypes.map((cs) => cs.soilType.slug),
        })),
      };
    }

    // DB empty – fallback to in-memory data
    return getFallbackRecommendations(season, soilType);
  } catch (error) {
    console.error('[advisoryService] DB error, falling back to static data:', error);
    return getFallbackRecommendations(season, soilType);
  }
};

// Static advisory data (matches frontend CROP_DATABASE)
const CROP_DATABASE = [
  { id: 'wheat', name: 'Wheat', description: 'Winter cereal crop with high yield potential.', expectedYield: 45, profitability: 75, sustainability: 80, mspPrice: 2150, type: 'grain', seasons: ['rabi'], soilTypes: ['loamy', 'alluvial', 'black-soil'] },
  { id: 'rice', name: 'Rice', description: 'Major staple crop with good market demand.', expectedYield: 55, profitability: 80, sustainability: 75, mspPrice: 2100, type: 'grain', seasons: ['kharif'], soilTypes: ['loamy', 'alluvial', 'clayey'] },
  { id: 'maize', name: 'Maize (Corn)', description: 'Versatile crop with multiple uses. High yielding.', expectedYield: 60, profitability: 85, sustainability: 82, mspPrice: 1850, type: 'grain', seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'black-soil', 'sandy-loam'] },
  { id: 'chickpea', name: 'Chickpea (Gram)', description: 'Protein-rich pulse crop. Excellent for crop rotation.', expectedYield: 22, profitability: 78, sustainability: 88, mspPrice: 5100, type: 'pulse', seasons: ['rabi'], soilTypes: ['black-soil', 'loamy', 'sandy-loam'] },
  { id: 'lentil', name: 'Lentil (Masoor)', description: 'High protein pulse. Improves soil fertility.', expectedYield: 18, profitability: 82, sustainability: 90, mspPrice: 6500, type: 'pulse', seasons: ['rabi'], soilTypes: ['loamy', 'black-soil', 'alluvial'] },
  { id: 'sunflower', name: 'Sunflower', description: 'Oil seed crop with high market value. Drought tolerant.', expectedYield: 18, profitability: 84, sustainability: 79, mspPrice: 6000, type: 'oilseed', seasons: ['rabi', 'kharif'], soilTypes: ['sandy-loam', 'loamy', 'black-soil'] },
  { id: 'cotton', name: 'Cotton', description: 'Cash crop with strong global market.', expectedYield: 18, profitability: 75, sustainability: 70, mspPrice: 5800, type: 'fabric', seasons: ['kharif'], soilTypes: ['black-soil', 'loamy'] },
  { id: 'sugarcane', name: 'Sugarcane', description: 'Cash crop with stable returns. High water need.', expectedYield: 75, profitability: 72, sustainability: 68, mspPrice: 310, type: 'grain', seasons: ['kharif'], soilTypes: ['alluvial', 'loamy', 'black-soil'] },
  { id: 'marigold', name: 'Marigold', description: 'Floriculture crop with good demand.', expectedYield: 320, profitability: 92, sustainability: 88, mspPrice: 2500, type: 'flower', seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'sandy-loam', 'alluvial'] },
  { id: 'mango', name: 'Mango', description: 'King of fruits with excellent market value.', expectedYield: 35, profitability: 90, sustainability: 92, mspPrice: 8000, type: 'fruit', seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'sandy-loam', 'black-soil'] },
  { id: 'banana', name: 'Banana', description: 'Perennial crop with year-round yield.', expectedYield: 50, profitability: 88, sustainability: 87, mspPrice: 3000, type: 'fruit', seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'alluvial', 'sandy-loam'] },
  { id: 'pomegranate', name: 'Pomegranate', description: 'High-value fruit with export market.', expectedYield: 25, profitability: 93, sustainability: 90, mspPrice: 12000, type: 'fruit', seasons: ['kharif'], soilTypes: ['black-soil', 'loamy', 'sandy-loam'] },
  { id: 'kidney-bean', name: 'Kidney Bean', description: 'Premium pulse crop with export demand.', expectedYield: 20, profitability: 88, sustainability: 85, mspPrice: 7200, type: 'pulse', seasons: ['rabi', 'kharif'], soilTypes: ['loamy', 'sandy-loam'] },
  { id: 'rose', name: 'Rose', description: 'Premium floriculture crop for cut flowers.', expectedYield: 150, profitability: 95, sustainability: 85, mspPrice: 5000, type: 'flower', seasons: ['kharif', 'rabi'], soilTypes: ['loamy', 'sandy-loam'] },
  { id: 'dragon-fruit', name: 'Dragon Fruit', description: 'Exotic high-value fruit with growing demand.', expectedYield: 15, profitability: 94, sustainability: 88, mspPrice: 20000, type: 'exotic', seasons: ['kharif', 'rabi'], soilTypes: ['sandy-loam', 'loamy'] },
  { id: 'strawberry', name: 'Strawberry', description: 'High-value exotic fruit with export potential.', expectedYield: 20, profitability: 96, sustainability: 84, mspPrice: 15000, type: 'exotic', seasons: ['rabi'], soilTypes: ['loamy', 'sandy-loam'] },
  { id: 'blueberry', name: 'Blueberry', description: 'Premium superfruit with export potential.', expectedYield: 12, profitability: 97, sustainability: 89, mspPrice: 25000, type: 'exotic', seasons: ['rabi'], soilTypes: ['sandy-loam', 'loamy'] },
];

const getFallbackRecommendations = (season: string, soilType: string) => {
  let results = CROP_DATABASE.filter(
    (c) => c.seasons.includes(season) && c.soilTypes.includes(soilType)
  ).sort((a, b) => b.profitability - a.profitability).slice(0, 8);

  if (results.length === 0) {
    results = CROP_DATABASE.filter((c) => c.seasons.includes(season))
      .sort((a, b) => b.profitability - a.profitability)
      .slice(0, 8);
  }

  return { success: true, source: 'static', data: results };
};
