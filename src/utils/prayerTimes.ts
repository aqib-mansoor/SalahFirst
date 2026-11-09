import { Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { CalculationMethodName, JuristicMethod, SalahName, CurrentPrayerPeriod } from '@/types';
import { formatTimeInTimezone, createCalendarDateForCalculation, getLocalDateComponents, localTimeToUtcEpoch } from './timezone';
import { getCurrentPrayerPeriod, createFallbackPeriod } from './currentPrayerPeriod';
import {
  getMethodParams,
  createRobustPrayerTimes,
} from './prayerCalculationBase';

export * from './prayerCalculationBase';
export * from './currentPrayerPeriod';

export const normalizeAdhanToUtcDate = (
  adhanDate: Date,
  targetComp: { year: number; month: number; day: number },
  timezone?: string
): Date => {
  if (!adhanDate || isNaN(adhanDate.getTime())) return adhanDate;
  const epoch = localTimeToUtcEpoch(
    targetComp.year,
    targetComp.month,
    targetComp.day,
    adhanDate.getHours(),
    adhanDate.getMinutes(),
    adhanDate.getSeconds(),
    timezone
  );
  return new Date(epoch);
};

export interface FormattedPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: SalahName;
  nextPrayerTimeFormatted: string;
  nextPrayerDate: Date;
  raw: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  };
  currentPeriod: CurrentPrayerPeriod;
}

export const formatTime = (date: Date, timezone?: string): string =>
  formatTimeInTimezone(date, timezone);

export const formatRemainingTime = (targetDate: Date, now: Date = new Date()): string => {
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) return 'NOW';
  const totalMins = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `IN ${mins}M`;
  if (mins === 0) return `IN ${hours}H`;
  return `IN ${hours}H ${mins}M`;
};

export const getPrayerTimes = (
  latitude?: number | null,
  longitude?: number | null,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi',
  timezone?: string
): FormattedPrayerTimes => {
  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    const dummyDate = new Date();
    return {
      fajr: '--:--',
      sunrise: '--:--',
      dhuhr: '--:--',
      asr: '--:--',
      maghrib: '--:--',
      isha: '--:--',
      currentPrayerName: 'SELECT LOCATION',
      currentTimeFormatted: '--:--',
      nextPrayerName: 'Fajr',
      nextPrayerTimeFormatted: '--:--',
      nextPrayerDate: new Date(Date.now() + 86400000),
      raw: {
        fajr: dummyDate,
        sunrise: dummyDate,
        dhuhr: dummyDate,
        asr: dummyDate,
        maghrib: dummyDate,
        isha: dummyDate,
      },
      currentPeriod: createFallbackPeriod(dummyDate, timezone),
    };
  }

  const coordinates = new Coordinates(latitude, longitude);
  const params = getMethodParams(method);
  params.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  const targetDate = createCalendarDateForCalculation(date, timezone);
  const ptToday = createRobustPrayerTimes(coordinates, targetDate, params);

  const tomorrow = new Date(targetDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = createRobustPrayerTimes(coordinates, tomorrow, params);

  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const ptYesterday = createRobustPrayerTimes(coordinates, yesterday, params);

  const todayComp = getLocalDateComponents(targetDate, timezone);
  const tomorrowComp = getLocalDateComponents(tomorrow, timezone);

  const rawTodayNormalized = {
    fajr: normalizeAdhanToUtcDate(ptToday.fajr, todayComp, timezone),
    sunrise: normalizeAdhanToUtcDate(ptToday.sunrise, todayComp, timezone),
    dhuhr: normalizeAdhanToUtcDate(ptToday.dhuhr, todayComp, timezone),
    asr: normalizeAdhanToUtcDate(ptToday.asr, todayComp, timezone),
    maghrib: normalizeAdhanToUtcDate(ptToday.maghrib, todayComp, timezone),
    isha: normalizeAdhanToUtcDate(ptToday.isha, todayComp, timezone),
  };
  const tomorrowFajr = normalizeAdhanToUtcDate(ptTomorrow.fajr, tomorrowComp, timezone);

  const currentPeriod = getCurrentPrayerPeriod({
    latitude,
    longitude,
    date,
    method,
    juristic,
    timezone,
    rawToday: ptToday,
    rawTomorrow: ptTomorrow,
    rawYesterday: ptYesterday,
  });

  const now = date.getTime();
  let nextName: SalahName = 'Fajr';
  let nextTime = rawTodayNormalized.fajr;

  if (now < rawTodayNormalized.fajr.getTime()) {
    nextName = 'Fajr';
    nextTime = rawTodayNormalized.fajr;
  } else if (now < rawTodayNormalized.dhuhr.getTime()) {
    nextName = 'Dhuhr';
    nextTime = rawTodayNormalized.dhuhr;
  } else if (now < rawTodayNormalized.asr.getTime()) {
    nextName = 'Asr';
    nextTime = rawTodayNormalized.asr;
  } else if (now < rawTodayNormalized.maghrib.getTime()) {
    nextName = 'Maghrib';
    nextTime = rawTodayNormalized.maghrib;
  } else if (now < rawTodayNormalized.isha.getTime()) {
    nextName = 'Isha';
    nextTime = rawTodayNormalized.isha;
  } else {
    nextName = 'Fajr';
    nextTime = tomorrowFajr;
  }

  return {
    fajr: formatTimeInTimezone(rawTodayNormalized.fajr, timezone),
    sunrise: formatTimeInTimezone(rawTodayNormalized.sunrise, timezone),
    dhuhr: formatTimeInTimezone(rawTodayNormalized.dhuhr, timezone),
    asr: formatTimeInTimezone(rawTodayNormalized.asr, timezone),
    maghrib: formatTimeInTimezone(rawTodayNormalized.maghrib, timezone),
    isha: formatTimeInTimezone(rawTodayNormalized.isha, timezone),
    currentPrayerName: currentPeriod.nameKey,
    currentTimeFormatted: currentPeriod.startTimeFormatted,
    nextPrayerName: nextName,
    nextPrayerTimeFormatted: formatTimeInTimezone(nextTime, timezone),
    nextPrayerDate: nextTime,
    raw: rawTodayNormalized,
    currentPeriod,
  };
};

