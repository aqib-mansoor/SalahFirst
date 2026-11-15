import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import {
  PrayerCompletionEvent,
  PrayerCycle,
  CalculationMethodName,
  JuristicMethod,
  PrayerMinuteAdjustments,
} from '@/types';
import * as Sharing from 'expo-sharing';

export const BACKUP_SCHEMA_VERSION = 2;

export interface SalahFirstBackupData {
  schemaVersion: number;
  exportedAtUtc: number;
  appVersion: string;
  prayerLedger: PrayerCompletionEvent[];
  prayerTracker: Record<string, Record<string, boolean>>;
  prayerCycle: PrayerCycle | null;
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
  prayerAdjustments?: PrayerMinuteAdjustments;
  hadithBookmarks?: string[];
  sunnahTracker?: Record<string, Record<string, boolean>>;
}

export const generateBackupPayload = async (): Promise<SalahFirstBackupData> => {
  const [ledger, tracker, cycle, calcMethod, juristic, prayerAdjustments, bookmarks, sunnah, legacySunnah] = await Promise.all([
    storage.get<PrayerCompletionEvent[]>(APP_CONFIG.storageKeys.prayerLedger, []),
    storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.prayerTracker, {}),
    storage.get<PrayerCycle | null>(APP_CONFIG.storageKeys.prayerCycle, null),
    storage.get<CalculationMethodName | null>(APP_CONFIG.storageKeys.calculationMethod, null),
    storage.get<JuristicMethod | null>(APP_CONFIG.storageKeys.juristicMethod, null),
    storage.get<PrayerMinuteAdjustments | null>(APP_CONFIG.storageKeys.prayerAdjustments, null),
    storage.get<string[]>(APP_CONFIG.storageKeys.hadithBookmarks, []),
    storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.sunnahHistory, {}),
    storage.get<Record<string, Record<string, boolean>>>('@salahfirst_sunnah_tracker', {}),
  ]);

  const mergedSunnah = { ...legacySunnah, ...sunnah };

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAtUtc: Date.now(),
    appVersion: APP_CONFIG.version,
    prayerLedger: ledger,
    prayerTracker: tracker,
    prayerCycle: cycle,
    calculationMethod: calcMethod || undefined,
    juristicMethod: juristic || undefined,
    prayerAdjustments: prayerAdjustments || undefined,
    hadithBookmarks: bookmarks,
    sunnahTracker: mergedSunnah,
  };
};

export const exportBackupToJson = async (): Promise<string> => {
  const payload = await generateBackupPayload();
  return JSON.stringify(payload, null, 2);
};

export const validateBackupPayload = (data: any): { isValid: boolean; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid backup structure: expected a JSON object.' };
  }
  if (!data.schemaVersion || typeof data.schemaVersion !== 'number') {
    return { isValid: false, error: 'Missing or invalid schema version.' };
  }
  if (data.schemaVersion > BACKUP_SCHEMA_VERSION) {
    return { isValid: false, error: `Backup is from a newer app version (v${data.schemaVersion}).` };
  }
  if (!Array.isArray(data.prayerLedger) && !data.prayerTracker) {
    return { isValid: false, error: 'Backup does not contain valid prayer records.' };
  }
  return { isValid: true };
};

export const restoreBackupFromJson = async (
  jsonString: string
): Promise<{ success: boolean; restoredCount: number; error?: string }> => {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateBackupPayload(parsed);
    if (!validation.isValid) {
      return { success: false, restoredCount: 0, error: validation.error };
    }

    const payload = parsed as SalahFirstBackupData;

    // 1. Pre-restore snapshot of existing data to guarantee rollback safety
    const currentBackup = await generateBackupPayload();
    await storage.set('@salahfirst_pre_restore_snapshot', currentBackup);

    // 2. Merge ledger events safely without destroying unique past events
    const currentLedger = await storage.get<PrayerCompletionEvent[]>(
      APP_CONFIG.storageKeys.prayerLedger,
      []
    );
    const existingRefs = new Set(currentLedger.map((e) => e.occurrenceRef));
    const mergedLedger = [...currentLedger];

    let newEventCount = 0;
    (payload.prayerLedger || []).forEach((event) => {
      if (event && event.occurrenceRef && !existingRefs.has(event.occurrenceRef)) {
        mergedLedger.push(event);
        existingRefs.add(event.occurrenceRef);
        newEventCount++;
      }
    });

    // 3. Merge legacy date-tracker records
    const currentTracker = await storage.get<Record<string, Record<string, boolean>>>(
      APP_CONFIG.storageKeys.prayerTracker,
      {}
    );
    const mergedTracker = { ...currentTracker };

    Object.entries(payload.prayerTracker || {}).forEach(([dateKey, dayPrayers]) => {
      mergedTracker[dateKey] = {
        ...(mergedTracker[dateKey] || {}),
        ...dayPrayers,
      };
    });

    // 3.5. Merge Sunnah tracker history
    const currentSunnah = await storage.get<Record<string, Record<string, boolean>>>(
      APP_CONFIG.storageKeys.sunnahHistory,
      {}
    );
    const mergedSunnah = { ...currentSunnah };
    Object.entries(payload.sunnahTracker || {}).forEach(([dateKey, daySunnah]) => {
      mergedSunnah[dateKey] = {
        ...(mergedSunnah[dateKey] || {}),
        ...daySunnah,
      };
    });

    // 4. Commit all updates transactionally
    await Promise.all([
      storage.set(APP_CONFIG.storageKeys.prayerLedger, mergedLedger),
      storage.set(APP_CONFIG.storageKeys.prayerTracker, mergedTracker),
      storage.set(APP_CONFIG.storageKeys.sunnahHistory, mergedSunnah),
      payload.prayerCycle ? storage.set(APP_CONFIG.storageKeys.prayerCycle, payload.prayerCycle) : Promise.resolve(),
      payload.hadithBookmarks ? storage.set(APP_CONFIG.storageKeys.hadithBookmarks, payload.hadithBookmarks) : Promise.resolve(),
      payload.calculationMethod ? storage.set(APP_CONFIG.storageKeys.calculationMethod, payload.calculationMethod) : Promise.resolve(),
      payload.juristicMethod ? storage.set(APP_CONFIG.storageKeys.juristicMethod, payload.juristicMethod) : Promise.resolve(),
      payload.prayerAdjustments ? storage.set(APP_CONFIG.storageKeys.prayerAdjustments, payload.prayerAdjustments) : Promise.resolve(),
    ]);

    const totalRestored =
      newEventCount > 0
        ? newEventCount
        : Object.values(payload.prayerTracker || {}).reduce(
            (acc, day) => acc + Object.values(day || {}).filter(Boolean).length,
            0
          ) +
          Object.keys(payload.sunnahTracker || {}).length +
          (payload.hadithBookmarks?.length || 0);

    return { success: true, restoredCount: totalRestored };
  } catch (err: any) {
    return { success: false, restoredCount: 0, error: err?.message || 'Failed to parse backup JSON.' };
  }
};

