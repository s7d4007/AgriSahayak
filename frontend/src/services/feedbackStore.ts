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

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open("agrisahayak-db", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        if (!db.objectStoreNames.contains("feedback")) {
          db.createObjectStore("feedback", { keyPath: "id" });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

export async function saveFeedback(item: FeedbackItem): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("feedback", "readwrite");
  tx.objectStore("feedback").put(item);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getAllFeedback(): Promise<FeedbackItem[]> {
  const db = await getDb();
  const tx = db.transaction("feedback", "readonly");
  const store = tx.objectStore("feedback");
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
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
