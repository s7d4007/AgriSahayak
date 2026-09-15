import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, AlertCircle, Info, Loader } from 'lucide-react';
import { saveDiagnostic } from '../services/db';
import { detectPlantDisease } from '../services/api';
import type { DiseaseInfo } from '../utils/diseaseMapping';

interface DetectionResult {
  predictions: Array<{
    disease: DiseaseInfo;
    confidence: number;
    rank: 'High' | 'Mid' | 'Low';
  }>;
  isMockDetection?: boolean;
}

const DiseaseDetector: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  // no live stream in this implementation; keep file-based capture

  // Constants for image validation
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MIN_IMAGE_DIMENSION = 224; // Minimum for model input

  /**
   * Validate image file before processing
   */
  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a valid image file (JPEG, PNG, or WebP).',
      };
    }

    // Check file name length (avoid issues with very long names)
    if (file.name.length > 255) {
      return {
        valid: false,
        error: 'File name is too long. Please rename the file.',
      };
    }

    return { valid: true };
  };

  /**
   * Validate image dimensions
   */
  const validateImageDimensions = (img: HTMLImageElement): { valid: boolean; error?: string } => {
    const { width, height } = img;

    if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
      return {
        valid: false,
        error: `Image is too small. Minimum dimensions are ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px. Your image is ${width}x${height}px.`,
      };
    }

    // Warn about very large images
    if (width > 4096 || height > 4096) {
      console.warn('Image dimensions are very large, processing may take longer');
    }

    return { valid: true };
  };

  /**
   * Handle image file selection from file input or camera
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  /**
   * Process the selected image file
   */
  const processImageFile = (file: File) => {
    // Reset previous errors
    setImageValidationError(null);
    setError(null);

    // Validate file
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      setImageValidationError(fileValidation.error || 'Invalid image file');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;

      // Validate image dimensions
      const img = new Image();
      img.onload = () => {
        const dimensionValidation = validateImageDimensions(img);
        if (!dimensionValidation.valid) {
          setImageValidationError(dimensionValidation.error || 'Invalid image dimensions');
          return;
        }

        // Image is valid, proceed with detection
        setSelectedImage(imageData);
        setDetectionResult(null);
        setError(null);
        setImageValidationError(null);
        performDiseaseDetection(imageData);
      };

      img.onerror = () => {
        setImageValidationError('Failed to load image. Please try a different image.');
      };

      img.src = imageData;
    };

    reader.onerror = () => {
      setImageValidationError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  /**
   * Perform disease detection on the image
   */
  const performDiseaseDetection = async (imageData: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      console.log('Initiating disease detection...');
      const result = await detectPlantDisease(imageData);
      const resultData = result as unknown as {
        success?: boolean;
        data?: { predictions?: unknown[]; isMockDetection?: boolean };
        retryable?: boolean;
        error?: string;
      };

      if (resultData.success) {
        if (resultData.data?.predictions) {
          const preds = resultData.data.predictions as unknown as DetectionResult['predictions'];
          const detectionData: DetectionResult = {
            predictions: preds,
            isMockDetection: resultData.data.isMockDetection || false,
          };

          console.log('Raw predictions:', resultData.data.predictions);

          setDetectionResult(detectionData);

          // Save to IndexedDB (best-effort)
          try {
            await saveDiagnostic({
              imageData,
              result: {
                disease: detectionData.predictions[0].disease.name,
                confidence: detectionData.predictions[0].confidence,
                timestamp: new Date().toISOString(),
              },
            });
            console.log('Detection result saved to database');
          } catch (dbError) {
            console.error('Failed to save to database:', dbError);
          }

          if (detectionData.isMockDetection) {
            setError(
              'Using offline detection. For more accurate results, configure Hugging Face API integration.'
            );
          }
        }
      } else if (resultData.retryable) {
        setError(resultData.error || 'Detection service is loading. Please try again in a moment.');
      } else {
        setError('Unable to detect disease. Please try another image.');
      }
    } catch (err) {
      console.error('Error during detection:', err);
      setError('An error occurred during detection. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setError(null);
    setImageValidationError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  /**
   * Get confidence color
   */
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-blue-600';
    if (confidence >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Camera className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('disease.title')}</h1>
          </div>
          <p className="text-primary-100">
            {t('disease.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Messages */}
        {imageValidationError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!selectedImage ? (
          // Upload Section
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Option */}
              <div
                className="card cursor-pointer hover:border-primary-400 transition-all hover:shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="text-center">
                  <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-accent-900 mb-2">
                    {t('disease.uploadPhoto')}
                  </h3>
                  <p className="text-accent-600 mb-4">
                    Select a photo from your device
                  </p>
                  <button className="btn-primary w-full">
                    Choose File
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload image file"
                />
              </div>

              {/* Camera Option */}
              <div className="card cursor-pointer hover:border-primary-400 transition-all"
                onClick={() => cameraInputRef.current?.click()}>
                <div className="text-center">
                  <div className="bg-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-secondary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-accent-900 mb-2">
                    {t('disease.takePhoto')}
                  </h3>
                  <p className="text-accent-600 mb-4">
                    Capture a photo using your camera
                  </p>
                  <button className="btn-secondary w-full">
                    Open Camera
                  </button>
                </div>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Capture image from camera"
                />
              </div>
            </div>

            {/* Live camera preview removed: using file / capture input fallback for compatibility */}

            {/* Tips Section */}
            <div className="card bg-blue-50 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-accent-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                {t('disease.tipsTitle')}
              </h3>
              <ul className="space-y-2 text-accent-700">
                <li>✓ Capture the affected leaf clearly</li>
                <li>✓ Ensure good lighting for accurate detection</li>
                <li>✓ Show the disease symptoms clearly</li>
                <li>✓ Works offline - no internet needed</li>
              </ul>
            </div>
          </div>
        ) : (
          // Analysis Section
          <div className="space-y-8">
            {/* Selected Image */}
            <div className="card">
              <img
                src={selectedImage}
                alt="Crop leaf"
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
              <button
                onClick={handleReset}
                className="btn-outline w-full"
              >
                Take Another Photo
              </button>
            </div>

            {/* Results Section */}
            {analyzing ? (
              <div className="card text-center py-12">
                <div className="inline-block">
                  <Loader className="w-16 h-16 animate-spin text-primary-600 mb-4" />
                </div>
                <h3 className="text-xl font-bold text-accent-900 mb-2">
                  {t('disease.analyzing')}
                </h3>
                <p className="text-accent-600">
                  Using AI to identify disease in your crop...
                </p>
              </div>
            ) : detectionResult ? (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <h2 className="text-2xl font-bold text-accent-900 mb-2">
                    🔍 Top Disease Predictions
                  </h2>
                  <p className="text-accent-600">
                    Based on AI analysis of your image, here are the 3 most likely conditions detected:
                  </p>
                </div>

                {/* Predictions Grid - 3 Options */}
                <div className="grid grid-cols-1 gap-6">
                  {detectionResult.predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className={`card border-2 transition-all hover:shadow-lg ${
                        prediction.rank === 'High'
                          ? 'bg-green-50 border-green-400'
                          : prediction.rank === 'Mid'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-orange-50 border-orange-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-gray-700">#{index + 1}</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                              prediction.rank === 'High'
                                ? 'bg-green-200 text-green-800'
                                : prediction.rank === 'Mid'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-orange-200 text-orange-800'
                            }`}>
                              {prediction.rank} Confidence
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-accent-900 mb-1">
                            {prediction.disease.name}
                          </h3>
                          <p className="text-sm text-accent-600 mb-3">
                            {prediction.disease.scientificName && (
                              <span className="italic">{prediction.disease.scientificName}</span>
                            )}
                          </p>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-accent-700">Confidence Score</span>
                              <span className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                                {prediction.confidence}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  prediction.rank === 'High'
                                    ? 'bg-green-500'
                                    : prediction.rank === 'Mid'
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{ width: `${prediction.confidence}%` }}
                              />
                            </div>
                          </div>

                          <p className="text-sm text-accent-700 mb-3">
                            {prediction.disease.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-semibold text-accent-900 mb-1">Cause:</p>
                              <p className="text-accent-700">{prediction.disease.cause}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-accent-900 mb-1">Symptoms:</p>
                              <ul className="text-accent-700 space-y-1">
                                {prediction.disease.symptoms.slice(0, 2).map((symptom, idx) => (
                                  <li key={idx}>• {symptom}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Treatment & Prevention for this disease */}
                      <div className="border-t border-gray-300 pt-4 mt-4">
                        <details className="cursor-pointer">
                          <summary className="font-bold text-accent-900 hover:text-primary-600">
                            View Full Details & Treatment {'>'}
                          </summary>
                          <div className="mt-4 space-y-4">
                            <div>
                              <h4 className="font-bold text-accent-900 mb-2">Treatment Steps:</h4>
                              <ol className="space-y-2">
                                {prediction.disease.treatment.slice(0, 3).map((step, idx) => (
                                  <li key={idx} className="text-sm text-accent-700 flex gap-3">
                                    <span className="font-bold text-primary-600">{idx + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <h4 className="font-bold text-accent-900 mb-2">Prevention Measures:</h4>
                              <ul className="space-y-2">
                                {prediction.disease.prevention.slice(0, 3).map((measure, idx) => (
                                  <li key={idx} className="text-sm text-accent-700 flex gap-3">
                                    <span className="font-bold text-green-600">✓</span>
                                    <span>{measure}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Tips */}
                <div className="card bg-green-50">
                  <h3 className="font-bold text-lg text-accent-900 mb-4">
                    Additional Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-accent-700">
                    <li>
                      <strong className="text-green-700">High Confidence (70%+):</strong> The AI is very confident in this diagnosis. Consider this as the most likely condition.
                    </li>
                    <li>
                      <strong className="text-yellow-700">Mid Confidence (50-70%):</strong> The AI has reasonable confidence. Consult with an agricultural expert if uncertain.
                    </li>
                    <li>
                      <strong className="text-orange-700">Low Confidence (&lt;50%):</strong> Results are less reliable. Take a clearer image or seek expert advice.
                    </li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="card bg-yellow-50 border border-yellow-300">
                  <p className="text-sm text-yellow-900">
                    <strong>Disclaimer:</strong> This AI-based detection is a tool to assist farmers. For critical crop health decisions,
                    always consult with local agricultural extension officers or experts. Early detection and proper diagnosis are key to
                    effective disease management.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="btn-primary flex-1"
                  >
                    Check Another Leaf
                  </button>
                  <button className="btn-outline flex-1">
                    Share Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-accent-900 mb-2">
                  No Disease Detected
                </h3>
                <p className="text-accent-600 mb-6">
                  Your plant appears to be healthy! Continue monitoring for early disease signs.
                </p>
                <button onClick={handleReset} className="btn-primary" type="button">
                  Check Another Leaf
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetector;

