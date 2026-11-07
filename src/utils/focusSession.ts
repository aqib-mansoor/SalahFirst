import { storage } from './storage';
import { SalahName, FocusDuration } from '@/types';

export const FOCUS_SESSION_KEY = '@salahfirst_active_focus_session';

export interface FocusSession {
  prayerName: string;
  durationMinutes: FocusDuration;
  startTimestamp: number;
  targetEndTimestamp: number;
  status: 'active' | 'completed' | 'cancelled';
}

export const createFocusSession = (
  prayerName: string,
  durationMinutes: FocusDuration
): FocusSession => {
  const now = Date.now();
  return {
    prayerName,
    durationMinutes,
    startTimestamp: now,
    targetEndTimestamp: now + durationMinutes * 60 * 1000,
    status: 'active',
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
