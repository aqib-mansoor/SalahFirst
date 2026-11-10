import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const PRAYER_CHANNEL_MAKKAH = 'salahfirst-prayer-makkah-v2';
export const PRAYER_CHANNEL_MADINAH = 'salahfirst-prayer-madinah-v2';
export const PRAYER_CHANNEL_ALAQSA = 'salahfirst-prayer-alaqsa-v2';
export const PRAYER_CHANNEL_VIBRATE = 'salahfirst-prayer-vibrate-v2';
export const PRAYER_CHANNEL_ID = PRAYER_CHANNEL_MAKKAH;
export const PRAYER_CATEGORY_ID = 'salahfirst-prayer-actions';

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
  await Notifications.setNotificationCategoryAsync(PRAYER_CATEGORY_ID, [
    {
      identifier: 'START_FOCUS',
      buttonTitle: 'Start Salah Focus',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'DISMISS_AZAN',
      buttonTitle: 'Dismiss',
      options: { isDestructive: false, opensAppToForeground: false },
    },
  ]).catch(() => {});

  if (Platform.OS !== 'android') return;

  const legacyIds = [
    'salahfirst-prayer-alerts',
    'salahfirst-prayer-alerts-v2',
    'salahfirst-prayer-makkah-v1',
    'salahfirst-prayer-madinah-v1',
    'salahfirst-prayer-alaqsa-v1',
    'salahfirst-prayer-vibrate-v1',
  ];
  for (const id of legacyIds) {
    await Notifications.deleteNotificationChannelAsync(id).catch(() => {});
  }

  const reciterChannels = [
    { id: PRAYER_CHANNEL_MAKKAH, name: 'Prayer Azan (Makkah)', sound: 'azan_makkah.mp3' },
    { id: PRAYER_CHANNEL_MADINAH, name: 'Prayer Azan (Madinah)', sound: 'azan_madinah.mp3' },
    { id: PRAYER_CHANNEL_ALAQSA, name: 'Prayer Azan (Al-Aqsa)', sound: 'azan_alaqsa.mp3' },
  ];

  for (const ch of reciterChannels) {
    await Notifications.setNotificationChannelAsync(ch.id, {
      name: ch.name,
      importance: Notifications.AndroidImportance.MAX,
      bypassDnd: false,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#0E7449',
      enableLights: true,
      enableVibrate: true,
      sound: ch.sound,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.NOTIFICATION_RINGTONE,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });
  }

  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_VIBRATE, {
    name: 'Prayer Alert (Vibrate Only)',
    importance: Notifications.AndroidImportance.HIGH,
    bypassDnd: false,
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
