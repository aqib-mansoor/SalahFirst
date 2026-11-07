import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { UserLocation, PrayerAlertConfig, CalculationMethodName, JuristicMethod } from '@/types';
import {
  scheduleAllPrayerAlerts,
  requestNotificationPermission,
} from '@/utils/notifications';

export const useNotificationScheduler = (
  location?: UserLocation | null,
  alerts?: PrayerAlertConfig,
  calculationMethod?: CalculationMethodName,
  juristicMethod?: JuristicMethod
) => {
  const syncAlarms = useCallback(async () => {
    await scheduleAllPrayerAlerts({
      latitude: location?.latitude,
      longitude: location?.longitude,
      alerts,
      calculationMethod,
      juristicMethod,
    });
  }, [location?.latitude, location?.longitude, alerts, calculationMethod, juristicMethod]);

  // Synchronize scheduled prayer alarms whenever parameters change
  useEffect(() => {
    syncAlarms();
  }, [syncAlarms]);

  // Re-synchronize alarms when the app returns from background to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        syncAlarms();
      }
    });
    return () => subscription.remove();
  }, [syncAlarms]);

  const requestPermissions = useCallback(async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await syncAlarms();
    }
    return granted;
  }, [syncAlarms]);

  return {
    syncAlarms,
    requestPermissions,
  };
};
