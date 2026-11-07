/**
 * Backward compatibility re-export
 * Centralized i18n is located in src/i18n
 */
export {
  AppLanguage,
  TranslationKey,
  SUPPORTED_LANGUAGES,
  isLanguageRTL,
  changeAppLanguage,
  default as i18n,
} from '@/i18n';
