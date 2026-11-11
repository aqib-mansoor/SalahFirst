import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FOCUS_CHANNEL_ID } from './notificationChannels';
import { pruneDeliveredNotifications } from './notificationCleanup';
import { FocusScripture, getRandomFocusScripture } from '@/data/focusScriptures';

export const FOCUS_ACTIVE_NOTIF_ID = 'salahfirst_focus_active';
export const FOCUS_DONE_NOTIF_ID = 'salahfirst_focus_done';

let activeScripture: FocusScripture | null = null;

export const getActiveFocusScripture = (): FocusScripture => {
  if (!activeScripture) {
    activeScripture = getRandomFocusScripture();
  }
  return activeScripture;
};

/**
 * Starts persistent lockscreen and notification drawer focus notification
 * displaying Quran Ayat / Hadith and remaining time
 */
export const startFocusNotifications = async (
  prayerName: string,
  durationMinutes: number,
  remainingMinutes?: number
): Promise<void> => {
  try {
    await pruneDeliveredNotifications(FOCUS_ACTIVE_NOTIF_ID);
    const scripture = getActiveFocusScripture();
    const minsLeft = remainingMinutes !== undefined ? remainingMinutes : durationMinutes;
    const timeLabel = minsLeft > 0 ? `${minsLeft}m left` : 'Completing...';

    const title = `${prayerName} Focus • ${timeLabel} • Phone Silenced`;
    const body = `${scripture.arabic}\n${scripture.english}\n— ${scripture.reference}`;

    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_ACTIVE_NOTIF_ID,
      content: {
        title,
        body,
        data: { type: 'focus-active', prayerName },
        sticky: true,
        autoDismiss: false,
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: null,
    });

    const triggerDate = new Date(Date.now() + minsLeft * 60 * 1000);
    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_DONE_NOTIF_ID,
      content: {
        title: `${prayerName} • Focus Complete`,
        body: `Alhamdulillah. Tap to log your ${prayerName} prayer.`,
        data: { type: 'focus-completed', prayerName },
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch {}
};

/**
 * Updates the remaining minutes in the persistent focus notification
 */
export const updateFocusNotificationProgress = async (
  prayerName: string,
  remainingMinutes: number
): Promise<void> => {
  try {
    const scripture = getActiveFocusScripture();
    const timeLabel = remainingMinutes > 0 ? `${remainingMinutes}m left` : 'Completing...';
    const title = `${prayerName} Focus • ${timeLabel} • Phone Silenced`;
    const body = `${scripture.arabic}\n${scripture.english}\n— ${scripture.reference}`;

    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_ACTIVE_NOTIF_ID,
      content: {
        title,
        body,
        data: { type: 'focus-active', prayerName },
        sticky: true,
        autoDismiss: false,
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: null,
    });
  } catch {}
};

/**
 * Cancels and cleans up all active focus notifications
 */
export const cancelFocusNotifications = async (): Promise<void> => {
  try {
    activeScripture = null;
    await Notifications.dismissNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_DONE_NOTIF_ID);
  } catch {}
};
