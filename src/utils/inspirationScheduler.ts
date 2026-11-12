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
import { hasDeliveredReengagementOnDate } from './reengagementManager';
import {
  InspirationConfig,
  InspirationItem,
  getInspirationById,
} from '@/data/inspiration';
import { CalculationMethodName, JuristicMethod } from '@/types';
import { getRawPrayerTimes } from './prayerTimes';
import { formatScriptureNotification } from './scriptureNotificationFormatter';

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

export const calculateFajrToDhuhrInspirationDate = (
  baseDate: Date,
  latitude?: number,
  longitude?: number,
  timezone?: string,
  calculationMethod: CalculationMethodName = 'Karachi',
  juristicMethod: JuristicMethod = 'Hanafi'
): Date => {
  // Default Fajr+30m (06:00) to Dhuhr-15m (11:45) fallback if coordinates aren't provided
  let windowStartMs = new Date(baseDate).setHours(6, 0, 0, 0);
  let windowEndMs = new Date(baseDate).setHours(11, 45, 0, 0);

  if (latitude !== undefined && longitude !== undefined) {
    const raw = getRawPrayerTimes(
      latitude,
      longitude,
      baseDate,
      calculationMethod,
      juristicMethod,
      timezone
    );
    if (raw.fajr && raw.dhuhr) {
      // Buffer 20 mins after Fajr start and 15 mins before Dhuhr start
      windowStartMs = raw.fajr.getTime() + 20 * 60 * 1000;
      windowEndMs = raw.dhuhr.getTime() - 15 * 60 * 1000;
    }
  }

  const nowMs = Date.now();
  const effectiveStartMs = Math.max(windowStartMs, nowMs + 2 * 60 * 1000);

  if (effectiveStartMs >= windowEndMs) {
    // Window for baseDate has passed
    return new Date(windowEndMs);
  }

  const randomOffsetMs = Math.floor(Math.random() * (windowEndMs - effectiveStartMs));
  return new Date(effectiveStartMs + randomOffsetMs);
};

export const scheduleDailyInspirationNotification = async (params: {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
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
    const alreadyDeliveredReengagement = await hasDeliveredReengagementOnDate(todayKey);
    const scheduledList = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
    const existingToday = scheduledList.find((n) => n.identifier === `salahfirst-inspiration-${todayKey}`);
    const existingReengagement = scheduledList.find((n) => n.identifier === `salahfirst-reengagement-${todayKey}`);

    // Determine today's Fajr-to-Dhuhr end boundary
    let todayDhuhrEndMs = new Date(now).setHours(11, 45, 0, 0);
    if (params.latitude !== undefined && params.longitude !== undefined) {
      const todayRaw = getRawPrayerTimes(
        params.latitude,
        params.longitude,
        now,
        params.calculationMethod || 'Karachi',
        params.juristicMethod || 'Hanafi',
        params.timezone
      );
      if (todayRaw.dhuhr) {
        todayDhuhrEndMs = todayRaw.dhuhr.getTime() - 15 * 60 * 1000;
      }
    }

    const isPastFajrDhuhrWindow = now.getTime() >= todayDhuhrEndMs - 2 * 60 * 1000;

    let targetDate = new Date(now);
    let targetDateKey = todayKey;

    // Strictly 1 daily notification between Fajr and Dhuhr only.
    // If already scheduled/delivered today OR if past Dhuhr today, schedule for tomorrow's Fajr-to-Dhuhr window.
    if (
      alreadyDeliveredToday ||
      alreadyDeliveredReengagement ||
      existingToday ||
      existingReengagement ||
      isPastFajrDhuhrWindow
    ) {
      targetDate = new Date(now.getTime() + 86400000);
      const tomorrowLocal = getLocalDateComponents(targetDate, params.timezone);
      targetDateKey = tomorrowLocal.dateKey;
    }

    const existingTarget = scheduledList.find((n) => n.identifier === `salahfirst-inspiration-${targetDateKey}`);
    if (existingTarget) {
      return true; // Already safely scheduled for target day
    }

    const item = await selectNextInspiration(targetDateKey);
    if (!item) return false;

    const deliveryDate = calculateFajrToDhuhrInspirationDate(
      targetDate,
      params.latitude,
      params.longitude,
      params.timezone,
      params.calculationMethod,
      params.juristicMethod
    );

    const scheduledFormatted = formatScriptureNotification(item, lang);
    await Notifications.scheduleNotificationAsync({
      identifier: `salahfirst-inspiration-${targetDateKey}`,
      content: {
        title: scheduledFormatted.title,
        body: scheduledFormatted.body,
        sound: 'default',
        data: { type: 'daily-inspiration', contentId: item.id, dateKey: targetDateKey },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: deliveryDate,
        channelId: INSPIRATION_CHANNEL_ID,
      },
    });

    // Record immediately when scheduled so re-opening the app on the same day after delivery
    // never schedules a 2nd notification for the same dateKey
    await recordInspirationDelivery(item.id, targetDateKey, item.category);

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
            const formatted = formatScriptureNotification(item, lang);
            await Notifications.scheduleNotificationAsync({
              identifier: notif.identifier,
              content: {
                title: formatted.title,
                body: formatted.body,
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

