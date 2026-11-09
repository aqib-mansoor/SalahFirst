/**
 * Static & Seed Data
 * Bundled offline datasets (Quran Ayat, preset cities, verified Hadith).
 */

export * from './hadiths';
export * from './cities';
export * from './wallpaperData';
export * from './inspiration';
export * from './reengagement';

export interface QuranAyah {
  id: string;
  arabic: string;
  urdu: string;
  english: string;
  reference: string;
}

export const SETUP_QURAN_AYAT: QuranAyah[] = [
  {
    id: 'ayah-1',
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ',
    urdu: 'تمام نمازوں کی حفاظت اور پابندی کرو',
    english: 'Guard strictly your five daily prayers.',
    reference: 'Surah Al-Baqarah 2:238',
  },
  {
    id: 'ayah-2',
    arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    urdu: 'بے شک نماز بے حیائی اور برائی سے روکتی ہے',
    english: 'Indeed, prayer prohibits immorality and wrongdoing.',
    reference: 'Surah Al-Ankabut 29:45',
  },
  {
    id: 'ayah-3',
    arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
    urdu: 'اور میری یاد کی خاطر نماز قائم رکھو',
    english: 'And establish prayer for My remembrance.',
    reference: 'Surah Ta-Ha 20:14',
  },
];
