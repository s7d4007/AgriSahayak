import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/crop-advisory', label: t('nav.cropAdvisory') },
    { path: '/prices', label: t('nav.priceInfo') },
    { path: '/price-calculator', label: t('nav.priceCalculator') },
    { path: '/disease-detector', label: t('nav.diseaseDetector') },
    { path: '/farm-planner', label: t('nav.farmPlanner') },
    { path: '/news', label: t('nav.news') },
    { path: '/settings', label: t('nav.settings') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-accent-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-0">
                <img
                  src="/logo.png"
                  alt="AgriSahayak"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-logo.png'; // Fallback image
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-700">AgriSahayak</h1>
                <p className="text-xs text-secondary-600">Farm Smart, Earn More</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-accent-600 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language and Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                    i18n.language === 'en'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                    i18n.language === 'hi'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  हि
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-accent-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-accent-200 bg-white">
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-accent-600 hover:bg-accent-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    changeLanguage('hi');
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    i18n.language === 'hi'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700'
                  }`}
                >
                  हि
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="AgriSahayak" className="w-8 h-8 rounded-full" />
                <h3 className="font-bold text-lg">AgriSahayak</h3>
              </div>
              <p className="text-sm text-gray-300">{t('footer.description')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.features')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/crop-advisory" className="hover:text-primary-400">{t('nav.cropAdvisory')}</a></li>
                <li><a href="/prices" className="hover:text-primary-400">{t('nav.priceInfo')}</a></li>
                <li><a href="/disease-detector" className="hover:text-primary-400">{t('nav.diseaseDetector')}</a></li>
                <li><a href="/farm-planner" className="hover:text-primary-400">{t('nav.farmPlanner')}</a></li>
                <li><a href="/news" className="hover:text-primary-400">{t('nav.news')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/privacy" className="hover:text-primary-400">{t('footer.privacyPolicy')}</a></li>
                <li><a href="/terms" className="hover:text-primary-400">{t('footer.termsOfService')}</a></li>
                <li><a href="mailto:support@agrisahayak.com" className="hover:text-primary-400">{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} AgriSahayak. {t('footer.copyright')} | {t('footer.madeWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
