import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';
import Layout from './components/Layout';
import Home from './pages/Home';
import CropAdvisory from './pages/CropAdvisory';
import PriceDashboard from './pages/PriceDashboard';
import PriceCalculator from './pages/PriceCalculator';
import DiseaseDetector from './pages/DiseaseDetector';
import NewsAlerts from './pages/NewsAlerts';
import SettingsPage from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FarmPlanner from './pages/FarmPlanner';
import { initDB } from './services/db';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize IndexedDB
    initDB();

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crop-advisory" element={<CropAdvisory />} />
            <Route path="/prices" element={<PriceDashboard />} />
            <Route path="/price-calculator" element={<PriceCalculator />} />
            <Route path="/disease-detector" element={<DiseaseDetector />} />
            <Route path="/farm-planner" element={<FarmPlanner />} />
            <Route path="/news" element={<NewsAlerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </Layout>
      </Router>
    </I18nextProvider>
  );
};

export default App;
