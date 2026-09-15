import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import mrTranslations from '../locales/marathi.json';
import bnTranslations from '../locales/bengali.json';
import guTranslations from '../locales/gujarati.json';
import asTranslations from '../locales/assamese.json';
import orTranslations from '../locales/odia.json';
import paTranslations from '../locales/punjabi.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      mr: { translation: mrTranslations },
      bn: { translation: bnTranslations },
      gu: { translation: guTranslations },
      as: { translation: asTranslations },
      or: { translation: orTranslations },
      pa: { translation: paTranslations },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ['translation'],
    defaultNS: 'translation',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
