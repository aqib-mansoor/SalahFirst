import { NativeModules, Platform } from 'react-native';

const { FocusBlockerModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

export interface SystemPermissionsStatus {
  accessibility: boolean;
  overlay: boolean;
  exactAlarm: boolean;
  batteryOptimization: boolean;
  notifications: boolean;
}

export type PermissionKey = keyof SystemPermissionsStatus;

export const DISTRACTING_APPS_CATALOG = [
  { id: 'instagram', name: 'Instagram', package: 'com.instagram.android', defaultSelected: true },
  { id: 'tiktok', name: 'TikTok', package: 'com.zhiliaoapp.musically', defaultSelected: true },
  { id: 'facebook', name: 'Facebook', package: 'com.facebook.katana', defaultSelected: true },
  { id: 'youtube', name: 'YouTube', package: 'com.google.android.youtube', defaultSelected: true },
  { id: 'x', name: 'X / Twitter', package: 'com.twitter.android', defaultSelected: true },
  { id: 'reddit', name: 'Reddit', package: 'com.reddit.frontpage', defaultSelected: true },
  { id: 'snapchat', name: 'Snapchat', package: 'com.snapchat.android', defaultSelected: true },
  { id: 'whatsapp', name: 'WhatsApp', package: 'com.whatsapp', defaultSelected: false },
] as const;

export const startFocusBlocker = async (packageNames: string[]): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.startFocusBlocker(packageNames);
  } catch {
    return false;
  }
};

export const stopFocusBlocker = async (): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.stopFocusBlocker();
  } catch {
    return false;
  }
};

export const fetchPermissionsStatus = async (): Promise<SystemPermissionsStatus> => {
  if (!isAndroid || !FocusBlockerModule) {
    return {
      accessibility: true,
      overlay: true,
      exactAlarm: true,
      batteryOptimization: true,
      notifications: true,
    };
  }
  try {
    return await FocusBlockerModule.checkPermissionsStatus();
  } catch {
    return {
      accessibility: false,
      overlay: false,
      exactAlarm: true,
      batteryOptimization: false,
      notifications: true,
    };
  }
};

export const openPermissionSettingsByKey = async (key: PermissionKey): Promise<void> => {
  if (!isAndroid || !FocusBlockerModule) return;
  try {
    switch (key) {
      case 'accessibility':
        await FocusBlockerModule.openAccessibilitySettings();
        break;
      case 'overlay':
        await FocusBlockerModule.openOverlaySettings();
        break;
      case 'exactAlarm':
        await FocusBlockerModule.openExactAlarmSettings();
        break;
      case 'batteryOptimization':
        await FocusBlockerModule.openBatteryOptimizationSettings();
        break;
      case 'notifications':
        await FocusBlockerModule.openNotificationSettings();
        break;
    }
  } catch {}
};
