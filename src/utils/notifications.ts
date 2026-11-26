import * as Notifications from 'expo-notifications';
import {
  PrayerAlertConfig,
  NotificationMode,
  ReminderOffset,
  CalculationMethodName,
  JuristicMethod,
  PrayerMinuteAdjustments,
} from '@/types';
import { getRawPrayerTimes, setCachedPrayerAdjustments } from './prayerTimes';
import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import { formatDateKey } from './trackerStatistics';
import { isWithinQuietHours } from './notificationQuietHours';
import { getLocalDateComponents } from './timezone';
import { loadFocusOffsets, loadFocusDurations, loadFocusPreferences } from './prayerFocusOffsets';
import { dismissDeliveredByPrayer } from './notificationCleanup';
import {
  PRAYER_CHANNEL_ID,
  PRAYER_CATEGORY_ID,
  REMINDER_CHANNEL_ID,
  MISSED_CHANNEL_ID,
  REFLECTION_CHANNEL_ID,
  INSPIRATION_CHANNEL_ID,
  REENGAGEMENT_CHANNEL_ID,
  getPrayerChannelForModeAndReciter,
  setupNotificationChannels,
  checkNotificationPermissions,
  requestNotificationPermission,
} from './notificationChannels';
import {
  scheduleSecondaryPrayerReminders,
  scheduleDailyReflectionAlert,
} from './notificationFollowups';
import { AzanReciterKey } from './azanAudio';
import {
  scheduleNativeAzan,
  cancelAllNativeAzans,
  setNativeAlarmBehaviorPrefs,
} from '@/native/AzanServiceModule';
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
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getOffsetMinutes = (offset: ReminderOffset): number =>
  offset === '10m' ? 10 : offset === '15m' ? 15 : offset === '30m' ? 30 : 0;

export interface SchedulePrayerParams {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  alerts?: PrayerAlertConfig;
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
}

const PRAYERS_LIST: { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; name: string }[] = [
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
    await Notifications.cancelScheduledNotificationAsync(
      `salahfirst-missed-${prayerName.toLowerCase()}-${dateKey}`
    );
    await dismissDeliveredByPrayer(prayerName);
  } catch {}
};

export const triggerStreakNotification = async (): Promise<void> => {
  try {
    const { granted } = await checkNotificationPermissions();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: (i18n.t('notifStreakTitle') as string) || 'As Salah • Daily Completion',
        body: (i18n.t('notifStreakBody') as string) || 'Alhamdulillah. You completed all 5 prayers today.',
        sound: 'default',
        data: { type: 'streak-encouragement' },
      },
      trigger: null,
    });
  } catch {}
};

let isScheduling = false;
let queuedScheduleParams: SchedulePrayerParams | null = null;

