export interface FocusScripture {
  arabic: string;
  english: string;
  urdu: string;
  reference: string;
}

export const FOCUS_SCRIPTURES: FocusScripture[] = [
  {
    arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
    english: '"And establish prayer for My remembrance."',
    urdu: '"اور میری یاد کے لیے نماز قائم کرو۔"',
    reference: 'Surah Ta-Ha 20:14',
  },
  {
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    english: '"Indeed, prayer has been decreed upon the believers at specified times."',
    urdu: '"بے شک نماز مومنوں پر مقررہ اوقات میں فرض کی گئی ہے۔"',
    reference: 'Surah An-Nisa 4:103',
  },
  {
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
    english: '"Maintain with care the obligatory prayers and stand before Allah, devoutly obedient."',
    urdu: '"سب نمازوں کی حفاظت کرو اور اللہ کے حضور با ادب کھڑے رہو۔"',
    reference: 'Surah Al-Baqarah 2:238',
  },
  {
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    english: '"And seek help through patience and prayer."',
    urdu: '"اور صبر اور نماز کے ساتھ مدد چاہو۔"',
    reference: 'Surah Al-Baqarah 2:45',
  },
  {
    arabic: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ • الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ',
    english: '"Certainly will the believers have succeeded: They who are during their prayer humbly submissive."',
    urdu: '"یقیناً وہ ایمان والے کامیاب ہو گئے جو اپنی نمازوں میں خشوع کرتے ہیں۔"',
    reference: 'Surah Al-Mu\'minun 23:1-2',
  },
  {
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ الصَّلاَةُ لِوَقْتِهَا',
    english: '"The most beloved of deeds to Allah is the prayer offered at its stated time."',
    urdu: '"اللہ کے نزدیک سب سے زیادہ پسندیدہ عمل اپنے وقت پر نماز ادا کرنا ہے۔"',
    reference: 'Sahih al-Bukhari (527)',
  },
  {
    arabic: 'إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاَتُهُ',
    english: '"The first matter that the slave will be brought to account for on the Day of Judgment is prayer."',
    urdu: '"قیامت کے دن بندے کے اعمال میں سے سب سے پہلے نماز کا حساب لیا جائے گا۔"',
    reference: 'Jami` at-Tirmidhi (413)',
  },
  {
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    english: '"My Lord, make me an establisher of prayer and from my descendants."',
    urdu: '"اے میرے رب! مجھے اور میری اولاد کو نماز قائم کرنے والا بنا۔"',
    reference: 'Surah Ibrahim 14:40',
  },
];

export const getRandomFocusScripture = (): FocusScripture => {
  const index = Math.floor(Math.random() * FOCUS_SCRIPTURES.length);
  return FOCUS_SCRIPTURES[index];
};
