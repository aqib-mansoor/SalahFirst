import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { UserLocation } from '@/types';
import { PRESET_CITIES } from '@/data';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

const DEFAULT_LOCATION: UserLocation = {
  city: PRESET_CITIES[0].name,
  country: PRESET_CITIES[0].country,
  latitude: PRESET_CITIES[0].latitude,
  longitude: PRESET_CITIES[0].longitude,
  isGps: false,
};

export const useDeviceLocation = () => {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestGpsLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Location permission was denied. Using manual city.');
        setIsLoading(false);
        return;
      }

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

      const detectedLocation: UserLocation = {
        city,
        country,
        latitude,
        longitude,
        isGps: true,
      };

      setLocation(detectedLocation);
      await storage.set(APP_CONFIG.storageKeys.userPreferences, { location: detectedLocation });
    } catch {
      setErrorMessage('Could not fetch GPS location. Please select manually.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectCity = useCallback(async (city: { name: string; country: string; latitude: number; longitude: number }) => {
    const manualLocation: UserLocation = {
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      isGps: false,
    };
    setLocation(manualLocation);
    setErrorMessage(null);
    await storage.set(APP_CONFIG.storageKeys.userPreferences, { location: manualLocation });
  }, []);

  useEffect(() => {
    requestGpsLocation();
  }, [requestGpsLocation]);

  return {
    location,
    isLoading,
    errorMessage,
    requestGpsLocation,
    selectCity,
  };
};

