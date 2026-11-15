/**
 * Complete 140 Verified Offline Hadith Collection
 * 7 Thematic Modules of 20 authentic Hadiths each (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ahmad).
 */

import { HadithItem } from './types';
import { SALAH_VIRTUES_HADITHS } from './salahVirtues';
import { WUDU_PURITY_HADITHS } from './wuduAndPurity';
import { SUJUD_KHUSHOO_HADITHS } from './sujudAndKhushoo';
import { CONGREGATION_SUNNAH_HADITHS } from './congregationSunnah';
import { TAHAJJUD_CHARACTER_HADITHS } from './tahajjudCharacter';
import { YOUTH_HOPE_HADITHS } from './youthAndHope';
import { PEACE_AND_PURPOSE_HADITHS } from './peaceAndPurpose';

export * from './types';
export * from './salahVirtues';
export * from './wuduAndPurity';
export * from './sujudAndKhushoo';
export * from './congregationSunnah';
export * from './tahajjudCharacter';
export * from './youthAndHope';
export * from './peaceAndPurpose';
export * from './reflections';

export const VERIFIED_HADITHS: HadithItem[] = [
  ...SALAH_VIRTUES_HADITHS,
  ...WUDU_PURITY_HADITHS,
  ...SUJUD_KHUSHOO_HADITHS,
  ...CONGREGATION_SUNNAH_HADITHS,
  ...TAHAJJUD_CHARACTER_HADITHS,
  ...YOUTH_HOPE_HADITHS,
  ...PEACE_AND_PURPOSE_HADITHS,
];

export type HadithCategoryId =
  | 'all'
  | 'salah'
  | 'wudu'
  | 'khushoo'
  | 'congregation'
  | 'character'
  | 'youth'
  | 'peace';

export const HADITH_CATEGORY_RANGES: Record<Exclude<HadithCategoryId, 'all'>, [number, number]> = {
  salah: [0, 19],
  wudu: [20, 39],
  khushoo: [40, 59],
  congregation: [60, 79],
  character: [80, 99],
  youth: [100, 119],
  peace: [120, 139],
};

export const getHadithIndicesForCategory = (category: HadithCategoryId): number[] => {
  if (category === 'all') {
    return VERIFIED_HADITHS.map((_, idx) => idx);
  }
  const [start, end] = HADITH_CATEGORY_RANGES[category];
  const indices: number[] = [];
  for (let i = start; i <= end && i < VERIFIED_HADITHS.length; i++) {
    indices.push(i);
  }
  return indices;
};

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
