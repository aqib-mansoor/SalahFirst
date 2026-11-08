import { Coordinates, Madhab } from 'adhan';
import type {
  CalculationMethodName,
  JuristicMethod,
  CurrentPrayerPeriod,
  PrayerPeriodId,
  PrayerPeriodCategory,
} from '@/types';
import { formatTimeInTimezone, createCalendarDateForCalculation } from './timezone';
import { getMethodParams, createRobustPrayerTimes } from './prayerCalculationBase';

export interface RawPrayerTimesSet {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface DetectPeriodParams {
  latitude?: number | null;
  longitude?: number | null;
  date?: Date;
  method?: CalculationMethodName;
  juristic?: JuristicMethod;
  timezone?: string;
  rawToday?: RawPrayerTimesSet;
  rawTomorrow?: RawPrayerTimesSet;
  rawYesterday?: RawPrayerTimesSet;
}

/**
 * Classical Islamic Timing Boundaries:
 * 1. Sunrise prohibited interval (Tulu'): 15 mins post-sunrise (sun ascends 1 spear-length).
 * 2. Ishraq window: 30 mins after prohibition lifts (sunrise + 15m to sunrise + 45m).
 * 3. Zawal prohibited interval (Istiwa'): 15 mins prior to solar noon / Dhuhr adhan.
 * References: Sahih Muslim 831, Jami` at-Tirmidhi 586, Sahih al-Bukhari 1145.
 */
export const SUNRISE_PROHIBITED_MARGIN_MS = 15 * 60 * 1000;
export const ISHRAQ_DURATION_MS = 30 * 60 * 1000;
export const ZAWAL_PROHIBITED_MARGIN_MS = 15 * 60 * 1000;

export const calculateNightBoundaries = (maghribDate: Date, fajrDate: Date) => {
  const startMs = maghribDate.getTime();
  const endMs = fajrDate.getTime();
  const durationMs = Math.max(0, endMs - startMs);
  return {
    nightStart: maghribDate,
    nightEnd: fajrDate,
    islamicMidnight: new Date(startMs + Math.round(durationMs * 0.5)),
    lastThirdStart: new Date(startMs + Math.round(durationMs * (2 / 3))),
    durationMs,
  };
};

export interface DailyNaflSchedule {
  tahajjudRange: string;
  lastThirdRange: string;
  ishraqRange: string;
  duhaRange: string;
  zawalRange: string;
}

export const calculateDailyNaflSchedule = (
  raw: RawPrayerTimesSet,
  tomorrowFajr?: Date,
  timezone?: string
): DailyNaflSchedule => {
  const sunriseMs = raw.sunrise.getTime();
  const ishraqStart = new Date(sunriseMs + SUNRISE_PROHIBITED_MARGIN_MS);
  const ishraqEnd = new Date(sunriseMs + SUNRISE_PROHIBITED_MARGIN_MS + ISHRAQ_DURATION_MS);
  const zawalStart = new Date(raw.dhuhr.getTime() - ZAWAL_PROHIBITED_MARGIN_MS);

  const nextFajr = tomorrowFajr || new Date(raw.fajr.getTime() + 86400000);
  const night = calculateNightBoundaries(raw.maghrib, nextFajr);

  return {
    tahajjudRange: `${formatTimeInTimezone(raw.isha, timezone)} – ${formatTimeInTimezone(nextFajr, timezone)}`,
    lastThirdRange: `${formatTimeInTimezone(night.lastThirdStart, timezone)} – ${formatTimeInTimezone(nextFajr, timezone)}`,
    ishraqRange: `${formatTimeInTimezone(ishraqStart, timezone)} – ${formatTimeInTimezone(ishraqEnd, timezone)}`,
    duhaRange: `${formatTimeInTimezone(ishraqEnd, timezone)} – ${formatTimeInTimezone(zawalStart, timezone)}`,
    zawalRange: `${formatTimeInTimezone(zawalStart, timezone)} – ${formatTimeInTimezone(raw.dhuhr, timezone)}`,
  };
};

export const createFallbackPeriod = (instant: Date = new Date(), timezone?: string): CurrentPrayerPeriod => ({
  id: 'fajr',
  nameKey: 'selectCity',
  category: 'informational',
  startTime: instant,
  endTime: new Date(instant.getTime() + 3600000),
  startTimeFormatted: '--:--',
  endTimeFormatted: '--:--',
  descriptionKey: 'detectingLocation',
  isCalculatedWindow: false,
  isObligatory: false,
  isProhibited: false,
  isNafl: false,
  nextPeriod: { id: 'fajr', nameKey: 'fajr', startTime: instant, timeFormatted: '--:--' },
});

export const getCurrentPrayerPeriod = (params: DetectPeriodParams): CurrentPrayerPeriod => {
  const { latitude, longitude, date = new Date(), method = 'Karachi', juristic = 'Hanafi', timezone } = params;

  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    return createFallbackPeriod(date, timezone);
  }

  let today = params.rawToday;
  let tomorrow = params.rawTomorrow;
  let yesterday = params.rawYesterday;

  if (!today || !tomorrow || !yesterday) {
    const coords = new Coordinates(latitude, longitude);
    const mParams = getMethodParams(method);
    mParams.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
    const targetDate = createCalendarDateForCalculation(date, timezone);
    today = today || createRobustPrayerTimes(coords, targetDate, mParams);
    const tmrw = new Date(targetDate);
    tmrw.setDate(tmrw.getDate() + 1);
    tomorrow = tomorrow || createRobustPrayerTimes(coords, tmrw, mParams);
    const ystd = new Date(targetDate);
    ystd.setDate(ystd.getDate() - 1);
    yesterday = yesterday || createRobustPrayerTimes(coords, ystd, mParams);
  }

