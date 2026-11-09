import { PrayerCompletionEvent, ObligatorySalah } from '@/types';
import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import { getLocalDateComponents } from './timezone';

let cachedLedgerEvents: PrayerCompletionEvent[] | null = null;

export const loadPrayerLedger = async (): Promise<PrayerCompletionEvent[]> => {
  if (cachedLedgerEvents) return cachedLedgerEvents;
  const stored = await storage.get<PrayerCompletionEvent[]>(APP_CONFIG.storageKeys.prayerLedger, []);
  cachedLedgerEvents = stored;
  return stored;
};

export const savePrayerLedger = async (events: PrayerCompletionEvent[]): Promise<void> => {
  cachedLedgerEvents = events;
  await storage.set(APP_CONFIG.storageKeys.prayerLedger, events);
};

export const recordPrayerCompletion = async (params: {
  prayerKey: ObligatorySalah;
  cycleId: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  source?: 'manual' | 'notification' | 'focus';
}): Promise<{ event: PrayerCompletionEvent; isNew: boolean }> => {
  const events = await loadPrayerLedger();
  const occurrenceRef = `${params.cycleId}_${params.prayerKey}`;

  const existing = events.find((e) => e.occurrenceRef === occurrenceRef);
  if (existing) {
    return { event: existing, isNew: false };
  }

  const nowMs = Date.now();
  const tz = params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const localDate = getLocalDateComponents(new Date(nowMs), tz).dateKey;
  const rand = Math.random().toString(36).substring(2, 8);

  const newEvent: PrayerCompletionEvent = {
    id: `pevent_${nowMs}_${params.prayerKey.toLowerCase()}_${rand}`,
    prayerKey: params.prayerKey,
    timestampUtc: nowMs,
    localDate,
    timezone: tz,
    latitude: params.latitude,
    longitude: params.longitude,
    cycleId: params.cycleId,
    occurrenceRef,
    source: params.source || 'manual',
  };

  const updatedEvents = [...events, newEvent];
  await savePrayerLedger(updatedEvents);
  return { event: newEvent, isNew: true };
};

export const removePrayerCompletion = async (
  cycleId: string,
  prayerKey: ObligatorySalah
): Promise<boolean> => {
  const events = await loadPrayerLedger();
  const occurrenceRef = `${cycleId}_${prayerKey}`;
  const filtered = events.filter((e) => e.occurrenceRef !== occurrenceRef);

  if (filtered.length !== events.length) {
    await savePrayerLedger(filtered);
    return true;
  }
  return false;
};

export const getCycleCompletionStatus = (
  cycleId: string,
  events: PrayerCompletionEvent[]
): Record<ObligatorySalah, boolean> => {
  const status: Record<ObligatorySalah, boolean> = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };

  events.forEach((event) => {
    if (event.cycleId === cycleId) {
      status[event.prayerKey] = true;
    }
  });

  return status;
};

export const deriveHistoryMapFromLedger = (
  events: PrayerCompletionEvent[]
): Record<string, Record<string, boolean>> => {
  const map: Record<string, Record<string, boolean>> = {};

  events.forEach((event) => {
    if (!map[event.localDate]) {
      map[event.localDate] = {
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false,
      };
    }
    map[event.localDate][event.prayerKey] = true;
  });

  return map;
};

export const migrateLegacyHistoryToLedger = async (
  legacyHistory: Record<string, Record<string, boolean>>,
  defaultTimezone: string = 'Asia/Karachi'
): Promise<PrayerCompletionEvent[]> => {
  const existingEvents = await loadPrayerLedger();
  if (existingEvents.length > 0) {
    return existingEvents;
  }

  const migratedEvents: PrayerCompletionEvent[] = [];

  Object.entries(legacyHistory).forEach(([dateKey, prayers]) => {
    if (!prayers) return;
    const parts = dateKey.split('-').map(Number);
    const year = parts[0] || 2026;
    const month = (parts[1] || 1) - 1;
    const day = parts[2] || 1;
    const approxTimestamp = Date.UTC(year, month, day, 12, 0, 0);

    const cycleId = `legacy_cycle_${dateKey}`;

    (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as ObligatorySalah[]).forEach((prayer) => {
      if (prayers[prayer]) {
        migratedEvents.push({
          id: `migrated_${approxTimestamp}_${prayer.toLowerCase()}`,
          prayerKey: prayer,
          timestampUtc: approxTimestamp,
          localDate: dateKey,
          timezone: defaultTimezone,
          cycleId,
          occurrenceRef: `${cycleId}_${prayer}`,
          source: 'manual',
        });
      }
    });
  });

  if (migratedEvents.length > 0) {
    await savePrayerLedger(migratedEvents);
  }

  return migratedEvents;
};
