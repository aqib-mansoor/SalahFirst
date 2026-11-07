import { CalculationMethodName, JuristicMethod } from '@/types';

export interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface AlAdhanResult {
  success: boolean;
  timings?: AlAdhanTimings;
  dateFormatted?: string;
  meta?: {
    methodName?: string;
    school?: string;
  };
  error?: string;
}

export interface PrayerTimeComparison {
  prayer: string;
  localTime: string;
  apiTime: string;
  diffMinutes: number;
}

const METHOD_ID_MAP: Record<CalculationMethodName, number> = {
  Karachi: 1,
  NorthAmerica: 2,
  MuslimWorldLeague: 3,
  UmmAlQura: 4,
  Egyptian: 5,
  Tehran: 7,
  Dubai: 8,
  Kuwait: 9,
  Qatar: 10,
  Singapore: 11,
  Turkey: 13,
  MoonsightingCommittee: 15,
};

export const fetchAlAdhanTimings = async (
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  method: CalculationMethodName = 'Karachi',
  juristic: JuristicMethod = 'Hanafi'
): Promise<AlAdhanResult> => {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    const methodId = METHOD_ID_MAP[method] ?? 1;
    const schoolId = juristic === 'Hanafi' ? 1 : 0;

    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${methodId}&school=${schoolId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: `AlAdhan HTTP ${response.status}` };
    }

    const json = await response.json();
    if (json.code !== 200 || !json.data?.timings) {
      return { success: false, error: 'Invalid response from AlAdhan API' };
    }

    const timings: AlAdhanTimings = {
      Fajr: json.data.timings.Fajr?.slice(0, 5) || '--:--',
      Sunrise: json.data.timings.Sunrise?.slice(0, 5) || '--:--',
      Dhuhr: json.data.timings.Dhuhr?.slice(0, 5) || '--:--',
      Asr: json.data.timings.Asr?.slice(0, 5) || '--:--',
      Maghrib: json.data.timings.Maghrib?.slice(0, 5) || '--:--',
      Isha: json.data.timings.Isha?.slice(0, 5) || '--:--',
    };

    return {
      success: true,
      timings,
      dateFormatted: json.data.date?.readable,
      meta: {
        methodName: json.data.meta?.method?.name,
        school: json.data.meta?.school,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : 'Network unavailable',
    };
  }
};

export const parseMinutes = (timeStr: string): number => {
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
  return parts[0] * 60 + parts[1];
};

export const comparePrayerTimings = (
  local: Record<string, string>,
  api: AlAdhanTimings
): PrayerTimeComparison[] => {
  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  return prayers.map((p) => {
    const loc = local[p.toLowerCase()] || local[p] || '--:--';
    const remote = api[p as keyof AlAdhanTimings] || '--:--';
    const locMins = parseMinutes(loc);
    const apiMins = parseMinutes(remote);
    return {
      prayer: p,
      localTime: loc,
      apiTime: remote,
      diffMinutes: locMins - apiMins,
    };
  });
};