export const scheduleAllPrayerAlerts = async (
  params: SchedulePrayerParams
): Promise<number> => {
  if (isScheduling) {
    queuedScheduleParams = params;
    return 0;
  }
  isScheduling = true;

  try {
    const {
      latitude,
      longitude,
      timezone,
      alerts,
      calculationMethod = 'Karachi',
      juristicMethod = 'Hanafi',
    } = params;

    // Safety Guard: Never wipe existing scheduled alarms if coordinates are missing or invalid
    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      return 0;
    }

    const { granted } = await checkNotificationPermissions();
    if (!granted) return 0;

    // Only cancel existing alarms once new coordinates and permissions are confirmed
    const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
    for (const notif of scheduled) {
      if (/^salahfirst-(alarm|prayer|pre|missed|autofocus|reflection)-/.test(notif.identifier)) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier).catch(() => {});
      }
    }
    await cancelAllNativeAzans();
    if (alerts && alerts.exactAlarmsEnabled === false) return 0;

    await setNativeAlarmBehaviorPrefs(
      alerts?.hideStatusBarAlarmIcon !== true,
      alerts?.fajrWakeUpOverride !== false
    );

    const [history, focusOffsets, focusDurations, focusPrefs, reciterKey, storedAdjustments] = await Promise.all([
      storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.prayerTracker, {}),
      loadFocusOffsets(),
      loadFocusDurations(),
      loadFocusPreferences(),
      storage.get<AzanReciterKey>(APP_CONFIG.storageKeys.azanReciter, 'makkah'),
      storage.get<Partial<PrayerMinuteAdjustments> | null>(APP_CONFIG.storageKeys.prayerAdjustments, null),
    ]);
    if (storedAdjustments) {
      setCachedPrayerAdjustments(storedAdjustments);
    }

    const now = new Date();
    let scheduledCount = 0;
    const offsetMins = alerts ? getOffsetMinutes(alerts.reminderOffset) : 0;
    const qEnabled = alerts?.quietHoursEnabled ?? false;
    const qStart = alerts?.quietHoursStart ?? '23:00';
    const qEnd = alerts?.quietHoursEnd ?? '05:00';

    // 14-day rolling schedule window for exact prayer Azan alarms (70 alarms max)
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const targetDate = new Date(now.getTime() + dayOffset * 86400000);
      const dateKey = getLocalDateComponents(targetDate, timezone).dateKey;
      const raw = getRawPrayerTimes(
        latitude,
        longitude,
        targetDate,
        calculationMethod,
        juristicMethod,
        timezone
      );

      for (const prayer of PRAYERS_LIST) {
        const mode: NotificationMode = alerts && alerts[prayer.key] ? alerts[prayer.key] : 'AZAN';
        if (mode === 'SILENT') continue;

        const prayerDate = raw[prayer.name.toLowerCase() as keyof typeof raw] as Date;
        if (!prayerDate) continue;

        // Primary Exact Prayer Azan Alarm (scheduled for all 7 days)
        const isFajr = prayer.key === 'fajr';
        const alarmInQuiet = qEnabled && !isFajr && isWithinQuietHours(prayerDate, qStart, qEnd);
        if (prayerDate > now && !alarmInQuiet) {
          const isJumuah = prayerDate.getDay() === 5 && prayer.key === 'dhuhr';
          const alarmTitleKey = `notifPrayerTitle${prayer.name}`;
          const alarmBodyKey = `notifPrayerBody${prayer.name}`;
          // Fajr prayer always recites Fajr Dawn Azan; other prayers recite user's chosen voice
          const effectiveReciter = isFajr && mode === 'AZAN' ? 'fajr' : (reciterKey === 'fajr' ? 'makkah' : reciterKey);
          const { channelId: prayerChannel, soundName } = getPrayerChannelForModeAndReciter(
            mode,
            effectiveReciter
          );

          // Schedule AZAN, TONE, and VIBRATE through native AlarmManager.setAlarmClock on Android;
          // fall back to expo-notifications on iOS or if native scheduling is unavailable
          const nativeModeOrReciter =
            mode === 'TONE' ? 'tone' : mode === 'VIBRATE' ? 'vibrate' : effectiveReciter;
          const nativeScheduled = await scheduleNativeAzan(
            prayer.name,
            prayer.key,
            nativeModeOrReciter,
            prayerDate,
            dayOffset
          );

          if (nativeScheduled) {
            scheduledCount++;
          } else {
            await Notifications.scheduleNotificationAsync({
              identifier: `salahfirst-alarm-${prayer.key}-${dateKey}`,
              content: {
                title: isJumuah
                  ? (i18n.t('notifPrayerTitleJumuah' as any) as string) || "Jumu'ah • Friday Prayer Call"
                  : (i18n.t(alarmTitleKey as any) as string) || `${prayer.name} • Hayya 'alas-Salah`,
                body: isJumuah
                  ? (i18n.t('notifPrayerBodyJumuah' as any) as string) ||
                    "Jumu'ah Mubarak — Gather for the Friday remembrance and congregation."
                  : (i18n.t(alarmBodyKey as any) as string) ||
                    `Hayya 'alas-Salah — Turn your heart in worship for ${prayer.name} prayer.`,
                sound: mode === 'VIBRATE' ? undefined : soundName,
                categoryIdentifier: PRAYER_CATEGORY_ID,
                data: { prayerName: prayer.name, type: 'prayer-alarm' },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: prayerDate,
                channelId: prayerChannel,
              },
            });
            scheduledCount++;
          }
        }

        // Secondary reminders (Pre-Prayer, Auto-Focus, Missed) for immediate 3 days
        if (dayOffset < 3) {
          scheduledCount += await scheduleSecondaryPrayerReminders({
            now,
            prayerKey: prayer.key,
            prayerName: prayer.name,
            prayerDate,
            dateKey,
            mode,
            offsetMins,
            qEnabled,
            qStart,
            qEnd,
            alerts,
            focusPrefs,
            focusOffsets,
            focusDurations,
            isCompleted: !!history[dateKey]?.[prayer.name],
          });
        }
      }
    }

    return scheduledCount;
  } finally {
    isScheduling = false;
    if (queuedScheduleParams) {
      const next = queuedScheduleParams;
      queuedScheduleParams = null;
      scheduleAllPrayerAlerts(next);
    }
  }
};
