import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const PRAYER_CHANNEL_ID = 'salahfirst-prayer-alerts-v2';
export const REMINDER_CHANNEL_ID = 'salahfirst-pre-reminders';
export const MISSED_CHANNEL_ID = 'salahfirst-missed-reminders';
export const REFLECTION_CHANNEL_ID = 'salahfirst-reflection';
export const INSPIRATION_CHANNEL_ID = 'salahfirst-daily-inspiration';
export const REENGAGEMENT_CHANNEL_ID = 'salahfirst-reengagement';
export const FOCUS_CHANNEL_ID = 'salahfirst-focus-mode';
export const FOCUS_BREACH_CHANNEL_ID = 'salahfirst-focus-breach';

export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  // Clean up legacy v1 channel to ensure fresh channel creation with custom Azan sound
  await Notifications.deleteNotificationChannelAsync('salahfirst-prayer-alerts').catch(() => {});

  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_ID, {
    name: 'Prayer Call & Azan',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'azan.mp3',
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: 'Pre-Prayer Reminder',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(MISSED_CHANNEL_ID, {
    name: 'Prayer Tracker Reminder',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(REFLECTION_CHANNEL_ID, {
    name: 'Daily Reflection',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 100, 100, 100],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(INSPIRATION_CHANNEL_ID, {
    name: 'Daily Quran & Hadith',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(REENGAGEMENT_CHANNEL_ID, {
    name: 'Gentle Reconnection',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(FOCUS_CHANNEL_ID, {
    name: 'Salah Focus Mode',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync(FOCUS_BREACH_CHANNEL_ID, {
    name: 'Salah Focus Interceptor',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 350, 150, 350],
    lightColor: '#D97706',
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
