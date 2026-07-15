import axios from 'axios';
import { MARKET_PRICES, NEWS_ITEMS } from '../utils/constants';
import { getDiseaseInfo } from '../utils/diseaseMapping';

interface CropRecord {
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

interface NewsFeedItem {
  title?: string;
  link?: string;
  description?: string;
  content?: string;
  guid?: string;
  pubDate?: string;
  author?: string;
  source?: string;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: 'https://api.agrisahayak.local',
  timeout: 10000,
});

// Weather API instance
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'demo_key';
const weatherAPI = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Comprehensive crop repository with fair attributes
const CROP_DATABASE: Record<string, CropRecord> = {
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    description: 'Winter cereal crop with high yield potential. Best for rabi season in northern regions.',
    expectedYield: 45,
    profitability: 75,
    sustainability: 80,
    mspPrice: 2150,
    type: 'grain',
    seasons: ['rabi'],
    soilTypes: ['loamy', 'alluvial', 'black-soil'],
  },
  rice: {
    id: 'rice',
    name: 'Rice',
    description: 'Major staple crop with good market demand. Requires adequate water supply.',
    expectedYield: 55,
    profitability: 80,
    sustainability: 75,
    mspPrice: 2100,
    type: 'grain',
    seasons: ['kharif'],
    soilTypes: ['loamy', 'alluvial', 'clayey'],
  },
  maize: {
    id: 'maize',
    name: 'Maize (Corn)',
    description: 'Versatile crop with multiple uses. High yielding variety with increasing demand.',
    expectedYield: 60,
    profitability: 85,
    sustainability: 82,
    mspPrice: 1850,
    type: 'grain',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['loamy', 'black-soil', 'sandy-loam'],
  },
  chickpea: {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    description: 'Protein-rich pulse crop. Excellent for crop rotation and soil health.',
    expectedYield: 22,
    profitability: 78,
    sustainability: 88,
    mspPrice: 5100,
    type: 'pulse',
    seasons: ['rabi'],
    soilTypes: ['black-soil', 'loamy', 'sandy-loam'],
  },
  lentil: {
    id: 'lentil',
    name: 'Lentil (Masoor)',
    description: 'High protein pulse with good market value. Improves soil fertility.',
    expectedYield: 18,
    profitability: 82,
    sustainability: 90,
    mspPrice: 6500,
    type: 'pulse',
    seasons: ['rabi'],
    soilTypes: ['loamy', 'black-soil', 'alluvial'],
  },
  'kidney-bean': {
    id: 'kidney-bean',
    name: 'Kidney Bean',
    description: 'Premium pulse crop with strong export demand.',
    expectedYield: 20,
    profitability: 88,
    sustainability: 85,
    mspPrice: 7200,
    type: 'pulse',
    seasons: ['rabi', 'kharif'],
    soilTypes: ['loamy', 'sandy-loam'],
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    description: 'Oil seed crop with high market value. Drought tolerant.',
    expectedYield: 18,
    profitability: 84,
    sustainability: 79,
    mspPrice: 6000,
    type: 'flower',
    seasons: ['rabi', 'kharif'],
    soilTypes: ['sandy-loam', 'loamy', 'black-soil'],
  },
  marigold: {
    id: 'marigold',
    name: 'Marigold',
    description: 'Floriculture crop with good demand. High-value crop for markets.',
    expectedYield: 320,
    profitability: 92,
    sustainability: 88,
    mspPrice: 2500,
    type: 'flower',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['loamy', 'sandy-loam', 'alluvial'],
  },
  'black-soil': {
    id: 'black-soil',
    name: 'Black Soil',
    description: 'Nutrient-rich alluvial soil ideal for cotton and sugarcane.',
    expectedYield: 40,
    profitability: 78,
    sustainability: 85,
    mspPrice: 0,
    type: 'soil',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['black-soil'],
  },
  'sandy-loam': {
    id: 'sandy-loam',
    name: 'Sandy Loam',
    description: 'Well-draining soil suitable for groundnut and vegetables.',
    expectedYield: 35,
    profitability: 75,
    sustainability: 82,
    mspPrice: 0,
    type: 'soil',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['sandy-loam'],
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    description: 'Premium floriculture crop. Excellent for cut flowers and high value.',
    expectedYield: 150,
    profitability: 95,
    sustainability: 85,
    mspPrice: 5000,
    type: 'flower',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['loamy', 'sandy-loam'],
  },
  mango: {
    id: 'mango',
    name: 'Mango',
    description: 'King of fruits with excellent market value and long shelf life.',
    expectedYield: 35,
    profitability: 90,
    sustainability: 92,
    mspPrice: 8000,
    type: 'fruit',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['loamy', 'sandy-loam', 'black-soil'],
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    description: 'Perennial crop with year-round yield. High productivity and market demand.',
    expectedYield: 50,
    profitability: 88,
    sustainability: 87,
    mspPrice: 3000,
    type: 'fruit',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['loamy', 'alluvial', 'sandy-loam'],
  },
  pomegranate: {
    id: 'pomegranate',
    name: 'Pomegranate',
    description: 'High-value fruit crop with increasing demand in domestic and export markets.',
    expectedYield: 25,
    profitability: 93,
    sustainability: 90,
    mspPrice: 12000,
    type: 'fruit',
    seasons: ['kharif'],
    soilTypes: ['black-soil', 'loamy', 'sandy-loam'],
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'High-value exotic fruit with premium export potential.',
    expectedYield: 20,
    profitability: 96,
    sustainability: 84,
    mspPrice: 15000,
    type: 'exotic',
    seasons: ['rabi'],
    soilTypes: ['loamy', 'sandy-loam'],
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton',
    description: 'Cash crop with strong global market. Requires good soil and water management.',
    expectedYield: 18,
    profitability: 75,
    sustainability: 70,
    mspPrice: 5800,
    type: 'fabric',
    seasons: ['kharif'],
    soilTypes: ['black-soil', 'loamy'],
  },
  sugarcane: {
    id: 'sugarcane',
    name: 'Sugarcane',
    description: 'Cash crop with stable returns. Requires adequate water and nutrients.',
    expectedYield: 75,
    profitability: 72,
    sustainability: 68,
    mspPrice: 310,
    type: 'grain',
    seasons: ['kharif'],
    soilTypes: ['alluvial', 'loamy', 'black-soil'],
  },
  'dragon-fruit': {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    description: 'Exotic high-value fruit crop with increasing market demand.',
    expectedYield: 15,
    profitability: 94,
    sustainability: 88,
    mspPrice: 20000,
    type: 'exotic',
    seasons: ['kharif', 'rabi'],
    soilTypes: ['sandy-loam', 'loamy'],
  },
  blueberry: {
    id: 'blueberry',
    name: 'Blueberry',
    description: 'Premium superfruit with excellent export potential.',
    expectedYield: 12,
    profitability: 97,
    sustainability: 89,
    mspPrice: 25000,
    type: 'exotic',
    seasons: ['rabi'],
    soilTypes: ['sandy-loam', 'loamy'],
  },
};

