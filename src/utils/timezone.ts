/**
 * Production-ready Offline Timezone Resolver & Formatting Utilities
 * Resolves IANA timezones by coordinates and country, and formats prayer times in local timezone.
 */

export interface LocalDateComponents {
  year: number;
  month: number; // 0-indexed
  day: number;
  dateKey: string; // YYYY-MM-DD
}

// Country to primary IANA Timezone mapping
const COUNTRY_TIMEZONE_MAP: Record<string, string> = {
  pakistan: 'Asia/Karachi',
  'saudi arabia': 'Asia/Riyadh',
  'united arab emirates': 'Asia/Dubai',
  uae: 'Asia/Dubai',
  qatar: 'Asia/Qatar',
  kuwait: 'Asia/Kuwait',
  bahrain: 'Asia/Bahrain',
  oman: 'Asia/Muscat',
  turkey: 'Europe/Istanbul',
  türkiye: 'Europe/Istanbul',
  egypt: 'Africa/Cairo',
  'united kingdom': 'Europe/London',
  uk: 'Europe/London',
  england: 'Europe/London',
  scotland: 'Europe/London',
  france: 'Europe/Paris',
  germany: 'Europe/Berlin',
  sweden: 'Europe/Stockholm',
  norway: 'Europe/Oslo',
  japan: 'Asia/Tokyo',
  india: 'Asia/Kolkata',
  bangladesh: 'Asia/Dhaka',
  singapore: 'Asia/Singapore',
  malaysia: 'Asia/Kuala_Lumpur',
  indonesia: 'Asia/Jakarta',
  jordan: 'Asia/Amman',
  palestine: 'Asia/Gaza',
  lebanon: 'Asia/Beirut',
  iraq: 'Asia/Baghdad',
  iran: 'Asia/Tehran',
  morocco: 'Africa/Casablanca',
  algeria: 'Africa/Algiers',
  tunisia: 'Africa/Tunis',
  libya: 'Africa/Tripoli',
  sudan: 'Africa/Khartoum',
  nigeria: 'Africa/Lagos',
  somalia: 'Africa/Mogadishu',
  kenya: 'Africa/Nairobi',
  southafrica: 'Africa/Johannesburg',
  'south africa': 'Africa/Johannesburg',
};

export const resolveTimezone = (
  latitude: number,
  longitude: number,
  country?: string
): string => {
  const c = (country || '').toLowerCase().trim();

  // 1. Multi-timezone countries resolved by longitude ranges
  if (c.includes('united states') || c === 'usa' || c === 'us') {
    if (latitude > 50 && longitude < -130) return 'America/Anchorage';
    if (latitude < 25 && longitude < -150) return 'Pacific/Honolulu';
    if (longitude < -114) return 'America/Los_Angeles';
    if (longitude < -102) return 'America/Denver';
    if (longitude < -85.5) return 'America/Chicago';
    return 'America/New_York';
  }

  if (c.includes('canada') || c === 'ca') {
    if (longitude < -114) return 'America/Vancouver';
    if (longitude < -102) return 'America/Edmonton';
    if (longitude < -85) return 'America/Winnipeg';
    if (longitude < -68) return 'America/Toronto';
    return 'America/Halifax';
  }

  if (c.includes('australia') || c === 'au') {
    if (longitude < 129) return 'Australia/Perth';
    if (longitude < 141) return 'Australia/Adelaide';
    return 'Australia/Sydney';
  }

  if (c.includes('indonesia') || c === 'id') {
    if (longitude < 110) return 'Asia/Jakarta';
    if (longitude < 125) return 'Asia/Makassar';
    return 'Asia/Jayapura';
  }

  // 2. Direct Country Lookup
  for (const [key, tz] of Object.entries(COUNTRY_TIMEZONE_MAP)) {
    if (c.includes(key)) return tz;
  }

  // 3. Fallback: Longitude-based GMT offset band
  const offsetHours = Math.round(longitude / 15);
  const sign = offsetHours >= 0 ? '+' : '-';
  const abs = Math.abs(offsetHours);
  const pad = abs < 10 ? `0${abs}` : `${abs}`;
  return `Etc/GMT${sign === '+' ? '-' : '+'}${pad}`; // POSIX invert
};

export const getLocalDateComponents = (
  date: Date = new Date(),
  timezone: string = 'UTC'
): LocalDateComponents => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    for (const p of parts) {
      if (p.type === 'year') year = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10) - 1;
      if (p.type === 'day') day = parseInt(p.value, 10);
    }
    const mm = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return { year, month, day, dateKey: `${year}-${mm}-${dd}` };
  } catch {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const mm = m + 1 < 10 ? `0${m + 1}` : `${m + 1}`;
    const dd = d < 10 ? `0${d}` : `${d}`;
    return { year: y, month: m, day: d, dateKey: `${y}-${mm}-${dd}` };
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
