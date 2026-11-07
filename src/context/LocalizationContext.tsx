import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { AppLanguage, TRANSLATIONS, TranslationKey } from '@/constants/translations';

interface LocalizationContextType {
  language: AppLanguage;
  isRTL: boolean;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  language: 'en',
  isRTL: false,
  setLanguage: async () => {},
  t: (key) => TRANSLATIONS.en[key] || key,
});

const LANGUAGE_KEY = '@salahfirst_language';

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const saved = await storage.get<AppLanguage | null>(LANGUAGE_KEY, null);
      if (saved === 'en' || saved === 'ur') {
        setLanguageState(saved);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (newLang: AppLanguage) => {
    setLanguageState(newLang);
    await storage.set(LANGUAGE_KEY, newLang);
  }, []);

  const isRTL = language === 'ur';

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  return (
    <LocalizationContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = () => useContext(LocalizationContext);

