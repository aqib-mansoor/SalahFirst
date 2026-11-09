import * as Notifications from 'expo-notifications';
import { PrayerAlertConfig, ReminderOffset, CalculationMethodName, JuristicMethod } from '@/types';
import { getRawPrayerTimes } from './prayerTimes';
import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import { formatDateKey } from './trackerStatistics';
import { isWithinQuietHours } from './notificationQuietHours';
import { getLocalDateComponents } from './timezone';
import { loadFocusOffsets, loadFocusPreferences, PrayerFocusOffsets } from './prayerFocusOffsets';
import {
  PRAYER_CHANNEL_ID,
  REMINDER_CHANNEL_ID,
  MISSED_CHANNEL_ID,
  REFLECTION_CHANNEL_ID,
  INSPIRATION_CHANNEL_ID,
  REENGAGEMENT_CHANNEL_ID,
  FOCUS_CHANNEL_ID,
  setupNotificationChannels,
  checkNotificationPermissions,
  requestNotificationPermission,
} from './notificationChannels';
import i18n from '@/i18n';

export {
  PRAYER_CHANNEL_ID,
  REMINDER_CHANNEL_ID,
  MISSED_CHANNEL_ID,
  REFLECTION_CHANNEL_ID,
  INSPIRATION_CHANNEL_ID,
  REENGAGEMENT_CHANNEL_ID,
  setupNotificationChannels,
  checkNotificationPermissions,
  requestNotificationPermission,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  timezone?: string;
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

export const cancelMissedPrayerNotification = async (
  prayerName: string,
  dateKey: string = formatDateKey(new Date())
): Promise<void> => {
  try {
    const identifier = `salahfirst-missed-${prayerName.toLowerCase()}-${dateKey}`;
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch {}
};

export const triggerStreakNotification = async (): Promise<void> => {
  try {
    const { granted } = await checkNotificationPermissions();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: (i18n.t('notifStreakTitle') as string) || 'Alhamdulillah',
        body: (i18n.t('notifStreakBody') as string) || 'You completed all 5 prayers today. May Allah accept your worship.',
        sound: 'default',
        data: { type: 'streak-encouragement' },
      },
      trigger: null,
    });
  } catch {}
};

