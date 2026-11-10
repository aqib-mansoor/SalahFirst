import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const PRAYER_CHANNEL_MAKKAH = 'salahfirst-prayer-makkah-v1';
export const PRAYER_CHANNEL_MADINAH = 'salahfirst-prayer-madinah-v1';
export const PRAYER_CHANNEL_ALAQSA = 'salahfirst-prayer-alaqsa-v1';
export const PRAYER_CHANNEL_VIBRATE = 'salahfirst-prayer-vibrate-v1';
export const PRAYER_CHANNEL_ID = PRAYER_CHANNEL_MAKKAH;

export const REMINDER_CHANNEL_ID = 'salahfirst-pre-reminders';
export const MISSED_CHANNEL_ID = 'salahfirst-missed-reminders';
export const REFLECTION_CHANNEL_ID = 'salahfirst-reflection';
export const INSPIRATION_CHANNEL_ID = 'salahfirst-daily-inspiration';
export const REENGAGEMENT_CHANNEL_ID = 'salahfirst-reengagement';
export const FOCUS_CHANNEL_ID = 'salahfirst-focus-mode';
export const FOCUS_BREACH_CHANNEL_ID = 'salahfirst-focus-breach';

export const getPrayerChannelForModeAndReciter = (
  mode: 'AZAN' | 'TONE' | 'VIBRATE' | 'SILENT',
  reciterKey: 'makkah' | 'madinah' | 'alAqsa' = 'makkah'
): { channelId: string; soundName?: string } => {
  if (mode === 'VIBRATE') {
    return { channelId: PRAYER_CHANNEL_VIBRATE, soundName: undefined };
  }
  if (reciterKey === 'madinah') {
    return { channelId: PRAYER_CHANNEL_MADINAH, soundName: 'azan_madinah.mp3' };
  }
  if (reciterKey === 'alAqsa') {
    return { channelId: PRAYER_CHANNEL_ALAQSA, soundName: 'azan_alaqsa.mp3' };
  }
  return { channelId: PRAYER_CHANNEL_MAKKAH, soundName: 'azan_makkah.mp3' };
};

export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  // Clean up legacy channels to prevent stale audio mappings
  await Notifications.deleteNotificationChannelAsync('salahfirst-prayer-alerts').catch(() => {});
  await Notifications.deleteNotificationChannelAsync('salahfirst-prayer-alerts-v2').catch(() => {});

  // 1. Makkah Azan Channel
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_MAKKAH, {
    name: 'Prayer Azan (Makkah)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'azan_makkah.mp3',
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });

  // 2. Madinah Azan Channel
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_MADINAH, {
    name: 'Prayer Azan (Madinah)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'azan_madinah.mp3',
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });

  // 3. Al-Aqsa Azan Channel
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_ALAQSA, {
    name: 'Prayer Azan (Al-Aqsa)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#0E7449',
    enableLights: true,
    enableVibrate: true,
    sound: 'azan_alaqsa.mp3',
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });

  // 4. Vibrate-Only Prayer Channel (Explicitly zero sound)
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_VIBRATE, {
    name: 'Prayer Alert (Vibrate Only)',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 600, 300, 600],
    lightColor: '#CCA15F',
    enableLights: true,
    enableVibrate: true,
    sound: null,
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

    return finalStatus === 'granted';
  } catch {
    return false;
  }
};
