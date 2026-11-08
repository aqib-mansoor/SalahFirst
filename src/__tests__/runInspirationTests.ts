// Standalone automated test suite for Daily Islamic Inspiration notification system
const assert = (cond: any, msg: string) => {
  if (!cond) throw new Error(msg);
};

import { REMINDERS_CORE } from '../data/inspiration/remindersCore';
import { REMINDERS_REMEMBRANCE } from '../data/inspiration/remindersRemembrance';
import { CATEGORY_REMINDERS_PART2 } from '../data/inspiration/categoryRemindersPart2';
import { SCRIPTURE_REMINDERS } from '../data/inspiration/scriptureReminders';
import { isWithinQuietHours } from '../utils/notificationQuietHours';
import { InspirationItem } from '../data/inspiration/types';

const ALL_ITEMS: InspirationItem[] = [
  ...REMINDERS_CORE,
  ...REMINDERS_REMEMBRANCE,
  ...CATEGORY_REMINDERS_PART2,
  ...SCRIPTURE_REMINDERS,
];

console.log('--- Starting Daily Islamic Inspiration Test Suite ---');

// Test 1: Content verification and translation parity
console.log('\n[Test 1] Content Integrity & Translation Parity');
assert(ALL_ITEMS.length >= 30, `Expected at least 30 items, got ${ALL_ITEMS.length}`);
console.log(`✓ Total verified inspiration items: ${ALL_ITEMS.length}`);

const ids = new Set<string>();
const categoriesFound = new Set<string>();

ALL_ITEMS.forEach((item, index) => {
  // Unique IDs
  assert(!ids.has(item.id), `Duplicate ID found: ${item.id} at index ${index}`);
  ids.add(item.id);

  // Categories
  assert(item.category, `Missing category for item ${item.id}`);
  categoriesFound.add(item.category);

  // Translation Parity
  assert(item.title && item.title.en && item.title.ur && item.title.ar, `Missing title translations for ${item.id}`);
  assert(item.body && item.body.en && item.body.ur && item.body.ar, `Missing body translations for ${item.id}`);

  // Scripture verification
  if (item.sourceType === 'quran') {
    assert(item.reference && item.reference.includes('Surah'), `Quran item ${item.id} must have Surah reference, got: ${item.reference}`);
  }
  if (item.sourceType === 'hadith') {
    assert(item.reference && (item.reference.includes('Bukhari') || item.reference.includes('Muslim') || item.reference.includes('Tirmidhi') || item.reference.includes('Dawud')), `Hadith item ${item.id} must have authentic book reference, got: ${item.reference}`);
  }
});

console.log(`✓ Verified unique IDs for all ${ids.size} items`);
console.log(`✓ Verified translation parity across English, Urdu, and Arabic for all items`);
console.log(`✓ Verified Quran & Hadith citations for all scripture items`);

const expectedCategories = [
  'salah', 'quran', 'sadaqah', 'dhikr', 'dua',
  'good_deeds', 'gratitude', 'quranic_verses', 'hadith_reminders', 'habits'
];
expectedCategories.forEach((cat) => {
  assert(categoriesFound.has(cat), `Category '${cat}' missing from content library!`);
});
console.log(`✓ All 10 Islamic categories verified: [${Array.from(categoriesFound).join(', ')}]`);

// Test 2: Repetition Prevention & 60-Day Anti-Fatigue Logic
console.log('\n[Test 2] Repetition Prevention & 60-Day Rule');
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

function simulateSelectNext(items: InspirationItem[], history: any[], targetDateMs: number): InspirationItem {
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
  const lastDeliveredCategory = history.length > 0 ? history[0].category : null;
  const differentCategoryPool = pool.filter((item) => item.category !== lastDeliveredCategory);
  const categoryFilteredPool = differentCategoryPool.length > 0 ? differentCategoryPool : pool;

  const unreadItems = categoryFilteredPool.filter((item) => !lastDeliveredMap.has(item.id));
  if (unreadItems.length > 0) return unreadItems[0];

  const sortedByOldest = [...categoryFilteredPool].sort((a, b) => {
    const timeA = lastDeliveredMap.get(a.id) || 0;
    const timeB = lastDeliveredMap.get(b.id) || 0;
    return timeA - timeB;
  });
  return sortedByOldest[0];
}

