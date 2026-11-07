import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerAlertConfig, ReminderOffset, CalculationMethodName, JuristicMethod } from '@/types';
import { getRawPrayerTimes } from './prayerTimes';
import i18n from '@/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const PRAYER_CHANNEL_ID = 'salahfirst-prayer-alerts';
export const REMINDER_CHANNEL_ID = 'salahfirst-pre-reminders';

export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS === 'android') {
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
  }
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

const PRAYERS_LIST: { key: keyof PrayerAlertConfig; name: string }[] = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
];

/**
 * Schedules 3 days of upcoming prayer alarms and pre-reminders within OS limits.
 */
export const scheduleAllPrayerAlerts = async (
  params: SchedulePrayerParams
): Promise<number> => {
  try {
    const { latitude, longitude, alerts, calculationMethod = 'Karachi', juristicMethod = 'Hanafi' } = params;
    if (latitude === undefined || longitude === undefined) return 0;

    // Check permissions without showing prompt if user previously denied
    const { granted } = await checkNotificationPermissions();
    if (!granted) return 0;

    if (alerts && alerts.exactAlarmsEnabled === false) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return 0;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    let scheduledCount = 0;
    const offsetMins = alerts ? getOffsetMinutes(alerts.reminderOffset) : 0;

    // Schedule for today, tomorrow, and day-after-tomorrow (3 days)
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + dayOffset);

      const raw = getRawPrayerTimes(latitude, longitude, targetDate, calculationMethod, juristicMethod);

      for (const prayer of PRAYERS_LIST) {
        const mode = alerts ? alerts[prayer.key] : 'AZAN';
        if (mode === 'SILENT') continue;

        const prayerDate = raw[prayer.name.toLowerCase() as keyof typeof raw] as Date;
        if (!prayerDate) continue;

        const localizedPrayerName =
          (i18n.t(prayer.name.toLowerCase() as any) as string) || prayer.name;

        // 1. Pre-Prayer Reminder (e.g. 15 minutes before)
        if (offsetMins > 0) {
          const reminderDate = new Date(prayerDate.getTime() - offsetMins * 60000);
          if (reminderDate > now) {
            const preTitle = i18n.t('notifPreTitle', {
              minutes: offsetMins,
              prayer: localizedPrayerName,
            });
            const preBody = i18n.t('notifPreBody', {
              prayer: localizedPrayerName,
            });

            await Notifications.scheduleNotificationAsync({
              content: {
                title: preTitle,
                body: preBody,
                sound: mode === 'VIBRATE' ? undefined : 'default',
                data: { prayerName: prayer.name, type: 'pre-reminder' },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
                channelId: REMINDER_CHANNEL_ID,
              },
            });
            scheduledCount++;
          }
        }

        // 2. Exact Prayer Azan Alarm
        if (prayerDate > now) {
          const alarmTitle = i18n.t('notifAlarmTitle', {
            prayer: localizedPrayerName,
          });
          const alarmBody = i18n.t('notifAlarmBody');

          await Notifications.scheduleNotificationAsync({
            content: {
              title: alarmTitle,
              body: alarmBody,
              sound: mode === 'VIBRATE' ? undefined : 'default',
              data: { prayerName: prayer.name, type: 'prayer-alarm' },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayerDate,
              channelId: PRAYER_CHANNEL_ID,
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
