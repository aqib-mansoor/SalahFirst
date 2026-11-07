/**
 * Core Shared TypeScript Interfaces
 */

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isGps: boolean;
}

export interface UserPreferences {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticFeedback: boolean;
  location?: UserLocation;
}

export type SalahName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTimeItem {
  id: SalahName;
  name: string;
  time: string;
  isPassed: boolean;
  isCurrent: boolean;
}

export interface StoredPrayerRecord {
  date: string; // YYYY-MM-DD
  completedPrayers: Record<SalahName, boolean>;
}
