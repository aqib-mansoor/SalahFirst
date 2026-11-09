/**
 * Core Shared TypeScript Interfaces
 */

export type ThemeMode = 'dark' | 'light' | 'system';

export type JuristicMethod = 'Hanafi' | 'Standard';

export type CalculationMethodName =
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'NorthAmerica'
  | 'MoonsightingCommittee'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isGps: boolean;
  region?: string;
  timezone?: string;
  lastUpdated?: number;
  isConfirmed?: boolean;
  isStale?: boolean;
  source?: 'gps' | 'manual' | 'preset';
}

export * from './prayerLedger';

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
  missedPrayerRemindersEnabled: boolean;
  dailyReflectionEnabled: boolean;
  streakEncouragementEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm format, e.g. '22:00'
  quietHoursEnd?: string;   // HH:mm format, e.g. '05:00'
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
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
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

export type PrayerPeriodCategory = 'obligatory' | 'nafl' | 'prohibited' | 'informational';

export type PrayerPeriodId =
  | 'tahajjud_last_third'
  | 'tahajjud'
  | 'fajr'
  | 'sunrise_prohibited'
  | 'ishraq'
  | 'duha'
  | 'zawal_prohibited'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface NextPrayerPeriod {
  id: PrayerPeriodId;
  nameKey: string;
  startTime: Date;
  timeFormatted: string;
}

export interface CurrentPrayerPeriod {
  id: PrayerPeriodId;
  nameKey: string;
  category: PrayerPeriodCategory;
  startTime: Date;
  endTime: Date;
  startTimeFormatted: string;
  endTimeFormatted: string;
  descriptionKey: string;
  isCalculatedWindow: boolean;
  isObligatory: boolean;
  isProhibited: boolean;
  isNafl: boolean;
  nextPeriod: NextPrayerPeriod;
  obligatorySalahName?: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
}
