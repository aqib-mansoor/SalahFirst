import { configureStore } from '@reduxjs/toolkit';
import prayerReducer, { hydratePrayerState } from './slices/prayerSlice';
import tasbihReducer, { hydrateTasbihState, TASBIH_STORAGE_KEY } from './slices/tasbihSlice';
import preferencesReducer, {
  hydratePreferencesState,
  ALERTS_STORAGE_KEY,
  HADITH_MODE_STORAGE_KEY,
  HADITH_BOOKMARKS_STORAGE_KEY,
  HadithTranslationMode,
} from './slices/preferencesSlice';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import {
  CalculationMethodName,
  JuristicMethod,
  FiqhName,
  PrayerCompletionEvent,
  PrayerCycle,
  UserLocation,
  PrayerAlertConfig,
  TimeFormat,
  PrayerMinuteAdjustments,
} from '@/types';
import { migrateLegacyHistoryToLedger } from '@/utils/prayerLedgerManager';

export const store = configureStore({
  reducer: {
    prayer: prayerReducer,
    tasbih: tasbihReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * One-time fast hydration on application startup.
 * Restores all state synchronously into Redux memory so screens render without zero-data flicker.
 */
export const hydrateAllStore = async (dispatch: AppDispatch) => {
  try {
    const [
      storedMethod,
      storedJuristic,
      storedFiqh,
      storedFiqhProfiles,
      storedHistory,
      storedTasbih,
      storedLedger,
      storedCycle,
      storedLocation,
      storedAlerts,
      storedTimeFormat,
      storedHijri,
      storedHadithMode,
      storedHadithBookmarks,
      storedPrayerAdjustments,
      storedHapticFeedback,
    ] = await Promise.all([
      storage.get<CalculationMethodName | null>(APP_CONFIG.storageKeys.calculationMethod, null),
      storage.get<JuristicMethod | null>(APP_CONFIG.storageKeys.juristicMethod, null),
      storage.get<FiqhName | null>(APP_CONFIG.storageKeys.fiqh, null),
      storage.get<Record<FiqhName, { calcMethod: CalculationMethodName }> | null>(APP_CONFIG.storageKeys.fiqhProfiles, null),
      storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.prayerTracker, {}),
      storage.get<{ count: number; phaseIndex: number; totalCycles: number } | null>(TASBIH_STORAGE_KEY, null),
      storage.get<PrayerCompletionEvent[]>(APP_CONFIG.storageKeys.prayerLedger, []),
      storage.get<PrayerCycle | null>(APP_CONFIG.storageKeys.prayerCycle, null),
      storage.get<UserLocation | null>(APP_CONFIG.storageKeys.userLocation, null),
      storage.get<Partial<PrayerAlertConfig> | null>(ALERTS_STORAGE_KEY, null),
      storage.get<TimeFormat | null>(APP_CONFIG.storageKeys.timeFormat, null),
      storage.get<number | null>(APP_CONFIG.storageKeys.hijriAdjustment, null),
      storage.get<HadithTranslationMode | null>(HADITH_MODE_STORAGE_KEY, null),
      storage.get<string[] | null>(HADITH_BOOKMARKS_STORAGE_KEY, null),
      storage.get<Partial<PrayerMinuteAdjustments> | null>(APP_CONFIG.storageKeys.prayerAdjustments, null),
      storage.get<boolean | null>(APP_CONFIG.storageKeys.hapticFeedback, null),
    ]);

    let finalLedger = storedLedger;
    if (finalLedger.length === 0 && storedHistory && Object.keys(storedHistory).length > 0) {
      finalLedger = await migrateLegacyHistoryToLedger(storedHistory);
    }

    dispatch(
      hydratePrayerState({
        calcMethod: storedMethod || undefined,
        juristic: storedJuristic || undefined,
        fiqh: storedFiqh || undefined,
        fiqhProfiles: storedFiqhProfiles || undefined,
        prayerAdjustments: storedPrayerAdjustments,
        historyMap: storedHistory || undefined,
        ledgerEvents: finalLedger,
        activeCycle: storedCycle,
      })
    );

    dispatch(
      hydratePreferencesState({
        userLocation: storedLocation,
        alerts: storedAlerts,
        timeFormat: storedTimeFormat,
        hijriAdjustment: storedHijri,
        hadithTranslationMode: storedHadithMode,
        hadithBookmarks: storedHadithBookmarks,
        hapticFeedback: storedHapticFeedback,
      })
    );

    if (storedTasbih) {
      dispatch(
        hydrateTasbihState({
          count: storedTasbih.count,
          phaseIndex: storedTasbih.phaseIndex,
          totalCycles: storedTasbih.totalCycles,
        })
      );
    }
  } catch {
    // Non-blocking fallback
  }
};
