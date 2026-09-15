import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, TrendingUp, Leaf, Target } from 'lucide-react';
import { fetchCropRecommendations } from '../services/api';
import { getAllStates, getDistrictsForState, STATE_NAMES_EN, STATE_NAMES_HI } from '../utils/statesDistricts';

interface Crop {
  id: string;
  name: string;
  description: string;
  expectedYield: number;
  profitability: number;
  sustainability: number;
  mspPrice: number;
}

const CropAdvisory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [recommendations, setRecommendations] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // Get available states
  const states = getAllStates();
  
  // Get districts for selected state
  const availableDistricts = state ? getDistrictsForState(state) : [];
  
  // Helper to get state label name based on language
  const getStateLabel = (stateKey: string) => {
    if (i18n.language === 'hi') {
      return STATE_NAMES_HI[stateKey] || stateKey;
    }
    return STATE_NAMES_EN[stateKey] || stateKey;
  };

  // Reset district when state changes
  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    setDistrict('');
  };

  const handleGetRecommendation = async () => {
    if (!state || !district || !season || !soilType) {
      alert(t('common.required'));
      return;
    }

    setLoading(true);
    try {
      const result = await fetchCropRecommendations(district, season, soilType);
      if (result.success) {
        if (result.data.length > 0) {
          setRecommendations(result.data);
          setSelectedCrop(null);
        } else {
          alert(t('cropAdvisory.noRecommendations')); // Show message if no recommendations
        }
      } else {
        alert(t('common.errorOccurred'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t('common.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Sprout className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('cropAdvisory.title')}</h1>
          </div>
          <p className="text-primary-100">
            Get hyperlocal crop recommendations based on your district, season, and soil type.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommendation Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-accent-900 mb-6">
                Get Your Recommendations
              </h2>

              {/* State Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {t('cropAdvisory.selectState')}
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('common.selectOption')}</option>
                  {states.map((stateKey) => (
                    <option key={stateKey} value={stateKey}>
                      {getStateLabel(stateKey)}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {t('cropAdvisory.selectDistrict')}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="input-field"
                  disabled={!state}
                >
                  <option value="">
                    {!state ? t('cropAdvisory.selectFirstDistrict') : t('common.selectOption')}
                  </option>
                  {availableDistricts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {t('cropAdvisory.selectSeason')}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('common.selectOption')}</option>
                  {Object.entries(t('cropAdvisory.seasons', { returnObjects: true })).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soil Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {t('cropAdvisory.selectSoilType')}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('common.selectOption')}</option>
                  {Object.entries(t('cropAdvisory.soilTypes', { returnObjects: true })).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGetRecommendation}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Loading...' : t('cropAdvisory.getRecommendation')}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {selectedCrop ? (
              // Crop Details View
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-2"
                >
                  ← Back to Recommendations
                </button>

                <div className="card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-6 rounded-xl">
                      <Sprout className="w-12 h-12 text-primary-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-accent-900">
                        {selectedCrop.name}
                      </h1>
                      <p className="text-accent-600">{selectedCrop.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Expected Yield */}
                    <div className="bg-primary-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-accent-900">
                          {t('cropAdvisory.expectedYield')}
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-primary-700">
                        {selectedCrop.expectedYield} q/acre
                      </p>
                      <p className="text-sm text-accent-600">
                        {t('cropAdvisory.acresLabel')}
                      </p>
                    </div>

                    {/* Profitability */}
                    <div className="bg-secondary-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-secondary-600" />
                        <h3 className="font-semibold text-accent-900">
                          {t('cropAdvisory.profitability')}
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-secondary-700">
                        {selectedCrop.profitability}%
                      </p>
                      <p className="text-sm text-accent-600">Estimated ROI</p>
                    </div>

                    {/* Sustainability */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-accent-900">
                          {t('cropAdvisory.sustainability')}
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        {selectedCrop.sustainability}%
                      </p>
                      <p className="text-sm text-accent-600">Environmental Impact</p>
                    </div>

                    {/* MSP Price */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold text-accent-900 mb-2">
                        Minimum Support Price
                      </h3>
                      <p className="text-3xl font-bold text-blue-700">
                        ₹{selectedCrop.mspPrice}
                      </p>
                      <p className="text-sm text-accent-600">{t('cropAdvisory.acresLabel')}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-accent-200 pt-6">
                    <h3 className="font-bold text-xl text-accent-900 mb-4">
                      Key Information
                    </h3>
                    <ul className="space-y-3 text-accent-600">
                      <li className="flex gap-2">
                        <span className="text-primary-600">✓</span>
                        <span>Best suited for your selected district and season</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600">✓</span>
                        <span>Compatible with {soilType ? t(`cropAdvisory.soilTypes.${soilType}`) : 'soil'}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600">✓</span>
                        <span>Government support available through MSP scheme</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600">✓</span>
                        <span>Good market demand and price realization potential</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              // Recommendations List View
              <div>
                <h2 className="section-title mb-8">
                  {t('cropAdvisory.recommendations')}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {recommendations.map((crop) => (
                    <div
                      key={crop.id}
                      className="card cursor-pointer hover:border-primary-400 transition-all"
                      onClick={() => setSelectedCrop(crop)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-accent-900 mb-2">
                            {crop.name}
                          </h3>
                          <p className="text-accent-600 mb-4">{crop.description}</p>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-accent-500">Expected Yield</p>
                              <p className="text-lg font-bold text-primary-700">
                                {crop.expectedYield} q/acre
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-accent-500">Profitability</p>
                              <p className="text-lg font-bold text-secondary-700">
                                {crop.profitability}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-accent-500">MSP Price</p>
                              <p className="text-lg font-bold text-blue-700">
                                ₹{crop.mspPrice}/q
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 hidden md:block">
                          <Sprout className="w-16 h-16 text-primary-600 opacity-20" />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button className="text-primary-600 font-medium hover:text-primary-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Empty State
              <div className="card text-center py-16">
                <Sprout className="w-16 h-16 text-accent-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-accent-900 mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-accent-600">
                  Select your district, season, and soil type to get crop recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory;
