import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('axios', () => ({
  default: { post },
}));

describe('detectDiseaseFromBuffer', () => {
  let detectDiseaseFromBuffer: typeof import('../src/services/diseaseService').detectDiseaseFromBuffer;

  beforeAll(async () => {
    process.env.KINDWISE_API_KEY = 'test-kindwise-key';
    ({ detectDiseaseFromBuffer } = await import('../src/services/diseaseService'));
  });

  beforeEach(() => {
    post.mockReset();
  });

  it('maps Kindwise crop and the top three disease suggestions', async () => {
    post.mockResolvedValue({
      data: {
        result: {
          crop: { suggestions: [{ id: 'tomato', name: 'Tomato', probability: 0.91 }] },
          disease: {
            suggestions: [
              { name: 'Late blight', probability: 0.82 },
              { name: 'Leaf spot', probability: 0.41 },
              { name: 'Healthy', probability: 0.12 },
              { name: 'Ignored fourth result', probability: 0.05 },
            ],
          },
        },
      },
    });

    const result = await detectDiseaseFromBuffer(Buffer.from('image'), 'image/jpeg');

    expect(post).toHaveBeenCalledWith(
      'https://crop.kindwise.com/api/v1/identification',
      { images: [Buffer.from('image').toString('base64')], similar_images: false },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Api-Key': 'test-kindwise-key',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result.crop).toEqual({ id: 'tomato', name: 'Tomato', confidence: 91 });
    expect(result.predictions).toHaveLength(3);
    expect(result.predictions[0].disease.name).toBe('Late blight');
    expect(result.predictions[0].confidence).toBe(82);
    expect(result.noDiseaseDetected).toBe(false);
  });

  it('returns an empty result when Kindwise identifies no disease', async () => {
    post.mockResolvedValue({
      data: { result: { crop: { suggestions: [] }, disease: { suggestions: [] } } },
    });

    const result = await detectDiseaseFromBuffer(Buffer.from('image'), 'image/jpeg');

    expect(result.predictions).toEqual([]);
    expect(result.noDiseaseDetected).toBe(true);
  });

  it('reports rejected Kindwise credentials without exposing them', async () => {
    post.mockRejectedValue({ response: { status: 401 } });

    await expect(detectDiseaseFromBuffer(Buffer.from('image'), 'image/jpeg')).rejects.toMatchObject({
      message: 'Kindwise API key was rejected.',
      statusCode: 502,
      retryable: false,
    });
  });
});
