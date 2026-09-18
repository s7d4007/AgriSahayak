import { CROPS } from '../data/agriData';

interface AdvisoryRequest {
  district?: string;
  season: string;
  soilType: string;
}

/**
 * Get crop recommendations from static data based on season and soil type.
 */
export const getCropRecommendations = async (params: AdvisoryRequest) => {
  const { season, soilType } = params;

  try {
    let results = CROPS.filter(
      (c) => c.seasons.includes(season) && c.soils.includes(soilType)
    ).sort((a, b) => b.profitability - a.profitability).slice(0, 8);

    if (results.length === 0) {
      results = CROPS.filter((c) => c.seasons.includes(season))
        .sort((a, b) => b.profitability - a.profitability)
        .slice(0, 8);
    }

    return { success: true, source: 'static', data: results };
  } catch (error) {
    console.error('[advisoryService] Error serving static data:', error);
    return { success: false, error: 'Could not generate recommendations' };
  }
};
