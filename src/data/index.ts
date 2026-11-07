/**
 * Static & Seed Data
 * Bundled offline datasets (Quran Ayat, preset cities, verified Hadith).
 */

export * from './hadiths';

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

export interface PresetCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  qiblaDegrees: number;
  methodName: string;
}

export const PRESET_CITIES: PresetCity[] = [
  {
    id: '1',
    name: 'Chakwal',
    country: 'Pakistan',
    latitude: 32.9328,
    longitude: 72.8553,
    qiblaDegrees: 256,
    methodName: 'University of Islamic Sciences, Karachi',
  },
  {
    id: '2',
    name: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    qiblaDegrees: 260,
    methodName: 'University of Islamic Sciences, Karachi',
  },
  {
    id: '3',
    name: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5204,
    longitude: 74.3587,
    qiblaDegrees: 260,
    methodName: 'University of Islamic Sciences, Karachi',
  },
  {
    id: '4',
    name: 'Islamabad',
    country: 'Pakistan',
    latitude: 33.6844,
    longitude: 73.0479,
    qiblaDegrees: 255,
    methodName: 'University of Islamic Sciences, Karachi',
  },
  {
    id: '5',
    name: 'Makkah',
    country: 'Saudi Arabia',
    latitude: 21.4225,
    longitude: 39.8262,
    qiblaDegrees: 0,
    methodName: 'Umm al-Qura University, Makkah',
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
    qiblaDegrees: 258,
    methodName: 'Dubai (UAE)',
  },
  {
    id: '7',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    qiblaDegrees: 118,
    methodName: 'Muslim World League',
  },
];
