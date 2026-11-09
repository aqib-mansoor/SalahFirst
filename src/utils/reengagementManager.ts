import { storage } from './storage';
import {
  ALL_REENGAGEMENT_ITEMS,
  ReengagementItem,
  ReengagementHistoryEntry,
  ReengagementCategory,
} from '@/data/reengagement';

export const REENGAGEMENT_HISTORY_KEY = '@salahfirst_reengagement_history';
export const LAST_ACTIVE_TIME_KEY = '@salahfirst_last_active_time';
export const REENGAGEMENT_CONFIG_KEY = '@salahfirst_reengagement_config';

export const INACTIVITY_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export const recordAppActive = async (timestamp?: number): Promise<void> => {
  const time = timestamp ?? Date.now();
  await storage.set(LAST_ACTIVE_TIME_KEY, time);
};

export const getLastActiveTime = async (): Promise<number | null> => {
  return await storage.get<number | null>(LAST_ACTIVE_TIME_KEY, null);
};

export const isUserInactive = async (nowMs?: number): Promise<boolean> => {
  const lastActive = await getLastActiveTime();
  if (!lastActive) return false; // First launch or no prior session
  const current = nowMs ?? Date.now();
  return current - lastActive >= INACTIVITY_THRESHOLD_MS;
};

export const getReengagementHistory = async (): Promise<ReengagementHistoryEntry[]> => {
  return await storage.get<ReengagementHistoryEntry[]>(REENGAGEMENT_HISTORY_KEY, []);
};

export const hasDeliveredReengagementOnDate = async (dateKey: string): Promise<boolean> => {
  const history = await getReengagementHistory();
  return history.some((h) => h.deliveredDate === dateKey);
};

export const recordReengagementDelivery = async (
  contentId: string,
  dateKey: string,
  category: ReengagementCategory
): Promise<void> => {
  const history = await getReengagementHistory();
  const filtered = history.filter((h) => h.deliveredDate !== dateKey);
  const updated: ReengagementHistoryEntry[] = [
    { contentId, deliveredDate: dateKey, category },
    ...filtered,
  ].slice(0, 180);

  await storage.set(REENGAGEMENT_HISTORY_KEY, updated);
};

export const selectNextReengagement = async (
  targetDateKey: string
): Promise<ReengagementItem | null> => {
  if (ALL_REENGAGEMENT_ITEMS.length === 0) return null;

  const history = await getReengagementHistory();
  const targetDate = new Date(targetDateKey);
  const targetMs = targetDate.getTime();

  const lastDeliveredMap = new Map<string, number>();
  history.forEach((h) => {
    const entryMs = new Date(h.deliveredDate).getTime();
    const existing = lastDeliveredMap.get(h.contentId);
    if (!existing || entryMs > existing) {
      lastDeliveredMap.set(h.contentId, entryMs);
    }
  });

  // 1. Filter out items delivered within last 60 days
  const eligible60Days = ALL_REENGAGEMENT_ITEMS.filter((item) => {
    const lastMs = lastDeliveredMap.get(item.id);
    if (!lastMs) return true;
    return targetMs - lastMs >= SIXTY_DAYS_MS;
  });

  const pool = eligible60Days.length > 0 ? eligible60Days : ALL_REENGAGEMENT_ITEMS;

  // 2. Prevent consecutive category repetition
  const lastDeliveredCategory = history.length > 0 ? history[0].category : null;
  const differentCategoryPool = pool.filter((item) => item.category !== lastDeliveredCategory);
  const categoryFilteredPool = differentCategoryPool.length > 0 ? differentCategoryPool : pool;

  // 3. Prefer unused items
  const unreadItems = categoryFilteredPool.filter((item) => !lastDeliveredMap.has(item.id));
  if (unreadItems.length > 0) {
    const randomIndex = Math.floor(Math.random() * unreadItems.length);
    return unreadItems[randomIndex];
  }

  // 4. Oldest delivered fallback
  const sortedByOldest = [...categoryFilteredPool].sort((a, b) => {
    const timeA = lastDeliveredMap.get(a.id) || 0;
    const timeB = lastDeliveredMap.get(b.id) || 0;
    return timeA - timeB;
  });

  return sortedByOldest[0] || ALL_REENGAGEMENT_ITEMS[0];
};
