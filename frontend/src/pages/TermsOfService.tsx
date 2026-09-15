import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('terms.title')}</h1>
          <p className="text-primary-100">{t('terms.description')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="card">
          <h2 className="font-bold text-xl mb-2">{t('terms.usageTitle')}</h2>
          <p className="text-accent-700">{t('terms.usage')}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-xl mb-2">{t('terms.liabilityTitle')}</h2>
          <p className="text-accent-700">{t('terms.liability')}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
