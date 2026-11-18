import { NativeModules, Platform } from 'react-native';
import { storage } from './storage';
import { APP_CONFIG } from '@/constants/config';
import {
  PrayerCompletionEvent,
  PrayerCycle,
  CalculationMethodName,
  JuristicMethod,
  PrayerMinuteAdjustments,
  UserLocation,
} from '@/types';

const { SystemNavModule } = NativeModules;

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
  streak?: number;
  hijriAdjustment?: number;
  azanReciter?: string;
  timeFormat?: '12h' | '24h';
  userPreferences?: Record<string, any>;
  userLocation?: UserLocation | null;
}

export const generateBackupPayload = async (): Promise<SalahFirstBackupData> => {
  const [
    ledger,
    tracker,
    cycle,
    calcMethod,
    juristic,
    prayerAdjustments,
    bookmarks,
    sunnah,
    legacySunnah,
    streak,
    hijriAdjustment,
    azanReciter,
    timeFormat,
    userPreferences,
    userLocation,
  ] = await Promise.all([
    storage.get<PrayerCompletionEvent[]>(APP_CONFIG.storageKeys.prayerLedger, []),
    storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.prayerTracker, {}),
    storage.get<PrayerCycle | null>(APP_CONFIG.storageKeys.prayerCycle, null),
    storage.get<CalculationMethodName | null>(APP_CONFIG.storageKeys.calculationMethod, null),
    storage.get<JuristicMethod | null>(APP_CONFIG.storageKeys.juristicMethod, null),
    storage.get<PrayerMinuteAdjustments | null>(APP_CONFIG.storageKeys.prayerAdjustments, null),
    storage.get<string[]>(APP_CONFIG.storageKeys.hadithBookmarks, []),
    storage.get<Record<string, Record<string, boolean>>>(APP_CONFIG.storageKeys.sunnahHistory, {}),
    storage.get<Record<string, Record<string, boolean>>>('@salahfirst_sunnah_tracker', {}),
    storage.get<number>(APP_CONFIG.storageKeys.streak, 0),
    storage.get<number>(APP_CONFIG.storageKeys.hijriAdjustment, 0),
    storage.get<string>(APP_CONFIG.storageKeys.azanReciter, 'makkah'),
    storage.get<'12h' | '24h'>(APP_CONFIG.storageKeys.timeFormat, '12h'),
    storage.get<Record<string, any> | null>(APP_CONFIG.storageKeys.userPreferences, null),
    storage.get<UserLocation | null>(APP_CONFIG.storageKeys.userLocation, null),
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
    streak,
    hijriAdjustment,
    azanReciter,
    timeFormat,
    userPreferences: userPreferences || undefined,
    userLocation: userLocation || undefined,
  };
};

export const exportBackupToJson = async (): Promise<string> => {
  const payload = await generateBackupPayload();
  return JSON.stringify(payload, null, 2);
};

export const downloadBackupFile = async (
  existingPayload?: SalahFirstBackupData | null
): Promise<boolean> => {
  if (Platform.OS !== 'android' || !SystemNavModule?.saveBackupJsonFile) return false;
  try {
    const payload = existingPayload || (await generateBackupPayload());
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `salahfirst-backup-${dateStr}.json`;
    const jsonContent = JSON.stringify(payload, null, 2);
    return await SystemNavModule.saveBackupJsonFile(fileName, jsonContent);
  } catch {
    return false;
  }
};

export const pickAndReadBackupFile = async (): Promise<string | null> => {
  if (Platform.OS !== 'android' || !SystemNavModule?.pickBackupJsonFile) return null;
  try {
    return await SystemNavModule.pickBackupJsonFile();
  } catch {
    return null;
  }
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

    const currentBackup = await generateBackupPayload();
    await storage.set('@salahfirst_pre_restore_snapshot', currentBackup);

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

    const currentBookmarks = await storage.get<string[]>(APP_CONFIG.storageKeys.hadithBookmarks, []);
    const mergedBookmarks = Array.from(
      new Set([...currentBookmarks, ...(payload.hadithBookmarks || [])])
    );

    await Promise.all([
      storage.set(APP_CONFIG.storageKeys.prayerLedger, mergedLedger),
      storage.set(APP_CONFIG.storageKeys.prayerTracker, mergedTracker),
      storage.set(APP_CONFIG.storageKeys.sunnahHistory, mergedSunnah),
      storage.set(APP_CONFIG.storageKeys.hadithBookmarks, mergedBookmarks),
      payload.prayerCycle ? storage.set(APP_CONFIG.storageKeys.prayerCycle, payload.prayerCycle) : Promise.resolve(),
      payload.calculationMethod ? storage.set(APP_CONFIG.storageKeys.calculationMethod, payload.calculationMethod) : Promise.resolve(),
      payload.juristicMethod ? storage.set(APP_CONFIG.storageKeys.juristicMethod, payload.juristicMethod) : Promise.resolve(),
      payload.prayerAdjustments ? storage.set(APP_CONFIG.storageKeys.prayerAdjustments, payload.prayerAdjustments) : Promise.resolve(),
      typeof payload.streak === 'number' ? storage.set(APP_CONFIG.storageKeys.streak, payload.streak) : Promise.resolve(),
      typeof payload.hijriAdjustment === 'number' ? storage.set(APP_CONFIG.storageKeys.hijriAdjustment, payload.hijriAdjustment) : Promise.resolve(),
      payload.azanReciter ? storage.set(APP_CONFIG.storageKeys.azanReciter, payload.azanReciter) : Promise.resolve(),
      payload.timeFormat ? storage.set(APP_CONFIG.storageKeys.timeFormat, payload.timeFormat) : Promise.resolve(),
      payload.userPreferences ? storage.set(APP_CONFIG.storageKeys.userPreferences, payload.userPreferences) : Promise.resolve(),
      payload.userLocation ? storage.set(APP_CONFIG.storageKeys.userLocation, payload.userLocation) : Promise.resolve(),
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