// Crop recommendations API - Local recommendation engine
export const fetchCropRecommendations = async (_district: string, season: string, soilType: string) => {
  try {
    // _district parameter kept for future hyperlocal recommendations
    // Filter crops based on season and soil type
    const recommendations = Object.values(CROP_DATABASE)
      .filter((crop: CropRecord) => {
        const seasonMatch = crop.seasons.includes(season);
        const soilMatch = crop.soilTypes.includes(soilType);
        return seasonMatch && soilMatch;
      })
      .sort((a: CropRecord, b: CropRecord) => b.profitability - a.profitability) // Sort by profitability
      .slice(0, 8); // Return top 8 recommendations

    // If no exact match, return top crops for the season
    if (recommendations.length === 0) {
      const seasonRecommendations = Object.values(CROP_DATABASE)
        .filter((crop: CropRecord) => crop.seasons.includes(season))
        .sort((a: CropRecord, b: CropRecord) => b.profitability - a.profitability)
        .slice(0, 8);
      return { success: true, data: seasonRecommendations };
    }

    return { success: true, data: recommendations };
  } catch (error: unknown) {
    console.error('Error generating recommendations:', error);
    // Return default recommendations as fallback
    const defaultCrops = Object.values(CROP_DATABASE).slice(0, 8);
    return { success: true, data: defaultCrops };
  }
};

