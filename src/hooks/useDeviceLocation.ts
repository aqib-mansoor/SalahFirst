import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { reverseGeocodeCoordinates } from '@/utils/geocoding';

// Global subscriber set to sync location instantaneously across all active screens
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
  };

  const fetchCurrentGps = useCallback(async (isSilentBackground: boolean = false) => {
    try {
      if (!isSilentBackground) {
        setIsLoading(true);
        setErrorMessage(null);
      }

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
      };

      setLocation(freshLocation);
      notifyAll(freshLocation);
      await storage.set(APP_CONFIG.storageKeys.userLocation, freshLocation);
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
    setLocation(newLoc);
    notifyAll(newLoc);
    setNeedsCitySelection(false);
    setPermissionDenied(false);
    setErrorMessage(null);
    await storage.set(APP_CONFIG.storageKeys.userLocation, newLoc);
  }, []);

  useEffect(() => {
    locationListeners.add(setLocation);

    const initializeLocation = async () => {
      // 1. Instantly load cached location from local storage
      const cached = await storage.get<UserLocation | null>(
        APP_CONFIG.storageKeys.userLocation,
        null
      );

      if (cached) {
        globalCurrentLocation = cached;
        setLocation(cached);
        setIsLoading(false);
        // Only refresh GPS in background if user previously chose GPS! Never overwrite manual city!
        if (cached.isGps) {
          fetchCurrentGps(true);
        }
      } else {
        // First run without saved location: request fresh GPS
        fetchCurrentGps(false);
      }
    };

    if (!globalCurrentLocation) {
      initializeLocation();
    } else {
      setLocation(globalCurrentLocation);
      setIsLoading(false);
    }

    return () => {
      locationListeners.delete(setLocation);
    };
  }, [fetchCurrentGps]);

  return {
    location,
    isLoading,
    permissionDenied,
    errorMessage,
    needsCitySelection,
    requestGpsLocation: () => fetchCurrentGps(false),
    openSettings,
    updateLocation,
  };
};
