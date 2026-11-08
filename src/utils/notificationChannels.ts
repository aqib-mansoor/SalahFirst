import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const PRAYER_CHANNEL_ID = 'salahfirst-prayer-alerts';
export const REMINDER_CHANNEL_ID = 'salahfirst-pre-reminders';
export const MISSED_CHANNEL_ID = 'salahfirst-missed-reminders';
export const REFLECTION_CHANNEL_ID = 'salahfirst-reflection';
export const INSPIRATION_CHANNEL_ID = 'salahfirst-daily-inspiration';

export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_ID, {
    name: 'Prayer Time & Azan Alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 300, 200, 300],
    lightColor: '#114B36',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: 'Pre-Prayer Gentle Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(MISSED_CHANNEL_ID, {
    name: 'Missed Prayer Follow-ups',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(REFLECTION_CHANNEL_ID, {
    name: 'Daily Reflection & Streaks',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 100, 100, 100],
    lightColor: '#114B36',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(INSPIRATION_CHANNEL_ID, {
    name: 'Daily Islamic Inspiration',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });
};

export const checkNotificationPermissions = async (): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> => {
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return {
      granted: status === 'granted',
      canAskAgain,
    };
  } catch {
    return { granted: false, canAskAgain: true };
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      await setupNotificationChannels();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

