import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const sections = [
    ['privacy.dataCollectionTitle', 'privacy.dataCollection', 'Information we collect', 'AgriSahayak may receive information you enter into the app, such as crop, soil, location, farm-planning, calculator, and feedback information. Disease-detection images are sent to the configured backend for processing. The app does not require an account or password.'],
    ['privacy.localStorageTitle', 'privacy.localStorage', 'Information stored on your device', 'Language preferences, farm plans, cached data, diagnostics, and unsent feedback may be stored in your browser. You can remove locally stored information by clearing app data or browser storage.'],
    ['privacy.externalServicesTitle', 'privacy.externalServices', 'Third-party services', 'Weather, news, market information, hosting, and disease detection may use third-party providers. These providers may process information under their own privacy policies.'],
    ['privacy.feedbackTitle', 'privacy.feedback', 'Feedback and optional email', 'When you submit feedback, the message and optional email address are sent to the configured Formspree endpoint so the app owner can receive it. Email is optional and should only be provided if you want a response.'],
    ['privacy.dataUseTitle', 'privacy.dataUse', 'How we use information', 'Information is used to provide agricultural recommendations, calculations, weather and market displays, disease analysis, offline functionality, and responses to feedback.'],
    ['privacy.retentionTitle', 'privacy.retention', 'Retention and deletion', 'Locally stored information can be removed from Settings or your browser settings. Information sent to external providers is subject to their retention practices.'],
    ['privacy.securityTitle', 'privacy.security', 'Security', 'We use reasonable safeguards, but no internet transmission or browser storage is completely secure. Do not submit passwords, financial information, or government identification numbers.'],
    ['privacy.choicesTitle', 'privacy.choices', 'Your choices', 'You may decline browser permissions, leave the email field blank, clear local data, or stop using any feature. Some features may not work without required permissions or network access.'],
    ['privacy.contactTitle', 'privacy.contact', 'Contact', 'For privacy questions, contact the app operator through the support address published with your deployment.'],
  ] as const;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('privacy.title', { defaultValue: 'Privacy Policy' })}</h1>
          <p className="text-primary-100">{t('privacy.description', { defaultValue: 'How AgriSahayak collects, uses, stores, and shares information.' })}</p>
          <p className="text-sm text-primary-100 mt-2">{t('privacy.lastUpdated', { defaultValue: 'Last updated: November 2, 2026' })}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <p className="text-accent-700">{t('privacy.introduction', { defaultValue: 'This policy explains how AgriSahayak handles information when you use its agricultural tools.' })}</p>
        {sections.map(([titleKey, bodyKey, defaultTitle, defaultBody]) => (
          <div className="card" key={titleKey}>
            <h2 className="font-bold text-xl mb-2">{t(titleKey, { defaultValue: defaultTitle })}</h2>
            <p className="text-accent-700">{t(bodyKey, { defaultValue: defaultBody })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
