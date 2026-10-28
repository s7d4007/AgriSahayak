import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosGet = vi.fn();

vi.mock('axios', () => ({
  default: { get: axiosGet },
}));

describe('fetchAgriculturalNews', () => {
  beforeEach(() => {
    axiosGet.mockReset();
  });

  it('maps RSS items, strips HTML, and classifies categories', async () => {
    axiosGet.mockResolvedValue({
      data: {
        items: [
          {
            guid: 'weather-1',
            title: '<b>Heavy rain warning</b>',
            description: '<p>Storm expected</p>',
            link: 'https://example.com/weather',
            pubDate: '2026-01-01',
          },
          {
            title: 'Farm subsidy announced',
            description: 'Government support',
            link: 'https://example.com/scheme',
          },
        ],
      },
    });

    const { fetchAgriculturalNews } = await import('../src/services/newsService');
    const result = await fetchAgriculturalNews();

    expect(result).toEqual({
      success: true,
      live: true,
      data: [
        expect.objectContaining({
          id: 'weather-1',
          category: 'weather',
          title: 'Heavy rain warning',
          description: 'Storm expected',
          type: 'alert',
        }),
        expect.objectContaining({ category: 'scheme', type: 'warning' }),
      ],
    });
  });

  it('returns an explicit unavailable response when the feed fails', async () => {
    axiosGet.mockRejectedValue(new Error('network unavailable'));
    const { fetchAgriculturalNews } = await import('../src/services/newsService');

    await expect(fetchAgriculturalNews()).resolves.toEqual({
      success: false,
      data: [],
      live: false,
      error: 'Live news is currently unavailable.',
    });
  });
});
