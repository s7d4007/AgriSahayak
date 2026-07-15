import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Trash2, Download, Info } from 'lucide-react';
import { clearDatabase, getDBSize, getAllDiagnostics, getAllPrices } from '../services/db';
import { saveFeedback } from '../services/feedbackStore';
import { LANGUAGES, APP_VERSION, APP_NAME } from '../utils/constants';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [dbSize, setDBSize] = useState({ usage: 0, quota: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);

  const updateDBSize = async () => {
    try {
      const size = await getDBSize();
      setDBSize(size);
    } catch (_error) {
      console.error('Error updating DB size:', _error);
    }
  };

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateDBSize();
    // Update cache size every 5 seconds to show real-time changes
    const interval = setInterval(updateDBSize, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    if (
      window.confirm(
        'Are you sure you want to clear all cached data? This action cannot be undone.'
      )
    ) {
      setLoading(true);
      try {
        // Clear IndexedDB stores
        await clearDatabase();

        // Clear all service worker caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }

        setMessage('Cache cleared successfully!');
        setTimeout(() => setMessage(''), 3000);
        await updateDBSize();
      } catch (err) {
        console.error('Error clearing cache:', err);
        setMessage('Failed to clear cache');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadData = async () => {
    try {
      setLoading(true);
      const diagnostics = await getAllDiagnostics();
      const prices = await getAllPrices();
      const exportObj = { diagnostics, prices, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agrisahayak-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage('Data downloaded');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Download failed', err);
      setMessage('Failed to download data');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setFeedbackSaving(true);
    try {
      await saveFeedback({
        id: crypto.randomUUID(),
        message: feedbackText.trim(),
        language: i18n.language,
        createdAt: new Date().toISOString(),
        synced: false,
      });

      setFeedbackText('');
      setMessage(
        t('feedback.savedOffline', {
          defaultValue: 'Feedback saved offline.',
        })
      );
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Feedback save failed', err);
      setMessage(
        t('feedback.saveFailed', {
          defaultValue: 'Failed to save feedback.',
        })
      );
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setFeedbackSaving(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Settings className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t('settings.title')}</h1>
          </div>
          <p className="text-primary-100">
            Customize your AgriSahayak experience
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Language Settings */}
          <div className="card">
            <h2 className="text-2xl font-bold text-accent-900 mb-6">
              {t('settings.language')}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    const langName = t(`settings.languages.${lang.code}`, {
                      defaultValue: lang.name,
                    });
                    i18n.changeLanguage(lang.code);
                    localStorage.setItem('language', lang.code);
                    setMessage(
                      t('settings.languageChanged', { name: langName })
                    );
                    setTimeout(() => setMessage(''), 3000);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    i18n.language === lang.code
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  {t(`settings.languages.${lang.code}`, {
                    defaultValue: lang.name,
                  })}
                </button>
              ))}
            </div>

            <p className="text-sm text-accent-600 mt-4">
              Select your preferred language. The app will be translated immediately.
            </p>
          </div>

          {/* Offline Data Settings */}
          <div className="card">
            <h2 className="text-2xl font-bold text-accent-900 mb-6">
              {t('settings.offlineData')}
            </h2>

            <div className="space-y-6">
              {/* DB Size Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-accent-900">
                    {t('settings.cacheSize')}
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    {formatBytes(dbSize.usage)}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (dbSize.usage / dbSize.quota) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-accent-600 mt-2">
                  Using {formatBytes(dbSize.usage)} of{' '}
                  {formatBytes(dbSize.quota)} available
                </p>
              </div>

              {/* Download Data Button */}
              <button onClick={handleDownloadData} className="btn-secondary w-full flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {t('settings.downloadData')}
              </button>

              {/* Clear Cache Button */}
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="btn-outline w-full flex items-center justify-center gap-2 text-red-600 border-red-300 bg-red-50 hover:bg-red-100"
              >
                <Trash2 className="w-5 h-5" />
                {loading ? 'Clearing...' : t('settings.clearCache')}
              </button>

              <p className="text-sm text-accent-600">
                Clear all cached data including crops, prices, and news. The app will
                redownload essential data when you go online again.
              </p>
            </div>
          </div>

          {/* About AgriSahayak */}
          <div className="card">
            <h2 className="text-2xl font-bold text-accent-900 mb-6">
              {t('settings.aboutApp')}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-accent-200">
                <span className="text-accent-700">{t('settings.version')}</span>
                <span className="font-semibold text-accent-900">{APP_VERSION}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-accent-200">
                <span className="text-accent-700">{t('settings.developer')}</span>
                <span className="font-semibold text-accent-900">AgriTech India</span>
              </div>

              <div className="py-3 border-b border-accent-200">
                <h3 className="font-semibold text-accent-900 mb-2">About {APP_NAME}</h3>
                <p className="text-sm text-accent-600">
                  {APP_NAME} is a Progressive Web App designed to empower Indian farmers with
                  hyperlocal crop recommendations, real-time market prices, offline disease
                  detection, and agricultural news - all in your preferred language.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-accent-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-600" />
                  Key Features
                </h3>
                <ul className="text-sm text-accent-600 space-y-1">
                  <li>✓ Works completely offline</li>
                  <li>✓ Multilingual support (8 languages)</li>
                  <li>✓ Hyperlocal crop recommendations</li>
                  <li>✓ Real-time market prices</li>
                  <li>✓ AI-powered disease detection</li>
                  <li>✓ Government scheme alerts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="card border-2 border-primary-300">
            <h2 className="text-2xl font-bold text-accent-900 mb-6">
              {t('feedback.title', {
                defaultValue: t('settings.feedback', { defaultValue: 'Feedback' }),
              })}
            </h2>

            <form onSubmit={handleSubmitFeedback}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t('feedback.placeholder', {
                  defaultValue: 'Tell us how we can improve AgriSahayak...',
                })}
                className="input-field mb-4 h-32"
              />

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={feedbackSaving || !feedbackText.trim()}
              >
                {feedbackSaving
                  ? t('feedback.saving', { defaultValue: 'Saving...' })
                  : t('feedback.submit', { defaultValue: 'Submit Feedback' })}
              </button>
            </form>

            <p className="text-sm text-accent-600 mt-4">
              {t('feedback.note', {
                defaultValue:
                  'Your feedback helps us continue to improve AgriSahayak and serve farmers better.',
              })}
            </p>
          </div>

          {/* Links */}
          <div className="card">
            <div className="space-y-3">
              <a href="/privacy" className="block text-primary-600 font-medium hover:text-primary-700">
                → {t('settings.privacyPolicy')}
              </a>
              <a href="/terms" className="block text-primary-600 font-medium hover:text-primary-700">
                → {t('settings.termsOfService')}
              </a>
              <a href="mailto:support@agrisahayak.com" className="block text-primary-600 font-medium hover:text-primary-700">
                → Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
