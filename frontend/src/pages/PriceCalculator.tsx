import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, AlertCircle, Check } from 'lucide-react';
import { CROPS, SEASONS } from '../utils/constants';

interface CalculationResult {
  cropName: string;
  area: number;
  investmentPerAcre: number;
  totalInvestment: number;
  estimatedYield: number;
  mspPrice: number;
  mspRevenue: number;
  marketPrice: number;
  marketRevenue: number;
  mspProfit: number;
  marketProfit: number;
  profitMargin: string;
  weatherImpact: number;
  marektImpactAdjustedRevenue: number;
  breakEvenPrice: number;
  breakEvenYield: number;
  riskAssessment: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

const PriceCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop: 'rice',
    area: 1,
    investmentPerAcre: 25000,
    season: 'kharif',
    marketPrice: 3200,
    weatherCondition: 'normal',
    soilFertility: 'good',
    irrigationAvailable: true,
    useOfPesticides: true,
    laborCost: 5000
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const cropList = Object.values(CROPS);
  const seasonList = Object.values(SEASONS);

  const calculatePrice = () => {
    const selectedCrop = CROPS[formData.crop as keyof typeof CROPS];
    if (!selectedCrop) return;

    // Base calculations
    const totalInvestment = formData.area * formData.investmentPerAcre;
    let estimatedYield = selectedCrop.expectedYield * formData.area;

    // Weather impact factor
    const weatherFactors = {
      excellent: 1.15,
      good: 1.05,
      normal: 1.0,
      poor: 0.85,
      drought: 0.6
    };
    const weatherMultiplier = weatherFactors[formData.weatherCondition as keyof typeof weatherFactors] || 1.0;
    estimatedYield *= weatherMultiplier;

    // Soil fertility impact
    const soilFactors = {
      excellent: 1.1,
      good: 1.0,
      average: 0.9,
      poor: 0.75
    };
    const soilMultiplier = soilFactors[formData.soilFertility as keyof typeof soilFactors] || 1.0;
    estimatedYield *= soilMultiplier;

    // Irrigation impact
    if (formData.irrigationAvailable) {
      estimatedYield *= 1.08;
    }

    // Pest management impact
    if (formData.useOfPesticides) {
      estimatedYield *= 1.05;
    }

    // MSP Revenue
    const mspRevenue = estimatedYield * selectedCrop.mspPrice;

    // Market Revenue
    const marketRevenue = estimatedYield * formData.marketPrice;

    // Profit calculations
    const totalCost = totalInvestment + (formData.laborCost * formData.area);
    const mspProfit = mspRevenue - totalCost;
    const marketProfit = marketRevenue - totalCost;

    // Profit margin
    const profitMargin = marketRevenue > 0 
      ? ((marketProfit / marketRevenue) * 100).toFixed(2)
      : '0';

    // Weather impact on adjusted revenue
    const marektImpactAdjustedRevenue = marketRevenue * weatherMultiplier;

    // Break-even calculations
    const breakEvenPrice = totalCost > 0 ? parseFloat((totalCost / estimatedYield).toFixed(2)) : 0;
    const breakEvenYield = formData.marketPrice > 0 
      ? parseFloat((totalCost / formData.marketPrice).toFixed(2))
      : 0;

    // Risk assessment
    let riskAssessment: 'Low' | 'Medium' | 'High' = 'Medium';
    const profitMarginNum = parseFloat(profitMargin);
    
    if (weatherMultiplier < 0.8 || formData.marketPrice < selectedCrop.mspPrice * 0.9) {
      riskAssessment = 'High';
    } else if (profitMarginNum > 30 && weatherMultiplier >= 0.95) {
      riskAssessment = 'Low';
    }

    // Recommendation
    let recommendation = '';
    if (formData.marketPrice > selectedCrop.mspPrice * 1.15) {
      recommendation = 'Excellent opportunity! Market prices are significantly above MSP. Consider selling at current prices.';
    } else if (formData.marketPrice > selectedCrop.mspPrice * 1.05) {
      recommendation = 'Good opportunity. Market prices are above MSP. Monitor prices and sell when favorable.';
    } else if (formData.marketPrice >= selectedCrop.mspPrice) {
      recommendation = 'Prices are at MSP level. You can sell with minimal loss but consider waiting for better rates.';
    } else {
      recommendation = 'Market prices are below MSP. Explore government procurement or storage options.';
    }

    setResult({
      cropName: selectedCrop.name,
      area: formData.area,
      investmentPerAcre: formData.investmentPerAcre,
      totalInvestment,
      estimatedYield: parseFloat(estimatedYield.toFixed(2)),
      mspPrice: selectedCrop.mspPrice,
      mspRevenue: parseFloat(mspRevenue.toFixed(2)),
      marketPrice: formData.marketPrice,
      marketRevenue: parseFloat(marketRevenue.toFixed(2)),
      mspProfit: parseFloat(mspProfit.toFixed(2)),
      marketProfit: parseFloat(marketProfit.toFixed(2)),
      profitMargin,
      weatherImpact: parseFloat((weatherMultiplier * 100).toFixed(2)),
      marektImpactAdjustedRevenue: parseFloat(marektImpactAdjustedRevenue.toFixed(2)),
      breakEvenPrice,
      breakEvenYield,
      riskAssessment,
      recommendation
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Calculator className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('calculator.title')}</h1>
          </div>
          <p className="text-primary-100">
            {t('calculator.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-accent-900 mb-6">
                {t('calculator.inputs')}
              </h2>

              <div className="space-y-5">
                {/* Crop Selection */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.selectCrop')}
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) => handleInputChange('crop', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {cropList.map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {t(`calculator.crops.${crop.id}`, { defaultValue: crop.name })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.area')}
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Investment Per Acre */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.investmentPerAcre')}
                  </label>
                  <input
                    type="number"
                    value={formData.investmentPerAcre}
                    onChange={(e) => handleInputChange('investmentPerAcre', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Labor Cost */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.laborCost')}
                  </label>
                  <input
                    type="number"
                    value={formData.laborCost}
                    onChange={(e) => handleInputChange('laborCost', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="500"
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.season')}
                  </label>
                  <select
                    value={formData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {seasonList.map(season => (
                      <option key={season.id} value={season.id}>
                        {t(`calculator.seasons.${season.id}`, { defaultValue: season.name })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Market Price */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.marketPrice')}
                  </label>
                  <input
                    type="number"
                    value={formData.marketPrice}
                    onChange={(e) => handleInputChange('marketPrice', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Weather Condition */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.weatherCondition')}
                  </label>
                  <select
                    value={formData.weatherCondition}
                    onChange={(e) => handleInputChange('weatherCondition', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="excellent">{t('calculator.conditions.excellent')}</option>
                    <option value="good">{t('calculator.conditions.good')}</option>
                    <option value="normal">{t('calculator.conditions.normal')}</option>
                    <option value="poor">{t('calculator.conditions.poor')}</option>
                    <option value="drought">{t('calculator.conditions.drought')}</option>
                  </select>
                </div>

                {/* Soil Fertility */}
                <div>
                  <label className="block text-sm font-semibold text-accent-700 mb-2">
                    {t('calculator.soilFertility')}
                  </label>
                  <select
                    value={formData.soilFertility}
                    onChange={(e) => handleInputChange('soilFertility', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="excellent">{t('calculator.conditions.excellent')}</option>
                    <option value="good">{t('calculator.conditions.good')}</option>
                    <option value="average">{t('calculator.conditions.average')}</option>
                    <option value="poor">{t('calculator.conditions.poor')}</option>
                  </select>
                </div>

                {/* Irrigation */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="irrigation"
                    checked={formData.irrigationAvailable}
                    onChange={(e) => handleInputChange('irrigationAvailable', e.target.checked)}
                    className="w-4 h-4 rounded border-accent-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <label htmlFor="irrigation" className="ml-3 text-sm font-medium text-accent-700">
                    {t('calculator.irrigationAvailable')}
                  </label>
                </div>

                {/* Pesticides */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pesticides"
                    checked={formData.useOfPesticides}
                    onChange={(e) => handleInputChange('useOfPesticides', e.target.checked)}
                    className="w-4 h-4 rounded border-accent-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <label htmlFor="pesticides" className="ml-3 text-sm font-medium text-accent-700">
                    {t('calculator.usingInputs')}
                  </label>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculatePrice}
                  className="btn-primary w-full mt-6"
                >
                  {t('calculator.calculate')}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Investment */}
                  <div className="card">
                    <p className="text-sm text-accent-600 mb-1">{t('calculator.totalInvestment')}</p>
                    <p className="text-2xl font-bold text-accent-900">
                      ₹{result.totalInvestment.toLocaleString()}
                    </p>
                  </div>

                  {/* Estimated Yield */}
                  <div className="card">
                    <p className="text-sm text-accent-600 mb-1">{t('calculator.estimatedYield')}</p>
                    <p className="text-2xl font-bold text-accent-900">
                      {result.estimatedYield.toLocaleString()} {t('calculator.quintals')}
                    </p>
                  </div>

                  {/* MSP Revenue */}
                  <div className="card">
                    <p className="text-sm text-accent-600 mb-1">{t('calculator.mspRevenue')}</p>
                    <p className="text-2xl font-bold text-accent-900">
                      ₹{result.mspRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-accent-500 mt-1">
                      @ ₹{result.mspPrice}/{t('calculator.quintal')}
                    </p>
                  </div>

                  {/* Market Revenue */}
                  <div className="card">
                    <p className="text-sm text-accent-600 mb-1">{t('calculator.marketRevenue')}</p>
                    <p className="text-2xl font-bold text-accent-900">
                      ₹{result.marketRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-accent-500 mt-1">
                      @ ₹{result.marketPrice}/{t('calculator.quintal')}
                    </p>
                  </div>
                </div>

                {/* Profit Analysis */}
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="text-lg font-bold text-accent-900 mb-4">{t('calculator.profitAnalysis')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-accent-600 mb-1">{t('calculator.mspProfit')}</p>
                      <p className={`text-2xl font-bold ${result.mspProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{result.mspProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 mb-1">{t('calculator.marketProfit')}</p>
                      <p className={`text-2xl font-bold ${result.marketProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{result.marketProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 mb-1">{t('calculator.profitMargin')}</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {result.profitMargin}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Break-Even Analysis */}
                <div className="card">
                  <h3 className="text-lg font-bold text-accent-900 mb-4">{t('calculator.breakEvenAnalysis')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-accent-600 mb-2">{t('calculator.breakEvenPrice')}</p>
                      <p className="text-2xl font-bold text-accent-900">
                        ₹{result.breakEvenPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}/{t('calculator.quintal')}
                      </p>
                      <p className="text-xs text-accent-500 mt-2">
                        {t('calculator.minimumPrice')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-accent-600 mb-2">{t('calculator.breakEvenYield')}</p>
                      <p className="text-2xl font-bold text-accent-900">
                        {result.breakEvenYield.toLocaleString('en-IN', { maximumFractionDigits: 2 })} {t('calculator.quintals')}
                      </p>
                      <p className="text-xs text-accent-500 mt-2">
                        {t('calculator.minimumYield')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact Factors */}
                <div className="card">
                  <h3 className="text-lg font-bold text-accent-900 mb-4">{t('calculator.impactFactors')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-accent-700">{t('calculator.weatherImpact')}</span>
                      <span className={`font-semibold ${result.weatherImpact >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                        {result.weatherImpact}%
                      </span>
                    </div>
                    <div className="w-full bg-accent-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${result.weatherImpact >= 100 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min(result.weatherImpact, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className={`card border-l-4 ${
                  result.riskAssessment === 'Low' ? 'border-l-green-500 bg-green-50' :
                  result.riskAssessment === 'Medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
                      result.riskAssessment === 'Low' ? 'text-green-600' :
                      result.riskAssessment === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <div>
                      <h3 className="text-lg font-bold text-accent-900 mb-2">
                        {t('calculator.riskAssessment')}: <span className={
                          result.riskAssessment === 'Low' ? 'text-green-600' :
                          result.riskAssessment === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }>{t(`calculator.risk.${result.riskAssessment.toLowerCase()}`)}</span>
                      </h3>
                      <p className="text-accent-700">{result.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="card bg-blue-50">
                  <h3 className="text-lg font-bold text-accent-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600" />
                    {t('calculator.tips')}
                  </h3>
                  <ul className="space-y-2 text-sm text-accent-700">
                    <li>• Monitor market prices weekly to sell at the best rate</li>
                    <li>• Compare prices across nearby mandis before selling</li>
                    <li>• Consider storing produce for 1-2 months if prices are expected to rise</li>
                    <li>• Negotiate directly with buyers or join farmer groups for better prices</li>
                    <li>• Keep detailed records of costs for better planning next season</li>
                    <li>• Diversify crops to reduce risk and maximize income</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Calculator className="w-16 h-16 text-accent-300 mx-auto mb-4" />
                <p className="text-accent-600 text-lg">
                  {t('calculator.emptyState')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;