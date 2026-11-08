import { InspirationItem } from './types';

export const SCRIPTURE_REMINDERS: InspirationItem[] = [
  // 8. Authentic Quranic Verses
  {
    id: 'insp_verse_01',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Al-Baqarah 2:152',
    title: {
      en: 'Remember Me (Quran 2:152)',
      ur: 'مجھ کو یاد رکھو (البقرہ: 152)',
      ar: 'فاذكروني أذكركم (البقرة: ١٥٢)',
    },
    body: {
      en: '"So remember Me; I will remember you. And be grateful to Me and do not deny Me."',
      ur: '"پس تم مجھ کو یاد رکھو، میں تمہیں یاد رکھوں گا، اور میرا شکر ادا کرو اور ناشکری نہ کرو۔"',
      ar: '﴿فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ﴾',
    },
  },
  {
    id: 'insp_verse_02',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Ash-Sharh 94:6',
    title: {
      en: 'Ease with Hardship (Quran 94:6)',
      ur: 'مشکل کے ساتھ آسانی (الشرح: 6)',
      ar: 'إن مع العسر يسراً (الشرح: ٦)',
    },
    body: {
      en: '"Indeed, with hardship will be ease."',
      ur: '"بے شک ہر تنگی کے ساتھ آسانی ہے۔"',
      ar: '﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',
    },
  },
  {
    id: 'insp_verse_03',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Ar-Ra’d 13:28',
    title: {
      en: 'Peace of Hearts (Quran 13:28)',
      ur: 'دلوں کا سکون (الرعد: 28)',
      ar: 'ألا بذكر الله تطمئن القلوب (الرعد: ٢٨)',
    },
    body: {
      en: '"Unquestionably, by the remembrance of Allah hearts are assured."',
      ur: '"سن لو! اللہ کی یاد ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔"',
      ar: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
    },
  },
  {
    id: 'insp_verse_04',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Al-Baqarah 2:186',
    title: {
      en: 'He is Near (Quran 2:186)',
      ur: 'وہ قریب ہے (البقرہ: 186)',
      ar: 'فإني قريب (البقرة: ١٨٦)',
    },
    body: {
      en: '"And when My servants ask you concerning Me, indeed I am near. I respond to the invocations of the caller."',
      ur: '"اور جب میرے بندے آپ سے میرے متعلق پوچھیں، تو میں یقیناً قریب ہوں۔ دعا کرنے والے کی دعا قبول کرتا ہوں۔"',
      ar: '﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ﴾',
    },
  },
  {
    id: 'insp_verse_05',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Al-Imran 3:139',
    title: {
      en: 'Do Not Weaken (Quran 3:139)',
      ur: 'غمگین نہ ہو (آل عمران: 139)',
      ar: 'ولا تهنوا ولا تحزنوا (آل عمران: ١٣٩)',
    },
    body: {
      en: '"So do not weaken and do not grieve, and you will be superior if you are [true] believers."',
      ur: '"اور تم کمزور نہ پڑو اور نہ غم کرو، اور تم ہی غالب رہو گے اگر تم مومن ہو۔"',
      ar: '﴿وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ﴾',
    },
  },
  {
    id: 'insp_verse_06',
    category: 'quranic_verses',
    sourceType: 'quran',
    reference: 'Surah Ibrahim 14:7',
    title: {
      en: 'I Will Increase You (Quran 14:7)',
      ur: 'نعمتوں میں اضافہ (ابراہیم: 7)',
      ar: 'لئن شكرتم لأزيدنكم (إبراهيم: ٧)',
    },
    body: {
      en: '"If you are grateful, I will surely increase you [in favor]."',
      ur: '"اگر تم شکر ادا کرو گے تو میں تمہیں اور زیادہ دوں گا۔"',
      ar: '﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾',
    },
  },

  // 9. Authentic Hadith Reminders
  {
    id: 'insp_hadith_01',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Sahih al-Bukhari 6407',
    title: {
      en: 'Beloved Deeds (Bukhari 6407)',
      ur: 'پسندیدہ اعمال (بخاری: 6407)',
      ar: 'أحب الأعمال إلى الله (البخاري: ٦٤٠٧)',
    },
    body: {
      en: 'The Prophet ﷺ said: "The most beloved deeds to Allah are those done regularly, even if they are few."',
      ur: 'نبی کریم ﷺ نے فرمایا: "اللہ کو سب سے محبوب عمل وہ ہے جو پابندی سے کیا جائے، خواہ وہ تھوڑا ہی ہو۔"',
      ar: 'قال رسول الله ﷺ: «أحبُّ الأعمالِ إلى اللهِ أدْومُها وإن قَلَّ».',
    },
  },
  {
    id: 'insp_hadith_02',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Sahih Muslim 223',
    title: {
      en: 'Cleanliness is Half of Faith (Muslim 223)',
      ur: 'طہارت نصف ایمان ہے (مسلم: 223)',
      ar: 'الطهور شطر الإيمان (مسلم: ٢٢٣)',
    },
    body: {
      en: 'The Prophet ﷺ said: "Cleanliness is half of faith, and Alhamdulillah fills the scale."',
      ur: 'رسول اللہ ﷺ نے فرمایا: "پاکیزگی نصف ایمان ہے اور الحمد للہ میزان کو بھر دیتا ہے۔"',
      ar: 'قال رسول الله ﷺ: «الطَّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ».',
    },
  },
  {
    id: 'insp_hadith_03',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Jami` at-Tirmidhi 1956',
    title: {
      en: 'A Smile is Charity (Tirmidhi 1956)',
      ur: 'مسکراہٹ بھی صدقہ ہے (ترمذی: 1956)',
      ar: 'تبسمك صدقة (الترمذي: ١٩٥٦)',
    },
    body: {
      en: 'The Prophet ﷺ said: "Your smiling in the face of your brother is charity for you."',
      ur: 'نبی کریم ﷺ نے فرمایا: "اپنے بھائی کے سامنے مسکرانا بھی تمہارے لیے صدقہ ہے۔"',
      ar: 'قال رسول الله ﷺ: «تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ».',
    },
  },
  {
    id: 'insp_hadith_04',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Sahih al-Bukhari 13',
    title: {
      en: 'Love for Your Brother (Bukhari 13)',
      ur: 'بھائی چارے کی علامت (بخاری: 13)',
      ar: 'حب الخير للغير (البخاري: ١٣)',
    },
    body: {
      en: 'The Prophet ﷺ said: "None of you truly believes until he loves for his brother what he loves for himself."',
      ur: 'نبی کریم ﷺ نے فرمایا: "تم میں سے کوئی مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔"',
      ar: 'قال رسول الله ﷺ: «لا يُؤْمِنُ أحَدُكُمْ حتَّى يُحِبَّ لأخِيهِ ما يُحِبُّ لِنَفْسِهِ».',
    },
  },
  {
    id: 'insp_hadith_05',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Sunan Abu Dawud 4941',
    title: {
      en: 'Kindness Adorns (Abu Dawud 4941)',
      ur: 'نرمی کی خوبصورتی (ابو داؤد: 4941)',
      ar: 'الرفق يزين كل شيء (أبو داود: ٤٩٤١)',
    },
    body: {
      en: 'The Prophet ﷺ said: "Kindness is not in anything except that it adorns it."',
      ur: 'نبی کریم ﷺ نے فرمایا: "نرمی جس چیز میں بھی ہو اسے خوبصورت بنا دیتی ہے۔"',
      ar: 'قال رسول الله ﷺ: «مَا كَانَ الرِّفْقُ فِي شَيْءٍ إِلا زَانَهُ».',
    },
  },
  {
    id: 'insp_hadith_06',
    category: 'hadith_reminders',
    sourceType: 'hadith',
    reference: 'Sahih Muslim 2699',
    title: {
      en: 'Seeking Knowledge (Muslim 2699)',
      ur: 'علم کا راستہ (مسلم: 2699)',
      ar: 'طلب العلم وطريق الجنة (مسلم: ٢٦٩٩)',
    },
    body: {
      en: 'The Prophet ﷺ said: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise."',
      ur: 'رسول اللہ ﷺ نے فرمایا: "جو شخص علم کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔"',
      ar: 'قال رسول الله ﷺ: «مَن سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إلى الجَنَّةِ».',
    },
  },
];
