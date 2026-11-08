import { storage } from './storage';

export interface PrayerFocusOffsets {
  fajr: number; // default +30 mins after Azan
  dhuhr: number; // default +60 mins after Azan (~1:00 PM)
  asr: number; // default +20 mins after Azan
  maghrib: number; // default 0 mins (immediate with sunset)
  isha: number; // default +20 mins after Azan
}

export const DEFAULT_FOCUS_OFFSETS: PrayerFocusOffsets = {
  fajr: 30,
  dhuhr: 60,
  asr: 20,
  maghrib: 0,
  isha: 20,
};

const STORAGE_KEY = '@salahfirst_focus_offsets';

export const loadFocusOffsets = async (): Promise<PrayerFocusOffsets> => {
  try {
    const saved = await storage.get<PrayerFocusOffsets | null>(STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_FOCUS_OFFSETS, ...saved };
    }
  } catch {
    // fallback to defaults
  }
  return DEFAULT_FOCUS_OFFSETS;
};

export const saveFocusOffsets = async (offsets: PrayerFocusOffsets): Promise<void> => {
  await storage.set(STORAGE_KEY, offsets);
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

