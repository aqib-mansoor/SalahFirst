import { Coordinates, CalculationMethod, PrayerTimes, Madhab, HighLatitudeRule } from 'adhan';
import { CalculationMethodName, JuristicMethod, SalahName } from '@/types';

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
}

const padZero = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const formatTime = (date: Date): string => {
  if (!date || isNaN(date.getTime())) return '--:--';
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
};

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

export const getDefaultMethodForCountry = (country?: string): CalculationMethodName => {
  if (!country) return 'Karachi';
  const c = country.toLowerCase().trim();
  if (/saudi|makkah|madinah/.test(c)) return 'UmmAlQura';
  if (/emirates|uae|dubai|abu dhabi/.test(c)) return 'Dubai';
  if (/egypt|sudan|jordan|lebanon|syria/.test(c)) return 'Egyptian';
  if (/united states|usa|canada/.test(c)) return 'NorthAmerica';
  if (c.includes('kuwait')) return 'Kuwait';
  if (c.includes('qatar')) return 'Qatar';
  if (/singapore|malaysia|indonesia/.test(c)) return 'Singapore';
  if (/turkey|türkiye/.test(c)) return 'Turkey';
  return 'Karachi';
};

export const getDefaultMadhabForCountry = (country?: string): JuristicMethod => {
  if (!country) return 'Hanafi';
  const c = country.toLowerCase().trim();
  return /pakistan|india|bangladesh|turkey|türkiye|afghanistan/.test(c) ? 'Hanafi' : 'Standard';
};

const getMethodParams = (method: CalculationMethodName = 'Karachi') => {
  const map: Record<string, () => any> = {
    UmmAlQura: CalculationMethod.UmmAlQura,
    Dubai: CalculationMethod.Dubai,
    MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
    Egyptian: CalculationMethod.Egyptian,
    NorthAmerica: CalculationMethod.NorthAmerica,
    MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
    Kuwait: CalculationMethod.Kuwait,
    Qatar: CalculationMethod.Qatar,
    Singapore: CalculationMethod.Singapore,
    Tehran: CalculationMethod.Tehran,
    Turkey: CalculationMethod.Turkey,
    Karachi: CalculationMethod.Karachi,
  };
  return (map[method] || CalculationMethod.Karachi)();
};

const createRobustPrayerTimes = (
  coords: Coordinates,
  date: Date,
  params: ReturnType<typeof getMethodParams>
): PrayerTimes => {
  try {
    const pt = new PrayerTimes(coords, date, params);
    if (
      !pt.fajr ||
      isNaN(pt.fajr.getTime()) ||
      !pt.sunrise ||
      isNaN(pt.sunrise.getTime()) ||
      !pt.dhuhr ||
      isNaN(pt.dhuhr.getTime()) ||
      !pt.maghrib ||
      isNaN(pt.maghrib.getTime())
    ) {
      throw new Error('Astronomical polar anomaly');
    }
    return pt;
  } catch {
    // Polar day/night fallback (Aqrab al-Bilad: nearest regular latitude 60°, preserving longitude)
    const fallbackLat = coords.latitude > 0 ? 60.0 : -60.0;
    const fallbackCoords = new Coordinates(fallbackLat, coords.longitude);
    return new PrayerTimes(fallbackCoords, date, params);
  }
};

export const getPrayerTimes = (
  latitude?: number | null,
  longitude?: number | null,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi'
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
    };
  }

  const coordinates = new Coordinates(latitude, longitude);
  const params = getMethodParams(method);
  params.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);

  const ptToday = createRobustPrayerTimes(coordinates, date, params);

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = createRobustPrayerTimes(coordinates, tomorrow, params);

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const ptYesterday = createRobustPrayerTimes(coordinates, yesterday, params);

  const now = date.getTime();
  let currentName = 'ISHA';
  let currentTime = ptYesterday.isha;
  let nextName: SalahName = 'Fajr';
  let nextTime = ptToday.fajr;

  if (now < ptToday.fajr.getTime()) {
    // Keep initial defaults (Isha -> Fajr)
  } else if (now < ptToday.sunrise.getTime() || now < ptToday.dhuhr.getTime()) {
    currentName = 'FAJR';
    currentTime = ptToday.fajr;
    nextName = 'Dhuhr';
    nextTime = ptToday.dhuhr;
  } else if (now < ptToday.asr.getTime()) {
    currentName = 'DHUHR';
    currentTime = ptToday.dhuhr;
    nextName = 'Asr';
    nextTime = ptToday.asr;
  } else if (now < ptToday.maghrib.getTime()) {
    currentName = 'ASR';
    currentTime = ptToday.asr;
    nextName = 'Maghrib';
    nextTime = ptToday.maghrib;
  } else if (now < ptToday.isha.getTime()) {
    currentName = 'MAGHRIB';
    currentTime = ptToday.maghrib;
    nextName = 'Isha';
    nextTime = ptToday.isha;
  } else {
    currentName = 'ISHA';
    currentTime = ptToday.isha;
    nextName = 'Fajr';
    nextTime = ptTomorrow.fajr;
  }

  return {
    fajr: formatTime(ptToday.fajr),
    sunrise: formatTime(ptToday.sunrise),
    dhuhr: formatTime(ptToday.dhuhr),
    asr: formatTime(ptToday.asr),
    maghrib: formatTime(ptToday.maghrib),
    isha: formatTime(ptToday.isha),
    currentPrayerName: currentName,
    currentTimeFormatted: formatTime(currentTime),
    nextPrayerName: nextName,
    nextPrayerTimeFormatted: formatTime(nextTime),
    nextPrayerDate: nextTime,
    raw: {
      fajr: ptToday.fajr,
      sunrise: ptToday.sunrise,
      dhuhr: ptToday.dhuhr,
      asr: ptToday.asr,
      maghrib: ptToday.maghrib,
      isha: ptToday.isha,
    },
  };
};

export const getRawPrayerTimes = (
  latitude?: number | null,
  longitude?: number | null,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi'
): { fajr: Date; sunrise: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date } => {
  const coordinates = new Coordinates(latitude ?? 0, longitude ?? 0);
  const params = getMethodParams(method);
  params.madhab = juristic === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  const pt = createRobustPrayerTimes(coordinates, date, params);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
};

export const getIslamicDateFormatted = (date: Date = new Date()): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(date);
  } catch {
    return '26 Dhu al-Qi’dah 1447';
  }
};
