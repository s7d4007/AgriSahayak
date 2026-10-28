import { beforeEach, describe, expect, it, vi } from 'vitest';

const request = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: { response: { use: vi.fn() } },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => request),
  },
}));

describe('frontend API helpers', () => {
  beforeEach(() => {
    request.get.mockReset();
    request.post.mockReset();
  });

  it('returns backend market-price data on success', async () => {
    request.get.mockResolvedValue({ data: { success: true, data: [{ commodity: 'Rice' }] } });
    const { fetchMarketPrices } = await import('./api');

    await expect(fetchMarketPrices('rice')).resolves.toEqual({
      success: true,
      data: [{ commodity: 'Rice' }],
    });
    expect(request.get).toHaveBeenCalledWith('/api/market-prices', {
      params: { commodity: 'rice', market: undefined },
    });
  });

  it('returns a safe error response when a request fails', async () => {
    request.get.mockRejectedValue(new Error('backend unavailable'));
    const { fetchNews } = await import('./api');

    await expect(fetchNews()).resolves.toEqual({
      success: false,
      error: 'Failed to fetch news',
    });
  });

  it('uses the Mumbai fallback when geolocation is unavailable', async () => {
    const { getLocationCoordinates } = await import('./api');

    await expect(getLocationCoordinates()).resolves.toEqual({ lat: 19.076, lon: 72.8777 });
  });
});
