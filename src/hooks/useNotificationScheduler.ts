import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { UserLocation, PrayerAlertConfig, CalculationMethodName, JuristicMethod } from '@/types';
import { scheduleAllPrayerAlerts, requestNotificationPermission } from '@/utils/notifications';
import {
  scheduleDailyInspirationNotification,
  updatePendingInspirationLanguage,
} from '@/utils/inspirationScheduler';
import {
  scheduleStandbyReengagement,
  cancelPendingReengagement,
  updatePendingReengagementLanguage,
} from '@/utils/reengagementScheduler';
import { recordAppActive } from '@/utils/reengagementManager';
import { addTrackerListener } from './usePrayerTracker';

export const useNotificationScheduler = (
  location?: UserLocation | null,
  alerts?: PrayerAlertConfig,
  calculationMethod?: CalculationMethodName,
  juristicMethod?: JuristicMethod,
  language?: string
) => {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeSync = useCallback(async () => {
    await scheduleAllPrayerAlerts({
      latitude: location?.latitude,
      longitude: location?.longitude,
      timezone: location?.timezone,
      alerts,
      calculationMethod,
      juristicMethod,
    });
    await scheduleDailyInspirationNotification({
      timezone: location?.timezone,
      language,
    });
  }, [location?.latitude, location?.longitude, location?.timezone, alerts, calculationMethod, juristicMethod, language]);

  const syncAlarms = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      executeSync();
    }, 500);
  }, [executeSync]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Synchronize scheduled prayer alarms whenever parameters change
  useEffect(() => {
    syncAlarms();
  }, [syncAlarms]);

  // When language changes, update any pending inspiration and reengagement notification content
  useEffect(() => {
    if (language) {
      updatePendingInspirationLanguage(language);
      updatePendingReengagementLanguage(language);
    }
  }, [language]);

  // Re-synchronize alarms when prayer tracker completions or preferences change
  useEffect(() => {
    return addTrackerListener(() => {
      syncAlarms();
    });
  }, [syncAlarms]);

  // Handle AppState: active resets reengagement & syncs alarms, background queues standby reengagement
  useEffect(() => {
    recordAppActive();
    cancelPendingReengagement();

    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        recordAppActive();
        cancelPendingReengagement();
        syncAlarms();
      } else if (state === 'background' || state === 'inactive') {
        recordAppActive();
        scheduleStandbyReengagement({
          timezone: location?.timezone,
          language,
        });
      }
    });
    return () => subscription.remove();
  }, [syncAlarms, location?.timezone, language]);

  const requestPermissions = useCallback(async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      syncAlarms();
    }
    return granted;
  }, [syncAlarms]);

  return {
    syncAlarms,
    requestPermissions,
  };
};
