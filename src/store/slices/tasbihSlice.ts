import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '@/utils/storage';
import { DHIKR_PHASES } from '@/data/tasbihData';

export const TASBIH_STORAGE_KEY = '@salahfirst_tasbih_state';

export interface TasbihState {
  count: number;
  phaseIndex: number;
  totalCycles: number;
  isHydrated: boolean;
}

const initialState: TasbihState = {
  count: 0,
  phaseIndex: 0,
  totalCycles: 0,
  isHydrated: false,
};

const persistTasbih = (state: TasbihState) => {
  storage
    .set(TASBIH_STORAGE_KEY, {
      count: state.count,
      phaseIndex: state.phaseIndex,
      totalCycles: state.totalCycles,
    })
    .catch(() => {});
};

export const tasbihSlice = createSlice({
  name: 'tasbih',
  initialState,
  reducers: {
    hydrateTasbihState: (
      state,
      action: PayloadAction<{
        count?: number;
        phaseIndex?: number;
        totalCycles?: number;
      }>
    ) => {
      if (action.payload.count !== undefined) state.count = action.payload.count;
      if (action.payload.phaseIndex !== undefined) state.phaseIndex = action.payload.phaseIndex;
      if (action.payload.totalCycles !== undefined) state.totalCycles = action.payload.totalCycles;
      state.isHydrated = true;
    },

    incrementTasbih: (state) => {
      const currentPhase = DHIKR_PHASES[state.phaseIndex] || DHIKR_PHASES[0];
      if (state.count + 1 >= currentPhase.target) {
        if (state.phaseIndex + 1 < DHIKR_PHASES.length) {
          state.phaseIndex += 1;
          state.count = 0;
        } else {
          state.phaseIndex = 0;
          state.count = 0;
          state.totalCycles += 1;
        }
      } else {
        state.count += 1;
      }
      persistTasbih(state);
    },

    resetTasbihPhase: (state) => {
      state.count = 0;
      persistTasbih(state);
    },

    resetAllTasbih: (state) => {
      state.count = 0;
      state.phaseIndex = 0;
      persistTasbih(state);
    },
  },
});

export const {
  hydrateTasbihState,
  incrementTasbih,
  resetTasbihPhase,
  resetAllTasbih,
} = tasbihSlice.actions;

export default tasbihSlice.reducer;

