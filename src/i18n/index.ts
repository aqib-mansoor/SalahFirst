import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import { storage } from '@/utils/storage';
import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import { validateTranslations } from './validator';

export type AppLanguage = 'en' | 'ur' | 'ar';

export const LANGUAGE_STORAGE_KEY = '@salahfirst_language';

export const SUPPORTED_LANGUAGES: { code: AppLanguage; label: string; nativeName: string; isRTL: boolean }[] = [
  { code: 'en', label: 'English', nativeName: 'English', isRTL: false },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو', isRTL: true },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', isRTL: true },
];

export const isLanguageRTL = (lang: string): boolean => {
  return lang === 'ur' || lang === 'ar';
};

export const detectDeviceLanguage = (): AppLanguage => {
  try {
    const locales = Localization.getLocales();
    const deviceCode = locales[0]?.languageCode?.toLowerCase() || 'en';
    if (deviceCode === 'ur') return 'ur';
    if (deviceCode === 'ar') return 'ar';
    return 'en';
  } catch {
    return 'en';
  }
};

const resources = {
  en: { translation: en },
  ur: { translation: ur },
  ar: { translation: ar },
};

// Initialize i18next instance
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Will be rehydrated from storage or device locale on app mount
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
} as any);

// Run development-time validation
if (__DEV__) {
  validateTranslations();
}

/**
 * Initializes language from storage or device locale
 */
export const initAppLanguage = async (): Promise<AppLanguage> => {
  try {
    const saved = await storage.get<AppLanguage | null>(LANGUAGE_STORAGE_KEY, null);
    const chosen = (saved && ['en', 'ur', 'ar'].includes(saved)) ? saved : detectDeviceLanguage();
    
    await i18n.changeLanguage(chosen);
    
    const rtl = isLanguageRTL(chosen);
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
    
    return chosen;
  } catch {
    return 'en';
  }
};

/**
 * Changes language, saves to storage, and configures RTL
 */
export const changeAppLanguage = async (newLang: AppLanguage): Promise<void> => {
  try {
    await i18n.changeLanguage(newLang);
    await storage.set(LANGUAGE_STORAGE_KEY, newLang);
    
    const rtl = isLanguageRTL(newLang);
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
  } catch (error) {
    console.error('[i18n] Failed to switch language:', error);
  }
};

export default i18n;
export type TranslationKey = keyof typeof en;
