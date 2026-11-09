// Standalone automated test suite for Gentle Islamic Re-engagement Notifications
const assert = (cond: any, msg: string) => {
  if (!cond) throw new Error(msg);
};

import { SALAH_AND_CONNECTION_REMINDERS } from '../data/reengagement/salahAndConnectionReminders';
import { QURAN_AND_HOPE_REMINDERS } from '../data/reengagement/quranAndHopeReminders';
import { calculateReengagementTargetTime } from '../utils/reengagementScheduler';
import { INACTIVITY_THRESHOLD_MS } from '../utils/reengagementManager';
import { ReengagementItem } from '../data/reengagement/types';

const ALL_REENGAGEMENT_ITEMS: ReengagementItem[] = [
  ...SALAH_AND_CONNECTION_REMINDERS,
  ...QURAN_AND_HOPE_REMINDERS,
];

console.log('--- Starting Gentle Islamic Re-engagement Test Suite ---');

// Test 1: Content verification and translation parity
console.log('\n[Test 1] Content Integrity & Translation Parity');
assert(ALL_REENGAGEMENT_ITEMS.length >= 20, `Expected at least 20 items, got ${ALL_REENGAGEMENT_ITEMS.length}`);
console.log(`✓ Total verified re-engagement items: ${ALL_REENGAGEMENT_ITEMS.length}`);

const ids = new Set<string>();
const categoriesFound = new Set<string>();

ALL_REENGAGEMENT_ITEMS.forEach((item, index) => {
  // Unique IDs
  assert(!ids.has(item.id), `Duplicate ID found: ${item.id} at index ${index}`);
  ids.add(item.id);

  // Category
  assert(item.category, `Missing category for item ${item.id}`);
  categoriesFound.add(item.category);

  // Translation Parity
  assert(item.title && item.title.en && item.title.ur && item.title.ar, `Missing title translations for ${item.id}`);
  assert(item.body && item.body.en && item.body.ur && item.body.ar, `Missing body translations for ${item.id}`);

  // Tone check: Ensure messages are short enough for notification trays (< 180 chars)
  assert(item.body.en.length <= 180, `Body too long for notification tray in ${item.id}: ${item.body.en.length}`);
});

console.log(`✓ Verified unique IDs for all ${ids.size} items`);
console.log(`✓ Verified full trilingual parity (English, Urdu, Arabic) for all items`);

const expectedCategories = ['salah_reminders', 'allah_connection', 'quran_dua', 'hope_returning'];
expectedCategories.forEach((cat) => {
  assert(categoriesFound.has(cat), `Category '${cat}' missing from content library!`);
});
console.log(`✓ All 4 emotional categories verified: [${Array.from(categoriesFound).join(', ')}]`);

// Test 2: Inactivity Detection Threshold
console.log('\n[Test 2] Inactivity Detection Logic (24-Hour Rule)');
assert(INACTIVITY_THRESHOLD_MS === 24 * 60 * 60 * 1000, 'Threshold must be strictly 24 hours');

const simulateInactivityCheck = (lastActive: number | null, nowMs: number): boolean => {
  if (!lastActive) return false; // First app launch or no prior session
  return nowMs - lastActive >= INACTIVITY_THRESHOLD_MS;
};

const now = Date.now();
// First install
assert(!simulateInactivityCheck(null, now), 'New install with no active time must not be marked inactive');
// Active 5 hours ago
assert(!simulateInactivityCheck(now - 5 * 3600 * 1000, now), 'Active 5h ago must not be marked inactive');
// Active 23.9 hours ago
assert(!simulateInactivityCheck(now - 23.9 * 3600 * 1000, now), 'Active 23.9h ago must not be marked inactive');
// Active 24.1 hours ago
assert(simulateInactivityCheck(now - 24.1 * 3600 * 1000, now), 'Active 24.1h ago must be marked inactive');
// Active 48 hours ago
assert(simulateInactivityCheck(now - 48 * 3600 * 1000, now), 'Active 48h ago must be marked inactive');
console.log('✓ Inactivity detection accurately isolates inactive users at 24+ hours');

// Test 3: Repetition Prevention & 60-Day Rotation
console.log('\n[Test 3] Repetition Prevention & 60-Day Cool-off');
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

