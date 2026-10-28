type FeedbackItem = {
  id: string;
  message: string;
  rating?: number;
  language: string;
  createdAt: string;
  synced?: boolean;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open("agrisahayak-db", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("feedback")) {
          db.createObjectStore("feedback", { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
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
