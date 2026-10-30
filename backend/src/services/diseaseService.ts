import axios from 'axios';
import 'dotenv/config';
import { getDiseaseInfo, DiseaseInfo } from '../utils/diseaseMapping';

const HF_MODEL_ID = process.env.HF_MODEL_ID || 'nateraw/vit-base-patch16-224-plant-disease';
const HF_INFERENCE_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL_ID}`;

const getHuggingFaceApiKey = (): string => (process.env.HF_API_KEY || '').trim();

interface HFPrediction {
  label: string;
  score: number;
}

interface HFErrorResponse {
  error?: string;
  estimated_time?: number;
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
  const hfApiKey = getHuggingFaceApiKey();

  if (!hfApiKey || hfApiKey === 'hf_xxxxxxxxxxxxxxxxxxxx') {
    throw Object.assign(new Error('Disease detection is unavailable until HF_API_KEY is configured.'), {
      statusCode: 503,
      retryable: false,
    });
  }

  try {
    const response = await axios.post<HFPrediction[]>(HF_INFERENCE_URL, buffer, {
      headers: {
        Authorization: `Bearer ${hfApiKey}`,
        'Content-Type': mimeType,
        Accept: 'application/json',
        'X-Wait-For-Model': 'true',
      },
      timeout: 60000,
    });

    const predictions: HFPrediction[] = response.data;

    if (!Array.isArray(predictions) || predictions.length === 0) {
      throw Object.assign(new Error('Disease detection returned no predictions.'), {
        statusCode: 502,
        retryable: true,
      });
    }

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
    const err = error as {
      response?: { status?: number; data?: HFErrorResponse };
      message?: string;
    };

    if (err.response?.status === 503) {
      const estimatedTime = err.response.data?.estimated_time;
      const waitMessage =
        typeof estimatedTime === 'number'
          ? `Model is loading. Please try again in about ${Math.max(1, Math.ceil(estimatedTime))} seconds.`
          : 'Model is loading. Please try again in a moment.';
      throw Object.assign(new Error(waitMessage), {
        retryable: true,
        statusCode: 503,
      });
    }

    if (err.response?.status === 401) {
      console.error('[diseaseService] Invalid HF API key');
      throw Object.assign(new Error('Hugging Face API key was rejected.'), {
        statusCode: 502,
        retryable: false,
      });
    }

    if (err.response?.status === 404) {
      console.error('[diseaseService] HF model was not found:', HF_MODEL_ID);
      throw Object.assign(new Error('The configured Hugging Face disease model was not found.'), {
        statusCode: 502,
        retryable: false,
      });
    }

    console.error('[diseaseService] HF API error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data?.error,
    });
    throw Object.assign(new Error('Disease detection is temporarily unavailable.'), {
      statusCode: 502,
      retryable: true,
    });
  }
};
