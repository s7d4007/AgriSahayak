import axios from 'axios';
import 'dotenv/config';
import { getDiseaseInfo, DiseaseInfo } from '../utils/diseaseMapping';

const KINDWISE_API_URL = 'https://crop.kindwise.com/api/v1/identification';

interface KindwiseSuggestion {
  id?: string;
  name: string;
  probability: number;
}

interface KindwiseResponse {
  result?: {
    crop?: { suggestions?: KindwiseSuggestion[] };
    disease?: { suggestions?: KindwiseSuggestion[] };
    is_plant?: { probability?: number; binary?: boolean };
  };
}

interface DetectionPrediction {
  disease: DiseaseInfo;
  confidence: number;
  rank: 'High' | 'Mid' | 'Low';
}

interface CropIdentification {
  id?: string;
  name: string;
  confidence: number;
}

interface DiseaseDetectionResult {
  predictions: DetectionPrediction[];
  crop?: CropIdentification;
  noDiseaseDetected: boolean;
  isMockDetection: false;
}

const getRank = (confidence: number): 'High' | 'Mid' | 'Low' => {
  if (confidence >= 70) return 'High';
  if (confidence >= 50) return 'Mid';
  return 'Low';
};

const getKindwiseApiKey = (): string => (process.env.KINDWISE_API_KEY || '').trim();

const toConfidence = (probability: number): number =>
  Math.round(Math.max(0, Math.min(1, probability)) * 100);

const createProviderError = (
  message: string,
  statusCode: number,
  retryable: boolean
): Error & { statusCode: number; retryable: boolean } =>
  Object.assign(new Error(message), { statusCode, retryable });

/**
 * Detect crop and disease from an image buffer using Kindwise Crop.health.
 */
export const detectDiseaseFromBuffer = async (
  buffer: Buffer,
  _mimeType: string
): Promise<DiseaseDetectionResult> => {
  const apiKey = getKindwiseApiKey();

  if (!apiKey || apiKey === 'your_kindwise_api_key') {
    throw createProviderError(
      'Disease detection is unavailable until KINDWISE_API_KEY is configured.',
      503,
      false
    );
  }

  try {
    const response = await axios.post<KindwiseResponse>(
      KINDWISE_API_URL,
      {
        images: [buffer.toString('base64')],
        similar_images: false,
      },
      {
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 60000,
      }
    );

    const result = response.data.result;
    const cropSuggestion = result?.crop?.suggestions?.[0];
    const diseaseSuggestions = result?.disease?.suggestions ?? [];
    const predictions = diseaseSuggestions.slice(0, 3).map((suggestion) => {
      const confidence = toConfidence(suggestion.probability);
      return {
        disease: getDiseaseInfo(suggestion.name, suggestion.name),
        confidence,
        rank: getRank(confidence),
      };
    });

    return {
      predictions,
      ...(cropSuggestion
        ? {
            crop: {
              id: cropSuggestion.id,
              name: cropSuggestion.name,
              confidence: toConfidence(cropSuggestion.probability),
            },
          }
        : {}),
      noDiseaseDetected: predictions.length === 0,
      isMockDetection: false,
    };
  } catch (error: unknown) {
    const err = error as {
      code?: string;
      message?: string;
      response?: { status?: number; data?: { error?: string; message?: string } };
    };
    const status = err.response?.status;

    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw createProviderError('Kindwise disease detection timed out. Please try again.', 504, true);
    }

    if (status === 401 || status === 403) {
      console.error('[diseaseService] Kindwise API key was rejected');
      throw createProviderError('Kindwise API key was rejected.', 502, false);
    }

    if (status === 402) {
      console.error('[diseaseService] Kindwise account has insufficient credits');
      throw createProviderError('Kindwise account has insufficient credits.', 502, false);
    }

    if (status === 429) {
      throw createProviderError('Kindwise rate limit reached. Please try again later.', 503, true);
    }

    if (status && status >= 500) {
      throw createProviderError('Kindwise service is temporarily unavailable.', 503, true);
    }

    console.error('[diseaseService] Kindwise API error:', {
      code: err.code,
      message: err.message,
      status,
      providerMessage: err.response?.data?.error || err.response?.data?.message,
    });
    throw createProviderError('Disease detection is temporarily unavailable.', 502, true);
  }
};
