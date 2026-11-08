import { storage } from './storage';
import {
  ALL_INSPIRATION_ITEMS,
  InspirationItem,
  InspirationHistoryEntry,
  InspirationCategory,
} from '@/data/inspiration';

export const INSPIRATION_HISTORY_KEY = '@salahfirst_inspiration_history';
export const INSPIRATION_CONFIG_KEY = '@salahfirst_inspiration_config';

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export const getInspirationHistory = async (): Promise<InspirationHistoryEntry[]> => {
  return await storage.get<InspirationHistoryEntry[]>(INSPIRATION_HISTORY_KEY, []);
};

export const hasDeliveredOnDate = async (dateKey: string): Promise<boolean> => {
  const history = await getInspirationHistory();
  return history.some((h) => h.deliveredDate === dateKey);
};

export const recordInspirationDelivery = async (
  contentId: string,
  dateKey: string,
  category: InspirationCategory
): Promise<void> => {
  const history = await getInspirationHistory();
  // Filter out any existing entry for the same day (enforce max 1 delivery per day)
  const filtered = history.filter((h) => h.deliveredDate !== dateKey);
  const updated: InspirationHistoryEntry[] = [
    { contentId, deliveredDate: dateKey, category },
    ...filtered,
  ].slice(0, 180); // Keep last 180 days

  await storage.set(INSPIRATION_HISTORY_KEY, updated);
};

export const selectNextInspiration = async (
  targetDateKey: string
): Promise<InspirationItem | null> => {
  if (ALL_INSPIRATION_ITEMS.length === 0) return null;

  const history = await getInspirationHistory();
  const targetDate = new Date(targetDateKey);
  const targetMs = targetDate.getTime();

  // Map each contentId to its most recent delivery timestamp
  const lastDeliveredMap = new Map<string, number>();
  history.forEach((h) => {
    const entryMs = new Date(h.deliveredDate).getTime();
    const existing = lastDeliveredMap.get(h.contentId);
    if (!existing || entryMs > existing) {
      lastDeliveredMap.set(h.contentId, entryMs);
    }
  });

  // 1. Identify items not used within the last 60 days
  const eligible60Days = ALL_INSPIRATION_ITEMS.filter((item) => {
    const lastMs = lastDeliveredMap.get(item.id);
    if (!lastMs) return true; // Never delivered
    return targetMs - lastMs >= SIXTY_DAYS_MS;
  });

  // Fallback if 60-day pool is exhausted: pick from full list sorted by oldest delivered
  const pool = eligible60Days.length > 0 ? eligible60Days : ALL_INSPIRATION_ITEMS;

  // 2. Identify last delivered category to avoid consecutive category repetition
  const lastDeliveredCategory = history.length > 0 ? history[0].category : null;
  const differentCategoryPool = pool.filter(
    (item) => item.category !== lastDeliveredCategory
  );
  const categoryFilteredPool =
    differentCategoryPool.length > 0 ? differentCategoryPool : pool;

  // 3. Separate completely unread items from previously delivered items
  const unreadItems = categoryFilteredPool.filter(
    (item) => !lastDeliveredMap.has(item.id)
  );

  if (unreadItems.length > 0) {
    // Pick pseudo-randomly from unread items
    const randomIndex = Math.floor(Math.random() * unreadItems.length);
    return unreadItems[randomIndex];
  }

  // 4. Otherwise, pick the item with the oldest lastDelivered date
  const sortedByOldest = [...categoryFilteredPool].sort((a, b) => {
    const timeA = lastDeliveredMap.get(a.id) || 0;
    const timeB = lastDeliveredMap.get(b.id) || 0;
    return timeA - timeB;
  });

  return sortedByOldest[0] || ALL_INSPIRATION_ITEMS[0];
};
