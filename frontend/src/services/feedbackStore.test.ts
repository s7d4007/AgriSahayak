import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('feedbackStore', () => {
  beforeEach(async () => {
    vi.resetModules();
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

});
