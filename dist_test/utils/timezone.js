"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendarDateForCalculation = exports.formatTimeInTimezone = exports.getLocalDateComponents = exports.resolveTimezone = void 0;
const tz_lookup_1 = __importDefault(require("tz-lookup"));
// In-memory cache to guarantee zero overhead on repeated lookups
const timezoneCache = new Map();
// Country to primary IANA Timezone fallback (used only if coordinate lookup fails)
const COUNTRY_TIMEZONE_MAP = {
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
const resolveTimezone = (latitude, longitude, country) => {
    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error(`Invalid geographical coordinates: (${latitude}, ${longitude})`);
    }
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (timezoneCache.has(cacheKey)) {
        return timezoneCache.get(cacheKey);
    }
    // 1. Primary Offline Boundary Lookup via tz-lookup (covers irregular borders, non-DST states, half-hour zones)
    try {
        const tz = (0, tz_lookup_1.default)(latitude, longitude);
        if (tz && typeof tz === 'string') {
            timezoneCache.set(cacheKey, tz);
            return tz;
        }
    }
    catch { }
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
exports.resolveTimezone = resolveTimezone;
const getLocalDateComponents = (date = new Date(), timezone) => {
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
            if (p.type === 'year')
                year = parseInt(p.value, 10);
            if (p.type === 'month')
                month = parseInt(p.value, 10) - 1;
            if (p.type === 'day')
                day = parseInt(p.value, 10);
            if (p.type === 'hour')
                hour = parseInt(p.value, 10);
            if (p.type === 'minute')
                minute = parseInt(p.value, 10);
        }
        const mm = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
        const dd = day < 10 ? `0${day}` : `${day}`;
        return { year, month, day, dateKey: `${year}-${mm}-${dd}`, hour, minute };
    }
    catch {
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
exports.getLocalDateComponents = getLocalDateComponents;
const formatTimeInTimezone = (date, timezone) => {
    if (!date || isNaN(date.getTime()))
        return '--:--';
    if (!timezone) {
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
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
    }
    catch {
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
};
exports.formatTimeInTimezone = formatTimeInTimezone;
const createCalendarDateForCalculation = (instant, timezone) => {
    if (!timezone)
        return instant;
    const { year, month, day } = (0, exports.getLocalDateComponents)(instant, timezone);
    return new Date(year, month, day, 12, 0, 0);
};
exports.createCalendarDateForCalculation = createCalendarDateForCalculation;
