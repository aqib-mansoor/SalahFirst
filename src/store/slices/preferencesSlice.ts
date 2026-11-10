import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLocation, PrayerAlertConfig } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

export type HadithTranslationMode = 'en' | 'ur' | 'both';

export const ALERTS_STORAGE_KEY = '@salahfirst_alerts';
export const HADITH_MODE_STORAGE_KEY = 'hadith_translation_mode';
export const HADITH_BOOKMARKS_STORAGE_KEY = 'saved_hadith_bookmarks';

export const DEFAULT_PRAYER_ALERTS: PrayerAlertConfig = {
  fajr: 'TONE',
  dhuhr: 'TONE',
  asr: 'TONE',
  maghrib: 'TONE',
  isha: 'VIBRATE',
  reminderOffset: '15m',
  exactAlarmsEnabled: true,
  missedPrayerRemindersEnabled: true,
  dailyReflectionEnabled: true,
  streakEncouragementEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '05:00',
};

export interface PreferencesState {
  userLocation: UserLocation | null;
  alerts: PrayerAlertConfig;
  hijriAdjustment: number | null;
  hadithTranslationMode: HadithTranslationMode;
  hadithBookmarks: string[];
  isHydrated: boolean;
}

const initialState: PreferencesState = {
  userLocation: null,
  alerts: DEFAULT_PRAYER_ALERTS,
  hijriAdjustment: null,
  hadithTranslationMode: 'both',
  hadithBookmarks: [],
  isHydrated: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    hydratePreferencesState: (
      state,
      action: PayloadAction<{
        userLocation?: UserLocation | null;
        alerts?: Partial<PrayerAlertConfig> | null;
        hijriAdjustment?: number | null;
        hadithTranslationMode?: HadithTranslationMode | null;
        hadithBookmarks?: string[] | null;
      }>
    ) => {
      if (action.payload.userLocation !== undefined) {
        state.userLocation = action.payload.userLocation;
      }
      if (action.payload.alerts) {
        state.alerts = { ...DEFAULT_PRAYER_ALERTS, ...action.payload.alerts };
      }
      if (action.payload.hijriAdjustment !== undefined) {
        state.hijriAdjustment = action.payload.hijriAdjustment;
      }
      if (action.payload.hadithTranslationMode) {
        state.hadithTranslationMode = action.payload.hadithTranslationMode;
      }
      if (action.payload.hadithBookmarks) {
        state.hadithBookmarks = action.payload.hadithBookmarks;
      }
      state.isHydrated = true;
    },

    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.userLocation = action.payload;
      storage.set(APP_CONFIG.storageKeys.userLocation, action.payload).catch(() => {});
    },

    setPrayerAlerts: (state, action: PayloadAction<PrayerAlertConfig>) => {
      state.alerts = action.payload;
      storage.set(ALERTS_STORAGE_KEY, action.payload).catch(() => {});
    },

    setHijriAdjustment: (state, action: PayloadAction<number>) => {
      state.hijriAdjustment = action.payload;
      storage.set(APP_CONFIG.storageKeys.hijriAdjustment, action.payload).catch(() => {});
    },

    setHadithTranslationMode: (state, action: PayloadAction<HadithTranslationMode>) => {
      state.hadithTranslationMode = action.payload;
      storage.set(HADITH_MODE_STORAGE_KEY, action.payload).catch(() => {});
    },

    setHadithBookmarks: (state, action: PayloadAction<string[]>) => {
      state.hadithBookmarks = action.payload;
      storage.set(HADITH_BOOKMARKS_STORAGE_KEY, action.payload).catch(() => {});
    },
  },
});

export const {
  hydratePreferencesState,
  setUserLocation,
  setPrayerAlerts,
  setHijriAdjustment,
  setHadithTranslationMode,
  setHadithBookmarks,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;

