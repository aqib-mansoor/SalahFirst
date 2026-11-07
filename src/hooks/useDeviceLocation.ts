import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

const FALLBACK_LOCATION: UserLocation = {
  city: 'Detecting Location...',
  country: 'Pakistan',
  latitude: 33.6844,
  longitude: 73.0479,
  isGps: false,
};

export const useDeviceLocation = () => {
  const [location, setLocation] = useState<UserLocation>(FALLBACK_LOCATION);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCurrentGps = useCallback(async (isSilentBackground: boolean = false) => {
    try {
      if (!isSilentBackground) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setErrorMessage('Location permission required for accurate prayer times.');
        setIsLoading(false);
        return;
      }

      setPermissionDenied(false);

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      const reverseList = await Location.reverseGeocodeAsync({ latitude, longitude });

      let city = 'Current City';
      let country = 'Current Country';

      if (reverseList.length > 0) {
        const place = reverseList[0];
        city = place.city || place.subregion || place.district || place.name || 'Current City';
        country = place.country || place.region || 'Current Country';
      }

      const freshLocation: UserLocation = {
        city,
        country,
        latitude,
        longitude,
        isGps: true,
      };

      setLocation(freshLocation);
      await storage.set(APP_CONFIG.storageKeys.userLocation, freshLocation);
    } catch {
      if (!isSilentBackground) {
        setErrorMessage('Unable to lock GPS. Please check location settings.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const updateLocation = useCallback(async (newLoc: UserLocation) => {
    setLocation(newLoc);
    await storage.set(APP_CONFIG.storageKeys.userLocation, newLoc);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      // 1. Instantly load cached location from local storage (0ms delay)
      const cached = await storage.get<UserLocation | null>(
        APP_CONFIG.storageKeys.userLocation,
        null
      );

      if (cached && isMounted) {
        setLocation(cached);
        setIsLoading(false);
        // 2. Silently verify/refresh GPS in background in case user moved
        fetchCurrentGps(true);
      } else if (isMounted) {
        // First run: request fresh GPS
        fetchCurrentGps(false);
      }
    };

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, [fetchCurrentGps]);

  return {
    location,
    isLoading,
    permissionDenied,
    errorMessage,
    requestGpsLocation: () => fetchCurrentGps(false),
    openSettings,
    updateLocation,
  };
};
