import { storage } from './storage';
import { FocusDuration } from '@/types';
import {
  FocusSession,
  createFocusSession,
  saveActiveFocusSession,
  isFocusCompletedToday,
} from './focusSession';

export interface PrayerFocusOffsets {
  fajr: number; // default +30 mins after Azan
  dhuhr: number; // default +60 mins after Azan (~1:00 PM)
  asr: number; // default +20 mins after Azan
  maghrib: number; // default 0 mins (immediate with sunset)
  isha: number; // default +20 mins after Azan
}

export interface PrayerFocusDurations {
  fajr: FocusDuration;
  dhuhr: FocusDuration;
  asr: FocusDuration;
  maghrib: FocusDuration;
  isha: FocusDuration;
}

export interface FocusPreferences {
  autoStartOnAzan: boolean;
  defaultDuration: FocusDuration;
  playAzanBefore: boolean;
  blockSocial: boolean;
  blockShortVideos: boolean;
  blockGames: boolean;
  blockNews: boolean;
}

export const DEFAULT_FOCUS_OFFSETS: PrayerFocusOffsets = {
  fajr: 30,
  dhuhr: 60,
  asr: 20,
  maghrib: 0,
  isha: 20,
};

export const DEFAULT_FOCUS_DURATIONS: PrayerFocusDurations = {
  fajr: 15,
  dhuhr: 15,
  asr: 15,
  maghrib: 15,
  isha: 20,
};

export const DEFAULT_FOCUS_PREFERENCES: FocusPreferences = {
  autoStartOnAzan: true,
  defaultDuration: 15,
  playAzanBefore: true,
  blockSocial: true,
  blockShortVideos: true,
  blockGames: false,
  blockNews: false,
};

const STORAGE_KEY = '@salahfirst_focus_offsets';
const DURATIONS_STORAGE_KEY = '@salahfirst_focus_durations';
const PREFS_STORAGE_KEY = '@salahfirst_focus_preferences';

export const loadFocusOffsets = async (): Promise<PrayerFocusOffsets> => {
  try {
    const saved = await storage.get<PrayerFocusOffsets | null>(STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_FOCUS_OFFSETS, ...saved };
    }
  } catch {}
  return DEFAULT_FOCUS_OFFSETS;
};

export const saveFocusOffsets = async (offsets: PrayerFocusOffsets): Promise<void> => {
  await storage.set(STORAGE_KEY, offsets);
};

export const loadFocusDurations = async (): Promise<PrayerFocusDurations> => {
  try {
    const saved = await storage.get<PrayerFocusDurations | null>(DURATIONS_STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_FOCUS_DURATIONS, ...saved };
    }
  } catch {}
  return DEFAULT_FOCUS_DURATIONS;
};

export const saveFocusDurations = async (durations: PrayerFocusDurations): Promise<void> => {
  await storage.set(DURATIONS_STORAGE_KEY, durations);
};

export const loadFocusPreferences = async (): Promise<FocusPreferences> => {
  try {
    const saved = await storage.get<FocusPreferences | null>(PREFS_STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_FOCUS_PREFERENCES, ...saved };
    }
  } catch {}
  return DEFAULT_FOCUS_PREFERENCES;
};

export const saveFocusPreferences = async (prefs: FocusPreferences): Promise<void> => {
  await storage.set(PREFS_STORAGE_KEY, prefs);
};

export const checkAndActivateCurrentAutoFocus = async (
  rawPrayerDates?: Record<string, Date>
): Promise<FocusSession | null> => {
  if (!rawPrayerDates) return null;

  try {
    const [offsets, durations, prefs] = await Promise.all([
      loadFocusOffsets(),
      loadFocusDurations(),
      loadFocusPreferences(),
    ]);

    if (!prefs.autoStartOnAzan) return null;

    const now = Date.now();
    const prayers: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
      'fajr', 'dhuhr', 'asr', 'maghrib', 'isha',
    ];

    for (const prayer of prayers) {
      const azanDate = rawPrayerDates[prayer];
      if (!azanDate || isNaN(azanDate.getTime())) continue;

      const delayMinutes = offsets[prayer] ?? 20;
      const prayerDuration = durations[prayer] ?? prefs.defaultDuration ?? 15;
      const windowStartMs = azanDate.getTime() + delayMinutes * 60 * 1000;
      const windowEndMs = windowStartMs + prayerDuration * 60 * 1000;

      // Window must still be active and not already completed today
      if (now < windowStartMs || now >= windowEndMs) continue;
      const prayerName = prayer.charAt(0).toUpperCase() + prayer.slice(1);
      if (await isFocusCompletedToday(prayerName)) continue;

      // Restore actual window — do NOT use createFocusSession (which resets start to now)
      const session: FocusSession = {
        prayerName,
        durationMinutes: prayerDuration,
        startTimestamp: windowStartMs,
        targetEndTimestamp: windowEndMs,
        status: 'active',
        breachCount: 0,
      };
      await saveActiveFocusSession(session);
      return session;
    }
  } catch {}

  return null;
};

export interface FocusReadinessResult {
  isFocusReady: boolean;
  focusDate: Date | null;
  formattedFocusTime: string;
  minutesRemaining: number;
}

export const calculateFocusReadiness = (
  prayerName: string,
  rawAzanDate: Date | undefined,
  offsets: PrayerFocusOffsets = DEFAULT_FOCUS_OFFSETS,
  now: Date = new Date()
): FocusReadinessResult => {
  if (!rawAzanDate || isNaN(rawAzanDate.getTime())) {
    return {
      isFocusReady: true,
      focusDate: null,
      formattedFocusTime: '--:--',
      minutesRemaining: 0,
    };
  }

  const key = prayerName.toLowerCase() as keyof PrayerFocusOffsets;
  const offsetMinutes = typeof offsets[key] === 'number' ? offsets[key] : 15;

  const focusDate = new Date(rawAzanDate.getTime() + offsetMinutes * 60 * 1000);
  const nowMs = now.getTime();
  const diffMs = focusDate.getTime() - nowMs;

  const hours = focusDate.getHours();
  const mins = focusDate.getMinutes();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formattedFocusTime = `${pad(hours)}:${pad(mins)}`;

  if (diffMs <= 0) {
    return {
      isFocusReady: true,
      focusDate,
      formattedFocusTime,
      minutesRemaining: 0,
    };
  }

  return {
    isFocusReady: false,
    focusDate,
    formattedFocusTime,
    minutesRemaining: Math.ceil(diffMs / 60000),
  };
};
