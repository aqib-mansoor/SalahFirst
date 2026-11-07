import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

export interface FormattedPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  nextPrayerDate: Date;
}

const padZero = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const formatTime = (date: Date): string => {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const getPrayerTimes = (
  latitude: number = 32.9328,
  longitude: number = 72.8553,
  date: Date = new Date()
): FormattedPrayerTimes => {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Karachi();
  const pt = new PrayerTimes(coordinates, date, params);

  const current = pt.currentPrayer();
  const next = pt.nextPrayer();

  const prayerNameMap: Record<string, string> = {
    [Prayer.Fajr]: 'Fajr',
    [Prayer.Sunrise]: 'Sunrise',
    [Prayer.Dhuhr]: 'Dhuhr',
    [Prayer.Asr]: 'Asr',
    [Prayer.Maghrib]: 'Maghrib',
    [Prayer.Isha]: 'Isha',
    [Prayer.None]: 'Isha',
  };

  const currentName = prayerNameMap[current] || 'Asr';
  const nextName = prayerNameMap[next] || 'Maghrib';

  const currentTime = pt.timeForPrayer(current) || pt.asr;
  const nextTime = pt.timeForPrayer(next) || pt.maghrib;

  return {
    fajr: formatTime(pt.fajr),
    sunrise: formatTime(pt.sunrise),
    dhuhr: formatTime(pt.dhuhr),
    asr: formatTime(pt.asr),
    maghrib: formatTime(pt.maghrib),
    isha: formatTime(pt.isha),
    currentPrayerName: currentName.toUpperCase(),
    currentTimeFormatted: formatTime(currentTime),
    nextPrayerName: nextName,
    nextPrayerTimeFormatted: formatTime(nextTime),
    nextPrayerDate: nextTime,
  };
};

export const getRawPrayerTimes = (
  latitude: number = 32.9328,
  longitude: number = 72.8553,
  date: Date = new Date()
): { fajr: Date; sunrise: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date } => {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Karachi();
  const pt = new PrayerTimes(coordinates, date, params);
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

