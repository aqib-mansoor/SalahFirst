import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { reverseGeocodeCoordinates } from '@/utils/geocoding';
import { resolveTimezone } from '@/utils/timezone';
import { reconcilePrayerCycle } from '@/utils/prayerCycleManager';
import { scheduleAllPrayerAlerts } from '@/utils/notifications';

export const LOCATION_BACKGROUND_TASK = 'salahfirst-background-location';

// Idempotent background task definition
try {
  if (!TaskManager.isTaskDefined(LOCATION_BACKGROUND_TASK)) {
    TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data, error }) => {
      if (error || !data) return;

      try {
        const { locations } = data as { locations: Location.LocationObject[] };
        if (!locations || locations.length === 0) return;

        const latest = locations[locations.length - 1];
        const { latitude, longitude } = latest.coords;

        const cached = await storage.get<UserLocation | null>(
          APP_CONFIG.storageKeys.userLocation,
          null
        );

        // If user manually chose a city, do not overwrite unless GPS tracking was previously active
        if (cached && !cached.isGps) {
          return;
        }

        const distanceMoved = cached
          ? Math.sqrt(
              Math.pow(cached.latitude - latitude, 2) + Math.pow(cached.longitude - longitude, 2)
            ) * 111 // approximate km
          : 999;

        const newTz = resolveTimezone(latitude, longitude, cached?.country);
        const tzChanged = cached?.timezone ? cached.timezone !== newTz : false;

        // Only commit updates for meaningful movements (> 5 km) or timezone crossings
        if (distanceMoved > 5 || tzChanged) {
          const rev = await reverseGeocodeCoordinates(latitude, longitude).catch(() => ({
            city: cached?.city || 'Local Location',
            country: cached?.country || 'Local Area',
            region: cached?.region,
            timezone: newTz,
          }));

          const updatedLoc: UserLocation = {
            city: rev.city,
            country: rev.country,
            region: rev.region,
            latitude,
            longitude,
            timezone: newTz,
            isGps: true,
            isConfirmed: true,
            isStale: false,
            lastUpdated: Date.now(),
            source: 'gps',
          };

          await storage.set(APP_CONFIG.storageKeys.userLocation, updatedLoc);
          await reconcilePrayerCycle(updatedLoc);
          await scheduleAllPrayerAlerts({
            latitude,
            longitude,
            timezone: newTz,
          }).catch(() => {});
        }
      } catch {}
    });
  }
} catch {}

export const registerBackgroundLocation = async (): Promise<boolean> => {
  try {
    const isAvailable = await TaskManager.isAvailableAsync();
    if (!isAvailable) return false;

    const { status: fgStatus } = await Location.getForegroundPermissionsAsync();
    if (fgStatus !== 'granted') return false;

    const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') return false;

    const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_BACKGROUND_TASK).catch(
      () => false
    );
    if (isStarted) return true;

    await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 15 * 60 * 1000, // 15 minutes minimum interval to respect battery
      distanceInterval: 1000, // 1000 meters movement filter
      deferredUpdatesInterval: 15 * 60 * 1000,
      showsBackgroundLocationIndicator: false,
      pausesUpdatesAutomatically: true,
      foregroundService: {
        notificationTitle: 'SalahFirst Location Synchronization',
        notificationBody: 'Keeping your local prayer times accurate.',
        notificationColor: '#114B36',
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const unregisterBackgroundLocation = async (): Promise<void> => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_BACKGROUND_TASK).catch(
      () => false
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_BACKGROUND_TASK);
    }
  } catch {}
};

