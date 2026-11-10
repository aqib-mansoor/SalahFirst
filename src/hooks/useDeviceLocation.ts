import { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { reverseGeocodeCoordinates } from '@/utils/geocoding';
import { reconcilePrayerCycle } from '@/utils/prayerCycleManager';
import { unregisterBackgroundLocation } from '@/services/backgroundLocationTask';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserLocation } from '@/store/slices/preferencesSlice';
import { setActiveCycle } from '@/store/slices/prayerSlice';

export const initDeviceLocationCache = async (): Promise<UserLocation | null> => {
  unregisterBackgroundLocation().catch(() => {});
  return storage.get<UserLocation | null>(APP_CONFIG.storageKeys.userLocation, null);
};

export const useDeviceLocation = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.preferences.userLocation);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsCitySelection, setNeedsCitySelection] = useState<boolean>(false);

  const commitLocation = useCallback(
    (newLoc: UserLocation) => {
      dispatch(setUserLocation(newLoc));
      reconcilePrayerCycle(newLoc)
        .then(({ cycle }) => dispatch(setActiveCycle(cycle)))
        .catch(() => {});
    },
    [dispatch]
  );

  const fetchCurrentGps = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const servicesEnabled = await Location.hasServicesEnabledAsync().catch(() => false);
      if (!servicesEnabled) {
        setErrorMessage('Location services are disabled on your device.');
        if (!location) setNeedsCitySelection(true);
        setIsLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        if (!location) setNeedsCitySelection(true);
        setErrorMessage('Location permission required. Please enable in Settings or select a city manually.');
        setIsLoading(false);
        return;
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

      commitLocation(freshLocation);
    } catch {
      setErrorMessage('Unable to lock GPS. Please select your city manually.');
      if (!location) setNeedsCitySelection(true);
    } finally {
      setIsLoading(false);
    }
  }, [location, commitLocation]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const updateLocation = useCallback(
    async (newLoc: UserLocation) => {
      const confirmed: UserLocation = {
        ...newLoc,
        isConfirmed: true,
        isStale: false,
        lastUpdated: Date.now(),
        source: newLoc.isGps ? 'gps' : 'manual',
      };
      commitLocation(confirmed);
      setNeedsCitySelection(false);
      setPermissionDenied(false);
      setErrorMessage(null);
    },
    [commitLocation]
  );

  return {
    location,
    isLoading,
    permissionDenied,
    errorMessage,
    needsCitySelection,
    isStale: location?.isStale ?? false,
    isConfirmed: location?.isConfirmed ?? false,
    requestGpsLocation: () => fetchCurrentGps(),
    openSettings,
    updateLocation,
  };
};
