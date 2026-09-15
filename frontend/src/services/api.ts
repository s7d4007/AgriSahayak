import axios from 'axios';

// ─── Backend API base URL ────────────────────────────────
// In development: http://localhost:3001
// In production:  set VITE_API_URL in frontend environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// ─── Response interceptor (error logging only, no auth) ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API error]', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// ─── Types ───────────────────────────────────────────────
export interface CropRecord {
  id: string;
  name: string;
  description: string;
  expectedYield: number;
  profitability: number;
  sustainability: number;
  mspPrice: number;
  type: string;
  seasons: string[];
  soilTypes: string[];
}

// ─── Crop Advisory ───────────────────────────────────────
export const fetchCropRecommendations = async (
  district: string,
  season: string,
  soilType: string
) => {
  try {
    const response = await api.post('/api/advisory/recommend', {
      district,
      season,
      soilType,
    });
    return response.data;
  } catch (error) {
    console.error('[fetchCropRecommendations] error:', error);
    return { success: false, error: 'Failed to fetch recommendations' };
  }
};

// ─── Market Prices ───────────────────────────────────────
export const fetchMarketPrices = async (commodity?: string, market?: string) => {
  try {
    const response = await api.get('/api/market-prices', {
      params: { commodity, market },
    });
    return response.data;
  } catch (error) {
    console.error('[fetchMarketPrices] error:', error);
    return { success: false, error: 'Failed to fetch market prices' };
  }
};

export const fetchMandiPrices = async (marketQuery: string) => {
  return fetchMarketPrices(marketQuery);
};

// ─── News ────────────────────────────────────────────────
export const fetchNews = async () => {
  try {
    const response = await api.get('/api/news');
    return response.data;
  } catch (error) {
    console.error('[fetchNews] error:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
};

// ─── Weather ─────────────────────────────────────────────
export const fetchWeather = async (latitude: number, longitude: number) => {
  try {
    const response = await api.get('/api/weather', {
      params: { lat: latitude, lon: longitude },
    });
    return response.data;
  } catch (error) {
    console.error('[fetchWeather] error:', error);
    // Return offline fallback so the UI still renders
    return {
      success: true,
      offline: true,
      data: {
        location: 'Offline Mode',
        temperature: 28,
        humidity: 65,
        feelsLike: 28,
        windSpeed: 5,
        pressure: 1013,
        cloudCover: 10,
        description: 'Weather unavailable (backend offline)',
        rainfall: 0,
        latitude,
        longitude,
        agriculturalTips: [
          'Check your connection and backend status.',
          'Visit mausam.imd.gov.in for current weather.',
        ],
      },
    };
  }
};

// ─── Location Helper ─────────────────────────────────────
export const getLocationCoordinates = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
        () => resolve({ lat: 19.076, lon: 72.8777 }) // Mumbai fallback
      );
    } else {
      resolve({ lat: 19.076, lon: 72.8777 });
    }
  });
};

// ─── Disease Detection ───────────────────────────────────
// Sends the raw File as multipart/form-data; backend calls Hugging Face.
export const detectPlantDisease = async (imageData: string | File) => {
  try {
    const formData = new FormData();

    if (imageData instanceof File) {
      formData.append('image', imageData);
    } else {
      // imageData is a base64 data URL – convert to Blob for FormData
      const response = await fetch(imageData);
      const blob = await response.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      formData.append('image', blob, `plant.${ext}`);
    }

    const result = await api.post('/api/disease/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000, // longer timeout for HF inference
    });

    return result.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { error?: string; retryable?: boolean } };
      message?: string;
    };

    if (err.response?.status === 503) {
      return {
        success: false,
        retryable: true,
        error: err.response.data?.error || 'Model is loading. Please try again.',
      };
    }

    if (err.response?.status === 413) {
      return { success: false, error: 'Image too large (max 10 MB).' };
    }

    console.error('[detectPlantDisease] error:', error);
    return { success: false, error: 'Detection failed. Please try again.' };
  }
};

// ─── Crop Knowledge ──────────────────────────────────────
export const fetchCrops = async () => {
  try {
    const response = await api.get('/api/crops');
    return response.data;
  } catch (error) {
    console.error('[fetchCrops] error:', error);
    return { success: false, error: 'Failed to fetch crops' };
  }
};

export const fetchDiseases = async () => {
  try {
    const response = await api.get('/api/diseases');
    return response.data;
  } catch (error) {
    console.error('[fetchDiseases] error:', error);
    return { success: false, error: 'Failed to fetch diseases' };
  }
};

// ─── Feedback (local log – no backend endpoint needed) ───
export const submitFeedback = async (feedback: {
  message: string;
  email?: string;
  rating?: number;
}) => {
  console.log('[Feedback submitted locally]', feedback);
  return { success: true, message: 'Thank you for your feedback!' };
};

// ─── Sync Offline Data ───────────────────────────────────
export const syncOfflineData = async () => {
  try {
    const [prices, news] = await Promise.all([fetchMarketPrices(), fetchNews()]);
    return {
      success: true,
      synced: {
        prices: prices.data?.length || 0,
        news: news.data?.length || 0,
      },
    };
  } catch (error) {
    console.error('[syncOfflineData] error:', error);
    return { success: false, error: 'Failed to sync offline data' };
  }
};

export default api;