export const scheduleAllPrayerAlerts = async (
  params: SchedulePrayerParams
): Promise<number> => {
  try {
    const { latitude, longitude, timezone, alerts, calculationMethod = 'Karachi', juristicMethod = 'Hanafi' } = params;
    if (latitude === undefined || longitude === undefined) return 0;

    const { granted } = await checkNotificationPermissions();
    if (!granted) return 0;

    // Safely cancel only prayer, pre-reminder, and auto-focus notifications so inspiration notifications are preserved
    const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
    for (const notif of scheduled) {
      if (
        notif.identifier.startsWith('salahfirst-alarm-') ||
        notif.identifier.startsWith('salahfirst-prayer-') ||
        notif.identifier.startsWith('salahfirst-pre-') ||
        notif.identifier.startsWith('salahfirst-missed-') ||
        notif.identifier.startsWith('salahfirst-autofocus-')
      ) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier).catch(() => {});
      }
    }
    if (alerts && alerts.exactAlarmsEnabled === false) return 0;

    const [history, focusOffsets, focusPrefs] = await Promise.all([
      storage.get<Record<string, Record<string, boolean>>>(
        APP_CONFIG.storageKeys.prayerTracker,
        {}
      ),
      loadFocusOffsets(),
      loadFocusPreferences(),
    ]);

    const now = new Date();
    let scheduledCount = 0;
    const offsetMins = alerts ? getOffsetMinutes(alerts.reminderOffset) : 0;
    const qEnabled = alerts?.quietHoursEnabled ?? true;
    const qStart = alerts?.quietHoursStart ?? '22:00';
    const qEnd = alerts?.quietHoursEnd ?? '05:00';

    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const targetDate = new Date(now.getTime() + dayOffset * 86400000);
      const dateKey = getLocalDateComponents(targetDate, timezone).dateKey;
      const raw = getRawPrayerTimes(latitude, longitude, targetDate, calculationMethod, juristicMethod, timezone);

      for (const prayer of PRAYERS_LIST) {
        const mode = alerts ? alerts[prayer.key] : 'TONE';
        if (mode === 'SILENT') continue;

        const prayerDate = raw[prayer.name.toLowerCase() as keyof typeof raw] as Date;
        if (!prayerDate) continue;

        // 1. Pre-Prayer Reminder (e.g. 15 minutes before)
        if (offsetMins > 0) {
          const reminderDate = new Date(prayerDate.getTime() - offsetMins * 60000);
          const inQuiet = qEnabled && isWithinQuietHours(reminderDate, qStart, qEnd);
          if (reminderDate > now && !inQuiet) {
            await Notifications.scheduleNotificationAsync({
              identifier: `salahfirst-pre-${prayer.key}-${dateKey}`,
              content: {
                title: i18n.t('notifPreTitle', { minutes: offsetMins, prayer: prayer.name }),
                body: i18n.t('notifPreBody', { prayer: prayer.name }),
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

        // 2. Exact Prayer Azan Alarm (Fajr alarm exempt from quiet hours)
        const isFajr = prayer.key === 'fajr';
        const alarmInQuiet = qEnabled && !isFajr && isWithinQuietHours(prayerDate, qStart, qEnd);
        if (prayerDate > now && !alarmInQuiet) {
          const alarmTitleKey = `notifPrayerTitle${prayer.name}`;
          const alarmBodyKey = `notifPrayerBody${prayer.name}`;
          await Notifications.scheduleNotificationAsync({
            identifier: `salahfirst-alarm-${prayer.key}-${dateKey}`,
            content: {
              title: (i18n.t(alarmTitleKey as any) as string) || `Time for ${prayer.name}`,
              body: (i18n.t(alarmBodyKey as any) as string) || 'Hayya \'alas-Salah — Turn your attention to Salah.',
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

        // 2b. Automatic Prayer Focus Mode Alarm (at Azan + Congregation Delay)
        if (focusPrefs.autoStartOnAzan !== false) {
          const congregationDelay = focusOffsets[prayer.key as keyof PrayerFocusOffsets] ?? 20;
          const focusStartDate = new Date(prayerDate.getTime() + congregationDelay * 60000);
          const focusDurationMins = focusPrefs.defaultDuration ?? 15;
          const focusEndDate = new Date(focusStartDate.getTime() + focusDurationMins * 60000);

          if (focusStartDate > now) {
            await Notifications.scheduleNotificationAsync({
              identifier: `salahfirst-autofocus-${prayer.key}-${dateKey}`,
              content: {
                title: `🕌 ${prayer.name} Focus Mode Active`,
                body: `${focusDurationMins}m prayer shield running. Distractions minimized.`,
                sound: 'default',
                data: {
                  type: 'auto-focus-start',
                  prayerName: prayer.name,
                  duration: focusDurationMins,
                  targetEndTimestamp: focusEndDate.getTime(),
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: focusStartDate,
                channelId: FOCUS_CHANNEL_ID,
              },
            });
            scheduledCount++;
          }
        }

        // 3. Gentle Missed/Unmarked Follow-up Reminder (30 mins after prayer time)
        if (alerts?.missedPrayerRemindersEnabled !== false) {
          const missedDate = new Date(prayerDate.getTime() + 30 * 60000);
          const isCompleted = !!history[dateKey]?.[prayer.name];
          const missedInQuiet = qEnabled && isWithinQuietHours(missedDate, qStart, qEnd);

          if (missedDate > now && !isCompleted && !missedInQuiet) {
            const missedTitleKey = `notifMissedTitle${prayer.name}`;
            const missedBodyKey = `notifMissedBody${prayer.name}`;
            await Notifications.scheduleNotificationAsync({
              identifier: `salahfirst-missed-${prayer.key}-${dateKey}`,
              content: {
                title: (i18n.t(missedTitleKey as any) as string) || `${prayer.name} hasn't been marked yet`,
                body: (i18n.t(missedBodyKey as any) as string) || 'Take a moment for your prayer, if you haven\'t already.',
                sound: 'default',
                data: { prayerName: prayer.name, type: 'missed-followup' },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: missedDate,
                channelId: MISSED_CHANNEL_ID,
              },
            });
            scheduledCount++;
          }
        }
      }

      // 4. Daily Reflection (Scheduled at 20:45)
      if (alerts?.dailyReflectionEnabled !== false) {
        const reflectionDate = new Date(targetDate);
        reflectionDate.setHours(20, 45, 0, 0);
        const refInQuiet = qEnabled && isWithinQuietHours(reflectionDate, qStart, qEnd);

        if (reflectionDate > now && !refInQuiet) {
          await Notifications.scheduleNotificationAsync({
            identifier: `salahfirst-reflection-${dateKey}`,
            content: {
              title: (i18n.t('notifDailyReflectionTitle') as string) || 'A moment to reflect 🤍',
              body: (i18n.t('notifDailyReflectionBody') as string) || 'How was your Salah today? Take a moment to review your day.',
              sound: 'default',
              data: { type: 'daily-reflection' },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: reflectionDate,
              channelId: REFLECTION_CHANNEL_ID,
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
