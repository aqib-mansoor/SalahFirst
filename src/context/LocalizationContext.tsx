import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useTranslation as useI18nextTranslation, I18nextProvider } from 'react-i18next';
import i18n, {
  AppLanguage,
  TranslationKey,
  isLanguageRTL,
  initAppLanguage,
  changeAppLanguage,
} from '@/i18n';

interface LocalizationContextType {
  language: AppLanguage;
  isRTL: boolean;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  t: (key: TranslationKey, options?: Record<string, any>) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  language: 'en',
  isRTL: false,
  setLanguage: async () => {},
  t: (key) => key,
});

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t: i18nTranslate } = useI18nextTranslation();
  const [currentLang, setCurrentLang] = useState<AppLanguage>(
    (i18n.language as AppLanguage) || 'en'
  );

  useEffect(() => {
    const init = async () => {
      const detectedOrSaved = await initAppLanguage();
      setCurrentLang(detectedOrSaved);
    };
    init();

    const handleLanguageChanged = (lng: string) => {
      setCurrentLang((lng as AppLanguage) || 'en');
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const setLanguage = useCallback(async (newLang: AppLanguage) => {
    await changeAppLanguage(newLang);
    setCurrentLang(newLang);
  }, []);

  const isRTL = isLanguageRTL(currentLang);

  const t = useCallback(
    (key: TranslationKey, options?: Record<string, any>): string => {
      return (options ? i18nTranslate(key as any, options) : i18nTranslate(key as any)) as string;
    },
    [i18nTranslate]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <LocalizationContext.Provider
        value={{
          language: currentLang,
          isRTL,
          setLanguage,
          t,
        }}
      >
        {children}
      </LocalizationContext.Provider>
    </I18nextProvider>
  );
};

export const useTranslation = () => useContext(LocalizationContext);
export { AppLanguage, TranslationKey } from '@/i18n';
