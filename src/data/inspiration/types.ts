export type InspirationCategory =
  | 'salah'
  | 'quran'
  | 'sadaqah'
  | 'dhikr'
  | 'dua'
  | 'good_deeds'
  | 'gratitude'
  | 'quranic_verses'
  | 'hadith_reminders'
  | 'habits';

export type InspirationSourceType = 'reminder' | 'quran' | 'hadith';

export interface InspirationItem {
  id: string;
  category: InspirationCategory;
  sourceType: InspirationSourceType;
  reference?: string;
  title: {
    en: string;
    ur: string;
    ar: string;
  };
  body: {
    en: string;
    ur: string;
    ar: string;
  };
}

export interface InspirationHistoryEntry {
  contentId: string;
  deliveredDate: string; // YYYY-MM-DD
  category: InspirationCategory;
}

export interface InspirationConfig {
  enabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "05:00"
}

