/**
 * App Configuration
 * Centralized settings for easy rebranding and global app modifications.
 */
export const APP_CONFIG = {
  name: 'SalahFirst',
  nameFirst: 'Salah',
  nameSecond: 'First',
  bismillah: 'BISMILLAHIR RAHMANIR RAHIM',
  tagline: 'Make time for what matters.',
  continueButton: 'Continue to Setup',
  privacyBadge: '100% Private • Offline-First • No Account Required',
  version: '1.0.0',
  storageKeys: {
    theme: '@salahfirst_theme',
    hasCompletedSetup: '@salahfirst_has_completed_setup',
    userPreferences: '@salahfirst_preferences',
    prayerTracker: '@salahfirst_prayer_tracker',
    streak: '@salahfirst_streak',
  },
  defaultSettings: {
    themeMode: 'dark' as 'dark' | 'light' | 'system',
    notificationsEnabled: true,
    hapticFeedback: true,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