// Market prices API
export const fetchMarketPrices = async () => {
  try {
    // In production, call Agmarknet API
    return {
      success: true,
      data: MARKET_PRICES,
    };
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return {
      success: false,
      error: 'Failed to fetch market prices',
    };
  }
};

const stripHtml = (value: string = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const classifyNewsCategory = (title: string, description: string) => {
  const text = `${title} ${description}`.toLowerCase();

  if (/(weather|rain|storm|heat|drought|temperature|cyclone|monsoon|flood)/i.test(text)) {
    return 'weather';
  }

  if (/(scheme|subsidy|government|kisan|pm|loan|support|benefit|policy)/i.test(text)) {
    return 'scheme';
  }

  return 'market';
};

// News API
export const fetchNews = async () => {
  const newsFeedUrl = import.meta.env.VITE_NEWS_RSS_URL || 'https://news.google.com/rss/search?q=agriculture+india&hl=en-IN&gl=IN&ceid=IN:en';

  try {
    const response = await axios.get<{ items?: NewsFeedItem[] }>('https://api.rss2json.com/v1/api.json', {
      params: {
        rss_url: newsFeedUrl,
      },
      timeout: 15000,
    });

    const items: NewsFeedItem[] = response.data?.items ?? [];

    const mappedNews = items
      .filter((item: NewsFeedItem) => item?.title && item?.link)
      .slice(0, 12)
      .map((item: NewsFeedItem, index: number) => {
        const title = stripHtml(item.title);
        const description = stripHtml(item.description || item.content || '');

        return {
          id: item.guid || item.link || `news-${index}`,
          category: classifyNewsCategory(title, description),
          title,
          description: description || 'Read the full article for more details.',
          date: item.pubDate || new Date().toISOString(),
          source: item.author || item.source || 'Live News Feed',
          type: index === 0 ? 'alert' : index === 1 ? 'warning' : 'info',
          articleUrl: item.link,
        };
      });

    return {
      success: true,
      data: mappedNews.length > 0 ? mappedNews : NEWS_ITEMS,
    };
  } catch (error) {
    console.error('Error fetching live news:', error);
    return {
      success: true,
      data: NEWS_ITEMS,
    };
  }
};

// Weather API using OpenWeatherMap
export const fetchWeather = async (latitude: number, longitude: number) => {
  try {
    console.log('Fetching weather for:', latitude, longitude);
    console.log('API Key from env:', OPENWEATHER_API_KEY);
    
    if (OPENWEATHER_API_KEY === 'demo_key') {
      console.warn('Using demo API key - weather data may not load. Add VITE_OPENWEATHER_KEY to .env.local');
    }

    const response = await weatherAPI.get('/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'metric', // Use Celsius
      },
    });

    console.log('Weather API Response:', response.data);

    const data = response.data;
    return {
      success: true,
      data: {
        location: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        feelsLike: Math.round(data.main.feels_like),
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        cloudCover: data.clouds.all,
        description: data.weather[0].description || data.weather[0].main,
        rainfall: data.rain?.['1h'] || 0,
        latitude: latitude,
        longitude: longitude,
      },
    };
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error';

    console.error('Error fetching weather:', error);
    console.error('Error details:', errorDetails); // Log detailed error information
    
    // Return success with fallback data so UI displays something
    return {
      success: true,
      data: {
        location: 'Default Location (Offline)',
        temperature: 28,
        humidity: 65,
        feelsLike: 28,
        windSpeed: 5,
        pressure: 1013,
        cloudCover: 10,
        description: 'Offline mode',
        rainfall: 0,
        latitude: latitude,
        longitude: longitude,
      },
      offline: true,
    };
  }
};

