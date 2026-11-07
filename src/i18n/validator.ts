import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';

export interface ValidationReport {
  isValid: boolean;
  missingInUrdu: string[];
  missingInArabic: string[];
  extraInUrdu: string[];
  extraInArabic: string[];
}

export const validateTranslations = (): ValidationReport => {
  const enKeys = Object.keys(en);
  const urKeys = Object.keys(ur);
  const arKeys = Object.keys(ar);

  const missingInUrdu = enKeys.filter((key) => !(key in ur));
  const missingInArabic = enKeys.filter((key) => !(key in ar));
  const extraInUrdu = urKeys.filter((key) => !(key in en));
  const extraInArabic = arKeys.filter((key) => !(key in en));

  const isValid =
    missingInUrdu.length === 0 &&
    missingInArabic.length === 0 &&
    extraInUrdu.length === 0 &&
    extraInArabic.length === 0;

  if (!isValid && __DEV__) {
    if (missingInUrdu.length > 0) {
      console.warn('[i18n] Missing keys in Urdu:', missingInUrdu);
    }
    if (missingInArabic.length > 0) {
      console.warn('[i18n] Missing keys in Arabic:', missingInArabic);
    }
    if (extraInUrdu.length > 0) {
      console.warn('[i18n] Extra keys in Urdu (not in English):', extraInUrdu);
    }
    if (extraInArabic.length > 0) {
      console.warn('[i18n] Extra keys in Arabic (not in English):', extraInArabic);
    }
  }

  return {
    isValid,
    missingInUrdu,
    missingInArabic,
    extraInUrdu,
    extraInArabic,
  };
};
