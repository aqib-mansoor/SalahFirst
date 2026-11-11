import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FOCUS_CHANNEL_ID } from './notificationChannels';
import {
  FocusScripture,
  getNextFocusScripture,
  formatScriptureForLanguage,
} from '@/data/focusScriptures';
import {
  showLiveFocusNotification,
  dismissLiveFocusNotification,
} from '@/native/FocusSilencerBridge';

export const FOCUS_ACTIVE_NOTIF_ID = 'salahfirst_focus_active';
export const FOCUS_DONE_NOTIF_ID = 'salahfirst_focus_done';

let currentSessionScripture: FocusScripture | null = null;

export const cycleFocusScripture = (): FocusScripture => {
  currentSessionScripture = getNextFocusScripture();
  return currentSessionScripture;
};

export const getCurrentFocusScripture = (): FocusScripture => {
  if (!currentSessionScripture) {
    currentSessionScripture = getNextFocusScripture();
  }
  return currentSessionScripture;
};

/**
 * Starts or updates persistent lockscreen focus notification with native chronometer countdown,
 * live progress bar, and rotating verified Quran / Hadith text.
 */
export const syncLiveFocusNotification = async (
  prayerName: string,
  targetEndEpochMs: number,
  totalDurationMinutes: number,
  remainingMinutes: number,
  language: string = 'en',
  rotateVerse: boolean = false
): Promise<void> => {
  try {
    const scripture = rotateVerse ? cycleFocusScripture() : getCurrentFocusScripture();
    const formatted = formatScriptureForLanguage(scripture, language);

    // 1. First trigger the native Android notification with live chronometer & progress bar
    if (Platform.OS === 'android') {
      await showLiveFocusNotification(
        prayerName,
        targetEndEpochMs,
        totalDurationMinutes,
        remainingMinutes,
        formatted.titleBadge,
        formatted.textBody
      );
    }

    // 2. Schedule completion notification when focus session ends
    const minsLeft = Math.max(1, remainingMinutes);
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
 * Cancels and cleans up all active focus notifications
 */
export const cancelFocusNotifications = async (): Promise<void> => {
  try {
    currentSessionScripture = null;
    await dismissLiveFocusNotification();
    await Notifications.dismissNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_ACTIVE_NOTIF_ID);
    await Notifications.cancelScheduledNotificationAsync(FOCUS_DONE_NOTIF_ID);
  } catch {}
};
