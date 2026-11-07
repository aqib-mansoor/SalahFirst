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

export type NotificationMode = 'AZAN' | 'TONE' | 'VIBRATE' | 'SILENT';
export type ReminderOffset = 'off' | '10m' | '15m' | '30m';

export interface PrayerAlertConfig {
  fajr: NotificationMode;
  dhuhr: NotificationMode;
  asr: NotificationMode;
  maghrib: NotificationMode;
  isha: NotificationMode;
  reminderOffset: ReminderOffset;
  exactAlarmsEnabled: boolean;
}

export type FocusDuration = 10 | 15 | 20 | 30;

export interface FocusSettings {
  duration: FocusDuration;
  blockSocial: boolean;
  blockShortVideos: boolean;
  blockGames: boolean;
  blockNews: boolean;
  autoStartOnAzan: boolean;
  playAzanBefore: boolean;
}

export interface UserPreferences {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticFeedback: boolean;
  location?: UserLocation;
  alerts?: PrayerAlertConfig;
  focusSettings?: FocusSettings;
}

export type SalahName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTimeItem {
  id: SalahName;
  name: string;
  arabicName: string;
  time: string;
  notification: NotificationMode;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
  remainingTimeText?: string;
}

export interface StoredPrayerRecord {
  date: string; // YYYY-MM-DD
  completedPrayers: Record<SalahName, boolean>;
}
