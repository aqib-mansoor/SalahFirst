import { ReengagementItem, ReengagementCategory } from './types';
import { SALAH_AND_CONNECTION_REMINDERS } from './salahAndConnectionReminders';
import { QURAN_AND_HOPE_REMINDERS } from './quranAndHopeReminders';

export * from './types';

export const ALL_REENGAGEMENT_ITEMS: ReengagementItem[] = [
  ...SALAH_AND_CONNECTION_REMINDERS,
  ...QURAN_AND_HOPE_REMINDERS,
];

export const getReengagementById = (id: string): ReengagementItem | undefined => {
  return ALL_REENGAGEMENT_ITEMS.find((item) => item.id === id);
};

export const getReengagementsByCategory = (
  category: ReengagementCategory
): ReengagementItem[] => {
  return ALL_REENGAGEMENT_ITEMS.filter((item) => item.category === category);
};
