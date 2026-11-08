import { InspirationItem, InspirationCategory } from './types';
import { REMINDERS_CORE } from './remindersCore';
import { REMINDERS_REMEMBRANCE } from './remindersRemembrance';
import { CATEGORY_REMINDERS_PART2 } from './categoryRemindersPart2';
import { SCRIPTURE_REMINDERS } from './scriptureReminders';

export * from './types';

export const ALL_INSPIRATION_ITEMS: InspirationItem[] = [
  ...REMINDERS_CORE,
  ...REMINDERS_REMEMBRANCE,
  ...CATEGORY_REMINDERS_PART2,
  ...SCRIPTURE_REMINDERS,
];

export const getInspirationById = (id: string): InspirationItem | undefined => {
  return ALL_INSPIRATION_ITEMS.find((item) => item.id === id);
};

export const getInspirationsByCategory = (
  category: InspirationCategory
): InspirationItem[] => {
  return ALL_INSPIRATION_ITEMS.filter((item) => item.category === category);
};
