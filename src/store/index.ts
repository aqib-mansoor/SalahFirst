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
  PrayerCompletionEvent,
  PrayerCycle,
  UserLocation,
  PrayerAlertConfig,
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
      storedHistory,
      storedTasbih,
      storedLedger,
      storedCycle,
      storedLocation,
      storedAlerts,
      storedHijri,
      storedHadithMode,
      storedHadithBookmarks,
    ] = await Promise.all([
      storage.get<CalculationMethodName | null>(APP_CONFIG.storageKeys.calculationMethod, null),
      storage.get<JuristicMethod | null>(APP_CONFIG.storageKeys.juristicMethod, null),
      storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.prayerTracker, {}),
      storage.get<{ count: number; phaseIndex: number; totalCycles: number } | null>(TASBIH_STORAGE_KEY, null),
      storage.get<PrayerCompletionEvent[]>(APP_CONFIG.storageKeys.prayerLedger, []),
      storage.get<PrayerCycle | null>(APP_CONFIG.storageKeys.prayerCycle, null),
      storage.get<UserLocation | null>(APP_CONFIG.storageKeys.userLocation, null),
      storage.get<Partial<PrayerAlertConfig> | null>(ALERTS_STORAGE_KEY, null),
      storage.get<number | null>(APP_CONFIG.storageKeys.hijriAdjustment, null),
      storage.get<HadithTranslationMode | null>(HADITH_MODE_STORAGE_KEY, null),
      storage.get<string[] | null>(HADITH_BOOKMARKS_STORAGE_KEY, null),
    ]);

    let finalLedger = storedLedger;
    if (finalLedger.length === 0 && storedHistory && Object.keys(storedHistory).length > 0) {
      finalLedger = await migrateLegacyHistoryToLedger(storedHistory);
    }

    dispatch(
      hydratePrayerState({
        calcMethod: storedMethod || undefined,
        juristic: storedJuristic || undefined,
        historyMap: storedHistory || undefined,
        ledgerEvents: finalLedger,
        activeCycle: storedCycle,
      })
    );

    dispatch(
      hydratePreferencesState({
        userLocation: storedLocation,
        alerts: storedAlerts,
        hijriAdjustment: storedHijri,
        hadithTranslationMode: storedHadithMode,
        hadithBookmarks: storedHadithBookmarks,
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
