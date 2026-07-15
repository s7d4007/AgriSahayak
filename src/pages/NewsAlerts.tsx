import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, Cloud, Lightbulb, TrendingUp } from 'lucide-react';
import { fetchNews } from '../services/api';

interface NewsItem {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  source: string;
  type: 'info' | 'warning' | 'alert';
  articleUrl?: string;
}

const NewsAlerts: React.FC = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await fetchNews();
      if (result.success) {
        setNews((result.data as NewsItem[]) ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNews();
  }, []);

  const categories = [
    { id: 'all', label: t('news.all'), icon: Newspaper },
    { id: 'weather', label: t('news.weatherAlerts'), icon: Cloud },
    { id: 'scheme', label: t('news.schemeUpdates'), icon: Lightbulb },
    { id: 'market', label: t('news.bestPractices'), icon: TrendingUp },
  ];

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter((item) => item.category === selectedCategory);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Newspaper className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('news.title')}</h1>
          </div>
          <p className="text-primary-100">
            {t('news.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-accent-600">Loading news...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className={`card cursor-pointer hover:shadow-xl transition-all border-l-4 ${
                  item.type === 'warning'
                    ? 'border-l-yellow-500'
                    : item.type === 'alert'
                    ? 'border-l-red-500'
                    : 'border-l-blue-500'
                }`}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                      item.type
                    )}`}
                  >
                    {item.type === 'warning'
                      ? '⚠️ Warning'
                      : item.type === 'alert'
                      ? '🚨 Alert'
                      : 'ℹ️ Info'}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-accent-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-accent-600 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-accent-200 pt-4">
                  <div className="text-xs text-accent-500">
                    <p className="font-medium">{item.source}</p>
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (item.articleUrl) {
                        window.open(item.articleUrl, '_blank');
                      }
                    }}
                    className="text-primary-600 font-medium hover:text-primary-700 text-sm hover:underline"
                  >
                    {t('news.readMore')} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 text-accent-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-accent-900 mb-2">{t('news.noNews')}</h3>
            <p className="text-accent-600">
              {t('news.noNews')}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 card bg-gradient-to-r from-primary-50 to-secondary-50">
          <h3 className="font-bold text-xl text-accent-900 mb-4">
            How to Stay Updated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-accent-900 mb-2">✓ Weather Alerts</h4>
              <p className="text-sm text-accent-600">
                Get advance warnings about heavy rains, droughts, and other weather events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent-900 mb-2">✓ Government Schemes</h4>
              <p className="text-sm text-accent-600">
                Never miss subsidies, loans, and support programs launched for farmers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent-900 mb-2">✓ Market Updates</h4>
              <p className="text-sm text-accent-600">
                Stay informed about crop prices and optimal harvesting times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAlerts;
