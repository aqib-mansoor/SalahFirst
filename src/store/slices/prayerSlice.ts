import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculationMethodName, JuristicMethod } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { calculateCurrentStreak } from '@/utils/trackerStatistics';

export interface PrayerState {
  calcMethod: CalculationMethodName;
  juristic: JuristicMethod;
  historyMap: Record<string, Record<string, boolean>>;
  streakCount: number;
  isHydrated: boolean;
}

const initialState: PrayerState = {
  calcMethod: 'Karachi',
  juristic: 'Hanafi',
  historyMap: {},
  streakCount: 0,
  isHydrated: false,
};

export const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    hydratePrayerState: (
      state,
      action: PayloadAction<{
        calcMethod?: CalculationMethodName;
        juristic?: JuristicMethod;
        historyMap?: Record<string, Record<string, boolean>>;
      }>
    ) => {
      if (action.payload.calcMethod) {
        state.calcMethod = action.payload.calcMethod;
      }
      if (action.payload.juristic) {
        state.juristic = action.payload.juristic;
      }
      if (action.payload.historyMap) {
        state.historyMap = action.payload.historyMap;
        state.streakCount = calculateCurrentStreak(action.payload.historyMap);
      }
      state.isHydrated = true;
    },

    setPrayerCompleted: (
      state,
      action: PayloadAction<{
        dateKey: string;
        prayerName: string;
        completed: boolean;
      }>
    ) => {
      const { dateKey, prayerName, completed } = action.payload;
      if (!state.historyMap[dateKey]) {
        state.historyMap[dateKey] = {
          Fajr: false,
          Dhuhr: false,
          Asr: false,
          Maghrib: false,
          Isha: false,
        };
      }
      state.historyMap[dateKey][prayerName] = completed;
      state.streakCount = calculateCurrentStreak(state.historyMap);

      // Async background persistence
      storage.set(APP_CONFIG.storageKeys.prayerTracker, state.historyMap).catch(() => {});
    },

    setCalculationMethod: (state, action: PayloadAction<CalculationMethodName>) => {
      state.calcMethod = action.payload;
      storage.set(APP_CONFIG.storageKeys.calculationMethod, action.payload).catch(() => {});
    },

    setJuristicMethod: (state, action: PayloadAction<JuristicMethod>) => {
      state.juristic = action.payload;
      storage.set(APP_CONFIG.storageKeys.juristicMethod, action.payload).catch(() => {});
    },
  },
});

export const {
  hydratePrayerState,
  setPrayerCompleted,
  setCalculationMethod,
  setJuristicMethod,
} = prayerSlice.actions;

export default prayerSlice.reducer;
