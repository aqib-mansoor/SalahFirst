/**
 * App Configuration
 * Centralized settings for easy rebranding and global app modifications.
 */
export const APP_CONFIG = {
  name: 'SalahFirst',
  tagline: 'Modern Islamic Prayer & Productivity',
  version: '1.0.0',
  storageKeys: {
    theme: '@salahfirst_theme',
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

