import { Coordinates, Madhab } from 'adhan';
import type { CalculationMethodName, JuristicMethod, SalahName, CurrentPrayerPeriod } from '@/types';
import { formatTimeInTimezone, createCalendarDateForCalculation } from './timezone';
import { getCurrentPrayerPeriod, createFallbackPeriod } from './currentPrayerPeriod';
import {
  getMethodParams,
  createRobustPrayerTimes,
} from './prayerCalculationBase';

export * from './prayerCalculationBase';
export * from './currentPrayerPeriod';

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
  let nextTime = ptToday.fajr;

  if (now < ptToday.fajr.getTime()) {
    nextName = 'Fajr';
    nextTime = ptToday.fajr;
  } else if (now < ptToday.dhuhr.getTime()) {
    nextName = 'Dhuhr';
    nextTime = ptToday.dhuhr;
  } else if (now < ptToday.asr.getTime()) {
    nextName = 'Asr';
    nextTime = ptToday.asr;
  } else if (now < ptToday.maghrib.getTime()) {
    nextName = 'Maghrib';
    nextTime = ptToday.maghrib;
  } else if (now < ptToday.isha.getTime()) {
    nextName = 'Isha';
    nextTime = ptToday.isha;
  } else {
    nextName = 'Fajr';
    nextTime = ptTomorrow.fajr;
  }

  return {
    fajr: formatTimeInTimezone(ptToday.fajr, timezone),
    sunrise: formatTimeInTimezone(ptToday.sunrise, timezone),
    dhuhr: formatTimeInTimezone(ptToday.dhuhr, timezone),
    asr: formatTimeInTimezone(ptToday.asr, timezone),
    maghrib: formatTimeInTimezone(ptToday.maghrib, timezone),
    isha: formatTimeInTimezone(ptToday.isha, timezone),
    currentPrayerName: currentPeriod.nameKey,
    currentTimeFormatted: currentPeriod.startTimeFormatted,
    nextPrayerName: nextName,
    nextPrayerTimeFormatted: formatTimeInTimezone(nextTime, timezone),
    nextPrayerDate: nextTime,
    raw: {
      fajr: ptToday.fajr,
      sunrise: ptToday.sunrise,
      dhuhr: ptToday.dhuhr,
      asr: ptToday.asr,
      maghrib: ptToday.maghrib,
      isha: ptToday.isha,
    },
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
