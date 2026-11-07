/**
 * Core Shared TypeScript Interfaces
 */
import { ThemeColors } from '@/constants/theme';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserPreferences {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticFeedback: boolean;
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

