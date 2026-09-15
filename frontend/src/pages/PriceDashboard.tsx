import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { MARKET_PRICES } from '../utils/constants';
import { fetchMarketPrices } from '../services/api';

interface Price {
  commodity: string;
  mspPrice: number;
  marketPrice: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated?: string;
}

const PriceDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<Price | null>(null);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const result = await fetchMarketPrices();
      if (result.success) {
        setPrices((result.data as Price[]) || MARKET_PRICES);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const runLoad = async () => {
      setLoading(true);
      try {
        const result = await fetchMarketPrices();
        if (!isActive) return;
        if (result.success) {
          setPrices((result.data as Price[]) || MARKET_PRICES);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void runLoad();

    return () => {
      isActive = false;
    };
  }, []);

  const getPriceDifference = (mspPrice: number, marketPrice: number) => {
    return marketPrice - mspPrice;
  };

  const getPriceDifferencePercentage = (mspPrice: number, marketPrice: number) => {
    return ((marketPrice - mspPrice) / mspPrice * 100).toFixed(2);
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <DollarSign className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('pricing.title')}</h1>
          </div>
          <p className="text-primary-100">
            Check government MSP rates and real-time market prices for informed selling decisions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-accent-900 mb-6">
                Price Information
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-accent-900 mb-2">MSP (Minimum Support Price)</h3>
                  <p className="text-sm text-accent-600">
                    Government guaranteed price below which your produce cannot be bought.
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-accent-900 mb-2">Market Price</h3>
                  <p className="text-sm text-accent-600">
                    Current buying prices in major agricultural markets (mandis).
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-accent-900 mb-2">Negotiation Tips</h3>
                  <ul className="text-sm text-accent-600 space-y-2">
                    <li>✓ {t('pricing.tip1')}</li>
                    <li>✓ {t('pricing.tip2')}</li>
                    <li>✓ {t('pricing.tip3')}</li>
                    <li>✓ {t('pricing.tip4')}</li>
                  </ul>
                </div>

                <button
                  onClick={loadPrices}
                  className="btn-primary w-full"
                >
                  Refresh Prices
                </button>
              </div>
            </div>
          </div>

          {/* Prices Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="card text-center py-12">
                <p className="text-accent-600">Loading prices...</p>
              </div>
            ) : selectedCommodity ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedCommodity(null)}
                  className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-2"
                >
                  ← Back to Prices
                </button>

                <div className="card">
                  <h2 className="text-3xl font-bold text-accent-900 mb-6">
                    {selectedCommodity.commodity}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* MSP Price */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <p className="text-sm text-accent-600 mb-2">MSP Price (₹/Quintal)</p>
                      <p className="text-3xl font-bold text-blue-700">
                        ₹{selectedCommodity.mspPrice}
                      </p>
                      <p className="text-xs text-accent-500 mt-2">Government Guarantee</p>
                    </div>

                    {/* Market Price */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <p className="text-sm text-accent-600 mb-2">Market Price (₹/Quintal)</p>
                      <p className="text-3xl font-bold text-green-700">
                        ₹{selectedCommodity.marketPrice}
                      </p>
                      <p className="text-xs text-accent-500 mt-2">Current Rate</p>
                    </div>

                    {/* Price Difference */}
                    <div
                      className={`rounded-lg p-6 ${
                        getPriceDifference(
                          selectedCommodity.mspPrice,
                          selectedCommodity.marketPrice
                        ) >= 0
                          ? 'bg-green-50'
                          : 'bg-red-50'
                      }`}
                    >
                      <p className="text-sm text-accent-600 mb-2">Price Difference</p>
                      <p
                        className={`text-3xl font-bold ${
                          getPriceDifference(
                            selectedCommodity.mspPrice,
                            selectedCommodity.marketPrice
                          ) >= 0
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {getPriceDifference(
                          selectedCommodity.mspPrice,
                          selectedCommodity.marketPrice
                        ) >= 0
                          ? '+'
                          : ''}
                        ₹{getPriceDifference(
                          selectedCommodity.mspPrice,
                          selectedCommodity.marketPrice
                        )}
                      </p>
                      <p className="text-xs text-accent-500 mt-2">
                        {getPriceDifferencePercentage(
                          selectedCommodity.mspPrice,
                          selectedCommodity.marketPrice
                        )}
                        % Change
                      </p>
                    </div>
                  </div>

                  {/* Price Trend */}
                  <div className="border-t border-accent-200 pt-6">
                    <h3 className="font-bold text-lg text-accent-900 mb-4">Price Trend</h3>
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          selectedCommodity.trend === 'up'
                            ? 'bg-green-100'
                            : selectedCommodity.trend === 'down'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {selectedCommodity.trend === 'up' && (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        )}
                        {selectedCommodity.trend === 'down' && (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                        {selectedCommodity.trend === 'stable' && (
                          <Target className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-accent-900">
                          {selectedCommodity.trend === 'up'
                            ? 'Price Increasing'
                            : selectedCommodity.trend === 'down'
                            ? 'Price Decreasing'
                            : 'Price Stable'}
                        </p>
                        <p className="text-sm text-accent-600">
                          {selectedCommodity.lastUpdated
                            ? new Date(selectedCommodity.lastUpdated).toLocaleDateString()
                            : 'Recently updated'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="section-title mb-8">Current Market Prices</h2>
                <div className="grid grid-cols-1 gap-6">
                  {prices.map((price, index) => {
                    const diff = getPriceDifference(price.mspPrice, price.marketPrice);
                    const isAboveMSP = diff > 0;

                    return (
                      <div
                        key={index}
                        className="card cursor-pointer hover:border-primary-400 transition-all"
                        onClick={() => setSelectedCommodity(price)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-accent-900 mb-2">
                              {price.commodity}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-accent-500 uppercase">MSP</p>
                                <p className="text-lg font-bold text-blue-700">
                                  ₹{price.mspPrice}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-accent-500 uppercase">Market</p>
                                <p className="text-lg font-bold text-green-700">
                                  ₹{price.marketPrice}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-accent-500 uppercase">
                                  Difference
                                </p>
                                <p
                                  className={`text-lg font-bold ${
                                    isAboveMSP ? 'text-green-700' : 'text-red-700'
                                  }`}
                                >
                                  {isAboveMSP ? '+' : ''}₹{diff}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-accent-500 uppercase">Status</p>
                                {isAboveMSP ? (
                                  <span className="badge-success">Above MSP</span>
                                ) : (
                                  <span className="badge-danger">Below MSP</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="ml-4 hidden md:block">
                            {price.trend === 'up' && (
                              <TrendingUp className="w-8 h-8 text-green-600" />
                            )}
                            {price.trend === 'down' && (
                              <TrendingDown className="w-8 h-8 text-red-600" />
                            )}
                            {price.trend === 'stable' && (
                              <Target className="w-8 h-8 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDashboard;
