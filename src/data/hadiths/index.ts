/**
 * Complete 100 Verified Offline Hadith Collection
 * 5 Thematic Modules of 20 authentic Hadiths each (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i).
 */

import { HadithItem } from './types';
import { SALAH_VIRTUES_HADITHS } from './salahVirtues';
import { WUDU_PURITY_HADITHS } from './wuduAndPurity';
import { SUJUD_KHUSHOO_HADITHS } from './sujudAndKhushoo';
import { CONGREGATION_SUNNAH_HADITHS } from './congregationSunnah';
import { TAHAJJUD_CHARACTER_HADITHS } from './tahajjudCharacter';

export * from './types';
export * from './salahVirtues';
export * from './wuduAndPurity';
export * from './sujudAndKhushoo';
export * from './congregationSunnah';
export * from './tahajjudCharacter';

export const VERIFIED_HADITHS: HadithItem[] = [
  ...SALAH_VIRTUES_HADITHS,
  ...WUDU_PURITY_HADITHS,
  ...SUJUD_KHUSHOO_HADITHS,
  ...CONGREGATION_SUNNAH_HADITHS,
  ...TAHAJJUD_CHARACTER_HADITHS,
];

/**
 * Returns deterministic Hadith of the Day based on Day of Year
 */
export const getDayOfYearHadithIndex = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return (dayOfYear - 1 + VERIFIED_HADITHS.length) % VERIFIED_HADITHS.length;
};

