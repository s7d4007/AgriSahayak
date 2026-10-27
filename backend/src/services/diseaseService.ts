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
    throw Object.assign(new Error('Disease detection is unavailable until HF_API_KEY is configured.'), {
      statusCode: 503,
      retryable: false,
    });
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
      throw Object.assign(new Error('Disease detection returned no predictions.'), {
        statusCode: 502,
        retryable: true,
      });
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
    throw Object.assign(new Error('Disease detection is temporarily unavailable.'), {
      statusCode: 502,
      retryable: true,
    });
  }
};
