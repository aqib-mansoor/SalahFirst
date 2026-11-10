import { NativeModules, Platform } from 'react-native';

const { AzanModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

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