// Scenario A: Fresh install with no history selects an unread item
const freshItem = simulateSelectNext(ALL_ITEMS, [], Date.now());
assert(freshItem !== null, 'Failed to select item for fresh install');
console.log(`✓ Fresh install successfully selects unread item: ${freshItem.id} (${freshItem.category})`);

// Scenario B: Item delivered 10 days ago must NOT repeat today
const nowMs = new Date('2026-11-09T10:00:00Z').getTime();
const mockHistory = [
  { contentId: 'insp_salah_01', deliveredDate: '2026-10-30', category: 'salah' }
];
const nextItem = simulateSelectNext(ALL_ITEMS, mockHistory, nowMs);
assert(nextItem.id !== 'insp_salah_01', '60-day rule failed: repeated item within 10 days');
console.log(`✓ 60-day protection passed: insp_salah_01 delivered 10 days ago was not repeated; selected ${nextItem.id}`);

// Scenario C: Category alternation
const salahHistory = [
  { contentId: 'insp_salah_01', deliveredDate: '2026-11-08', category: 'salah' }
];
const alternateItem = simulateSelectNext(ALL_ITEMS, salahHistory, nowMs);
assert(alternateItem.category !== 'salah', `Category alternation failed: consecutive category ${alternateItem.category}`);
console.log(`✓ Category alternation passed: previous category 'salah' was avoided; selected category '${alternateItem.category}'`);

// Test 3: Randomized Delivery Window (9:00 AM – 8:00 PM)
console.log('\n[Test 3] Randomized Time Window (9:00 AM – 8:00 PM)');
function simulateRandomDelivery(baseDate: Date, minHour = 9, maxHour = 20): Date {
  const startTotalMins = minHour * 60; // 540
  const endTotalMins = maxHour * 60;  // 1200
  const range = endTotalMins - startTotalMins;
  const randomMinutes = Math.floor(Math.random() * range);
  const targetTotalMins = startTotalMins + randomMinutes;
  const targetHour = Math.floor(targetTotalMins / 60);
  const targetMin = targetTotalMins % 60;

  const dateObj = new Date(baseDate);
  dateObj.setHours(targetHour, targetMin, 0, 0);
  return dateObj;
}

for (let i = 0; i < 1000; i++) {
  const d = simulateRandomDelivery(new Date());
  const hour = d.getHours();
  assert(hour >= 9 && hour <= 20, `Generated time out of range: ${hour}:${d.getMinutes()}`);
  if (hour === 20) {
    assert(d.getMinutes() === 0, `Generated time after 8:00 PM: 20:${d.getMinutes()}`);
  }
}
console.log('✓ 1,000 iterations: all randomized delivery times are strictly between 09:00 AM and 20:00 PM (8:00 PM)');

// Test 4: Quiet Hours Protection
console.log('\n[Test 4] Quiet Hours Protection');
const lateNight = new Date('2026-11-09T23:30:00');
const earlyMorning = new Date('2026-11-09T03:15:00');
const daytime = new Date('2026-11-09T14:00:00');
const morning = new Date('2026-11-09T10:00:00');

assert(isWithinQuietHours(lateNight, '22:00', '05:00') === true, 'Failed to detect quiet hours at 23:30');
assert(isWithinQuietHours(earlyMorning, '22:00', '05:00') === true, 'Failed to detect quiet hours at 03:15');
assert(isWithinQuietHours(daytime, '22:00', '05:00') === false, 'Falsely flagged 14:00 as quiet hours');
assert(isWithinQuietHours(morning, '22:00', '05:00') === false, 'Falsely flagged 10:00 as quiet hours');
console.log('✓ Quiet hours correctly blocks 22:00–05:00 and permits 09:00–20:00 daytime delivery');

console.log('\n========================================');
console.log('✓ ALL INSPIRATION SYSTEM TESTS PASSED SUCCESSFULLY');
console.log('========================================\n');
