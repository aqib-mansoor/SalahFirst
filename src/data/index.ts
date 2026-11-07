/**
 * Static & Seed Data
 * Bundled offline datasets (e.g. verified Hadith collections, preset cities).
 */

export interface DailyHadith {
  id: string;
  arabic?: string;
  translation: string;
  source: string;
  chapter?: string;
}

export const INITIAL_HADITHS: DailyHadith[] = [
  {
    id: '1',
    translation: 'The most beloved deed to Allah is the prayer performed at its proper time.',
    source: 'Sahih al-Bukhari 527',
  },
  {
    id: '2',
    translation: 'Between a man and disbelief and paganism is the abandonment of prayer.',
    source: 'Sahih Muslim 82',
  },
];

