export interface FocusScripture {
  id: string;
  type: 'quran' | 'hadith';
  arabic: string;
  english: string;
  urdu: string;
  reference: string;
}

export const VERIFIED_FOCUS_SCRIPTURES: FocusScripture[] = [
  {
    id: 'quran-1',
    type: 'quran',
    arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
    english: '"And establish prayer for My remembrance."',
    urdu: '"اور میری یاد کے لیے نماز قائم کرو۔"',
    reference: 'Surah Ta-Ha 20:14',
  },
  {
    id: 'quran-2',
    type: 'quran',
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    english: '"Indeed, prayer has been decreed upon the believers at specified times."',
    urdu: '"بے شک نماز مومنوں پر مقررہ اوقات میں فرض کی گئی ہے۔"',
    reference: 'Surah An-Nisa 4:103',
  },
  {
    id: 'quran-3',
    type: 'quran',
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
    english: '"Maintain with care the obligatory prayers and stand before Allah, devoutly obedient."',
    urdu: '"سب نمازوں کی حفاظت کرو، بالخصوص درمیانی نماز کی، اور اللہ کے حضور با ادب کھڑے رہو۔"',
    reference: 'Surah Al-Baqarah 2:238',
  },
  {
    id: 'quran-4',
    type: 'quran',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    english: '"And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive."',
    urdu: '"اور صبر اور نماز کے ساتھ مدد چاہو، اور بے شک یہ بھاری ہے مگر خشوع کرنے والوں پر نہیں۔"',
    reference: 'Surah Al-Baqarah 2:45',
  },
  {
    id: 'quran-5',
    type: 'quran',
    arabic: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ • الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ',
    english: '"Certainly will the believers have succeeded: They who are during their prayer humbly submissive."',
    urdu: '"یقیناً وہ ایمان والے کامیاب ہو گئے جو اپنی نمازوں میں خشوع کرتے ہیں۔"',
    reference: 'Surah Al-Mu\'minun 23:1-2',
  },
  {
    id: 'quran-6',
    type: 'quran',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    english: '"My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication."',
    urdu: '"اے میرے رب! مجھے نماز قائم کرنے والا بنا اور میری اولاد میں سے بھی، اور ہماری دعا قبول فرما۔"',
    reference: 'Surah Ibrahim 14:40',
  },
  {
    id: 'quran-7',
    type: 'quran',
    arabic: 'اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    english: '"Recite what is revealed to you of the Book and establish prayer. Indeed, prayer prohibits immorality and wrongdoing."',
    urdu: '"جو کتاب آپ پر وحی کی گئی ہے اس کی تلاوت کریں اور نماز قائم کریں، یقیناً نماز بے حیائی اور برائی سے روکتی ہے۔"',
    reference: 'Surah Al-Ankabut 29:45',
  },
  {
    id: 'quran-8',
    type: 'quran',
    arabic: 'وَأْمُرْ أَهْلَكَ بِالصَّلَاةِ وَاصْطَبِرْ عَلَيْهَا',
    english: '"And enjoin prayer upon your family and be steadfast therein."',
    urdu: '"اور اپنے گھر والوں کو نماز کا حکم دیجیے اور خود بھی اس پر ثابت قدم رہیے۔"',
    reference: 'Surah Ta-Ha 20:132',
  },
  {
    id: 'hadith-1',
    type: 'hadith',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ الصَّلاَةُ لِوَقْتِهَا',
    english: '"The most beloved of deeds to Allah is the prayer offered at its stated time."',
    urdu: '"اللہ کے نزدیک سب سے زیادہ پسندیدہ عمل اپنے وقت پر نماز ادا کرنا ہے۔"',
    reference: 'Sahih al-Bukhari (527)',
  },
  {
    id: 'hadith-2',
    type: 'hadith',
    arabic: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ',
    english: '"The closest that a servant comes to his Lord is while he is in prostration, so supplicate abundantly."',
    urdu: '"بندہ اپنے رب کے سب سے زیادہ قریب سجدے کی حالت میں ہوتا ہے، لہٰذا سجدے میں کثرت سے دعا کیا کرو۔"',
    reference: 'Sahih Muslim (482)',
  },
  {
    id: 'hadith-3',
    type: 'hadith',
    arabic: 'إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاَتُهُ',
    english: '"The first matter that the slave will be brought to account for on the Day of Judgment is his prayer."',
    urdu: '"قیامت کے دن بندے کے اعمال میں سے سب سے پہلے نماز کا حساب لیا جائے گا۔"',
    reference: 'Jami` at-Tirmidhi (413)',
  },
  {
    id: 'hadith-4',
    type: 'hadith',
    arabic: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ',
    english: '"The parable of the five prayers is that of a river bathing a person five times a day, wiping away all impurities."',
    urdu: '"پانچ نمازوں کی مثال ایک ایسی نہر کی ہے جو انسان کو روزانہ پانچ بار نہلاتی ہے، جس سے کوئی میل کچیل باقی نہیں رہتا۔"',
    reference: 'Sahih al-Bukhari (528)',
  },
  {
    id: 'hadith-5',
    type: 'hadith',
    arabic: 'عَلَيْكَ بِكَثْرَةِ السُّجُودِ لِلَّهِ، فَإِنَّكَ لاَ تَسْجُدُ لِلَّهِ سَجْدَةً إِلاَّ رَفَعَكَ اللَّهُ بِهَا دَرَجَةً',
    english: '"Make frequent prostrations to Allah, for you do not make a prostration except that Allah raises you a degree."',
    urdu: '"اللہ کے لیے کثرت سے سجدے کیا کرو، کیونکہ ہر سجدے کے بدلے اللہ تمہارا ایک درجہ بلند کرتا ہے۔"',
    reference: 'Sahih Muslim (488)',
  },
  {
    id: 'hadith-6',
    type: 'hadith',
    arabic: 'وَجُعِلَتْ قُرَّةُ عَيْنِي فِي الصَّلاَةِ',
    english: '"And the coolness of my eyes has been made in prayer."',
    urdu: '"اور میری آنکھوں کی ٹھنڈک نماز میں رکھی گئی ہے۔"',
    reference: 'Sunan an-Nasa\'i (3940)',
  },
  {
    id: 'hadith-7',
    type: 'hadith',
    arabic: 'يَا بِلَالُ أَقِمِ الصَّلَاةَ أَرِحْنَا بِهَا',
    english: '"O Bilal, call for the prayer; bring us comfort and tranquility through it."',
    urdu: '"اے بلال! نماز کی اقامت کہو، اس کے ذریعے ہمیں راحت اور سکون پہنچاؤ۔"',
    reference: 'Sunan Abi Dawud (4985)',
  },
];

