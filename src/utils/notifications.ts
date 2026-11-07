import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerAlertConfig, ReminderOffset, CalculationMethodName, JuristicMethod } from '@/types';
import { getRawPrayerTimes } from './prayerTimes';

// Global notification handler for foreground and background display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_CHANNEL_ID = 'salahfirst-prayer-alerts';

/**
 * Configure Android notification channels
 */
export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Prayer Time & Azan Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#114B36',
      enableLights: true,
      enableVibrate: true,
      sound: 'default',
    });
  }
};

/**
 * Request notification permissions from device OS
 */
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

const getOffsetMinutes = (offset: ReminderOffset): number => {
  switch (offset) {
    case '10m': return 10;
    case '15m': return 15;
    case '30m': return 30;
    default: return 0;
  }
};

export interface SchedulePrayerParams {
  latitude?: number;
  longitude?: number;
  alerts?: PrayerAlertConfig;
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
}

/**
 * Schedule 5 local prayer alarms and pre-reminders for today and tomorrow
 */
export const scheduleAllPrayerAlerts = async (
  params: SchedulePrayerParams
): Promise<number> => {
  try {
    const { latitude, longitude, alerts, calculationMethod = 'Karachi', juristicMethod = 'Hanafi' } = params;
    if (latitude === undefined || longitude === undefined) return 0;

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return 0;

    // Cancel existing scheduled prayer notifications to avoid duplicate stacking
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    let scheduledCount = 0;

    const prayerScheduleDates = [
      getRawPrayerTimes(latitude, longitude, new Date(), calculationMethod, juristicMethod), // Today
      getRawPrayerTimes(latitude, longitude, new Date(Date.now() + 86400000), calculationMethod, juristicMethod), // Tomorrow
    ];

    const prayers: { key: keyof PrayerAlertConfig; name: string }[] = [
      { key: 'fajr', name: 'Fajr' },
      { key: 'dhuhr', name: 'Dhuhr' },
      { key: 'asr', name: 'Asr' },
      { key: 'maghrib', name: 'Maghrib' },
      { key: 'isha', name: 'Isha' },
    ];

    for (const prayerObj of prayerScheduleDates) {
      for (const prayer of prayers) {
        const mode = alerts ? alerts[prayer.key] : 'AZAN';
        if (mode === 'SILENT') continue;

        const prayerDate = prayerObj[prayer.name.toLowerCase() as keyof typeof prayerObj] as Date;
        if (!prayerDate) continue;

        // 1. Pre-Prayer Reminder (e.g. 15 minutes before)
        const offsetMins = alerts ? getOffsetMinutes(alerts.reminderOffset) : 0;
        if (offsetMins > 0) {
          const reminderDate = new Date(prayerDate.getTime() - offsetMins * 60000);
          if (reminderDate > now) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `${offsetMins}m until ${prayer.name}`,
                body: `Prepare for ${prayer.name} prayer. Cleanliness and tranquility.`,
                sound: mode === 'VIBRATE' ? undefined : 'default',
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
                channelId: NOTIFICATION_CHANNEL_ID,
              },
            });
            scheduledCount++;
          }
        }

        // 2. Exact Prayer Azan Alarm
        if (prayerDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Time for ${prayer.name} Prayer`,
              body: "Hayya 'alas-Salah — Turn your attention to Salah.",
              sound: mode === 'VIBRATE' ? undefined : 'default',
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayerDate,
              channelId: NOTIFICATION_CHANNEL_ID,
            },
          });
          scheduledCount++;
        }
      }
    }

    return scheduledCount;
  } catch {
    return 0;
  }
};
