/**
 * Static & Seed Data
 * Bundled offline datasets (Quran Ayat, preset cities, verified Hadith).
 */

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
}

export const PRESET_CITIES: PresetCity[] = [
  { id: '1', name: 'Chakwal', country: 'Pakistan', latitude: 32.9328, longitude: 72.8553 },
  { id: '2', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { id: '3', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { id: '4', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { id: '5', name: 'Rawalpindi', country: 'Pakistan', latitude: 33.5973, longitude: 73.0479 },
  { id: '6', name: 'Peshawar', country: 'Pakistan', latitude: 34.0151, longitude: 71.5249 },
  { id: '7', name: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { id: '8', name: 'Madinah', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692 },
  { id: '9', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: '10', name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
];
