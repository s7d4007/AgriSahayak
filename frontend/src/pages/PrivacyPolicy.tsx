import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('privacy.title')}</h1>
          <p className="text-primary-100">{t('privacy.description')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="card">
          <h2 className="font-bold text-xl mb-2">{t('privacy.dataCollectionTitle')}</h2>
          <p className="text-accent-700">{t('privacy.dataCollection')}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-xl mb-2">{t('privacy.dataUseTitle')}</h2>
          <p className="text-accent-700">{t('privacy.dataUse')}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-xl mb-2">{t('privacy.contactTitle')}</h2>
          <p className="text-accent-700">{t('privacy.contact')}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
