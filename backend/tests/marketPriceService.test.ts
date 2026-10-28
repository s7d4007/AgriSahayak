import { describe, expect, it } from 'vitest';
import { getMarketPrices } from '../src/services/marketPriceService';

describe('getMarketPrices', () => {
  it('returns all reference prices without filters', () => {
    const result = getMarketPrices();

    expect(result).toMatchObject({ success: true, live: false, source: 'reference' });
    expect(result.data.length).toBeGreaterThan(1);
    expect(result.count).toBe(result.data.length);
  });

  it('filters by commodity or variety case-insensitively', () => {
    expect(getMarketPrices('RICE').data.map((price) => price.commodity)).toEqual(['Rice']);
    expect(getMarketPrices('hd-2967').data.map((price) => price.commodity)).toEqual(['Wheat']);
  });

  it('filters by market and returns an empty result for an unknown market', () => {
    expect(getMarketPrices(undefined, 'national').count).toBeGreaterThan(0);
    expect(getMarketPrices(undefined, 'unknown').data).toEqual([]);
  });
});
