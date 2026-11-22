import { FiqhName, CalculationMethodName } from '@/types';
import { Madhab } from 'adhan';

export interface FiqhOption {
  id: FiqhName;
  nameKey: string;
  titleEn: string;
  titleAr: string;
  titleUr: string;
  asrRule: 'double' | 'single';
  shadowMultiplier: number;
  recommendedCalcMethod: CalculationMethodName;
  descKey: string;
}

export const FIQH_OPTIONS: FiqhOption[] = [
  {
    id: 'Hanafi',
    nameKey: 'fiqhHanafi',
    titleEn: 'Hanafi',
    titleAr: 'الحنفي',
    titleUr: 'حنفی',
    asrRule: 'double',
    shadowMultiplier: 2,
    recommendedCalcMethod: 'Karachi',
    descKey: 'fiqhHanafiDesc',
  },
  {
    id: 'Shafii',
    nameKey: 'fiqhShafii',
    titleEn: "Shafi'i",
    titleAr: 'الشافعي',
    titleUr: 'شافعی',
    asrRule: 'single',
    shadowMultiplier: 1,
    recommendedCalcMethod: 'Egyptian',
    descKey: 'fiqhShafiiDesc',
  },
  {
    id: 'Maliki',
    nameKey: 'fiqhMaliki',
    titleEn: 'Maliki',
    titleAr: 'المالكي',
    titleUr: 'مالکی',
    asrRule: 'single',
    shadowMultiplier: 1,
    recommendedCalcMethod: 'MuslimWorldLeague',
    descKey: 'fiqhMalikiDesc',
  },
  {
    id: 'Hanbali',
    nameKey: 'fiqhHanbali',
    titleEn: 'Hanbali',
    titleAr: 'الحنبلي',
    titleUr: 'حنبلی',
    asrRule: 'single',
    shadowMultiplier: 1,
    recommendedCalcMethod: 'UmmAlQura',
    descKey: 'fiqhHanbaliDesc',
  },
];

export const DEFAULT_FIQH_PROFILES: Record<FiqhName, { calcMethod: CalculationMethodName }> = {
  Hanafi: { calcMethod: 'Karachi' },
  Shafii: { calcMethod: 'Egyptian' },
  Maliki: { calcMethod: 'MuslimWorldLeague' },
  Hanbali: { calcMethod: 'UmmAlQura' },
};

export interface FiqhCongregationDelays {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export const FIQH_CONGREGATION_DELAYS: Record<FiqhName, FiqhCongregationDelays> = {
  Hanafi: { fajr: 35, dhuhr: 20, asr: 20, maghrib: 7, isha: 20 },
  Hanbali: { fajr: 25, dhuhr: 20, asr: 20, maghrib: 10, isha: 20 },
  Shafii: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 5, isha: 15 },
  Maliki: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 5, isha: 15 },
};

export const getDefaultDelaysForFiqh = (fiqh: FiqhName): FiqhCongregationDelays =>
  FIQH_CONGREGATION_DELAYS[fiqh] || FIQH_CONGREGATION_DELAYS.Hanafi;

export const getFiqhDetails = (fiqh: FiqhName): FiqhOption =>
  FIQH_OPTIONS.find((f) => f.id === fiqh) || FIQH_OPTIONS[0];

export const normalizeFiqh = (val?: string | null, country?: string): FiqhName => {
  if (val === 'Hanafi') return 'Hanafi';
  if (val === 'Shafii') return 'Shafii';
  if (val === 'Maliki') return 'Maliki';
  if (val === 'Hanbali') return 'Hanbali';
  if (val === 'Standard') {
    const c = (country || '').toLowerCase();
    if (/saudi|qatar|kuwait|emirates|dubai|uae|oman/.test(c)) return 'Hanbali';
    if (/morocco|algeria|tunisia|libya|sudan|mauritania/.test(c)) return 'Maliki';
    return 'Shafii';
  }
  return 'Hanafi';
};

export const getMadhabForFiqh = (fiqh: FiqhName | string) =>
  fiqh === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
