export interface DhikrPhase {
  arabic: string;
  transliteration: string;
  translation: string;
  translationKey: string;
  target: number;
}

export const DHIKR_PHASES: DhikrPhase[] = [
  {
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    translationKey: 'dhikrSubhanAllahTrans',
    target: 33,
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    translationKey: 'dhikrAlhamdulillahTrans',
    target: 33,
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    translationKey: 'dhikrAllahuAkbarTrans',
    target: 33,
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'None has the right to be worshipped except Allah',
    translationKey: 'dhikrLaIlahaIllallahTrans',
    target: 33,
  },
  {
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    translationKey: 'dhikrAstaghfirullahTrans',
    target: 33,
  },
];
