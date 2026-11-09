import * as Notifications from 'expo-notifications';
import { storage } from './storage';
import { getLocalDateComponents } from './timezone';
import { checkNotificationPermissions, REENGAGEMENT_CHANNEL_ID } from './notificationChannels';
import {
  REENGAGEMENT_CONFIG_KEY,
  hasDeliveredReengagementOnDate,
  recordReengagementDelivery,
  selectNextReengagement,
  recordAppActive,
} from './reengagementManager';
import {
  ReengagementConfig,
  getReengagementById,
} from '../data/reengagement';

export const DEFAULT_REENGAGEMENT_CONFIG: ReengagementConfig = {
  enabled: true,
};

export const getReengagementConfig = async (): Promise<ReengagementConfig> => {
  return await storage.get<ReengagementConfig>(
    REENGAGEMENT_CONFIG_KEY,
    DEFAULT_REENGAGEMENT_CONFIG
  );
};

export const saveReengagementConfig = async (
  config: ReengagementConfig
): Promise<void> => {
  await storage.set(REENGAGEMENT_CONFIG_KEY, config);
  if (!config.enabled) {
    await cancelPendingReengagement();
  }
};

export const cancelPendingReengagement = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith('salahfirst-reengagement-')) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch {}
};

import { calculateReengagementTargetTime } from './reengagementTiming';
export { calculateReengagementTargetTime };

export const scheduleStandbyReengagement = async (params: {
  timezone?: string;
  language?: string;
}): Promise<boolean> => {
  try {
    const config = await getReengagementConfig();
    if (!config.enabled) return false;

    const { granted } = await checkNotificationPermissions();
    if (!granted) return false;

    // Remove any previously scheduled standby reengagement before queueing fresh one
    await cancelPendingReengagement();

    const lang = params.language === 'ur' || params.language === 'ar' ? params.language : 'en';

    // 24 hours inactivity baseline
    const now = new Date();
    const minEligible = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const targetDate = calculateReengagementTargetTime(minEligible, params.timezone);

    const targetLocal = getLocalDateComponents(targetDate, params.timezone);
    const targetDateKey = targetLocal.dateKey;

    // Check if already delivered on target date
    const alreadyDelivered = await hasDeliveredReengagementOnDate(targetDateKey);
    if (alreadyDelivered) return false;

    const item = await selectNextReengagement(targetDateKey);
    if (!item) return false;

    await Notifications.scheduleNotificationAsync({
      identifier: `salahfirst-reengagement-${targetDateKey}`,
      content: {
        title: item.title[lang] || item.title.en,
        body: item.body[lang] || item.body.en,
        sound: 'default',
        data: {
          type: 'reengagement',
          contentId: item.id,
          dateKey: targetDateKey,
          category: item.category,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate,
        channelId: REENGAGEMENT_CHANNEL_ID,
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const updatePendingReengagementLanguage = async (
  newLanguage: string
): Promise<void> => {
  try {
    const lang = newLanguage === 'ur' || newLanguage === 'ar' ? newLanguage : 'en';
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith('salahfirst-reengagement-')) {
        const data = notif.content.data as { contentId?: string } | undefined;
        if (data?.contentId) {
          const item = getReengagementById(data.contentId);
          if (item && notif.trigger && 'date' in notif.trigger) {
            await Notifications.scheduleNotificationAsync({
              identifier: notif.identifier,
              content: {
                title: item.title[lang] || item.title.en,
                body: item.body[lang] || item.body.en,
                sound: notif.content.sound || 'default',
                data: notif.content.data,
              },
              trigger: notif.trigger as any,
            });
          }
        }
      }
    }
  } catch {}
};
