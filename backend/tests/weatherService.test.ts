import { describe, expect, it } from 'vitest';

describe('fetchWeatherData', () => {
  it('returns an offline fallback with the requested coordinates when no key is configured', async () => {
    delete process.env.OPENWEATHER_KEY;
    const { fetchWeatherData } = await import('../src/services/weatherService');
    const result = await fetchWeatherData(19.076, 72.8777);

    expect(result).toMatchObject({
      success: true,
      offline: true,
      data: { location: 'Offline Mode', latitude: 19.076, longitude: 72.8777 },
    });
    expect(result.data?.agriculturalTips.length).toBeGreaterThan(0);
  });
});
