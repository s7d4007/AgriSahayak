import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const sections = [
    ['privacy.dataCollectionTitle', 'privacy.dataCollection'],
    ['privacy.localStorageTitle', 'privacy.localStorage'],
    ['privacy.externalServicesTitle', 'privacy.externalServices'],
    ['privacy.feedbackTitle', 'privacy.feedback'],
    ['privacy.dataUseTitle', 'privacy.dataUse'],
    ['privacy.retentionTitle', 'privacy.retention'],
    ['privacy.securityTitle', 'privacy.security'],
    ['privacy.choicesTitle', 'privacy.choices'],
    ['privacy.contactTitle', 'privacy.contact'],
  ] as const;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('privacy.title')}</h1>
          <p className="text-primary-100">{t('privacy.description')}</p>
          <p className="text-sm text-primary-100 mt-2">{t('privacy.lastUpdated')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <p className="text-accent-700">{t('privacy.introduction')}</p>
        {sections.map(([titleKey, bodyKey]) => (
          <div className="card" key={titleKey}>
            <h2 className="font-bold text-xl mb-2">{t(titleKey)}</h2>
            <p className="text-accent-700">{t(bodyKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
