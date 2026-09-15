import axios from 'axios';
import FormData from 'form-data';
import { getDiseaseInfo, DiseaseInfo } from '../utils/diseaseMapping';

const HF_API_KEY = process.env.HF_API_KEY || '';
const HF_MODEL_ID = process.env.HF_MODEL_ID || 'nateraw/vit-base-patch16-224-plant-disease';
const HF_INFERENCE_URL = `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`;

interface HFPrediction {
  label: string;
  score: number;
}

interface DetectionPrediction {
  disease: DiseaseInfo;
  confidence: number;
  rank: 'High' | 'Mid' | 'Low';
}

const getRank = (confidence: number): 'High' | 'Mid' | 'Low' => {
  if (confidence >= 70) return 'High';
  if (confidence >= 50) return 'Mid';
  return 'Low';
};

/**
 * Detect plant disease from image buffer using Hugging Face Inference API
 */
export const detectDiseaseFromBuffer = async (
  buffer: Buffer,
  mimeType: string
): Promise<{ predictions: DetectionPrediction[]; isMockDetection: boolean }> => {
  if (!HF_API_KEY || HF_API_KEY === 'hf_xxxxxxxxxxxxxxxxxxxx') {
    console.warn('[diseaseService] HF_API_KEY not configured – using mock detection');
    return performMockDetection();
  }

  try {
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: 'image.jpg',
      contentType: mimeType,
    });

    const response = await axios.post<HFPrediction[]>(HF_INFERENCE_URL, buffer, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': mimeType,
        Accept: 'application/json',
      },
      timeout: 30000,
    });

    const predictions: HFPrediction[] = response.data;

    if (!Array.isArray(predictions) || predictions.length === 0) {
      console.warn('[diseaseService] Empty response from HF API – falling back to mock');
      return performMockDetection();
    }

    // Take top 3 predictions
    const top3 = predictions.slice(0, 3).map((pred): DetectionPrediction => {
      const confidence = Math.round(pred.score * 100);
      return {
        disease: getDiseaseInfo(pred.label),
        confidence,
        rank: getRank(confidence),
      };
    });

    return { predictions: top3, isMockDetection: false };
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: unknown }; message?: string };

    if (err.response?.status === 503) {
      // Model is loading – inform caller with retryable flag
      throw Object.assign(new Error('Model is loading. Please try again in about 20 seconds.'), {
        retryable: true,
        statusCode: 503,
      });
    }

    if (err.response?.status === 401) {
      console.error('[diseaseService] Invalid HF API key');
    }

    console.error('[diseaseService] HF API error:', err.message, err.response?.data);
    console.warn('[diseaseService] Falling back to mock detection');
    return performMockDetection();
  }
};

/** Mock disease detection – used as fallback when HF API unavailable */
const performMockDetection = (): { predictions: DetectionPrediction[]; isMockDetection: boolean } => {
  const diseaseList = [
    'apple___scab',
    'leaf_spot',
    'powdery_mildew',
    'rust_disease',
    'blight_disease',
    'mosaic_virus',
    'anthracnose',
    'healthy',
  ];

  const usedIndices = new Set<number>();
  const predictions: DetectionPrediction[] = [];

  for (let i = 0; i < 3; i++) {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * diseaseList.length);
    } while (usedIndices.has(idx) && usedIndices.size < diseaseList.length);

    usedIndices.add(idx);
    const label = diseaseList[idx];
    const baseConf = 90 - i * 25;
    const confidence = Math.max(40, baseConf + Math.floor(Math.random() * 10) - 5);

    predictions.push({
      disease: getDiseaseInfo(label),
      confidence,
      rank: getRank(confidence),
    });
  }

  return { predictions, isMockDetection: true };
};
