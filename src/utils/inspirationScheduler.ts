import * as Notifications from 'expo-notifications';
import { storage } from './storage';
import { isWithinQuietHours } from './notificationQuietHours';
import { getLocalDateComponents } from './timezone';
import { checkNotificationPermissions, INSPIRATION_CHANNEL_ID } from './notificationChannels';
import {
  selectNextInspiration,
  hasDeliveredOnDate,
  recordInspirationDelivery,
  INSPIRATION_CONFIG_KEY,
} from './inspirationManager';
import {
  InspirationConfig,
  InspirationItem,
  getInspirationById,
} from '@/data/inspiration';

export const DEFAULT_INSPIRATION_CONFIG: InspirationConfig = {
  enabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '05:00',
};

export const getInspirationConfig = async (): Promise<InspirationConfig> => {
  return await storage.get<InspirationConfig>(
    INSPIRATION_CONFIG_KEY,
    DEFAULT_INSPIRATION_CONFIG
  );
};

export const saveInspirationConfig = async (
  config: InspirationConfig
): Promise<void> => {
  await storage.set(INSPIRATION_CONFIG_KEY, config);
  if (!config.enabled) {
    await cancelInspirationNotifications();
  }
};

export const cancelInspirationNotifications = async (): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith('salahfirst-inspiration-')) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch {}
};

export const calculateRandomInspirationDate = (
  baseDate: Date,
  timezone?: string,
  minHour: number = 9,
  maxHour: number = 20
): Date => {
  const local = getLocalDateComponents(baseDate, timezone);
  const now = new Date();
  const todayLocal = getLocalDateComponents(now, timezone);
  const isTargetingToday = local.dateKey === todayLocal.dateKey;

  let startTotalMins = minHour * 60; // 09:00 = 540
  const endTotalMins = maxHour * 60;  // 20:00 = 1200

  if (isTargetingToday) {
    const currentLocalMins = now.getHours() * 60 + now.getMinutes();
    startTotalMins = Math.max(startTotalMins, currentLocalMins + 2);
  }

  const range = Math.max(1, endTotalMins - startTotalMins);
  const randomMinutes = Math.floor(Math.random() * range);
  const targetTotalMins = startTotalMins + randomMinutes;

  const targetHour = Math.floor(targetTotalMins / 60);
  const targetMin = targetTotalMins % 60;

  // Accurately map local calendar components into a valid timestamp
  const dateObj = new Date(baseDate);
  dateObj.setHours(targetHour, targetMin, 0, 0);
  return dateObj;
};

export const scheduleDailyInspirationNotification = async (params: {
  timezone?: string;
  language?: string;
}): Promise<boolean> => {
  try {
    const config = await getInspirationConfig();
    if (!config.enabled) return false;

    const { granted } = await checkNotificationPermissions();
    if (!granted) return false;

    const lang = (params.language === 'ur' || params.language === 'ar') ? params.language : 'en';
    const now = new Date();
    const todayLocal = getLocalDateComponents(now, params.timezone);
    const todayKey = todayLocal.dateKey;

    const alreadyDeliveredToday = await hasDeliveredOnDate(todayKey);
    const scheduledList = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
    const existingToday = scheduledList.find((n) => n.identifier === `salahfirst-inspiration-${todayKey}`);

    let targetDate = new Date();
    let targetDateKey = todayKey;

    // Check if we should target today or tomorrow
    const currentHour = now.getHours();
    if (alreadyDeliveredToday || existingToday || currentHour >= 20) {
      // Advance to tomorrow
      targetDate.setDate(now.getDate() + 1);
      const tomorrowLocal = getLocalDateComponents(targetDate, params.timezone);
      targetDateKey = tomorrowLocal.dateKey;
    }

    const existingTarget = scheduledList.find((n) => n.identifier === `salahfirst-inspiration-${targetDateKey}`);
    if (existingTarget) {
      return true; // Already safely scheduled for target day
    }

    const item = await selectNextInspiration(targetDateKey);
    if (!item) return false;

    const deliveryDate = calculateRandomInspirationDate(targetDate, params.timezone);

    // Respect quiet hours if configured
    if (config.quietHoursEnabled && isWithinQuietHours(deliveryDate, config.quietHoursStart, config.quietHoursEnd)) {
      deliveryDate.setHours(10, 0, 0, 0);
    }

    // Single delivery policy: if targeting today and time is now, fire immediately and record
    const isToday = targetDateKey === todayKey;
    if (isToday && deliveryDate.getTime() <= now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `salahfirst-inspiration-${todayKey}`,
        content: {
          title: item.title[lang] || item.title.en,
          body: item.body[lang] || item.body.en,
          sound: 'default',
          data: { type: 'daily-inspiration', contentId: item.id, dateKey: todayKey },
        },
        trigger: null, // immediate delivery
      });
      await recordInspirationDelivery(item.id, todayKey, item.category);
      // Immediately schedule tomorrow's in advance
      targetDate.setDate(now.getDate() + 1);
      const tomorrowLocal = getLocalDateComponents(targetDate, params.timezone);
      const nextItem = await selectNextInspiration(tomorrowLocal.dateKey);
      if (nextItem) {
        const nextDelivery = calculateRandomInspirationDate(targetDate, params.timezone);
        await Notifications.scheduleNotificationAsync({
          identifier: `salahfirst-inspiration-${tomorrowLocal.dateKey}`,
          content: {
            title: nextItem.title[lang] || nextItem.title.en,
            body: nextItem.body[lang] || nextItem.body.en,
            sound: 'default',
            data: { type: 'daily-inspiration', contentId: nextItem.id, dateKey: tomorrowLocal.dateKey },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: nextDelivery,
            channelId: INSPIRATION_CHANNEL_ID,
          },
        });
      }
      return true;
    }

    await Notifications.scheduleNotificationAsync({
      identifier: `salahfirst-inspiration-${targetDateKey}`,
      content: {
        title: item.title[lang] || item.title.en,
        body: item.body[lang] || item.body.en,
        sound: 'default',
        data: { type: 'daily-inspiration', contentId: item.id, dateKey: targetDateKey },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: deliveryDate,
        channelId: INSPIRATION_CHANNEL_ID,
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const updatePendingInspirationLanguage = async (
  newLanguage: string
): Promise<void> => {
  try {
    const lang = (newLanguage === 'ur' || newLanguage === 'ar') ? newLanguage : 'en';
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith('salahfirst-inspiration-')) {
        const data = notif.content.data as { contentId?: string; dateKey?: string } | undefined;
        if (data?.contentId) {
          const item = getInspirationById(data.contentId);
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
