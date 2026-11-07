import * as Location from 'expo-location';
import { PRESET_CITIES, PresetCity } from '@/data';
import { calculateQiblaBearing } from '@/utils/qiblaCalculations';
import { getDefaultMethodForCountry } from '@/utils/prayerTimes';

export interface GeocodeSearchResult {
  cities: PresetCity[];
  isOffline: boolean;
  attribution?: string;
  error?: string;
}

export interface ReverseGeocodeResult {
  city: string;
  region: string;
  country: string;
  timezone: string;
}

// In-memory query cache to avoid repeated requests and respect rate limits
const searchCache = new Map<string, PresetCity[]>();
let lastRequestTime = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const filterPresetCities = (query: string): PresetCity[] => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return PRESET_CITIES;
  return PRESET_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(trimmed) ||
      c.country.toLowerCase().includes(trimmed) ||
      (c.region && c.region.toLowerCase().includes(trimmed))
  );
};

export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  let city = 'Current City';
  let region = '';
  let country = 'Current Country';

  try {
    const list = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (list && list.length > 0) {
      const p = list[0];
      city = p.city || p.subregion || p.district || p.name || 'Current City';
      region = p.region || p.subregion || '';
      country = p.country || 'Current Country';
      return { city, region, country, timezone: defaultTz };
    }
  } catch {}

  // Fallback to Nominatim reverse if native reverse geocoding is unavailable
  try {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < 1000) await delay(1000 - elapsed);
    lastRequestTime = Date.now();

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SalahFirst-App/1.0 (https://salahfirst.app)' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      city = addr.city || addr.town || addr.village || addr.county || city;
      region = addr.state || region;
      country = addr.country || country;
    }
  } catch {}

  return { city, region, country, timezone: defaultTz };
};

export const searchWorldwideCity = async (
  query: string
): Promise<GeocodeSearchResult> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { cities: [], isOffline: false };
  }

  const cacheKey = trimmed.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return {
      cities: searchCache.get(cacheKey)!,
      isOffline: false,
      attribution: 'Cached results',
    };
  }

  // Enforce 1000ms rate limit to respect Nominatim & system policies
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000) {
    await delay(1000 - elapsed);
  }
  lastRequestTime = Date.now();

  const uniqueCities: PresetCity[] = [];
  const seenCoordinates = new Set<string>();

  // 1. Try native device geocoder
  try {
    const geoResults = await Location.geocodeAsync(trimmed);
    if (geoResults && geoResults.length > 0) {
      for (let i = 0; i < Math.min(geoResults.length, 5); i++) {
        const { latitude, longitude } = geoResults[i];
        const coordKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
        if (seenCoordinates.has(coordKey)) continue;
        seenCoordinates.add(coordKey);

        const rev = await reverseGeocodeCoordinates(latitude, longitude);

        uniqueCities.push({
          id: `geo-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
          name: rev.city || trimmed,
          region: rev.region,
          country: rev.country,
          latitude,
          longitude,
          qiblaDegrees: calculateQiblaBearing(latitude, longitude),
          methodName: getDefaultMethodForCountry(rev.country),
        });
      }
    }
  } catch {}

  // 2. If native geocoding returned no matches, query Nominatim
  if (uniqueCities.length === 0) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&limit=5&addressdetails=1`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'SalahFirst-App/1.0 (https://salahfirst.app)' },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            const latitude = parseFloat(item.lat);
            const longitude = parseFloat(item.lon);
            const coordKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
            if (seenCoordinates.has(coordKey)) continue;
            seenCoordinates.add(coordKey);

            const addr = item.address || {};
            const cityName =
              addr.city || addr.town || addr.village || addr.municipality || item.name || trimmed;
            const countryName = addr.country || 'Worldwide';
            const regionName = addr.state || addr.province || '';

            uniqueCities.push({
              id: `osm-${item.osm_id || Math.random().toString(36).substring(7)}`,
              name: cityName,
              region: regionName,
              country: countryName,
              latitude,
              longitude,
              qiblaDegrees: calculateQiblaBearing(latitude, longitude),
              methodName: getDefaultMethodForCountry(countryName),
            });
          }
        }
      }
    } catch {
      // Offline fallback: filter preset cities
      const offlineMatches = filterPresetCities(trimmed);
      return {
        cities: offlineMatches,
        isOffline: true,
        error: 'Network unavailable for online search. Showing verified offline cities.',
      };
    }
  }

  if (uniqueCities.length > 0) {
    if (searchCache.size > 100) searchCache.clear();
    searchCache.set(cacheKey, uniqueCities);
  }

  return {
    cities: uniqueCities,
    isOffline: false,
    attribution: 'Data © OpenStreetMap contributors & device geocoder',
  };
};
