/**
 * Disease mapping for Hugging Face plant disease classification model
 * Maps model predictions to detailed disease information with treatment and prevention
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

/**
 * Comprehensive disease mapping for common plant diseases
 * Keyed by normalized Hugging Face model labels
 */
export const DISEASE_DETAILS: Record<string, DiseaseInfo> = {
  // Apple diseases
  'apple___black_rot': {
    id: 'apple-black-rot',
    name: 'Apple Black Rot',
    scientificName: 'Botryosphaeria obtusa',
    description: 'Black rot is a fungal disease that affects apple trees, causing dark lesions on fruits and cankers on branches.',
    cause: 'Fungal infection (Botryosphaeria obtusa) that enters through wounds or lenticels. Thrives in warm, humid conditions.',
    symptoms: [
      'Dark, circular lesions on fruit with concentric rings',
      'Fruit appears shriveled and mummified',
      'Cankers (dark sunken areas) on branches',
      'Leaves may show brown spots'
    ],
    treatment: [
      'Prune and remove affected branches during dormant season',
      'Apply copper-based or sulfur fungicides in spring',
      'Spray fungicides every 7-10 days during growing season',
      'Remove mummified fruits from tree and ground',
      'Improve air circulation by pruning'
    ],
    prevention: [
      'Plant disease-resistant apple varieties',
      'Maintain proper orchard sanitation',
      'Thin fruits to improve air circulation',
      'Avoid wounding trees during pruning',
      'Apply dormant oil sprays in winter'
    ],
    severity: 'moderate'
  },

  'apple___cedar_apple_rust': {
    id: 'apple-cedar-apple-rust',
    name: 'Apple Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniper-virginianae',
    description: 'A fungal disease requiring both apple and juniper hosts, characterized by yellow/orange spots on leaves.',
    cause: 'Fungal pathogen that requires cedar/juniper trees for part of its life cycle. Spores spread via wind.',
    symptoms: [
      'Yellow to orange spots on leaves and fruit',
      'Small nodules or galls on infected fruit',
      'Leaves may drop prematurely',
      'Tubular projections from leaf undersides'
    ],
    treatment: [
      'Remove infected leaves and fruit immediately',
      'Apply fungicides containing myclobutanil at bud break',
      'Continue fungicide applications every 10-14 days',
      'Remove nearby cedar/juniper trees if possible',
      'Prune affected branches'
    ],
    prevention: [
      'Plant apple trees away from cedar trees',
      'Choose disease-resistant apple varieties',
      'Improve air circulation through pruning',
      'Remove fallen leaves and debris',
      'Apply preventive fungicides in spring'
    ],
    severity: 'moderate'
  },

  'apple___scab': {
    id: 'apple-scab',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    description: 'A common fungal disease causing dark spots on leaves and fruit, leading to reduced quality and defoliation.',
    cause: 'Fungal spores overwinter on fallen leaves. Spread by rain splash and wet conditions, especially in spring.',
    symptoms: [
      'Olive-brown spots on leaves with velvety texture',
      'Brown or black spots on fruit',
      'Lesions on twigs and shoots',
      'Premature leaf drop',
      'Misshapen fruit with corky tissue'
    ],
    treatment: [
      'Apply sulfur or copper fungicides every 7-10 days starting at bud break',
      'Use systemic fungicides like myclobutanil',
      'Spray during and after rain periods',
      'Remove infected leaves and fallen debris',
      'Improve air circulation by thinning branches'
    ],
    prevention: [
      'Choose scab-resistant apple varieties',
      'Rake and remove fallen leaves in fall',
      'Prune trees for better air circulation',
      'Avoid overhead watering',
      'Apply preventive fungicides from bud break through early summer'
    ],
    severity: 'moderate'
  },

  'leaf_spot': {
    id: 'leaf-spot',
    name: 'Leaf Spot',
    scientificName: 'Various (Cercospora, Alternaria, Phyllosticta)',
    description: 'A general fungal disease characterized by circular to irregular brown spots on leaves, causing defoliation.',
    cause: 'Various fungal pathogens that thrive in warm, humid conditions with leaf wetness.',
    symptoms: [
      'Brown or black circular spots on leaves',
      'Yellow halo around lesions',
      'Spots may merge causing large dead areas',
      'Leaf yellowing and premature drop',
      'Spots on stems and petioles'
    ],
    treatment: [
      'Remove infected leaves and plant debris',
      'Apply copper fungicides or mancozeb',
      'Spray at 7-10 day intervals',
      'Improve air circulation through pruning',
      'Water at soil level to keep leaves dry'
    ],
    prevention: [
      'Maintain proper plant spacing',
      'Avoid overhead watering',
      'Remove fallen leaves regularly',
      'Apply preventive fungicides during humid periods',
      'Choose disease-resistant varieties when available'
    ],
    severity: 'mild'
  },

  'powdery_mildew': {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    scientificName: 'Various Erysiphaceae species',
    description: 'A fungal disease causing white powder-like coating on leaves, affecting crop growth and appearance.',
    cause: 'Fungal spores spread by wind. Develops in warm days with cool nights and moderate humidity.',
    symptoms: [
      'White to gray powdery coating on leaves',
      'Coating on stems, buds, and flowers',
      'Distorted leaf growth',
      'Leaf yellowing and dropping',
      'Reduced fruit size and quality'
    ],
    treatment: [
      'Spray sulfur-based fungicides weekly',
      'Use neem oil or potassium bicarbonate sprays',
      'Apply systemic fungicides like myclobutanil',
      'Remove heavily infected leaves',
      'Increase air circulation by pruning'
    ],
    prevention: [
      'Choose resistant varieties',
      'Avoid excessive nitrogen fertilization',
      'Maintain proper plant spacing',
      'Water at soil level only',
      'Apply preventive sulfur sprays monthly during susceptible periods'
    ],
    severity: 'mild'
  },

  'rust_disease': {
    id: 'rust-disease',
    name: 'Rust Disease',
    scientificName: 'Various Pucciniales species',
    description: 'A fungal disease causing rust-colored pustules on leaf undersides, weakening plants over time.',
    cause: 'Fungal spores spread by wind and water splash. Favored by high humidity and cool temperatures.',
    symptoms: [
      'Rusty-orange pustules on leaf undersides',
      'Yellow spots on leaf upper surface',
      'Premature leaf drop',
      'Reduced plant vigor',
      'Small dark spots (telia) on stems'
    ],
    treatment: [
      'Remove affected leaves promptly',
      'Apply sulfur-based fungicides at first sign',
      'Use myclobutanil or other systemic fungicides',
      'Spray every 7-14 days as needed',
      'Prune to improve air circulation'
    ],
    prevention: [
      'Plant resistant varieties',
      'Maintain proper spacing for air flow',
      'Avoid overhead watering',
      'Remove infected plant debris',
      'Apply preventive fungicides during humid seasons'
    ],
    severity: 'moderate'
  },

  'blight_disease': {
    id: 'blight-disease',
    name: 'Blight Disease',
    scientificName: 'Various Phytophthora and early/late blight species',
    description: 'A serious fungal disease causing rapid leaf damage, stem cankers, and fruit rot.',
    cause: 'Fungal pathogens favored by high humidity, poor drainage, and cool to warm temperatures.',
    symptoms: [
      'Water-soaked spots on leaves turning brown/black',
      'Rapid leaf death and defoliation',
      'Stem cankers and darkening',
      'Fruit rot and collapse',
      'White fungal growth on undersides'
    ],
    treatment: [
      'Remove infected leaves and stems immediately',
      'Apply copper fungicides containing chlorothalonil',
      'Use systemic fungicides like metalaxyl',
      'Spray at 7-10 day intervals',
      'Improve drainage and air circulation',
      'Destroy heavily infected plants'
    ],
    prevention: [
      'Choose blight-resistant varieties',
      'Improve soil drainage',
      'Apply preventive fungicides from bloom onwards',
      'Avoid overhead watering; water at base only',
      'Mulch to prevent soil splash',
      'Remove infected plant material immediately'
    ],
    severity: 'severe'
  },

  'mosaic_virus': {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    scientificName: 'Various Potyvirus and other virus genera',
    description: 'A viral disease causing mottled, distorted foliage and reduced yield, spread by insects.',
    cause: 'Viral infection spread primarily by aphids and other sucking insects. Also spreads via contact and contaminated tools.',
    symptoms: [
      'Mottled light and dark green patches on leaves',
      'Leaf curling and distortion',
      'Stunted plant growth',
      'Reduced fruit/seed production',
      'Mosaic pattern on fruits'
    ],
    treatment: [
      'No direct chemical cure available',
      'Remove and destroy infected plants',
      'Control aphids with insecticidal soap or neem oil',
      'Disinfect tools with 10% bleach solution',
      'Manage weed hosts near plantings'
    ],
    prevention: [
      'Use virus-free certified seeds',
      'Plant resistant varieties',
      'Control aphid vectors with insecticides',
      'Isolate infected plants immediately',
      'Remove weeds that harbor viruses',
      'Avoid touching healthy plants after infected ones'
    ],
    severity: 'severe'
  },

  'anthracnose': {
    id: 'anthracnose',
    name: 'Anthracnose',
    scientificName: 'Colletotrichum species',
    description: 'A fungal disease causing sunken lesions and fruit rot, particularly damaging during wet conditions.',
    cause: 'Fungal spores spread by rain splash and contaminated tools. Develops in warm, wet conditions.',
    symptoms: [
      'Sunken dark lesions on leaves and stems',
      'Pink spore masses in lesion centers',
      'Leaf yellowing around lesions',
      'Fruit rot with concentric rings',
      'Twig dieback'
    ],
    treatment: [
      'Remove infected fruit and plant parts',
      'Apply chlorothalonil or mancozeb fungicides',
      'Use copper-based fungicides for prevention',
      'Spray every 7-10 days during wet weather',
      'Sanitize pruning tools between cuts'
    ],
    prevention: [
      'Plant disease-resistant varieties',
      'Improve air circulation through pruning',
      'Avoid overhead watering',
      'Remove fallen leaves and debris',
      'Apply preventive fungicides before rainy season',
      'Disinfect tools with bleach solution'
    ],
    severity: 'moderate'
  },

  'healthy': {
    id: 'healthy',
    name: 'Healthy Plant',
    description: 'No disease detected. Your plant appears to be in good health.',
    cause: 'N/A',
    symptoms: ['No visible disease symptoms'],
    treatment: ['Continue regular maintenance and monitoring'],
    prevention: [
      'Maintain proper watering schedule',
      'Ensure adequate sunlight and air circulation',
      'Monitor regularly for early disease signs',
      'Apply preventive measures during susceptible seasons',
      'Maintain soil fertility'
    ],
    severity: 'mild'
  },

  'unknown': {
    id: 'unknown',
    name: 'Unable to Identify',
    description: 'The plant condition could not be clearly identified. Please provide a clearer image.',
    cause: 'Insufficient image quality or unclear symptoms',
    symptoms: ['Unable to determine from provided image'],
    treatment: ['Retake image with better lighting and focus on affected area'],
    prevention: ['Ensure image is clear and shows disease symptoms'],
    severity: 'mild'
  }
};

