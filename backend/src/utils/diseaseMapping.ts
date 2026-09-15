/**
 * Disease mapping utility for AgriSahayak backend
 * Ported from frontend/src/utils/diseaseMapping.ts
 */

export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  cause: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export const DISEASE_DETAILS: Record<string, DiseaseInfo> = {
  'apple___black_rot': {
    id: 'apple-black-rot',
    name: 'Apple Black Rot',
    scientificName: 'Botryosphaeria obtusa',
    description: 'Black rot is a fungal disease that affects apple trees, causing dark lesions on fruits and cankers on branches.',
    cause: 'Fungal infection (Botryosphaeria obtusa) that enters through wounds or lenticels.',
    symptoms: ['Dark, circular lesions on fruit', 'Fruit appears shriveled', 'Cankers on branches', 'Brown spots on leaves'],
    treatment: ['Prune and remove affected branches', 'Apply copper-based fungicides', 'Spray every 7-10 days', 'Remove mummified fruits'],
    prevention: ['Plant disease-resistant varieties', 'Maintain orchard sanitation', 'Apply dormant oil sprays'],
    severity: 'moderate',
  },
  'apple___cedar_apple_rust': {
    id: 'apple-cedar-apple-rust',
    name: 'Apple Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniper-virginianae',
    description: 'A fungal disease requiring both apple and juniper hosts, characterized by yellow/orange spots on leaves.',
    cause: 'Fungal pathogen requiring cedar/juniper trees. Spores spread via wind.',
    symptoms: ['Yellow to orange spots on leaves', 'Nodules on fruit', 'Premature leaf drop'],
    treatment: ['Remove infected leaves', 'Apply myclobutanil at bud break', 'Continue applications every 10-14 days'],
    prevention: ['Plant away from cedar trees', 'Choose resistant varieties', 'Apply preventive fungicides'],
    severity: 'moderate',
  },
  'apple___scab': {
    id: 'apple-scab',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    description: 'A common fungal disease causing dark spots on leaves and fruit.',
    cause: 'Fungal spores overwintering on fallen leaves, spread by rain during spring.',
    symptoms: ['Olive-brown spots on leaves', 'Brown spots on fruit', 'Lesions on twigs', 'Premature leaf drop'],
    treatment: ['Apply sulfur or copper fungicides every 7-10 days', 'Use myclobutanil', 'Remove infected debris'],
    prevention: ['Choose scab-resistant varieties', 'Rake fallen leaves', 'Avoid overhead watering'],
    severity: 'moderate',
  },
  'leaf_spot': {
    id: 'leaf-spot',
    name: 'Leaf Spot',
    scientificName: 'Various (Cercospora, Alternaria, Phyllosticta)',
    description: 'A fungal disease with circular to irregular brown spots on leaves causing defoliation.',
    cause: 'Various fungal pathogens in warm, humid conditions.',
    symptoms: ['Brown or black circular spots', 'Yellow halo around lesions', 'Large dead areas', 'Premature leaf drop'],
    treatment: ['Remove infected leaves', 'Apply copper fungicides', 'Spray at 7-10 day intervals', 'Improve air circulation'],
    prevention: ['Maintain proper plant spacing', 'Avoid overhead watering', 'Remove fallen leaves regularly'],
    severity: 'mild',
  },
  'powdery_mildew': {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    scientificName: 'Various Erysiphaceae species',
    description: 'A fungal disease causing white powder-like coating on leaves.',
    cause: 'Fungal spores spread by wind. Develops in warm days with cool nights.',
    symptoms: ['White to gray powdery coating', 'Distorted leaf growth', 'Leaf yellowing', 'Reduced fruit quality'],
    treatment: ['Spray sulfur-based fungicides weekly', 'Use neem oil sprays', 'Remove heavily infected leaves'],
    prevention: ['Choose resistant varieties', 'Avoid excess nitrogen fertilization', 'Maintain proper spacing'],
    severity: 'mild',
  },
  'rust_disease': {
    id: 'rust-disease',
    name: 'Rust Disease',
    scientificName: 'Various Pucciniales species',
    description: 'A fungal disease causing rust-colored pustules on leaf undersides.',
    cause: 'Fungal spores spread by wind and water splash. Favored by high humidity.',
    symptoms: ['Rusty-orange pustules on leaves', 'Yellow spots on upper surface', 'Premature leaf drop'],
    treatment: ['Remove affected leaves promptly', 'Apply sulfur-based fungicides', 'Use myclobutanil'],
    prevention: ['Plant resistant varieties', 'Maintain proper spacing', 'Avoid overhead watering'],
    severity: 'moderate',
  },
  'blight_disease': {
    id: 'blight-disease',
    name: 'Blight Disease',
    scientificName: 'Various Phytophthora species',
    description: 'A serious fungal disease causing rapid leaf damage, stem cankers, and fruit rot.',
    cause: 'Fungal pathogens favored by high humidity and poor drainage.',
    symptoms: ['Water-soaked spots turning brown/black', 'Rapid defoliation', 'Stem cankers', 'Fruit rot'],
    treatment: ['Remove infected parts immediately', 'Apply chlorothalonil', 'Use metalaxyl fungicides', 'Improve drainage'],
    prevention: ['Choose blight-resistant varieties', 'Improve soil drainage', 'Avoid overhead watering', 'Mulch to prevent splash'],
    severity: 'severe',
  },
  'mosaic_virus': {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    scientificName: 'Various Potyvirus genera',
    description: 'A viral disease causing mottled, distorted foliage and reduced yield.',
    cause: 'Spread by aphids and other sucking insects. Also via contact and tools.',
    symptoms: ['Mottled light and dark green patches', 'Leaf curling', 'Stunted growth', 'Mosaic pattern on fruit'],
    treatment: ['No direct chemical cure', 'Remove infected plants', 'Control aphids with neem oil', 'Disinfect tools'],
    prevention: ['Use virus-free certified seeds', 'Plant resistant varieties', 'Control aphid vectors'],
    severity: 'severe',
  },
  'anthracnose': {
    id: 'anthracnose',
    name: 'Anthracnose',
    scientificName: 'Colletotrichum species',
    description: 'A fungal disease causing sunken lesions and fruit rot in wet conditions.',
    cause: 'Fungal spores spread by rain splash. Develops in warm, wet conditions.',
    symptoms: ['Sunken dark lesions', 'Pink spore masses', 'Leaf yellowing', 'Fruit rot with concentric rings'],
    treatment: ['Remove infected fruit and plant parts', 'Apply chlorothalonil', 'Spray every 7-10 days'],
    prevention: ['Plant resistant varieties', 'Improve air circulation', 'Remove fallen debris'],
    severity: 'moderate',
  },
  'healthy': {
    id: 'healthy',
    name: 'Healthy Plant',
    description: 'No disease detected. Your plant appears to be in good health.',
    cause: 'N/A',
    symptoms: ['No visible disease symptoms'],
    treatment: ['Continue regular maintenance and monitoring'],
    prevention: ['Maintain proper watering schedule', 'Monitor regularly', 'Maintain soil fertility'],
    severity: 'mild',
  },
  'unknown': {
    id: 'unknown',
    name: 'Unable to Identify',
    description: 'The plant condition could not be clearly identified. Please provide a clearer image.',
    cause: 'Insufficient image quality or unclear symptoms',
    symptoms: ['Unable to determine from provided image'],
    treatment: ['Retake image with better lighting and focus on affected area'],
    prevention: ['Ensure image is clear and shows disease symptoms'],
    severity: 'mild',
  },
};

export const normalizeModelLabel = (label: string): string =>
  label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim();

export const getDiseaseInfo = (modelLabel: string): DiseaseInfo => {
  const normalized = normalizeModelLabel(modelLabel);
  if (DISEASE_DETAILS[normalized]) return DISEASE_DETAILS[normalized];

  const partialMatch = Object.keys(DISEASE_DETAILS).find(
    (key) => normalized.includes(key) || key.includes(normalized)
  );
  if (partialMatch) return DISEASE_DETAILS[partialMatch];

  if (normalized.includes('healthy') || normalized.includes('normal')) {
    return DISEASE_DETAILS.healthy;
  }

  return DISEASE_DETAILS.unknown;
};
