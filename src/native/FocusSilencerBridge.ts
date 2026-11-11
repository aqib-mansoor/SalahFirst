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
 * Restores the previous ringer mode when focus session ends
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
