import { NativeModules, Platform } from 'react-native';

const { FocusBlockerModule } = NativeModules;
const isAndroid = Platform.OS === 'android';

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

export type DistractingAppId = typeof DISTRACTING_APPS_CATALOG[number]['id'];

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

export const checkAccessibilityPermission = async (): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.hasAccessibilityPermission();
  } catch {
    return false;
  }
};

export const checkOverlayPermission = async (): Promise<boolean> => {
  if (!isAndroid || !FocusBlockerModule) return false;
  try {
    return await FocusBlockerModule.hasOverlayPermission();
  } catch {
    return false;
  }
};

export const openAccessibilitySettings = async (): Promise<void> => {
  if (!isAndroid || !FocusBlockerModule) return;
  try {
    await FocusBlockerModule.openAccessibilitySettings();
  } catch {}
};

export const openOverlaySettings = async (): Promise<void> => {
  if (!isAndroid || !FocusBlockerModule) return;
  try {
    await FocusBlockerModule.openOverlaySettings();
  } catch {}
};
