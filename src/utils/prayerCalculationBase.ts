import { Coordinates, CalculationMethod, PrayerTimes, HighLatitudeRule, PolarCircleResolution } from 'adhan';
import type { CalculationMethodName, JuristicMethod } from '@/types';

export const getDefaultMethodForCountry = (country?: string): CalculationMethodName => {
  if (!country) return 'Karachi';
  const c = country.toLowerCase().trim();
  if (c.includes('saudi') || c.includes('makkah')) return 'UmmAlQura';
  if (c.includes('emirates') || c.includes('dubai') || c.includes('uae')) return 'Dubai';
  if (c.includes('egypt')) return 'Egyptian';
  if (c.includes('united states') || c.includes('usa') || c.includes('canada')) return 'NorthAmerica';
  if (c.includes('kuwait')) return 'Kuwait';
  if (c.includes('qatar')) return 'Qatar';
  if (/singapore|malaysia|indonesia/.test(c)) return 'Singapore';
  if (/turkey|türkiye/.test(c)) return 'Turkey';
  return 'Karachi';
};

export const getDefaultCalculationMethodForCountry = getDefaultMethodForCountry;

export const getDefaultMadhabForCountry = (country?: string): JuristicMethod => {
  if (!country) return 'Hanafi';
  const c = country.toLowerCase().trim();
  return /pakistan|india|bangladesh|turkey|türkiye|afghanistan/.test(c) ? 'Hanafi' : 'Standard';
};

export const CALCULATION_METHOD_LABELS: Record<CalculationMethodName, string> = {
  Karachi: 'University of Islamic Sciences, Karachi',
  MuslimWorldLeague: 'Muslim World League',
  Egyptian: 'Egyptian General Authority',
  UmmAlQura: 'Umm al-Qura University, Makkah',
  Dubai: 'Dubai (UAE)',
  Kuwait: 'Kuwait',
  Qatar: 'Qatar',
  Singapore: 'Singapore (MUIS)',
  Turkey: 'Turkey (Diyanet)',
  Tehran: 'Institute of Geophysics, Tehran',
  NorthAmerica: 'Islamic Society of North America (ISNA)',
  MoonsightingCommittee: 'Moonsighting Committee',
};

export const getMethodParams = (method: CalculationMethodName = 'Karachi') => {
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

export const createRobustPrayerTimes = (
  coords: Coordinates,
  date: Date,
  params: ReturnType<typeof getMethodParams>
): PrayerTimes => {
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  try {
    const pt = new PrayerTimes(coords, date, params);
    if (
      !pt.fajr || isNaN(pt.fajr.getTime()) ||
      !pt.sunrise || isNaN(pt.sunrise.getTime()) ||
      !pt.dhuhr || isNaN(pt.dhuhr.getTime()) ||
      !pt.maghrib || isNaN(pt.maghrib.getTime())
    ) {
      throw new Error('Astronomical polar anomaly');
    }
    return pt;
  } catch {
    const fallbackLat = coords.latitude > 0 ? 60.0 : -60.0;
    const fallbackCoords = new Coordinates(fallbackLat, coords.longitude);
    return new PrayerTimes(fallbackCoords, date, params);
  }
};
