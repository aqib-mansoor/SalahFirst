import { useEffect, useCallback } from 'react';
import { UserLocation, PrayerAlertConfig } from '@/types';
import {
  scheduleAllPrayerAlerts,
  requestNotificationPermission,
} from '@/utils/notifications';

export const useNotificationScheduler = (
  location?: UserLocation,
  alerts?: PrayerAlertConfig
) => {
  const syncAlarms = useCallback(async () => {
    await scheduleAllPrayerAlerts({
      latitude: location?.latitude,
      longitude: location?.longitude,
      alerts,
    });
  }, [location?.latitude, location?.longitude, alerts]);

  // Synchronize scheduled prayer alarms whenever location or alert preferences change
  useEffect(() => {
    syncAlarms();
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

