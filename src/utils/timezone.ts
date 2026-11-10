import tzLookup from 'tz-lookup';
import { COUNTRY_TIMEZONE_MAP } from '@/data/countryTimezones';

/**
 * Production-ready Offline Timezone Resolver & Formatting Utilities
 * Resolves accurate IANA timezones using a local boundary quadtree lookup with in-memory caching.
 */

export interface LocalDateComponents {
  year: number;
  month: number; // 0-indexed
  day: number;
  dateKey: string; // YYYY-MM-DD
  hour: number;
  minute: number;
}

// In-memory cache to guarantee zero overhead on repeated lookups
const timezoneCache = new Map<string, string>();

export const resolveTimezone = (
  latitude: number,
  longitude: number,
  country?: string
): string => {
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(`Invalid geographical coordinates: (${latitude}, ${longitude})`);
  }

  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  if (timezoneCache.has(cacheKey)) {
    return timezoneCache.get(cacheKey)!;
  }

  // 1. Primary Offline Boundary Lookup via tz-lookup (covers irregular borders, non-DST states, half-hour zones)
  try {
    const tz = tzLookup(latitude, longitude);
    if (tz && typeof tz === 'string') {
      timezoneCache.set(cacheKey, tz);
      return tz;
    }
  } catch {}

  // 2. Secondary Fallback: Country Mapping
  const c = (country || '').toLowerCase().trim();
  for (const [key, tz] of Object.entries(COUNTRY_TIMEZONE_MAP)) {
    if (c.includes(key)) {
      timezoneCache.set(cacheKey, tz);
      return tz;
    }
  }

  // 3. Coordinate validation check before falling back to POSIX GMT band
  if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
    const offsetHours = Math.round(longitude / 15);
    const sign = offsetHours >= 0 ? '+' : '-';
    const abs = Math.abs(offsetHours);
    const pad = abs < 10 ? `0${abs}` : `${abs}`;
    const gmtTz = `Etc/GMT${sign === '+' ? '-' : '+'}${pad}`;
    timezoneCache.set(cacheKey, gmtTz);
    return gmtTz;
  }

  throw new Error(`Unable to determine IANA timezone for coordinates (${latitude}, ${longitude})`);
};

export const getLocalDateComponents = (
  date: Date = new Date(),
  timezone?: string
): LocalDateComponents => {
  const resolvedTz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: resolvedTz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    let hour = date.getUTCHours();
    let minute = date.getUTCMinutes();
    for (const p of parts) {
      if (p.type === 'year') year = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10) - 1;
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }
    const mm = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return { year, month, day, dateKey: `${year}-${mm}-${dd}`, hour, minute };
  } catch {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const min = date.getMinutes();
    const mm = m + 1 < 10 ? `0${m + 1}` : `${m + 1}`;
    const dd = d < 10 ? `0${d}` : `${d}`;
    return { year: y, month: m, day: d, dateKey: `${y}-${mm}-${dd}`, hour: h, minute: min };
  }
};

export const formatTimeInTimezone = (
  date: Date,
  timezone?: string
): string => {
  if (!date || isNaN(date.getTime())) return '--:--';
  if (!timezone) {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
};

export const createCalendarDateForCalculation = (
  instant: Date,
  timezone?: string
): Date => {
  if (!timezone) return instant;
  const { year, month, day } = getLocalDateComponents(instant, timezone);
  return new Date(year, month, day, 12, 0, 0);
};

export const localTimeToUtcEpoch = (
  year: number,
  month: number, // 0-indexed
  day: number,
  hour: number,
  minute: number,
  second: number = 0,
  timezone?: string
): number => {
  const targetTz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const utcGuess = Date.UTC(year, month, day, hour, minute, second);
  const comp1 = getLocalDateComponents(new Date(utcGuess), targetTz);
  const offset1 = Date.UTC(comp1.year, comp1.month, comp1.day, comp1.hour, comp1.minute) - utcGuess;
  const epochEstimate = utcGuess - offset1;

  const comp2 = getLocalDateComponents(new Date(epochEstimate), targetTz);
  const offset2 = Date.UTC(comp2.year, comp2.month, comp2.day, comp2.hour, comp2.minute) - epochEstimate;
  return utcGuess - offset2;
};

export interface LocationTimeDiff {
  destinationTime: string;
  destinationDate: string;
  differenceMinutes: number;
  differenceText: string;
  dayRelation: 'same' | 'yesterday' | 'tomorrow';
  destDateKey: string;
  currentDateKey: string;
}

export const calculateLocationTimeDiff = (
  destinationTimezone: string,
  currentTimezone?: string
): LocationTimeDiff => {
  const currentTz = currentTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const now = new Date();

  const destComp = getLocalDateComponents(now, destinationTimezone);
  const currentComp = getLocalDateComponents(now, currentTz);

  const destUtcEpoch = Date.UTC(destComp.year, destComp.month, destComp.day, destComp.hour, destComp.minute);
  const currentUtcEpoch = Date.UTC(currentComp.year, currentComp.month, currentComp.day, currentComp.hour, currentComp.minute);

  const diffMinutes = Math.round((destUtcEpoch - currentUtcEpoch) / 60000);

  let dayRelation: 'same' | 'yesterday' | 'tomorrow' = 'same';
  if (destComp.dateKey < currentComp.dateKey) {
    dayRelation = 'yesterday';
  } else if (destComp.dateKey > currentComp.dateKey) {
    dayRelation = 'tomorrow';
  }

  let differenceText = 'Same time zone as phone';
  if (diffMinutes !== 0) {
    const isBehind = diffMinutes < 0;
    const absMins = Math.abs(diffMinutes);
    const hrs = Math.floor(absMins / 60);
    const mins = absMins % 60;
    const timeStr = mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    differenceText = isBehind ? `${timeStr} behind phone time` : `${timeStr} ahead of phone time`;
  }

  const destHour12 = destComp.hour % 12 || 12;
  const destAmPm = destComp.hour >= 12 ? 'PM' : 'AM';
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const destinationTime = `${pad(destHour12)}:${pad(destComp.minute)} ${destAmPm}`;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const destDateObj = new Date(destComp.year, destComp.month, destComp.day);
  const dayName = dayNames[destDateObj.getDay()];
  const monthName = monthNames[destComp.month];
  const destinationDate = `${dayName}, ${destComp.day} ${monthName}`;

  return {
    destinationTime,
    destinationDate,
    differenceMinutes: diffMinutes,
    differenceText,
    dayRelation,
    destDateKey: destComp.dateKey,
    currentDateKey: currentComp.dateKey,
  };
};
