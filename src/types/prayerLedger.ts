export type ObligatorySalah = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

/**
 * Immutable Prayer Completion Event
 * Represents a single permanent user prayer completion occurrence.
 * Never overwritten or deleted across timezone travel or location changes.
 */
export interface PrayerCompletionEvent {
  id: string;
  prayerKey: ObligatorySalah;
  timestampUtc: number;
  localDate: string; // YYYY-MM-DD
  timezone: string;
  latitude?: number;
  longitude?: number;
  cycleId: string;
  occurrenceRef: string; // `${cycleId}_${prayerKey}`
  source: 'manual' | 'notification' | 'focus';
}

/**
 * Centralized Islamic Prayer Cycle
 * Represents an active continuous prayer cycle from Fajr until the next local Fajr.
 */
export interface PrayerCycle {
  cycleId: string;
  cycleStartUtc: number;
  nextFajrBoundaryUtc: number;
  lastUpdatedUtc: number;
  locationSnapshot: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    isConfirmed: boolean;
    isStale: boolean;
  };
}
