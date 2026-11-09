import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculationMethodName, JuristicMethod, PrayerCompletionEvent, PrayerCycle, ObligatorySalah } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { calculateCurrentStreak } from '@/utils/trackerStatistics';
import { deriveHistoryMapFromLedger } from '@/utils/prayerLedgerManager';

export interface PrayerState {
  calcMethod: CalculationMethodName;
  juristic: JuristicMethod;
  historyMap: Record<string, Record<string, boolean>>;
  ledgerEvents: PrayerCompletionEvent[];
  activeCycle: PrayerCycle | null;
  streakCount: number;
  isHydrated: boolean;
}

const initialState: PrayerState = {
  calcMethod: 'Karachi',
  juristic: 'Hanafi',
  historyMap: {},
  ledgerEvents: [],
  activeCycle: null,
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
        ledgerEvents?: PrayerCompletionEvent[];
        activeCycle?: PrayerCycle | null;
      }>
    ) => {
      if (action.payload.calcMethod) {
        state.calcMethod = action.payload.calcMethod;
      }
      if (action.payload.juristic) {
        state.juristic = action.payload.juristic;
      }
      if (action.payload.activeCycle) {
        state.activeCycle = action.payload.activeCycle;
      }
      if (action.payload.ledgerEvents && action.payload.ledgerEvents.length > 0) {
        state.ledgerEvents = action.payload.ledgerEvents;
        const derived = deriveHistoryMapFromLedger(action.payload.ledgerEvents);
        state.historyMap = { ...action.payload.historyMap, ...derived };
      } else if (action.payload.historyMap) {
        state.historyMap = action.payload.historyMap;
      }
      state.streakCount = calculateCurrentStreak(state.historyMap);
      state.isHydrated = true;
    },

    setActiveCycle: (state, action: PayloadAction<PrayerCycle>) => {
      state.activeCycle = action.payload;
    },

    recordLedgerEvent: (state, action: PayloadAction<PrayerCompletionEvent>) => {
      const event = action.payload;
      const exists = state.ledgerEvents.some((e) => e.occurrenceRef === event.occurrenceRef);
      if (!exists) {
        state.ledgerEvents.push(event);
      }
      if (!state.historyMap[event.localDate]) {
        state.historyMap[event.localDate] = {
          Fajr: false,
          Dhuhr: false,
          Asr: false,
          Maghrib: false,
          Isha: false,
        };
      }
      state.historyMap[event.localDate][event.prayerKey] = true;
      state.streakCount = calculateCurrentStreak(state.historyMap);
    },

    removeLedgerEvent: (
      state,
      action: PayloadAction<{ cycleId: string; prayerKey: ObligatorySalah; localDate?: string }>
    ) => {
      const { cycleId, prayerKey, localDate } = action.payload;
      state.ledgerEvents = state.ledgerEvents.filter(
        (e) => !(e.cycleId === cycleId && e.prayerKey === prayerKey)
      );
      if (localDate && state.historyMap[localDate]) {
        state.historyMap[localDate][prayerKey] = false;
        state.streakCount = calculateCurrentStreak(state.historyMap);
      }
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
      storage.set(APP_CONFIG.storageKeys.prayerTracker, state.historyMap).catch(() => {});
    },

    carryOverPrayers: (
      state,
      action: PayloadAction<{ fromDateKey: string; toDateKey: string }>
    ) => {
      const { fromDateKey, toDateKey } = action.payload;
      if (!fromDateKey || !toDateKey || fromDateKey === toDateKey) return;
      const source = state.historyMap[fromDateKey];
      if (!source) return;
      if (!state.historyMap[toDateKey]) {
        state.historyMap[toDateKey] = {
          Fajr: false,
          Dhuhr: false,
          Asr: false,
          Maghrib: false,
          Isha: false,
        };
      }
      Object.entries(source).forEach(([prayer, completed]) => {
        if (completed) {
          state.historyMap[toDateKey][prayer] = true;
        }
      });
      state.streakCount = calculateCurrentStreak(state.historyMap);
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
  setActiveCycle,
  recordLedgerEvent,
  removeLedgerEvent,
  setPrayerCompleted,
  carryOverPrayers,
  setCalculationMethod,
  setJuristicMethod,
} = prayerSlice.actions;

export default prayerSlice.reducer;

