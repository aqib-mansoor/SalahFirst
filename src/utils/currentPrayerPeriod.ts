import { Coordinates, Madhab } from 'adhan';
import {
  CalculationMethodName,
  JuristicMethod,
  CurrentPrayerPeriod,
  NextPrayerPeriod,
  PrayerPeriodId,
  PrayerPeriodCategory,
} from '@/types';
import { formatTimeInTimezone, createCalendarDateForCalculation } from './timezone';
import { getMethodParams, createRobustPrayerTimes } from './prayerTimes';

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
  nextPeriod: {
    id: 'fajr',
    nameKey: 'fajr',
    startTime: instant,
    timeFormatted: '--:--',
  },
});

export const getCurrentPrayerPeriod = (params: DetectPeriodParams): CurrentPrayerPeriod => {
  const {
    latitude,
    longitude,
    date = new Date(),
    method = 'Karachi',
    juristic = 'Hanafi',
    timezone,
  } = params;

  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    return createFallbackPeriod(date, timezone);
  }

  // Resolve raw prayer times if not provided
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

  let id: PrayerPeriodId;
  let nameKey: string;
  let category: PrayerPeriodCategory;
  let startTime: Date;
  let endTime: Date;
  let descriptionKey: string;
  let obligatoryName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | undefined;
  let nextPeriod: NextPrayerPeriod;

  if (nowMs < fajrMs) {
    // Night portion before dawn (Day D-1 Maghrib to Day D Fajr)
    const night = calculateNightBoundaries(yesterday.maghrib, today.fajr);
    if (nowMs >= night.lastThirdStart.getTime()) {
      id = 'tahajjud_last_third';
      nameKey = 'periodTahajjud';
      category = 'nafl';
      startTime = night.lastThirdStart;
      endTime = today.fajr;
      descriptionKey = 'periodTahajjudLastThirdSubtitle';
      nextPeriod = { id: 'fajr', nameKey: 'fajr', startTime: today.fajr, timeFormatted: '' };
    } else if (nowMs >= night.islamicMidnight.getTime()) {
      id = 'tahajjud';
      nameKey = 'periodTahajjud';
      category = 'nafl';
      startTime = night.islamicMidnight;
      endTime = night.lastThirdStart;
      descriptionKey = 'periodTahajjudSubtitle';
      nextPeriod = { id: 'tahajjud_last_third', nameKey: 'periodTahajjud', startTime: night.lastThirdStart, timeFormatted: '' };
    } else {
      id = 'isha';
      nameKey = 'isha';
      category = 'obligatory';
      obligatoryName = 'Isha';
      startTime = yesterday.isha;
      endTime = night.islamicMidnight;
      descriptionKey = 'periodIshaSubtitle';
      nextPeriod = { id: 'tahajjud', nameKey: 'periodTahajjud', startTime: night.islamicMidnight, timeFormatted: '' };
    }
  } else if (nowMs < sunriseMs) {
    id = 'fajr';
    nameKey = 'fajr';
    category = 'obligatory';
    obligatoryName = 'Fajr';
    startTime = today.fajr;
    endTime = today.sunrise;
    descriptionKey = 'periodFajrSubtitle';
    nextPeriod = { id: 'sunrise_prohibited', nameKey: 'periodSunrise', startTime: today.sunrise, timeFormatted: '' };
  } else if (nowMs < ishraqStartMs) {
    id = 'sunrise_prohibited';
    nameKey = 'periodSunrise';
    category = 'prohibited';
    startTime = today.sunrise;
    endTime = new Date(ishraqStartMs);
    descriptionKey = 'periodSunriseSubtitle';
    nextPeriod = { id: 'ishraq', nameKey: 'periodIshraq', startTime: new Date(ishraqStartMs), timeFormatted: '' };
  } else if (nowMs < duhaStartMs) {
    id = 'ishraq';
    nameKey = 'periodIshraq';
    category = 'nafl';
    startTime = new Date(ishraqStartMs);
    endTime = new Date(duhaStartMs);
    descriptionKey = 'periodIshraqSubtitle';
    nextPeriod = { id: 'duha', nameKey: 'periodDuha', startTime: new Date(duhaStartMs), timeFormatted: '' };
  } else if (nowMs < zawalStartMs) {
    id = 'duha';
    nameKey = 'periodDuha';
    category = 'nafl';
    startTime = new Date(duhaStartMs);
    endTime = new Date(zawalStartMs);
    descriptionKey = 'periodDuhaSubtitle';
    nextPeriod = { id: 'zawal_prohibited', nameKey: 'periodZawal', startTime: new Date(zawalStartMs), timeFormatted: '' };
  } else if (nowMs < dhuhrMs) {
    id = 'zawal_prohibited';
    nameKey = 'periodZawal';
    category = 'prohibited';
    startTime = new Date(zawalStartMs);
    endTime = today.dhuhr;
    descriptionKey = 'periodZawalSubtitle';
    nextPeriod = { id: 'dhuhr', nameKey: 'dhuhr', startTime: today.dhuhr, timeFormatted: '' };
  } else if (nowMs < asrMs) {
    id = 'dhuhr';
    nameKey = 'dhuhr';
    category = 'obligatory';
    obligatoryName = 'Dhuhr';
    startTime = today.dhuhr;
    endTime = today.asr;
    descriptionKey = 'periodDhuhrSubtitle';
    nextPeriod = { id: 'asr', nameKey: 'asr', startTime: today.asr, timeFormatted: '' };
  } else if (nowMs < maghribMs) {
    id = 'asr';
    nameKey = 'asr';
    category = 'obligatory';
    obligatoryName = 'Asr';
    startTime = today.asr;
    endTime = today.maghrib;
    descriptionKey = 'periodAsrSubtitle';
    nextPeriod = { id: 'maghrib', nameKey: 'maghrib', startTime: today.maghrib, timeFormatted: '' };
  } else if (nowMs < ishaMs) {
    id = 'maghrib';
    nameKey = 'maghrib';
    category = 'obligatory';
    obligatoryName = 'Maghrib';
    startTime = today.maghrib;
    endTime = today.isha;
    descriptionKey = 'periodMaghribSubtitle';
    nextPeriod = { id: 'isha', nameKey: 'isha', startTime: today.isha, timeFormatted: '' };
  } else {
    // Night portion after Isha (Day D Maghrib to Day D+1 Fajr)
    const night = calculateNightBoundaries(today.maghrib, tomorrow.fajr);
    if (nowMs >= night.lastThirdStart.getTime()) {
      id = 'tahajjud_last_third';
      nameKey = 'periodTahajjud';
      category = 'nafl';
      startTime = night.lastThirdStart;
      endTime = tomorrow.fajr;
      descriptionKey = 'periodTahajjudLastThirdSubtitle';
      nextPeriod = { id: 'fajr', nameKey: 'fajr', startTime: tomorrow.fajr, timeFormatted: '' };
    } else if (nowMs >= night.islamicMidnight.getTime()) {
      id = 'tahajjud';
      nameKey = 'periodTahajjud';
      category = 'nafl';
      startTime = night.islamicMidnight;
      endTime = night.lastThirdStart;
      descriptionKey = 'periodTahajjudSubtitle';
      nextPeriod = { id: 'tahajjud_last_third', nameKey: 'periodTahajjud', startTime: night.lastThirdStart, timeFormatted: '' };
    } else {
      id = 'isha';
      nameKey = 'isha';
      category = 'obligatory';
      obligatoryName = 'Isha';
      startTime = today.isha;
      endTime = night.islamicMidnight;
      descriptionKey = 'periodIshaSubtitle';
      nextPeriod = { id: 'tahajjud', nameKey: 'periodTahajjud', startTime: night.islamicMidnight, timeFormatted: '' };
    }
  }

  nextPeriod.timeFormatted = formatTimeInTimezone(nextPeriod.startTime, timezone);

  return {
    id,
    nameKey,
    category,
    startTime,
    endTime,
    startTimeFormatted: formatTimeInTimezone(startTime, timezone),
    endTimeFormatted: formatTimeInTimezone(endTime, timezone),
    descriptionKey,
    isCalculatedWindow: true,
    isObligatory: category === 'obligatory',
    isProhibited: category === 'prohibited',
    isNafl: category === 'nafl',
    nextPeriod,
    obligatorySalahName: obligatoryName,
  };
};
