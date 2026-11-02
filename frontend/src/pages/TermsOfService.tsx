import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();
  const sections = [
    ['terms.acceptanceTitle', 'terms.acceptance', 'Acceptance', 'By using AgriSahayak, you agree to these terms. If you do not agree, do not use the service.'],
    ['terms.serviceTitle', 'terms.service', 'The service', 'AgriSahayak provides agricultural information, crop-planning tools, calculations, weather and news displays, and optional disease detection. Features may change or become unavailable.'],
    ['terms.adviceTitle', 'terms.advice', 'Informational advice only', 'The app is an informational aid, not a substitute for advice from qualified agricultural, financial, medical, or emergency professionals. Verify important decisions with reliable local sources.'],
    ['terms.userContentTitle', 'terms.userContent', 'Your content', 'You are responsible for images, feedback, email addresses, and other information you submit. Do not submit unlawful, harmful, private, or unauthorized content.'],
    ['terms.externalServicesTitle', 'terms.externalServices', 'Third-party services', 'The app may use Formspree, Kindwise, weather providers, news feeds, hosting providers, and market-data sources. Their services and policies are outside AgriSahayak’s control.'],
    ['terms.prohibitedTitle', 'terms.prohibited', 'Prohibited use', 'Do not attempt unauthorized access, bypass security controls, upload malicious code, disrupt the service, or use outputs for unlawful or dangerous decisions.'],
    ['terms.availabilityTitle', 'terms.availability', 'Availability and changes', 'The service is provided on an as-available basis. We may modify, suspend, or discontinue features and update these terms.'],
    ['terms.liabilityTitle', 'terms.liability', 'Disclaimer and liability', 'To the extent permitted by law, AgriSahayak is provided without warranties and is not responsible for crop loss, inaccurate information, provider outages, data loss, or decisions based on the service.'],
    ['terms.indemnityTitle', 'terms.indemnity', 'Indemnity', 'To the extent permitted by law, you are responsible for claims or losses caused by your misuse of the service or violation of these terms.'],
    ['terms.changesTitle', 'terms.changes', 'Governing terms', 'These terms should be read with the Privacy Policy. The operator should obtain local legal advice before production use.'],
    ['terms.contactTitle', 'terms.contact', 'Contact', 'Questions about these terms should be sent to the support address published with your deployment.'],
  ] as const;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('terms.title', { defaultValue: 'Terms of Service' })}</h1>
          <p className="text-primary-100">{t('terms.description', { defaultValue: 'The rules and conditions for using AgriSahayak.' })}</p>
          <p className="text-sm text-primary-100 mt-2">{t('terms.lastUpdated', { defaultValue: 'Last updated: November 2, 2026' })}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <p className="text-accent-700">{t('terms.introduction', { defaultValue: 'These Terms of Service govern your use of AgriSahayak. By using the service, you agree to follow them.' })}</p>
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

export default TermsOfService;
