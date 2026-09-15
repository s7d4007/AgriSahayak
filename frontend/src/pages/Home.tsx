import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  TrendingUp,
  Camera,
  Globe,
  Newspaper,
  WifiOff,
  ArrowRight,
  Cloud,
  Droplets,
  Wind,
  AlertTriangle,
  Loader,
} from 'lucide-react';
import { fetchWeather, getLocationCoordinates } from '../services/api';

interface Weather {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  cloudCover: number;
  offline?: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Fetch weather on component mount
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        
        // Get user's location
        const location = await getLocationCoordinates();
        
        // Fetch weather data
        const weatherData = await fetchWeather(location.lat, location.lon);
        
        if (weatherData.success && weatherData.data) {
          setWeather(weatherData.data);
        }
      } catch (error) {
        console.error('Error loading weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, []);

  const features = [
    {
      icon: Sprout,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
      path: '/crop-advisory',
    },
    {
      icon: TrendingUp,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
      path: '/prices',
    },
    {
      icon: Camera,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
      path: '/disease-detector',
    },
    {
      icon: Globe,
      title: t('home.feature4Title'),
      description: t('home.feature4Desc'),
      path: '/settings',
    },
    {
      icon: Newspaper,
      title: t('home.feature5Title'),
      description: t('home.feature5Desc'),
      path: '/news',
    },
    {
      icon: WifiOff,
      title: t('home.feature6Title'),
      description: t('home.feature6Desc'),
      path: '/',
    },
  ];

  const stats = [
    { value: '10,000+', label: t('home.farmers') },
    { value: '15-25%', label: t('home.profitIncrease') },
    { value: '8-12%', label: t('home.priceRealization') },
    { value: '20%', label: t('home.diseaseReduction') },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                {t('home.welcome')}
              </h1>
              <p className="text-xl text-accent-600 mb-8 leading-relaxed">
                {t('home.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/crop-advisory')}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {t('home.getStarted')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  {t('home.learnMore')}
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-32 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-lg flex items-center justify-center text-primary-600">
                    <Sprout className="w-16 h-16" />
                  </div>
                  <h3 className="font-bold text-lg text-accent-900">Smart Recommendations</h3>
                  <p className="text-accent-600 text-sm">Get crop suggestions based on your location and soil type.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Widget Section */}
      <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-accent-900 mb-6 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-primary-600" />
            Current Weather
          </h3>
          
          {weatherLoading ? (
            <div className="card text-center py-8">
              <Loader className="w-8 h-8 text-primary-600 mx-auto animate-spin mb-3" />
              <p className="text-accent-600">Loading weather data...</p>
            </div>
          ) : weather ? (
            <>
              {/* Offline Mode Warning */}
              {weather.offline && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">Using Offline Data</p>
                      <p className="text-sm text-orange-700 mt-1">
                        Real weather data could not be loaded. Check your API key or internet connection.
                      </p>
                      <p className="text-xs text-orange-700 mt-2 font-mono">
                        Console Tip: Open DevTools (F12) → Console to see detailed error messages
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Temperature */}
              <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-accent-900">Temperature</h4>
                  <Cloud className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-4xl font-bold text-blue-600">{weather.temperature}°C</p>
                <p className="text-sm text-accent-600 mt-2">
                  Feels like {weather.feelsLike}°C
                </p>
                <p className="text-xs text-accent-500 mt-2 capitalize">
                  {weather.description}
                </p>
              </div>

              {/* Humidity */}
              <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-accent-900">Humidity</h4>
                  <Droplets className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-4xl font-bold text-green-600">{weather.humidity}%</p>
                <p className="text-sm text-accent-600 mt-2">
                  {weather.humidity > 70 ? 'High humidity' : weather.humidity > 40 ? 'Moderate humidity' : 'Low humidity'}
                </p>
              </div>

              {/* Wind Speed */}
              <div className="card bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-accent-900">Wind Speed</h4>
                  <Wind className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-4xl font-bold text-orange-600">{weather.windSpeed} m/s</p>
                <p className="text-sm text-accent-600 mt-2">
                  {weather.windSpeed > 6 ? 'Strong wind' : weather.windSpeed > 3 ? 'Moderate wind' : 'Light wind'}
                </p>
              </div>

              {/* Pressure & Rainfall */}
              <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-accent-900">Conditions</h4>
                  <Cloud className="w-6 h-6 text-purple-500" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-accent-500">Pressure</p>
                    <p className="text-xl font-bold text-purple-600">{weather.pressure} hPa</p>
                  </div>
                  <div>
                    <p className="text-xs text-accent-500">Cloud Cover</p>
                    <p className="text-xl font-bold text-purple-600">{weather.cloudCover}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location & Status */}
            {weather && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>📍 Location:</strong> {weather.location || 'Your location'} 
                  {weather.latitude && weather.longitude && ` (${weather.latitude.toFixed(2)}°, ${weather.longitude.toFixed(2)}°)`}
                </p>
                <p className="text-xs text-blue-700 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            )}
            </>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('home.features')}</h2>
            <p className="section-subtitle">Everything you need for smart farming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card group cursor-pointer hover:border-primary-300"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-accent-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-accent-600 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-primary-600 font-medium">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.impact')}
            </h2>
            <p className="text-primary-100">Projected impact in pilot districts within 6 months</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <p className="text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">{t('home.ctaTitle')}</h2>
          <p className="section-subtitle mb-8">
            {t('home.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/crop-advisory')}
              className="btn-primary"
            >
              {t('home.ctaGetStarted')}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="btn-secondary"
            >
              {t('home.ctaCustomizeLanguage')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