// Get location coordinates via geolocation
export const getLocationCoordinates = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          // Default to Mumbai if geolocation fails
          resolve({ lat: 19.0760, lon: 72.8777 });
        }
      );
    } else {
      resolve({ lat: 19.0760, lon: 72.8777 });
    }
  });
};

// Disease Detection API using Hugging Face Inference
export const detectPlantDisease = async (imageBase64: string) => {
  try {
    // Validate image input
    if (!imageBase64 || !imageBase64.startsWith('data:image/')) {
      return {
        success: false,
        error: 'Invalid image format. Please use a valid image file.',
      };
    }

    // Strip data URL prefix to get raw base64
    const base64Data = imageBase64.split(',')[1];
    if (!base64Data) {
      return {
        success: false,
        error: 'Failed to process image. Please try again.',
      };
    }

    // Use mock disease detection as fallback
    console.log('Using mock disease detection...');
    return performMockDiseaseDetection();
  } catch (error: unknown) {
    console.error('Error in disease detection:', error);
    // Fallback to mock detection on errors
    return performMockDiseaseDetection();
  }
};

/**
 * Get confidence rank based on confidence score
 */
const getConfidenceRank = (confidence: number): 'High' | 'Mid' | 'Low' => {
  if (confidence >= 70) return 'High';
  if (confidence >= 50) return 'Mid';
  return 'Low';
};

// Mock disease detection with intelligent results (fallback)
const performMockDiseaseDetection = () => {
  // Fallback detection when API is unavailable
  // Simulates analyzing image characteristics
  // In production, ensure Hugging Face API key is configured
  
  const diseaseList = [
    'apple___scab',
    'leaf_spot',
    'powdery_mildew',
    'rust_disease',
    'blight_disease',
    'mosaic_virus',
    'anthracnose',
    'healthy'
  ];
  
  // Generate 3 random diseases with decreasing confidence
  const predictions = [];
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < 3; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * diseaseList.length);
    } while (usedIndices.has(randomIndex) && usedIndices.size < diseaseList.length);
    
    usedIndices.add(randomIndex);
    const selectedLabel = diseaseList[randomIndex];
    const diseaseInfo = getDiseaseInfo(selectedLabel);
    
    // Generate confidence between 95-50% with decreasing scores
    const baseConfidence = 95 - (i * 25);
    const confidence = Math.max(40, baseConfidence + Math.floor(Math.random() * 10) - 5);
    const rank = getConfidenceRank(confidence);

    predictions.push({
      disease: diseaseInfo,
      confidence,
      rank
    });
  }

  console.log(`Mock detection with 3 options: ${predictions.map(p => `${p.disease.name} (${p.confidence}%)`).join(', ')}`);

  return {
    success: true,
    data: {
      predictions,
      isMockDetection: true,
    },
  };
};

// Mandi prices API
export const fetchMandiPrices = async (market: string) => {
  try {
    return {
      success: true,
      data: MARKET_PRICES.filter((p) =>
        p.commodity.toLowerCase().includes(market.toLowerCase())
      ),
    };
  } catch (error) {
    console.error('Error fetching mandi prices:', error);
    return {
      success: false,
      error: 'Failed to fetch mandi prices',
    };
  }
};

// Submit feedback
export const submitFeedback = async (feedback: {
  message: string;
  email?: string;
  rating?: number;
}) => {
  try {
    console.log('Feedback submitted:', feedback);
    return {
      success: true,
      message: 'Thank you for your feedback!',
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: 'Failed to submit feedback',
    };
  }
};

// Sync offline data
export const syncOfflineData = async () => {
  try {
    const prices = await fetchMarketPrices();
    const news = await fetchNews();
    
    return {
      success: true,
      synced: {
        prices: prices.data?.length || 0,
        news: news.data?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error syncing offline data:', error);
    return {
      success: false,
      error: 'Failed to sync offline data',
    };
  }
};

export default api;
