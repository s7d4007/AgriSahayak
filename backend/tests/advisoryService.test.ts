import { describe, expect, it } from 'vitest';
import { getCropRecommendations } from '../src/services/advisoryService';

describe('getCropRecommendations', () => {
  it('returns soil-matched crops ordered by profitability', async () => {
    const result = await getCropRecommendations({ season: 'kharif', soilType: 'alluvial' });

    expect(result.success).toBe(true);
    expect(result.source).toBe('static');
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.length).toBeLessThanOrEqual(8);
    expect(result.data[0].profitability).toBeGreaterThanOrEqual(
      result.data[result.data.length - 1].profitability
    );
    expect(result.data.every((crop) => crop.seasons.includes('kharif'))).toBe(true);
  });

  it('falls back to season matches when the soil has no matching crops', async () => {
    const result = await getCropRecommendations({ season: 'rabi', soilType: 'unknown-soil' });

    expect(result.success).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((crop) => crop.seasons.includes('rabi'))).toBe(true);
  });
});
