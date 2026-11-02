import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('feedbackStore', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('agrisahayak-db');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });

  it('persists feedback and reads it back', async () => {
    const { getAllFeedback, saveFeedback } = await import('./feedbackStore');
    const feedback = {
      id: 'feedback-1',
      message: 'Helpful advice',
      rating: 5,
      language: 'en',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    await saveFeedback(feedback);

    await expect(getAllFeedback()).resolves.toEqual([feedback]);
  });

  it('submits feedback to the configured Formspree endpoint', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test-form');
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { submitFeedback } = await import('./feedbackStore');

    await expect(
      submitFeedback({
        message: 'Helpful advice',
        email: 'farmer@example.com',
        language: 'en',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).resolves.toEqual({ submitted: true, savedOffline: false });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/test-form',
      expect.objectContaining({
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Helpful advice',
          email: 'farmer@example.com',
          language: 'en',
          submittedAt: '2026-01-01T00:00:00.000Z',
        }),
      })
    );
  });

  it('saves feedback locally when Formspree is unavailable', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test-form');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { getAllFeedback, submitFeedback } = await import('./feedbackStore');

    await expect(
      submitFeedback({
        message: 'Works offline',
        language: 'en',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).resolves.toEqual({ submitted: false, savedOffline: true });

    await expect(getAllFeedback()).resolves.toEqual([
      expect.objectContaining({
        message: 'Works offline',
        language: 'en',
        createdAt: '2026-01-01T00:00:00.000Z',
        synced: false,
      }),
    ]);
  });

  it('does not send to an untrusted feedback endpoint', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://example.com/collect');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { submitFeedback } = await import('./feedbackStore');

    await expect(
      submitFeedback({
        message: 'Keep this local',
        language: 'en',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).resolves.toEqual({ submitted: false, savedOffline: true });

    expect(fetchMock).not.toHaveBeenCalled();
  });

});
