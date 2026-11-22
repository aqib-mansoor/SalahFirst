import { storage } from './storage';
import { FocusDuration, FiqhName } from '@/types';
import { getDefaultDelaysForFiqh } from '@/constants/fiqh';
import {
  FocusSession,
  createFocusSession,
  saveActiveFocusSession,
  isFocusCompletedToday,
} from './focusSession';

export interface PrayerFocusOffsets {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerFocusDurations {
  fajr: FocusDuration;
  dhuhr: FocusDuration;
  asr: FocusDuration;
  maghrib: FocusDuration;
  isha: FocusDuration;
}

export interface AutoSilenceConfig {
  enabled: boolean;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface FocusPreferences {
  autoStartOnAzan: boolean;
  defaultDuration: FocusDuration;
  playAzanBefore: boolean;
  blockSocial: boolean;
  blockShortVideos: boolean;
  blockGames: boolean;
  blockNews: boolean;
  blockedAppPackages?: string[];
}

export const DEFAULT_FOCUS_OFFSETS: PrayerFocusOffsets = {
  fajr: 35,
  dhuhr: 20,
  asr: 20,
  maghrib: 7,
  isha: 20,
};

export const DEFAULT_FOCUS_DURATIONS: PrayerFocusDurations = {
  fajr: 20,
  dhuhr: 20,
  asr: 15,
  maghrib: 15,
  isha: 25,
};

export const DEFAULT_AUTO_SILENCE_CONFIG: AutoSilenceConfig = {
  enabled: true,
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
};

export const DEFAULT_FOCUS_PREFERENCES: FocusPreferences = {
  autoStartOnAzan: true,
  defaultDuration: 20,
  playAzanBefore: false,
  blockSocial: false,
  blockShortVideos: false,
  blockGames: false,
  blockNews: false,
};

const STORAGE_KEY = '@salahfirst_focus_offsets';
const DURATIONS_STORAGE_KEY = '@salahfirst_focus_durations';
const PREFS_STORAGE_KEY = '@salahfirst_focus_preferences';
const AUTO_SILENCE_KEY = '@salahfirst_auto_silence_config';

export const loadAutoSilenceConfig = async (): Promise<AutoSilenceConfig> => {
  try {
    const saved = await storage.get<AutoSilenceConfig | null>(AUTO_SILENCE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_AUTO_SILENCE_CONFIG, ...saved };
    }
  } catch {}
  return DEFAULT_AUTO_SILENCE_CONFIG;
};

export const saveAutoSilenceConfig = async (cfg: AutoSilenceConfig): Promise<void> => {
  await storage.set(AUTO_SILENCE_KEY, cfg);
};

export const loadFocusOffsets = async (fiqh?: FiqhName): Promise<PrayerFocusOffsets> => {
  const defaults = fiqh ? getDefaultDelaysForFiqh(fiqh) : DEFAULT_FOCUS_OFFSETS;
  try {
    const saved = await storage.get<PrayerFocusOffsets | null>(STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...defaults, ...saved };
    }
  } catch {}
  return defaults;
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
