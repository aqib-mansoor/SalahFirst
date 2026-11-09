import { PrayerCycle, UserLocation, CalculationMethodName, JuristicMethod } from '@/types';
import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import { getRawPrayerTimes, getDefaultMethodForCountry, getDefaultMadhabForCountry } from './prayerTimes';
import { resolveTimezone } from './timezone';

let cachedActiveCycle: PrayerCycle | null = null;

export const calculateFajrBoundaries = (
  latitude: number,
  longitude: number,
  timezone: string,
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi',
  now: Date = new Date()
): { cycleStartUtc: number; nextFajrBoundaryUtc: number } => {
  const nowMs = now.getTime();
  const rawToday = getRawPrayerTimes(latitude, longitude, now, method, juristic, timezone);

  const tomorrowDate = new Date(nowMs + 86400000);
  const rawTomorrow = getRawPrayerTimes(latitude, longitude, tomorrowDate, method, juristic, timezone);

  const yesterdayDate = new Date(nowMs - 86400000);
  const rawYesterday = getRawPrayerTimes(latitude, longitude, yesterdayDate, method, juristic, timezone);

  const todayFajrMs = rawToday.fajr.getTime();
  const tomorrowFajrMs = rawTomorrow.fajr.getTime();
  const yesterdayFajrMs = rawYesterday.fajr.getTime();

  if (nowMs < todayFajrMs) {
    return {
      cycleStartUtc: yesterdayFajrMs,
      nextFajrBoundaryUtc: todayFajrMs,
    };
  }

  return {
    cycleStartUtc: todayFajrMs,
    nextFajrBoundaryUtc: tomorrowFajrMs,
  };
};

export const getActiveCycle = async (): Promise<PrayerCycle | null> => {
  if (cachedActiveCycle) return cachedActiveCycle;
  const stored = await storage.get<PrayerCycle | null>(APP_CONFIG.storageKeys.prayerCycle, null);
  cachedActiveCycle = stored;
  return stored;
};

export const saveActiveCycle = async (cycle: PrayerCycle): Promise<void> => {
  cachedActiveCycle = cycle;
  await storage.set(APP_CONFIG.storageKeys.prayerCycle, cycle);
};

export const reconcilePrayerCycle = async (
  currentLocation: UserLocation | null,
  methodPref?: CalculationMethodName,
  juristicPref?: JuristicMethod
): Promise<{ cycle: PrayerCycle; wasReset: boolean }> => {
  const now = new Date();
  const nowMs = now.getTime();

  const lat = currentLocation?.latitude ?? 24.8607;
  const lng = currentLocation?.longitude ?? 67.0011;
  const country = currentLocation?.country ?? 'Pakistan';
  const tz = currentLocation?.timezone || resolveTimezone(lat, lng, country);
  const method = methodPref || getDefaultMethodForCountry(country);
  const juristic = juristicPref || getDefaultMadhabForCountry(country);

  const existingCycle = await getActiveCycle();

  // 1. Initial Cycle Creation if no cycle has ever been stored
  if (!existingCycle) {
    const boundaries = calculateFajrBoundaries(lat, lng, tz, method, juristic, now);
    const initialCycle: PrayerCycle = {
      cycleId: `cycle_${boundaries.cycleStartUtc}_${boundaries.nextFajrBoundaryUtc}`,
      cycleStartUtc: boundaries.cycleStartUtc,
      nextFajrBoundaryUtc: boundaries.nextFajrBoundaryUtc,
      lastUpdatedUtc: nowMs,
      locationSnapshot: {
        city: currentLocation?.city || 'Default Location',
        country,
        latitude: lat,
        longitude: lng,
        timezone: tz,
        isConfirmed: currentLocation?.isConfirmed ?? false,
        isStale: currentLocation?.isStale ?? true,
      },
    };
    await saveActiveCycle(initialCycle);
    return { cycle: initialCycle, wasReset: true };
  }

  // 2. Expiry Check: Close existing cycle only when the confirmed next-Fajr boundary is reached
  if (nowMs >= existingCycle.nextFajrBoundaryUtc) {
    const boundaries = calculateFajrBoundaries(lat, lng, tz, method, juristic, now);
    const newCycle: PrayerCycle = {
      cycleId: `cycle_${boundaries.cycleStartUtc}_${boundaries.nextFajrBoundaryUtc}`,
      cycleStartUtc: boundaries.cycleStartUtc,
      nextFajrBoundaryUtc: boundaries.nextFajrBoundaryUtc,
      lastUpdatedUtc: nowMs,
      locationSnapshot: {
        city: currentLocation?.city || existingCycle.locationSnapshot.city,
        country,
        latitude: lat,
        longitude: lng,
        timezone: tz,
        isConfirmed: currentLocation?.isConfirmed ?? false,
        isStale: currentLocation?.isStale ?? false,
      },
    };
    await saveActiveCycle(newCycle);
    return { cycle: newCycle, wasReset: true };
  }

  // 3. Location/Timezone Change during active cycle: update pending boundary without wiping completed prayers
  const locSnapshot = existingCycle.locationSnapshot;
  const hasMovedMeaningfully =
    Math.abs(locSnapshot.latitude - lat) > 0.08 ||
    Math.abs(locSnapshot.longitude - lng) > 0.08 ||
    locSnapshot.timezone !== tz;

  if (hasMovedMeaningfully) {
    const rawTomorrow = getRawPrayerTimes(lat, lng, new Date(nowMs + 86400000), method, juristic, tz);
    const rawToday = getRawPrayerTimes(lat, lng, now, method, juristic, tz);

    const destBoundary = nowMs < rawToday.fajr.getTime() ? rawToday.fajr.getTime() : rawTomorrow.fajr.getTime();

    const updatedCycle: PrayerCycle = {
      ...existingCycle,
      nextFajrBoundaryUtc: destBoundary,
      lastUpdatedUtc: nowMs,
      locationSnapshot: {
        city: currentLocation?.city || locSnapshot.city,
        country,
        latitude: lat,
        longitude: lng,
        timezone: tz,
        isConfirmed: currentLocation?.isConfirmed ?? true,
        isStale: currentLocation?.isStale ?? false,
      },
    };
    await saveActiveCycle(updatedCycle);
    return { cycle: updatedCycle, wasReset: false };
  }

  return { cycle: existingCycle, wasReset: false };
};

