import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();
  const sections = [
    ['terms.acceptanceTitle', 'terms.acceptance'],
    ['terms.serviceTitle', 'terms.service'],
    ['terms.adviceTitle', 'terms.advice'],
    ['terms.userContentTitle', 'terms.userContent'],
    ['terms.externalServicesTitle', 'terms.externalServices'],
    ['terms.prohibitedTitle', 'terms.prohibited'],
    ['terms.availabilityTitle', 'terms.availability'],
    ['terms.liabilityTitle', 'terms.liability'],
    ['terms.indemnityTitle', 'terms.indemnity'],
    ['terms.changesTitle', 'terms.changes'],
    ['terms.contactTitle', 'terms.contact'],
  ] as const;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('terms.title')}</h1>
          <p className="text-primary-100">{t('terms.description')}</p>
          <p className="text-sm text-primary-100 mt-2">{t('terms.lastUpdated')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <p className="text-accent-700">{t('terms.introduction')}</p>
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

export default TermsOfService;
