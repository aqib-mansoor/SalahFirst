import { storage } from './storage';
import { FocusDuration } from '@/types';

export const FOCUS_SESSION_KEY = '@salahfirst_active_focus_session';
const FOCUS_COMPLETED_KEY = '@salahfirst_focus_completed_days';

/** Returns today's date key: YYYY-MM-DD in local time */
const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Mark focus session as completed for a specific prayer today */
export const markFocusCompleted = async (prayerName: string): Promise<void> => {
  try {
    const key = todayKey();
    const map = await storage.get<Record<string, string[]>>(FOCUS_COMPLETED_KEY, {});
    const list = map[key] ?? [];
    if (!list.includes(prayerName.toLowerCase())) list.push(prayerName.toLowerCase());
    map[key] = list;
    await storage.set(FOCUS_COMPLETED_KEY, map);
  } catch {}
};

/** Check if focus was already completed for a prayer today */
export const isFocusCompletedToday = async (prayerName: string): Promise<boolean> => {
  try {
    const key = todayKey();
    const map = await storage.get<Record<string, string[]>>(FOCUS_COMPLETED_KEY, {});
    return (map[key] ?? []).includes(prayerName.toLowerCase());
  } catch {
    return false;
  }
};

export interface FocusSession {
  prayerName: string;
  durationMinutes: FocusDuration;
  startTimestamp: number;
  targetEndTimestamp: number;
  status: 'active' | 'completed' | 'cancelled';
  breachCount?: number;
}

export const createFocusSession = (
  prayerName: string,
  durationMinutes: FocusDuration,
  breachCount: number = 0
): FocusSession => {
  const now = Date.now();
  return {
    prayerName,
    durationMinutes,
    startTimestamp: now,
    targetEndTimestamp: now + durationMinutes * 60 * 1000,
    status: 'active',
    breachCount,
  };
};

export const saveActiveFocusSession = async (session: FocusSession): Promise<void> => {
  await storage.set(FOCUS_SESSION_KEY, session);
};

export const getActiveFocusSession = async (): Promise<FocusSession | null> => {
  return await storage.get<FocusSession | null>(FOCUS_SESSION_KEY, null);
};

export const clearActiveFocusSession = async (): Promise<void> => {
  await storage.remove(FOCUS_SESSION_KEY);
};

export const calculateRemainingSeconds = (session: FocusSession): number => {
  const diffMs = session.targetEndTimestamp - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
};
