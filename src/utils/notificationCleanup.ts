import * as Notifications from 'expo-notifications';

/**
 * Prunes delivered notifications in the drawer so that only the latest active alert remains.
 * Prevents multiple stacked notifications from cluttering the Android shade.
 */
export const pruneDeliveredNotifications = async (keepIdentifier?: string): Promise<void> => {
  try {
    const presented = await Notifications.getPresentedNotificationsAsync();
    for (const item of presented) {
      if (keepIdentifier && item.request.identifier === keepIdentifier) continue;
      await Notifications.dismissNotificationAsync(item.request.identifier).catch(() => {});
    }
  } catch {}
};

/**
 * Dismisses all delivered notifications for a specific prayer when logged or viewed.
 */
export const dismissDeliveredByPrayer = async (prayerName: string): Promise<void> => {
  try {
    const presented = await Notifications.getPresentedNotificationsAsync();
    const query = prayerName.toLowerCase();
    for (const item of presented) {
      const id = item.request.identifier.toLowerCase();
      if (id.includes(query)) {
        await Notifications.dismissNotificationAsync(item.request.identifier).catch(() => {});
      }
    }
  } catch {}
};

/**
 * Dismisses all delivered notifications currently sitting in the system tray.
 */
export const dismissAllDeliveredNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {}
};

/**
 * Registers a listener that guarantees at most 1 active SalahFirst notification in the shade.
 */
export const registerSingleNotificationPolicy = (): (() => void) => {
  const subscription = Notifications.addNotificationReceivedListener((notification) => {
    pruneDeliveredNotifications(notification.request.identifier);
  });
  return () => subscription.remove();
};

