import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FOCUS_CHANNEL_ID } from './notificationChannels';

export const FOCUS_ACTIVE_NOTIF_ID = 'salahfirst_focus_active';
export const FOCUS_DONE_NOTIF_ID = 'salahfirst_focus_done';

/**
 * Starts ongoing and scheduled completion notifications for active focus
 */
export const startFocusNotifications = async (
  prayerName: string,
  durationMinutes: number
): Promise<void> => {
  try {
    // 1. Ongoing active shield notification
    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_ACTIVE_NOTIF_ID,
      content: {
        title: `🕌 ${prayerName} Focus Mode Active`,
        body: `${durationMinutes}m prayer shield running. Distractions minimized.`,
        data: { type: 'focus-active', prayerName },
        sticky: true,
        autoDismiss: false,
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: null,
    });

    // 2. Scheduled completion notification
    const triggerDate = new Date(Date.now() + durationMinutes * 60 * 1000);
    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_DONE_NOTIF_ID,
      content: {
        title: `✅ ${prayerName} Focus Complete`,
        body: `Alhamdulillah! Tap to confirm you completed your ${prayerName} prayer.`,
        data: { type: 'focus-completed', prayerName },
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch (error) {
    console.warn('[FocusNotification] Failed to schedule focus notifications', error);
  }
};

/**
 * Dismisses any active or pending focus notifications
 */
export const cancelFocusNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_DONE_NOTIF_ID);
  } catch (error) {
    console.warn('[FocusNotification] Failed to cancel focus notifications', error);
  }
};

