import * as Location from 'expo-location';
import { PRESET_CITIES, PresetCity } from '@/data';
import { calculateQiblaBearing } from '@/utils/qiblaCalculations';
import { getDefaultMethodForCountry } from '@/utils/prayerTimes';

export interface GeocodeSearchResult {
  cities: PresetCity[];
  isOffline: boolean;
  error?: string;
}

export const filterPresetCities = (query: string): PresetCity[] => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return PRESET_CITIES;
  return PRESET_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(trimmed) ||
      c.country.toLowerCase().includes(trimmed)
  );
};

export const searchWorldwideCity = async (
  query: string
): Promise<GeocodeSearchResult> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { cities: [], isOffline: false };
  }

  try {
    const geoResults = await Location.geocodeAsync(trimmed);
    if (!geoResults || geoResults.length === 0) {
      return { cities: [], isOffline: false };
    }

    const uniqueCities: PresetCity[] = [];
    const seenCoordinates = new Set<string>();

    for (let i = 0; i < Math.min(geoResults.length, 5); i++) {
      const { latitude, longitude } = geoResults[i];
      const coordKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
      if (seenCoordinates.has(coordKey)) continue;
      seenCoordinates.add(coordKey);

      let cityName = trimmed;
      let countryName = 'Worldwide';

      try {
        const rev = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (rev && rev.length > 0) {
          const place = rev[0];
          cityName = place.city || place.name || place.subregion || trimmed;
          countryName = place.country || countryName;
        }
      } catch {
        // Fallback to query name if reverse geocoding is rate-limited
      }

      uniqueCities.push({
        id: `geo-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
        name: cityName,
        country: countryName,
        latitude,
        longitude,
        qiblaDegrees: calculateQiblaBearing(latitude, longitude),
        methodName: getDefaultMethodForCountry(countryName),
      });
    }

    return { cities: uniqueCities, isOffline: false };
  } catch {
    return { cities: [], isOffline: true, error: 'Network unavailable for online search' };
  }
};