let lastScriptureIndex = -1;

/**
 * Returns a new scripture, guaranteeing never to pick the same one back-to-back
 */
export const getNextFocusScripture = (): FocusScripture => {
  const len = VERIFIED_FOCUS_SCRIPTURES.length;
  if (len <= 1) return VERIFIED_FOCUS_SCRIPTURES[0];

  let nextIdx: number;
  do {
    nextIdx = Math.floor(Math.random() * len);
  } while (nextIdx === lastScriptureIndex);

  lastScriptureIndex = nextIdx;
  return VERIFIED_FOCUS_SCRIPTURES[nextIdx];
};

/**
 * Formats bilingual / trilingual text according to user language preference:
 * - en / ur: shows Arabic + English + Urdu + citation
 * - ar: shows Arabic + English + citation
 */
export const formatScriptureForLanguage = (
  scripture: FocusScripture,
  lang: string = 'en'
): { titleBadge: string; textBody: string } => {
  const badge = scripture.type === 'quran' ? 'QURAN' : 'HADITH';

  let body = `${scripture.arabic}\n`;

  if (lang === 'ar') {
    body += `${scripture.english}\n— ${scripture.reference}`;
  } else if (lang === 'ur') {
    body += `${scripture.urdu}\n— ${scripture.reference}`;
  } else {
    body += `${scripture.english}\n${scripture.urdu}\n— ${scripture.reference}`;
  }

  return {
    titleBadge: badge,
    textBody: body,
  };
};
