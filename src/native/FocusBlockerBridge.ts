import { NativeModules, Platform } from 'react-native';

const { FocusBlockerModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

export interface BlockerPermissionsStatus {
  overlay: boolean;
  accessibility: boolean;
  isReady: boolean;
}

export const DISTRACTING_APPS_CATALOG = [
  { id: 'tiktok', name: 'TikTok', package: 'com.zhiliaoapp.musically', defaultSelected: true },
  { id: 'instagram', name: 'Instagram', package: 'com.instagram.android', defaultSelected: true },
  { id: 'facebook', name: 'Facebook', package: 'com.facebook.katana', defaultSelected: true },
  { id: 'youtube', name: 'YouTube', package: 'com.google.android.youtube', defaultSelected: true },
  { id: 'x', name: 'X / Twitter', package: 'com.twitter.android', defaultSelected: true },
  { id: 'snapchat', name: 'Snapchat', package: 'com.snapchat.android', defaultSelected: true },
  { id: 'reddit', name: 'Reddit', package: 'com.reddit.frontpage', defaultSelected: true },
] as const;

export const startFocusBlocker = async (
  prayerName: string,
  targetEndTimestamp: number,
  packageNames?: string[]
): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.startFocusSession(prayerName, targetEndTimestamp, packageNames ?? null);
  } catch {
    return false;
  }
};

export const stopFocusBlocker = async (): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.stopFocusSession();
  } catch {
    return false;
  }
};

export const checkBlockerPermissions = async (): Promise<BlockerPermissionsStatus> => {
  if (!isAndroid || !FocusBlockerModule) {
    return { overlay: true, accessibility: true, isReady: true };
  }
  try {
    return await FocusBlockerModule.checkPermissionsStatus();
  } catch {
    return { overlay: false, accessibility: false, isReady: false };
  }
};

export const openOverlaySettings = async (): Promise<void> => {
  if (!isAndroid || !FocusBlockerModule) return;
  try {
    await FocusBlockerModule.openOverlaySettings();
  } catch {}
};

export const openAccessibilitySettings = async (): Promise<void> => {
  if (!isAndroid || !FocusBlockerModule) return;
  try {
    await FocusBlockerModule.openAccessibilitySettings();
  } catch {}
};

