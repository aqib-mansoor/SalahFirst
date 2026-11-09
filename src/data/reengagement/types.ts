export type ReengagementCategory =
  | 'salah_reminders'
  | 'allah_connection'
  | 'quran_dua'
  | 'hope_returning';

export interface ReengagementItem {
  id: string;
  category: ReengagementCategory;
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

export interface ReengagementHistoryEntry {
  contentId: string;
  deliveredDate: string; // YYYY-MM-DD
  category: ReengagementCategory;
}

export interface ReengagementConfig {
  enabled: boolean;
}
