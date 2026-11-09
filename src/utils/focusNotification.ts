import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FOCUS_CHANNEL_ID } from './notificationChannels';
import { pruneDeliveredNotifications } from './notificationCleanup';

export const FOCUS_ACTIVE_NOTIF_ID = 'salahfirst_focus_active';
export const FOCUS_DONE_NOTIF_ID = 'salahfirst_focus_done';
export const FOCUS_BREACH_NOTIF_ID = 'salahfirst_focus_breach';

/**
 * Triggers an immediate high-priority warning when user departs from active focus
 */
export const triggerFocusBreachNotification = async (prayerName: string): Promise<void> => {
  try {
    await pruneDeliveredNotifications(FOCUS_BREACH_NOTIF_ID);
    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_BREACH_NOTIF_ID,
      content: {
        title: `${prayerName} • Prayer in Progress`,
        body: 'Focus shield active. Return to SalahFirst to complete your Salah.',
        sound: 'default',
        data: { type: 'focus-breach', prayerName },
        ...(Platform.OS === 'android' ? { channelId: FOCUS_CHANNEL_ID } : {}),
      },
      trigger: null,
    });
  } catch {}
};

/**
 * Dismisses focus breach warning notification
 */
export const dismissFocusBreachNotification = async (): Promise<void> => {
  try {
    await Notifications.dismissNotificationAsync(FOCUS_BREACH_NOTIF_ID);
  } catch {}
};

/**
 * Starts ongoing and scheduled completion notifications for active focus
 */
export const startFocusNotifications = async (
  prayerName: string,
  durationMinutes: number
): Promise<void> => {
  try {
    await pruneDeliveredNotifications(FOCUS_ACTIVE_NOTIF_ID);

    // 1. Ongoing active shield notification
    await Notifications.scheduleNotificationAsync({
      identifier: FOCUS_ACTIVE_NOTIF_ID,
      content: {
        title: `${prayerName} • Focus Shield Active`,
        body: `${durationMinutes}m prayer shield running. Distractions silenced.`,
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
 * Dismisses any active or pending focus notifications
 */
export const cancelFocusNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_DONE_NOTIF_ID);
  } catch {}
};
