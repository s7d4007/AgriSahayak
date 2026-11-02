import { initDB } from './db';

type FeedbackItem = {
  id: string;
  message: string;
  email?: string;
  rating?: number;
  language: string;
  createdAt: string;
  synced?: boolean;
};

export type FeedbackSubmission = Omit<FeedbackItem, 'id' | 'synced'>;

export async function saveFeedback(item: FeedbackItem): Promise<void> {
  const db = await initDB();
  await db.put('feedback', item);
}

export async function getAllFeedback(): Promise<FeedbackItem[]> {
  const db = await initDB();
  return db.getAll('feedback');
}

function getFormspreeEndpoint(): string | null {
  const configuredEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
  if (!configuredEndpoint) return null;

  try {
    const endpoint = new URL(configuredEndpoint);
    const isAllowedHost =
      endpoint.hostname === 'formspree.io' || endpoint.hostname === 'www.formspree.io';
    const isSecure = endpoint.protocol === 'https:';

    if (!isAllowedHost || !isSecure) {
      console.error('Feedback endpoint must be an HTTPS Formspree URL.');
      return null;
    }

    return endpoint.toString();
  } catch {
    console.error('Feedback endpoint is not a valid URL.');
    return null;
  }
}

export async function submitFeedback(feedback: FeedbackSubmission): Promise<{
  submitted: boolean;
  savedOffline: boolean;
}> {
  const endpoint = getFormspreeEndpoint();
  const item: FeedbackItem = {
    ...feedback,
    id: crypto.randomUUID(),
    synced: false,
  };

  if (!endpoint) {
    await saveFeedback(item);
    return { submitted: false, savedOffline: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: feedback.message,
        email: feedback.email,
        language: feedback.language,
        submittedAt: feedback.createdAt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Feedback submission failed with status ${response.status}`);
    }

    return { submitted: true, savedOffline: false };
  } catch (error) {
    console.error('Feedback submission failed; saving locally for retry.', error);
    await saveFeedback(item);
    return { submitted: false, savedOffline: true };
  }
}
