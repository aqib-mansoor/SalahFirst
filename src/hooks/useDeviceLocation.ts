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

      // Check if hardware location services are enabled on the device
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

      // In silent background checks, never force a system permission modal
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

      // Fast-path: quickly reverse geocode last known position if available
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown && !globalCurrentLocation) {
          const rev = await reverseGeocodeCoordinates(lastKnown.coords.latitude, lastKnown.coords.longitude);
          const quickLoc: UserLocation = {
            city: rev.city,
            region: rev.region,
            country: rev.country,
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
            timezone: rev.timezone,
            isGps: true,
          };
          setLocation(quickLoc);
          notifyAll(quickLoc);
        }
      } catch {}

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
        // Only refresh GPS silently in background if previously enabled and services are active
        if (cached.isGps) {
          fetchCurrentGps(true);
        }
      } else {
        // First run without saved location: run silently without blocking popup
        fetchCurrentGps(true);
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
