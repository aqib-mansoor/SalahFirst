import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { FiqhName } from '@/types';
import {
  loadFocusOffsets,
  loadFocusDurations,
  loadAutoSilenceConfig,
  loadFocusPreferences,
  PrayerFocusOffsets,
} from '@/utils/prayerFocusOffsets';
import {
  silenceDeviceForFocus,
  restoreDeviceSoundAfterFocus,
} from '@/native/FocusSilencerBridge';
import {
  syncLiveFocusNotification,
  cancelFocusNotifications,
} from '@/utils/focusNotification';
import {
  isFocusCompletedToday,
  markFocusCompleted,
  saveActiveFocusSession,
  clearActiveFocusSession,
  getActiveFocusSession,
} from '@/utils/focusSession';
import { addTrackerListener } from './usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';

const PRAYERS: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
  'fajr', 'dhuhr', 'asr', 'maghrib', 'isha',
];

export const useFocusAutoSilencer = (
  rawPrayerDates?: Record<string, Date>,
  fiqh?: FiqhName
) => {
  const { language } = useTranslation();
  const [activeSilencedPrayer, setActiveSilencedPrayer] = useState<string | null>(null);
  const isSilencedRef = useRef(false);

  const checkAutoSilence = useCallback(async () => {
    if (!rawPrayerDates) return;

    try {
      const [offsets, durations, autoConfig, prefs, currentSession] = await Promise.all([
        loadFocusOffsets(fiqh),
        loadFocusDurations(),
        loadAutoSilenceConfig(),
        loadFocusPreferences(),
        getActiveFocusSession(),
      ]);

      const now = Date.now();

      // Crash / Restart Recovery: If previous session expired, restore sound immediately
      if (currentSession && currentSession.targetEndTimestamp <= now) {
        await restoreDeviceSoundAfterFocus();
        await cancelFocusNotifications();
        await clearActiveFocusSession();
        isSilencedRef.current = false;
        setActiveSilencedPrayer(null);
      }

      if (!autoConfig.enabled || !prefs.autoStartOnAzan) {
        if (isSilencedRef.current) {
          await restoreDeviceSoundAfterFocus();
          await cancelFocusNotifications();
          isSilencedRef.current = false;
          setActiveSilencedPrayer(null);
        }
        return;
      }

      for (const prayer of PRAYERS) {
        if (!autoConfig[prayer]) continue;

        const azanDate = rawPrayerDates[prayer];
        if (!azanDate || isNaN(azanDate.getTime())) continue;

        const delay = offsets[prayer as keyof PrayerFocusOffsets] ?? 20;
        const duration = durations[prayer] ?? 15;
        const windowStart = azanDate.getTime() + delay * 60000;
        const windowEnd = windowStart + duration * 60000;
        const prayerName = prayer.charAt(0).toUpperCase() + prayer.slice(1);

        if (now >= windowStart && now < windowEnd) {
          if (await isFocusCompletedToday(prayerName)) continue;

          const minsLeft = Math.ceil((windowEnd - now) / 60000);
          if (!isSilencedRef.current || activeSilencedPrayer !== prayerName) {
            isSilencedRef.current = true;
            setActiveSilencedPrayer(prayerName);
            await silenceDeviceForFocus();
            await saveActiveFocusSession({
              prayerName,
              durationMinutes: duration,
              startTimestamp: windowStart,
              targetEndTimestamp: windowEnd,
              status: 'active',
              breachCount: 0,
            });
            await syncLiveFocusNotification(prayerName, windowEnd, duration, minsLeft, language, true);
          }
          return;
        }

        // Window finished: un-silence if this prayer was active
        if (now >= windowEnd && isSilencedRef.current && activeSilencedPrayer === prayerName) {
          isSilencedRef.current = false;
          setActiveSilencedPrayer(null);
          await restoreDeviceSoundAfterFocus();
          await cancelFocusNotifications();
          await clearActiveFocusSession();
          await markFocusCompleted(prayerName);
        }
      }
    } catch {}
  }, [rawPrayerDates, fiqh, language, activeSilencedPrayer]);

  useEffect(() => {
    checkAutoSilence();
    const interval = setInterval(checkAutoSilence, 15000);
    const unsub = addTrackerListener(checkAutoSilence);
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') checkAutoSilence();
    });

    return () => {
      clearInterval(interval);
      unsub();
      sub.remove();
    };
  }, [checkAutoSilence]);

  return { activeSilencedPrayer, isSilenced: isSilencedRef.current };
};