export const getRawPrayerTimes = (
  latitude?: number | null,
  longitude?: number | null,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi',
  timezone?: string
) => {
  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    const dummyDate = new Date();
    return {
      fajr: dummyDate,
      sunrise: dummyDate,
      dhuhr: dummyDate,
      asr: dummyDate,
      maghrib: dummyDate,
      isha: dummyDate,
    };
  }

  const coordinates = new Coordinates(latitude, longitude);
  const params = getMethodParams(method);
  params.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  const targetDate = createCalendarDateForCalculation(date, timezone);
  const ptToday = createRobustPrayerTimes(coordinates, targetDate, params);
  const todayComp = getLocalDateComponents(targetDate, timezone);

  return {
    fajr: normalizeAdhanToUtcDate(ptToday.fajr, todayComp, timezone),
    sunrise: normalizeAdhanToUtcDate(ptToday.sunrise, todayComp, timezone),
    dhuhr: normalizeAdhanToUtcDate(ptToday.dhuhr, todayComp, timezone),
    asr: normalizeAdhanToUtcDate(ptToday.asr, todayComp, timezone),
    maghrib: normalizeAdhanToUtcDate(ptToday.maghrib, todayComp, timezone),
    isha: normalizeAdhanToUtcDate(ptToday.isha, todayComp, timezone),
  };
};
  longitude?: number | null,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi',
  timezone?: string
): { fajr: Date; sunrise: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date } => {
  const coordinates = new Coordinates(latitude ?? 0, longitude ?? 0);
  const params = getMethodParams(method);
  params.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  const targetDate = createCalendarDateForCalculation(date, timezone);
  const pt = createRobustPrayerTimes(coordinates, targetDate, params);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
};

export { getIslamicDateFormatted } from './hijriCalendar';
