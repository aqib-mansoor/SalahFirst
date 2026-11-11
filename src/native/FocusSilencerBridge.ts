import { NativeModules, Platform } from 'react-native';

const { FocusSilencerModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

export interface RingerModeStatus {
  mode: number;
  isVibrate: boolean;
  isSilent: boolean;
  isNormal: boolean;
}

/**
 * Silences phone into Vibrate Mode during focus prayer session
 */
export const silenceDeviceForFocus = async (): Promise<boolean> => {
  if (!isAndroid || !FocusSilencerModule) return true;
  try {
    return await FocusSilencerModule.enableFocusSilence();
  } catch {
    return false;
  }
};

/**
 * Restores the previous ringer mode and cancels live focus notification
 */
export const restoreDeviceSoundAfterFocus = async (): Promise<boolean> => {
  if (!isAndroid || !FocusSilencerModule) return true;
  try {
    return await FocusSilencerModule.restoreFocusSilence();
  } catch {
    return false;
  }
};

/**
 * Updates or displays the live native notification with chronometer countdown,
 * progress bar, and formatted Quran / Hadith text.
 */
export const showLiveFocusNotification = async (
  prayerName: string,
  targetEndEpochMs: number,
  totalDurationMinutes: number,
  remainingMinutes: number,
  titleBadge: string,
  bodyText: string
): Promise<boolean> => {
  if (!isAndroid || !FocusSilencerModule) return false;
  try {
    return await FocusSilencerModule.showLiveFocusNotification(
      prayerName,
      targetEndEpochMs,
      totalDurationMinutes,
      remainingMinutes,
      titleBadge,
      bodyText
    );
  } catch {
    return false;
  }
};

/**
 * Dismisses the live focus notification explicitly
 */
export const dismissLiveFocusNotification = async (): Promise<boolean> => {
  if (!isAndroid || !FocusSilencerModule) return false;
  try {
    return await FocusSilencerModule.dismissLiveFocusNotification();
  } catch {
    return false;
  }
};

/**
 * Reads current device ringer mode
 */
export const getDeviceRingerMode = async (): Promise<RingerModeStatus> => {
  if (!isAndroid || !FocusSilencerModule) {
    return { mode: 2, isVibrate: false, isSilent: false, isNormal: true };
  }
  try {
    return await FocusSilencerModule.getCurrentRingerMode();
  } catch {
    return { mode: 2, isVibrate: false, isSilent: false, isNormal: true };
  }
};