  const nowMs = date.getTime();
  const fajrMs = today.fajr.getTime();
  const sunriseMs = today.sunrise.getTime();
  const ishraqStartMs = sunriseMs + SUNRISE_PROHIBITED_MARGIN_MS;
  const duhaStartMs = ishraqStartMs + ISHRAQ_DURATION_MS;
  const zawalStartMs = today.dhuhr.getTime() - ZAWAL_PROHIBITED_MARGIN_MS;
  const dhuhrMs = today.dhuhr.getTime();
  const asrMs = today.asr.getTime();
  const maghribMs = today.maghrib.getTime();
  const ishaMs = today.isha.getTime();

  const makePeriod = (
    id: PrayerPeriodId,
    nameKey: string,
    cat: PrayerPeriodCategory,
    start: Date,
    end: Date,
    descKey: string,
    nextId: PrayerPeriodId,
    nextNameKey: string,
    nextStart: Date,
    fard?: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'
  ): CurrentPrayerPeriod => ({
    id,
    nameKey,
    category: cat,
    startTime: start,
    endTime: end,
    startTimeFormatted: formatTimeInTimezone(start, timezone),
    endTimeFormatted: formatTimeInTimezone(end, timezone),
    descriptionKey: descKey,
    isCalculatedWindow: true,
    isObligatory: cat === 'obligatory',
    isProhibited: cat === 'prohibited',
    isNafl: cat === 'nafl',
    nextPeriod: {
      id: nextId,
      nameKey: nextNameKey,
      startTime: nextStart,
      timeFormatted: formatTimeInTimezone(nextStart, timezone),
    },
    obligatorySalahName: fard,
  });

  if (nowMs < fajrMs) {
    const night = calculateNightBoundaries(yesterday.maghrib, today.fajr);
    if (nowMs >= night.lastThirdStart.getTime()) {
      return makePeriod('tahajjud_last_third', 'periodTahajjud', 'nafl', night.lastThirdStart, today.fajr, 'periodTahajjudLastThirdSubtitle', 'fajr', 'fajr', today.fajr);
    }
    if (nowMs >= night.islamicMidnight.getTime()) {
      return makePeriod('tahajjud', 'periodTahajjud', 'nafl', night.islamicMidnight, night.lastThirdStart, 'periodTahajjudSubtitle', 'tahajjud_last_third', 'periodTahajjud', night.lastThirdStart);
    }
    return makePeriod('isha', 'isha', 'obligatory', yesterday.isha, night.islamicMidnight, 'periodIshaSubtitle', 'tahajjud', 'periodTahajjud', night.islamicMidnight, 'Isha');
  }

  if (nowMs < sunriseMs) {
    return makePeriod('fajr', 'fajr', 'obligatory', today.fajr, today.sunrise, 'periodFajrSubtitle', 'sunrise_prohibited', 'periodSunrise', today.sunrise, 'Fajr');
  }
  if (nowMs < ishraqStartMs) {
    return makePeriod('sunrise_prohibited', 'periodSunrise', 'prohibited', today.sunrise, new Date(ishraqStartMs), 'periodSunriseSubtitle', 'ishraq', 'periodIshraq', new Date(ishraqStartMs));
  }
  if (nowMs < duhaStartMs) {
    return makePeriod('ishraq', 'periodIshraq', 'nafl', new Date(ishraqStartMs), new Date(duhaStartMs), 'periodIshraqSubtitle', 'duha', 'periodDuha', new Date(duhaStartMs));
  }
  if (nowMs < zawalStartMs) {
    return makePeriod('duha', 'periodDuha', 'nafl', new Date(duhaStartMs), new Date(zawalStartMs), 'periodDuhaSubtitle', 'zawal_prohibited', 'periodZawal', new Date(zawalStartMs));
  }
  if (nowMs < dhuhrMs) {
    return makePeriod('zawal_prohibited', 'periodZawal', 'prohibited', new Date(zawalStartMs), today.dhuhr, 'periodZawalSubtitle', 'dhuhr', 'dhuhr', today.dhuhr);
  }
  if (nowMs < asrMs) {
    return makePeriod('dhuhr', 'dhuhr', 'obligatory', today.dhuhr, today.asr, 'periodDhuhrSubtitle', 'asr', 'asr', today.asr, 'Dhuhr');
  }
  if (nowMs < maghribMs) {
    return makePeriod('asr', 'asr', 'obligatory', today.asr, today.maghrib, 'periodAsrSubtitle', 'maghrib', 'maghrib', today.maghrib, 'Asr');
  }
  if (nowMs < ishaMs) {
    return makePeriod('maghrib', 'maghrib', 'obligatory', today.maghrib, today.isha, 'periodMaghribSubtitle', 'isha', 'isha', today.isha, 'Maghrib');
  }

  // Evening after Isha
  const night = calculateNightBoundaries(today.maghrib, tomorrow.fajr);
  if (nowMs >= night.lastThirdStart.getTime()) {
    return makePeriod('tahajjud_last_third', 'periodTahajjud', 'nafl', night.lastThirdStart, tomorrow.fajr, 'periodTahajjudLastThirdSubtitle', 'fajr', 'fajr', tomorrow.fajr);
  }
  if (nowMs >= night.islamicMidnight.getTime()) {
    return makePeriod('tahajjud', 'periodTahajjud', 'nafl', night.islamicMidnight, night.lastThirdStart, 'periodTahajjudSubtitle', 'tahajjud_last_third', 'periodTahajjud', night.lastThirdStart);
  }
  return makePeriod('isha', 'isha', 'obligatory', today.isha, night.islamicMidnight, 'periodIshaSubtitle', 'tahajjud', 'periodTahajjud', night.islamicMidnight, 'Isha');
};