/**
 * Normalize Hugging Face model labels to disease keys
 * Handles various label formats from the model
 */
export const normalizeModelLabel = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .trim();
};

/**
 * Get disease information from model prediction label
 * with fallback handling
 */
export const getDiseaseInfo = (modelLabel: string): DiseaseInfo => {
  const normalized = normalizeModelLabel(modelLabel);
  
  // Try exact match first
  if (DISEASE_DETAILS[normalized]) {
    return DISEASE_DETAILS[normalized];
  }
  
  // Try partial match
  const partialMatch = Object.keys(DISEASE_DETAILS).find(key =>
    normalized.includes(key) || key.includes(normalized)
  );
  
  if (partialMatch) {
    return DISEASE_DETAILS[partialMatch];
  }
  
  // Check if it's a healthy/no disease label
  if (normalized.includes('healthy') || normalized.includes('normal')) {
    return DISEASE_DETAILS.healthy;
  }
  
  // Return unknown disease
  return DISEASE_DETAILS.unknown;
};

/**
 * Get treatment recommendation based on severity
 */
export const getTreatmentRecommendation = (disease: DiseaseInfo): string[] => {
  const baseRecommendations = disease.treatment;
  
  if (disease.severity === 'severe') {
    return [
      '⚠️ URGENT: This is a serious disease requiring immediate action',
      ...baseRecommendations,
      'Consider consulting local agricultural extension officer',
      'Quarantine affected plants to prevent spread'
    ];
  }
  
  return baseRecommendations;
};

/**
 * Format disease information for display
 */
export const formatDiseaseInfo = (disease: DiseaseInfo) => {
  return {
    name: disease.name,
    description: disease.description,
    severity: disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1),
    cause: disease.cause,
    symptoms: disease.symptoms,
    treatment: getTreatmentRecommendation(disease),
    prevention: disease.prevention
  };
};
