// Crop data for recommendations
export const CROPS = {
  rice: {
    id: 'rice',
    name: 'Rice (Basmati)',
    expectedYield: 50,
    profitability: 85,
    sustainability: 80,
    mspPrice: 2875,
    description: 'High market demand, premium pricing'
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    expectedYield: 45,
    profitability: 75,
    sustainability: 82,
    mspPrice: 2015,
    description: 'Excellent yield in winter season'
  },
  maize: {
    id: 'maize',
    name: 'Maize (Corn)',
    expectedYield: 55,
    profitability: 70,
    sustainability: 78,
    mspPrice: 1848,
    description: 'Versatile crop with multiple uses'
  },
  chickpea: {
    id: 'chickpea',
    name: 'Pulses (Chickpea)',
    expectedYield: 20,
    profitability: 90,
    sustainability: 95,
    mspPrice: 5100,
    description: 'Nitrogen-fixing, sustainable farming'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    expectedYield: 25,
    profitability: 80,
    sustainability: 85,
    mspPrice: 6715,
    description: 'High-value crop with good oil yield'
  },
  sugarcane: {
    id: 'sugarcane',
    name: 'Sugarcane',
    expectedYield: 70,
    profitability: 72,
    sustainability: 65,
    mspPrice: 290,
    description: 'High return crop, requires water management'
  }
};

// Soil types
export const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial' },
  { id: 'black', name: 'Black Soil' },
  { id: 'red', name: 'Red Soil' },
  { id: 'laterite', name: 'Laterite' },
  { id: 'sandy', name: 'Sandy Loam' }
];

// Seasons
export const SEASONS = [
  { id: 'kharif', name: 'Kharif (Monsoon)' },
  { id: 'rabi', name: 'Rabi (Winter)' },
  { id: 'summer', name: 'Summer' }
];

// Districts (Sample for Maharashtra)
export const DISTRICTS = [
  { id: 'pune', name: 'Pune' },
  { id: 'nashik', name: 'Nashik' },
  { id: 'sangli', name: 'Sangli' },
  { id: 'kolhapur', name: 'Kolhapur' },
  { id: 'satara', name: 'Satara' },
  { id: 'aurangabad', name: 'Aurangabad' },
  { id: 'ahmednagar', name: 'Ahmednagar' },
  { id: 'solapur', name: 'Solapur' }
];

// Common crop diseases
export const DISEASES = [
  {
    id: 'leaf-spot',
    name: 'Leaf Spot',
    treatment: 'Use copper-based fungicides, remove infected leaves',
    prevention: 'Ensure proper spacing and ventilation',
    commonCrops: ['rice', 'wheat', 'maize']
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    treatment: 'Spray sulfur or neem oil solutions',
    prevention: 'Avoid overhead watering, maintain air circulation',
    commonCrops: ['wheat', 'chickpea']
  },
  {
    id: 'rust',
    name: 'Rust Disease',
    treatment: 'Apply triadimefon or other rust-specific fungicides',
    prevention: 'Plant resistant varieties, rotate crops',
    commonCrops: ['wheat', 'maize']
  },
  {
    id: 'blight',
    name: 'Blight Disease',
    treatment: 'Use systemic fungicides, remove affected parts',
    prevention: 'Improve drainage, avoid dense planting',
    commonCrops: ['rice', 'maize']
  },
  {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    treatment: 'No direct cure, manage insects that transmit it',
    prevention: 'Use certified seeds, control aphids and insects',
    commonCrops: ['rice', 'maize']
  },
  {
    id: 'anthracnose',
    name: 'Anthracnose',
    treatment: 'Fungicide sprays, remove infected plant parts',
    prevention: 'Crop rotation, proper sanitation',
    commonCrops: ['maize', 'sunflower']
  }
];

// Agricultural news (sample data)
export const NEWS_ITEMS = [
  {
    id: 'news-1',
    category: 'scheme',
    title: 'PM Kisan Yojana Beneficiaries Increased',
    description: 'Government increases support for small farmers under PM Kisan scheme',
    date: new Date().toISOString(),
    source: 'Agricultural Ministry',
    type: 'info',
    articleUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'news-2',
    category: 'weather',
    title: 'Heavy Rains Expected Next Week',
    description: 'Meteorological Department warns of heavy rainfall in agricultural regions',
    date: new Date().toISOString(),
    source: 'IMD',
    type: 'warning',
    articleUrl: 'https://mausam.imd.gov.in'
  },
  {
    id: 'news-3',
    category: 'market',
    title: 'Rice Prices Surge in FCI Procurement',
    description: 'Food Corporation of India increases rice procurement at higher MSP',
    date: new Date().toISOString(),
    source: 'FCI',
    type: 'info',
    articleUrl: 'https://fci.gov.in'
  }
];

// Market prices (sample data)
export const MARKET_PRICES = [
  {
    commodity: 'Rice',
    mspPrice: 2875,
    marketPrice: 3100,
    trend: 'up',
    lastUpdated: new Date().toISOString()
  },
  {
    commodity: 'Wheat',
    mspPrice: 2015,
    marketPrice: 2050,
    trend: 'stable',
    lastUpdated: new Date().toISOString()
  },
  {
    commodity: 'Maize',
    mspPrice: 1848,
    marketPrice: 1750,
    trend: 'down',
    lastUpdated: new Date().toISOString()
  },
  {
    commodity: 'Chickpea',
    mspPrice: 5100,
    marketPrice: 5300,
    trend: 'up',
    lastUpdated: new Date().toISOString()
  }
];

// Supported languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' }
];

// App version
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'AgriSahayak';

// Cache duration in milliseconds
export const CACHE_DURATION = {
  STATIC: 30 * 24 * 60 * 60 * 1000, // 30 days
  DYNAMIC: 24 * 60 * 60 * 1000, // 24 hours
  PRICES: 6 * 60 * 60 * 1000 // 6 hours
};
