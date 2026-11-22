import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CalculationMethodName,
  JuristicMethod,
  FiqhName,
  PrayerCompletionEvent,
  PrayerCycle,
  ObligatorySalah,
  PrayerMinuteAdjustments,
} from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { calculateCurrentStreak } from '@/utils/trackerStatistics';
import { deriveHistoryMapFromLedger } from '@/utils/prayerLedgerManager';
import { DEFAULT_PRAYER_ADJUSTMENTS, setCachedPrayerAdjustments } from '@/utils/prayerCalculationBase';
import {
  DEFAULT_FIQH_PROFILES,
  normalizeFiqh,
  getFiqhDetails,
} from '@/constants/fiqh';

export interface PrayerState {
  calcMethod: CalculationMethodName;
  juristic: JuristicMethod;
  fiqh: FiqhName;
  fiqhProfiles: Record<FiqhName, { calcMethod: CalculationMethodName }>;
  prayerAdjustments: PrayerMinuteAdjustments;
  historyMap: Record<string, Record<string, boolean>>;
  ledgerEvents: PrayerCompletionEvent[];
  activeCycle: PrayerCycle | null;
  streakCount: number;
  isHydrated: boolean;
}

const initialState: PrayerState = {
  calcMethod: 'Karachi',
  juristic: 'Hanafi',
  fiqh: 'Hanafi',
  fiqhProfiles: { ...DEFAULT_FIQH_PROFILES },
  prayerAdjustments: { ...DEFAULT_PRAYER_ADJUSTMENTS },
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
        fiqh?: FiqhName;
        fiqhProfiles?: Record<FiqhName, { calcMethod: CalculationMethodName }> | null;
        prayerAdjustments?: Partial<PrayerMinuteAdjustments> | null;
        historyMap?: Record<string, Record<string, boolean>>;
        ledgerEvents?: PrayerCompletionEvent[];
        activeCycle?: PrayerCycle | null;
      }>
    ) => {
      if (action.payload.calcMethod) {
        state.calcMethod = action.payload.calcMethod;
      }
      if (action.payload.fiqh) {
        state.fiqh = normalizeFiqh(action.payload.fiqh);
        state.juristic = state.fiqh;
      } else if (action.payload.juristic) {
        state.fiqh = normalizeFiqh(action.payload.juristic);
        state.juristic = state.fiqh;
      }
      if (action.payload.fiqhProfiles) {
        state.fiqhProfiles = { ...DEFAULT_FIQH_PROFILES, ...action.payload.fiqhProfiles };
      }
      if (action.payload.prayerAdjustments) {
        state.prayerAdjustments = {
          ...DEFAULT_PRAYER_ADJUSTMENTS,
          ...action.payload.prayerAdjustments,
        };
        setCachedPrayerAdjustments(state.prayerAdjustments);
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
      if (state.fiqh) {
        state.fiqhProfiles[state.fiqh] = { calcMethod: action.payload };
        storage.set(APP_CONFIG.storageKeys.fiqhProfiles, state.fiqhProfiles).catch(() => {});
      }
      storage.set(APP_CONFIG.storageKeys.calculationMethod, action.payload).catch(() => {});
    },

    setJuristicMethod: (state, action: PayloadAction<JuristicMethod>) => {
      const normalized = normalizeFiqh(action.payload);
      state.juristic = normalized;
      state.fiqh = normalized;
      storage.set(APP_CONFIG.storageKeys.juristicMethod, normalized).catch(() => {});
      storage.set(APP_CONFIG.storageKeys.fiqh, normalized).catch(() => {});
    },

    setFiqh: (
      state,
      action: PayloadAction<{ fiqh: FiqhName; applyRecommendedCalc?: boolean }>
    ) => {
      const { fiqh, applyRecommendedCalc = true } = action.payload;
      state.fiqh = fiqh;
      state.juristic = fiqh;
      storage.set(APP_CONFIG.storageKeys.fiqh, fiqh).catch(() => {});
      storage.set(APP_CONFIG.storageKeys.juristicMethod, fiqh).catch(() => {});

      if (applyRecommendedCalc) {
        const details = getFiqhDetails(fiqh);
        state.calcMethod = details.recommendedCalcMethod;
        state.fiqhProfiles[fiqh] = { calcMethod: details.recommendedCalcMethod };
        storage.set(APP_CONFIG.storageKeys.calculationMethod, details.recommendedCalcMethod).catch(() => {});
      } else if (state.fiqhProfiles[fiqh]?.calcMethod) {
        state.calcMethod = state.fiqhProfiles[fiqh].calcMethod;
        storage.set(APP_CONFIG.storageKeys.calculationMethod, state.calcMethod).catch(() => {});
      }
      storage.set(APP_CONFIG.storageKeys.fiqhProfiles, state.fiqhProfiles).catch(() => {});
    },

    setPrayerAdjustments: (state, action: PayloadAction<PrayerMinuteAdjustments>) => {
      state.prayerAdjustments = action.payload;
      setCachedPrayerAdjustments(action.payload);
      storage.set(APP_CONFIG.storageKeys.prayerAdjustments, action.payload).catch(() => {});
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
  setFiqh,
  setPrayerAdjustments,
} = prayerSlice.actions;

export default prayerSlice.reducer;

