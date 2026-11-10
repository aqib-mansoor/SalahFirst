import * as Notifications from 'expo-notifications';
import { PrayerAlertConfig, NotificationMode } from '@/types';
import { PrayerFocusOffsets, PrayerFocusDurations, FocusPreferences } from './prayerFocusOffsets';
import { isWithinQuietHours } from './notificationQuietHours';
import {
  REMINDER_CHANNEL_ID,
  MISSED_CHANNEL_ID,
  MISSED_CATEGORY_ID,
  REFLECTION_CHANNEL_ID,
  FOCUS_CHANNEL_ID,
} from './notificationChannels';
import i18n from '@/i18n';

export interface SecondaryReminderContext {
  now: Date;
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayerName: string;
  prayerDate: Date;
  dateKey: string;
  mode: NotificationMode;
  offsetMins: number;
  qEnabled: boolean;
  qStart: string;
  qEnd: string;
  alerts?: PrayerAlertConfig;
  focusPrefs: FocusPreferences;
  focusOffsets: PrayerFocusOffsets;
  focusDurations?: PrayerFocusDurations;
  isCompleted: boolean;
}

export const scheduleSecondaryPrayerReminders = async (
  ctx: SecondaryReminderContext
): Promise<number> => {
  const {
    now,
    prayerKey,
    prayerName,
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
    isCompleted,
  } = ctx;

  let count = 0;
  const displayPrayer = prayerDate.getDay() === 5 && prayerKey === 'dhuhr' ? "Jumu'ah" : prayerName;

  // 1. Pre-Prayer Reminder
  if (offsetMins > 0) {
    const reminderDate = new Date(prayerDate.getTime() - offsetMins * 60000);
    const inQuiet = qEnabled && isWithinQuietHours(reminderDate, qStart, qEnd);
    if (reminderDate > now && !inQuiet) {
      await Notifications.scheduleNotificationAsync({
        identifier: `salahfirst-pre-${prayerKey}-${dateKey}`,
        content: {
          title: i18n.t('notifPreTitle', { minutes: offsetMins, prayer: displayPrayer }),
          body: i18n.t('notifPreBody', { prayer: displayPrayer }),
          sound: mode === 'VIBRATE' ? undefined : 'default',
          data: { prayerName, type: 'pre-reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
          channelId: REMINDER_CHANNEL_ID,
        },
      });
      count++;
    }
  }

  // 2. Automatic Prayer Focus Mode Alarm (at Azan + Congregation Delay)
  if (focusPrefs.autoStartOnAzan !== false) {
    const congregationDelay = focusOffsets[prayerKey as keyof PrayerFocusOffsets] ?? 20;
    const focusStartDate = new Date(prayerDate.getTime() + congregationDelay * 60000);
    const prayerDuration = focusDurations?.[prayerKey as keyof PrayerFocusDurations] ?? focusPrefs.defaultDuration ?? 15;
    const focusEndDate = new Date(focusStartDate.getTime() + prayerDuration * 60000);

    if (focusStartDate > now) {
      await Notifications.scheduleNotificationAsync({
        identifier: `salahfirst-autofocus-${prayerKey}-${dateKey}`,
        content: {
          title: `${displayPrayer} Focus • Time for Salah`,
          body: `Salah first, scroll later. Put distractions aside and stand before your Lord for ${displayPrayer}.`,
          sound: 'default',
          data: {
            type: 'auto-focus-start',
            prayerName,
            duration: prayerDuration,
            targetEndTimestamp: focusEndDate.getTime(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: focusStartDate,
          channelId: FOCUS_CHANNEL_ID,
        },
      });
      count++;
    }
  }

  // 3. Gentle Missed/Unmarked Follow-up Reminder (30 mins after prayer time)
  if (alerts?.missedPrayerRemindersEnabled !== false) {
    const missedDate = new Date(prayerDate.getTime() + 30 * 60000);
    const missedInQuiet = qEnabled && isWithinQuietHours(missedDate, qStart, qEnd);

    if (missedDate > now && !isCompleted && !missedInQuiet) {
      const missedTitleKey = `notifMissedTitle${prayerName}`;
      const missedBodyKey = `notifMissedBody${prayerName}`;
      await Notifications.scheduleNotificationAsync({
        identifier: `salahfirst-missed-${prayerKey}-${dateKey}`,
        content: {
          title:
            displayPrayer === "Jumu'ah"
              ? "Jumu'ah • Unmarked Prayer"
              : (i18n.t(missedTitleKey as any) as string) || `${displayPrayer} • Unmarked Prayer`,
          body:
            (i18n.t(missedBodyKey as any) as string) ||
            `Take a peaceful moment to complete and log your ${displayPrayer}.`,
          sound: 'default',
          categoryIdentifier: MISSED_CATEGORY_ID,
          data: { prayerName, type: 'missed-followup' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: missedDate,
          channelId: MISSED_CHANNEL_ID,
        },
      });
      count++;
    }
  }

  return count;
};

export const scheduleDailyReflectionAlert = async (
  targetDate: Date,
  dateKey: string,
  now: Date,
  qEnabled: boolean,
  qStart: string,
  qEnd: string
): Promise<number> => {
  const reflectionDate = new Date(targetDate);
  reflectionDate.setHours(20, 45, 0, 0);
  const refInQuiet = qEnabled && isWithinQuietHours(reflectionDate, qStart, qEnd);

  if (reflectionDate > now && !refInQuiet) {
    await Notifications.scheduleNotificationAsync({
      identifier: `salahfirst-reflection-${dateKey}`,
      content: {
        title: (i18n.t('notifDailyReflectionTitle') as string) || 'SalahFirst • Evening Reflection',
        body:
          (i18n.t('notifDailyReflectionBody') as string) ||
          'Take a quiet moment to review your prayers today.',
        sound: 'default',
        data: { type: 'daily-reflection' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reflectionDate,
        channelId: REFLECTION_CHANNEL_ID,
      },
    });
    return 1;
  }
  return 0;
};