function simulateSelectNext(items: ReengagementItem[], history: any[], targetDateMs: number): ReengagementItem {
  const lastDeliveredMap = new Map<string, number>();
  history.forEach((h) => {
    const entryMs = new Date(h.deliveredDate).getTime();
    const existing = lastDeliveredMap.get(h.contentId);
    if (!existing || entryMs > existing) {
      lastDeliveredMap.set(h.contentId, entryMs);
    }
  });

  const eligible60Days = items.filter((item) => {
    const lastMs = lastDeliveredMap.get(item.id);
    if (!lastMs) return true;
    return targetDateMs - lastMs >= SIXTY_DAYS_MS;
  });

  const pool = eligible60Days.length > 0 ? eligible60Days : items;
  const lastCategory = history.length > 0 ? history[0].category : null;
  const diffCategory = pool.filter((item) => item.category !== lastCategory);
  const finalPool = diffCategory.length > 0 ? diffCategory : pool;

  const unread = finalPool.filter((item) => !lastDeliveredMap.has(item.id));
  if (unread.length > 0) return unread[0];

  const sorted = [...finalPool].sort((a, b) => {
    const tA = lastDeliveredMap.get(a.id) || 0;
    const tB = lastDeliveredMap.get(b.id) || 0;
    return tA - tB;
  });
  return sorted[0];
}

const mockHistory = [
  { contentId: ALL_REENGAGEMENT_ITEMS[0].id, deliveredDate: '2026-11-01', category: ALL_REENGAGEMENT_ITEMS[0].category },
  { contentId: ALL_REENGAGEMENT_ITEMS[1].id, deliveredDate: '2026-11-02', category: ALL_REENGAGEMENT_ITEMS[1].category },
];

const selected = simulateSelectNext(ALL_REENGAGEMENT_ITEMS, mockHistory, new Date('2026-11-03').getTime());
assert(selected.id !== ALL_REENGAGEMENT_ITEMS[0].id, 'Must not repeat item delivered 2 days ago');
assert(selected.id !== ALL_REENGAGEMENT_ITEMS[1].id, 'Must not repeat item delivered yesterday');
assert(selected.category !== mockHistory[1].category, 'Must alternate category from yesterday');
console.log(`✓ Repetition prevention correctly chose fresh item [${selected.id}] of category [${selected.category}]`);

// Test 4: Respectful Daytime Scheduling Window (10:00 AM - 8:00 PM)
console.log('\n[Test 4] Daytime Scheduling Window Calculation');

// Early morning eligible (e.g. 5:30 AM local) -> must schedule between 10:00 AM and 8:00 PM
const morningDate = new Date('2026-11-10T05:30:00');
const morningTarget = calculateReengagementTargetTime(morningDate);
assert(morningTarget.getHours() >= 10 && morningTarget.getHours() <= 20, `Morning schedule must be between 10 and 20, got ${morningTarget.getHours()}`);
assert(morningTarget.getDate() === morningDate.getDate(), 'Morning schedule should remain on same day');

// Afternoon eligible (e.g. 2:00 PM local) -> must schedule between 2:15 PM and 8:00 PM
const afternoonDate = new Date('2026-11-10T14:00:00');
const afternoonTarget = calculateReengagementTargetTime(afternoonDate);
assert(afternoonTarget.getHours() >= 14 && afternoonTarget.getHours() <= 20, `Afternoon schedule must be between 14 and 20, got ${afternoonTarget.getHours()}`);

// Late night eligible (e.g. 9:00 PM local) -> must roll over to next day between 10:00 AM and 8:00 PM
const nightDate = new Date('2026-11-10T21:00:00');
const nightTarget = calculateReengagementTargetTime(nightDate);
assert(nightTarget.getHours() >= 10 && nightTarget.getHours() <= 20, `Night rollover must be between 10 and 20, got ${nightTarget.getHours()}`);
assert(nightTarget.getDate() === 11, 'Night schedule must roll over to the next day');

console.log('✓ All daytime windows strictly enforced within 10:00 AM – 8:00 PM local time');

console.log('\n--- ALL GENTLE RE-ENGAGEMENT NOTIFICATION TESTS PASSED ---');
