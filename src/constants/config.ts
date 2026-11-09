/**
 * App Configuration
 * Centralized settings for easy rebranding and global app modifications.
 */
export const APP_CONFIG = {
  name: 'SalahFirst',
  nameFirst: 'Salah',
  nameSecond: 'First',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  tagline: 'Make time for what matters.',
  continueButton: 'Continue to Setup',
  privacyBadge: '100% Private • Offline-First • No Account Required',
  version: '1.0.1',
  storageKeys: {
    theme: '@salahfirst_theme',
    hasCompletedSetup: '@salahfirst_has_completed_setup',
    userLocation: '@salahfirst_location',
    userPreferences: '@salahfirst_preferences',
    prayerTracker: '@salahfirst_prayer_tracker',
    prayerLedger: '@salahfirst_prayer_ledger',
    prayerCycle: '@salahfirst_prayer_cycle',
    streak: '@salahfirst_streak',
    calculationMethod: '@salahfirst_calc_method',
    juristicMethod: '@salahfirst_juristic_method',
    hijriAdjustment: '@salahfirst_hijri_adjustment',
  },
  defaultSettings: {
    themeMode: 'dark' as 'dark' | 'light' | 'system',
    notificationsEnabled: true,
    hapticFeedback: true,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
