import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface AgriSahayakDB extends DBSchema {
  crops: {
    key: string;
    value: {
      id: string;
      name: string;
      mspPrice: number;
      data: Record<string, unknown>;
      timestamp: number;
    };
  };
  prices: {
    key: string;
    value: {
      commodity: string;
      mspPrice: number;
      marketPrice: number;
      trend: string;
      timestamp: number;
    };
  };
  news: {
    key: string;
    value: {
      id: string;
      title: string;
      content: string;
      category: string;
      timestamp: number;
    };
  };
  diseases: {
    key: string;
    value: {
      id: string;
      name: string;
      treatment: string;
      prevention: string;
      timestamp: number;
    };
  };
  diagnostics: {
    key: string;
    value: {
      id: string;
      imageData: string;
      result: Record<string, unknown>;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<AgriSahayakDB> | null = null;

export const initDB = async () => {
  if (db) return db;

  db = await openDB<AgriSahayakDB>('agrisahayak-db', 1, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('crops')) {
        db.createObjectStore('crops', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('prices')) {
        db.createObjectStore('prices', { keyPath: 'commodity' });
      }
      if (!db.objectStoreNames.contains('news')) {
        db.createObjectStore('news', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('diseases')) {
        db.createObjectStore('diseases', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('diagnostics')) {
        db.createObjectStore('diagnostics', { keyPath: 'id' });
      }
    },
  });

  return db;
};

// Crop-related operations
export const saveCrop = async (cropId: string, cropData: Record<string, unknown>) => {
  const database = await initDB();
  await database.put('crops', {
    id: cropId,
    name: cropData.name as string,
    mspPrice: cropData.mspPrice as number,
    data: cropData,
    timestamp: Date.now(),
  });
};

export const getCrop = async (cropId: string) => {
  const database = await initDB();
  return await database.get('crops', cropId);
};

export const getAllCrops = async () => {
  const database = await initDB();
  return await database.getAll('crops');
};

// Price-related operations
export const savePrice = async (commodity: string, priceData: Record<string, unknown>) => {
  const database = await initDB();
  await database.put('prices', {
    commodity,
    mspPrice: priceData.mspPrice as number,
    marketPrice: priceData.marketPrice as number,
    trend: priceData.trend as string,
    timestamp: Date.now(),
  });
};

export const getPrice = async (commodity: string) => {
  const database = await initDB();
  return await database.get('prices', commodity);
};

export const getAllPrices = async () => {
  const database = await initDB();
  return await database.getAll('prices');
};

// News-related operations
export const saveNews = async (newsItem: Record<string, unknown>) => {
  const database = await initDB();
  await database.put('news', {
    id: newsItem.id as string,
    title: newsItem.title as string,
    content: newsItem.description as string,
    category: newsItem.category as string,
    timestamp: Date.now(),
  });
};

export const getNews = async (newsId: string) => {
  const database = await initDB();
  return await database.get('news', newsId);
};

export const getAllNews = async () => {
  const database = await initDB();
  return await database.getAll('news');
};

// Disease-related operations
export const saveDisease = async (diseaseData: Record<string, unknown>) => {
  const database = await initDB();
  await database.put('diseases', {
    id: diseaseData.id as string,
    name: diseaseData.name as string,
    treatment: diseaseData.treatment as string,
    prevention: diseaseData.prevention as string,
    timestamp: Date.now(),
  });
};

export const getDisease = async (diseaseId: string) => {
  const database = await initDB();
  return await database.get('diseases', diseaseId);
};

export const getAllDiseases = async () => {
  const database = await initDB();
  return await database.getAll('diseases');
};

// Diagnostics-related operations
export const saveDiagnostic = async (diagnosticData: Record<string, unknown>) => {
  const database = await initDB();
  const id = `diag-${Date.now()}`;
  await database.put('diagnostics', {
    id,
    imageData: diagnosticData.imageData as string,
    result: diagnosticData.result as Record<string, unknown>,
    timestamp: Date.now(),
  });
  return id;
};

export const getDiagnostic = async (diagnosticId: string) => {
  const database = await initDB();
  return await database.get('diagnostics', diagnosticId);
};

export const getAllDiagnostics = async () => {
  const database = await initDB();
  return await database.getAll('diagnostics');
};

// Cleanup operations
export const clearDatabase = async () => {
  const database = await initDB();
  await database.clear('crops');
  await database.clear('prices');
  await database.clear('news');
  await database.clear('diseases');
  await database.clear('diagnostics');
};

export const getDBSize = async () => {
  try {
    // Get IndexedDB size via Storage API
    if (!navigator.storage || !navigator.storage.estimate) {
      return { usage: 0, quota: 0 };
    }

    const estimate = await navigator.storage.estimate();
    let cacheSize = 0;

    // Try to get cache size from service worker if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const response = await new Promise<{ cacheSize: number }>((resolve, reject) => {
          const messageChannel = new MessageChannel();
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(
              { type: 'GET_CACHE_SIZE' },
              [messageChannel.port2]
            );
          }
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data);
          };
          setTimeout(() => reject('Timeout'), 5000);
        });
        cacheSize = response.cacheSize || 0;
      } catch (error) {
        console.log('Could not get cache size from service worker:', error);
      }
    }

    const totalUsage = (estimate.usage || 0) + cacheSize;

    return {
      usage: totalUsage,
      quota: estimate.quota || 0,
    };
  } catch (error) {
    console.error('Error getting DB size:', error);
    return { usage: 0, quota: 0 };
  }
};
