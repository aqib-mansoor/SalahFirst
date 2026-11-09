import { useState, useEffect, useCallback } from 'react';
import { Linking, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { reverseGeocodeCoordinates } from '@/utils/geocoding';
import { reconcilePrayerCycle } from '@/utils/prayerCycleManager';
import { registerBackgroundLocation } from '@/services/backgroundLocationTask';

const locationListeners = new Set<(loc: UserLocation) => void>();
let globalCurrentLocation: UserLocation | null = null;

export const useDeviceLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(globalCurrentLocation);
  const [isLoading, setIsLoading] = useState<boolean>(!globalCurrentLocation);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsCitySelection, setNeedsCitySelection] = useState<boolean>(false);

  const notifyAll = (newLoc: UserLocation) => {
    globalCurrentLocation = newLoc;
    locationListeners.forEach((listener) => listener(newLoc));
    reconcilePrayerCycle(newLoc).catch(() => {});
  };

  const fetchCurrentGps = useCallback(async (isSilentBackground: boolean = false) => {
    try {
      if (!isSilentBackground) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync().catch(() => false);
      if (!servicesEnabled) {
        if (!isSilentBackground) {
          setErrorMessage('Location services are disabled on your device.');
        }
        if (!globalCurrentLocation) {
          setNeedsCitySelection(true);
        }
        setIsLoading(false);
        return;
      }

      if (isSilentBackground) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsLoading(false);
          return;
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionDenied(true);
          if (!globalCurrentLocation) {
            setNeedsCitySelection(true);
          }
          setErrorMessage('Location permission required. Please enable in Settings or select a city manually.');
          setIsLoading(false);
          return;
        }
      }

      setPermissionDenied(false);
      setNeedsCitySelection(false);

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      const rev = await reverseGeocodeCoordinates(latitude, longitude);

      const freshLocation: UserLocation = {
        city: rev.city,
        region: rev.region,
        country: rev.country,
        latitude,
        longitude,
        timezone: rev.timezone,
        isGps: true,
        isConfirmed: true,
        isStale: false,
        lastUpdated: Date.now(),
        source: 'gps',
      };

      setLocation(freshLocation);
      notifyAll(freshLocation);
      await storage.set(APP_CONFIG.storageKeys.userLocation, freshLocation);
      registerBackgroundLocation().catch(() => {});
    } catch {
      if (!isSilentBackground) {
        setErrorMessage('Unable to lock GPS. Please select your city manually.');
        if (!globalCurrentLocation) {
          setNeedsCitySelection(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const updateLocation = useCallback(async (newLoc: UserLocation) => {
    const confirmed: UserLocation = {
      ...newLoc,
      isConfirmed: true,
      isStale: false,
      lastUpdated: Date.now(),
      source: newLoc.isGps ? 'gps' : 'manual',
    };
    setLocation(confirmed);
    notifyAll(confirmed);
    setNeedsCitySelection(false);
    setPermissionDenied(false);
    setErrorMessage(null);
    await storage.set(APP_CONFIG.storageKeys.userLocation, confirmed);
  }, []);

  useEffect(() => {
    locationListeners.add(setLocation);

    const initializeLocation = async () => {
      const cached = await storage.get<UserLocation | null>(
        APP_CONFIG.storageKeys.userLocation,
        null
      );

      if (cached) {
        const isStale = cached.lastUpdated ? Date.now() - cached.lastUpdated > 4 * 3600 * 1000 : false;
        const primed = { ...cached, isStale };
        globalCurrentLocation = primed;
        setLocation(primed);
        setIsLoading(false);
        if (cached.isGps) {
          fetchCurrentGps(true);
        }
      } else {
        fetchCurrentGps(true);
      }
    };

    if (!globalCurrentLocation) {
      initializeLocation();
    } else {
      setLocation(globalCurrentLocation);
      setIsLoading(false);
    }

    // AppState listener to synchronize location when returning to active foreground
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && globalCurrentLocation?.isGps) {
        fetchCurrentGps(true);
      }
    });

    return () => {
      locationListeners.delete(setLocation);
      sub.remove();
    };
  }, [fetchCurrentGps]);

  return {
    location,
    isLoading,
    permissionDenied,
    errorMessage,
    needsCitySelection,
    isStale: location?.isStale ?? false,
    isConfirmed: location?.isConfirmed ?? false,
    requestGpsLocation: () => fetchCurrentGps(false),
    openSettings,
    updateLocation,
  };
};
