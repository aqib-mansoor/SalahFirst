import { NativeModules, Platform } from 'react-native';

const { AzanModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export interface DeviceSoundModeState {
  ringerMode: number;
  isDndActive: boolean;
  canPlayAudibleSound: boolean;
  suppressionReason?: string | null;
}

/**
 * Stable alarm ID: dayOffset(0-6) * 10 + prayerIndex(0-4) → 0–64
 */
export const getAlarmId = (prayerKey: string, dayOffset: number): number => {
  const idx = PRAYER_KEYS.indexOf(prayerKey as typeof PRAYER_KEYS[number]);
  return dayOffset * 10 + (idx >= 0 ? idx : 0);
};

/**
 * Schedule a native AlarmManager exact alarm to play full Azan via AzanService.
 * Works even when the app is killed, screen is off, or user is in another app.
 */
export const scheduleNativeAzan = async (
  prayerName: string,
  prayerKey: string,
  reciterKey: string,
  triggerDate: Date,
  dayOffset: number
): Promise<boolean> => {
  if (!isAndroid || !AzanModule) return false;
  try {
    const alarmId = getAlarmId(prayerKey, dayOffset);
    await AzanModule.scheduleAzan(prayerName, reciterKey, triggerDate.getTime(), alarmId);
    return true;
  } catch {
    return false;
  }
};

/**
 * Cancel a single native Azan alarm by prayer + day.
 */
export const cancelNativeAzan = async (
  prayerKey: string,
  dayOffset: number
): Promise<boolean> => {
  if (!isAndroid || !AzanModule) return false;
  try {
    await AzanModule.cancelAzan(getAlarmId(prayerKey, dayOffset));
    return true;
  } catch {
    return false;
  }
};

/**
 * Cancel all 70 possible native Azan alarms (7 days × 10 IDs).
 */
export const cancelAllNativeAzans = async (): Promise<boolean> => {
  if (!isAndroid || !AzanModule) return false;
  try {
    await AzanModule.cancelAllAzans();
    return true;
  } catch {
    return false;
  }
};

/**
 * Stop an actively playing Azan foreground service immediately.
 */
export const stopNativeAzan = async (): Promise<boolean> => {
  if (!isAndroid || !AzanModule) return false;
  try {
    await AzanModule.stopAzan();
    return true;
  } catch {
    return false;
  }
};

/**
 * Inspect live device sound mode (Ringer mode & DND interruption filter).
 */
export const getDeviceSoundMode = async (): Promise<DeviceSoundModeState> => {
  if (!isAndroid || !AzanModule?.getDeviceSoundMode) {
    return {
      ringerMode: 2, // Normal
      isDndActive: false,
      canPlayAudibleSound: true,
      suppressionReason: null,
    };
  }
  try {
    return await AzanModule.getDeviceSoundMode();
  } catch {
    return {
      ringerMode: 2,
      isDndActive: false,
      canPlayAudibleSound: true,
      suppressionReason: null,
    };
  }
};

/**
 * DEVELOPER TESTING: Trigger immediate native playback via AzanService.
 */
export const playNativeAzanImmediate = async (
  reciterKey: string = 'makkah',
  testLabel: string = '[TEST] Immediate Azan'
): Promise<boolean> => {
  if (!isAndroid || !AzanModule?.playNativeAzanImmediate) return false;
  try {
    await AzanModule.playNativeAzanImmediate(reciterKey, testLabel);
    return true;
  } catch {
    return false;
  }
};

/**
 * DEVELOPER TESTING: Schedule a native test alarm (default 30s) using the production AlarmManager path.
 * Uses isolated test alarm ID 9999 so it never interferes with real prayer times.
 */
export const scheduleTestAzan = async (
  reciterKey: string = 'makkah',
  delaySeconds: number = 30
): Promise<number | null> => {
  if (!isAndroid || !AzanModule?.scheduleTestAzan) return null;
  try {
    const triggerMs = await AzanModule.scheduleTestAzan(reciterKey, delaySeconds);
    return triggerMs;
  } catch {
    return null;
  }
};

/**
 * DEVELOPER TESTING: Cancel only the scheduled test alarm (ID 9999).
 */
export const cancelTestAzan = async (): Promise<boolean> => {
  if (!isAndroid || !AzanModule?.cancelTestAzan) return false;
  try {
    await AzanModule.cancelTestAzan();
    return true;
  } catch {
    return false;
  }
};
