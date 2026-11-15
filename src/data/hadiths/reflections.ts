import { HadithItem } from './types';

export interface HadithReflection {
  en: string;
  ur: string;
  ar: string;
}

const CATEGORY_REFLECTIONS: Record<'salah' | 'wudu' | 'khushoo' | 'congregation' | 'character', HadithReflection[]> = {
  salah: [
    {
      en: 'Praying on time trains your brain that nothing in the world is bigger than your appointment with Allah.',
      ur: 'وقت پر نماز پڑھنا ذہن کو سکھاتا ہے کہ دنیا کی کوئی مصروفیت اللہ سے ملاقات سے بڑی نہیں۔',
      ar: 'الصلاة في وقتها تدرب قلبك على أن موعدك مع الله أهم من كل مشاغل الدنيا.',
    },
    {
      en: 'Every Salah washes away the mental dust and slips of the past few hours so you start fresh.',
      ur: 'ہر نماز پچھلے چند گھنٹوں کی غفلت اور خطاؤں کو دھو کر آپ کو نیا آغاز دیتی ہے۔',
      ar: 'كل صلاة تغسل غبار الساعات الماضية وتمنحك بداية نقية جديدة.',
    },
    {
      en: 'Guard your Fajr and Asr—they are the two anchors that protect the start and end of your day.',
      ur: 'فجر اور عصر کی حفاظت کریں—یہ دو نمازیں آپ کے پورے دن کے آغاز اور اختتام کی محافظ ہیں۔',
      ar: 'حافظ على الفجر والعصر؛ فهما ركيزتا يومك اللتان تحفظان بدايته وختامه.',
    },
    {
      en: 'When life feels overwhelming, remember the Prophet ﷺ called Salah his comfort and relief (`Arihna biha`).',
      ur: 'جب زندگی بھاری لگے تو یاد رکھیں نبی ﷺ نے نماز کو اپنے دل کا سکون اور راحت قرار دیا ہے۔',
      ar: 'حين تثقل عليك الحياة، تذكر أن النبي ﷺ جعل الصلاة راحةً لقلبه وقرةً لعينه.',
    },
  ],
  wudu: [
    {
      en: 'Perform Wudu mindfully: as water leaves your hands and face, visualize your stress and sins leaving with it.',
      ur: 'توجہ کے ساتھ وضو کریں: پانی کے قطروں کے ساتھ اپنے گناہوں اور ذہنی تناؤ کو دھلتے ہوئے محسوس کریں۔',
      ar: 'توضأ بحضور قلب، واستشعر مع قطرات الماء زوال الخطايا والهموم عن جوارحك.',
    },
    {
      en: 'Every single step you take toward the prayer mat or Masjid deletes a sin and upgrades your rank.',
      ur: 'مسجد یا جائے نماز کی طرف اٹھایا گیا ہر قدم ایک گناہ مٹاتا اور ایک درجہ بلند کرتا ہے۔',
      ar: 'كل خطوة تخطوها نحو الصلاة تمحو عنك خطيئة وترفع لك عند الله درجة.',
    },
    {
      en: 'The minutes between Azan and Iqamah are a golden window where Duas are never rejected.',
      ur: 'اذان اور اقامت کے درمیان کے لمحات قبولیتِ دعا کا سنہری وقت ہیں، انہیں ضائع نہ کریں۔',
      ar: 'الدقائق بين الأذان والإقامة وقت ذهبي لا يُرد فيه الدعاء، فاغتنمها.',
    },
    {
      en: 'Going to sleep in a state of Wudu brings angelic protection and Duas of forgiveness all night long.',
      ur: 'باوضو ہو کر سونا پوری رات فرشتوں کی حفاظت اور دعائے مغفرت کا ذریعہ بنتا ہے۔',
      ar: 'النوم على طهارة يحيطك بحفظ الملائكة ودعائهم لك بالمغفرة طوال الليل.',
    },
  ],
  khushoo: [
    {
      en: 'You are never closer to Allah than when your forehead touches the ground in Sajdah—pour your heart out there.',
      ur: 'انسان سجدے کی حالت میں اپنے رب کے سب سے زیادہ قریب ہوتا ہے—اپنے دل کی ہر بات سجدے میں کہہ دیں۔',
      ar: 'أقرب ما تكون من ربك وأنت ساجد؛ فاسكب حاجات قلبك كلها في سجودك.',
    },
    {
      en: 'Don’t rush your Ruku and Sajdah—pause for two calm breaths so your heart catches up with your body.',
      ur: 'رکوع اور سجدے میں جلدی نہ کریں—دو لمحے سکون سے ٹھہریں تاکہ آپ کا دل بھی جسم کے ساتھ حاضر ہو سکے۔',
      ar: 'لا تستعجل في ركوعك وسجودك؛ تمهّل لحظات حتى يطمئن قلبك بين يدي الله.',
    },
    {
      en: 'Reciting Ayat al-Kursi right after Salah takes less than a minute and builds a direct bridge to Jannah.',
      ur: 'ہر فرض نماز کے بعد ایک منٹ نکال کر آیت الکرسی پڑھنا جنت کی ضمانت ہے۔',
      ar: 'قراءة آية الكرسي دبر كل صلاة لا تستغرق دقيقة ولكنها تفتح لك طريق الجنة.',
    },
    {
      en: 'End every prayer asking Allah: "Help me remember You, thank You, and worship You well."',
      ur: 'ہر نماز کے آخر میں اللہ سے ضرور مانگیں: اے اللہ! اپنے ذکر، شکر اور بہترین عبادت پر میری مدد فرما۔',
      ar: 'اختم صلاتك دائماً بـ «اللهم أعني على ذكرك وشكرك وحسن عبادتك».',
    },
  ],
  congregation: [
    {
      en: 'Praying in congregation multiplies your reward 27x and connects you to a brotherhood of believers.',
      ur: 'باجماعت نماز آپ کے ثواب کو 27 گنا بڑھا دیتی ہے اور مومنوں کے دلوں کو جوڑتی ہے۔',
      ar: 'صلاة الجماعة تضاعف أجرك سبعاً وعشرين درجة وتحيي روح الأخوة في قلبك.',
    },
    {
      en: 'Protecting the 12 daily Sunnah Rak’ahs quietly builds your eternal home in Paradise day by day.',
      ur: 'دن بھر کی 12 سنتِ مؤکدہ کی پابندی روزانہ جنت میں آپ کے لیے ایک محل تعمیر کرتی ہے۔',
      ar: 'المحافظة على السنن الرواتب الاثنتي عشرة تبني لك بيتاً في الجنة كل يوم.',
    },
    {
      en: 'Two quick Rak’ahs of Duha in the morning pay the charity due on every single joint in your body.',
      ur: 'صبح کے وقت چاشت (ضحیٰ) کی دو رکعتیں جسم کے ہر جوڑ کے صدقے کا حق ادا کر دیتی ہیں۔',
      ar: 'ركعتا الضحى في الصباح تجزئان عن صدقة كل مفصل في جسدك.',
    },
    {
      en: 'Seal your night with Witr before sleeping so the final record of your day is standing before Allah.',
      ur: 'سونے سے پہلے وتر ضرور ادا کریں تاکہ آپ کے دن کا اختتام اللہ کے حضور عبادت پر ہو۔',
      ar: 'اختم ليلتك بصلاة الوتر ليكون آخر عهد يومك وقوفاً بين يدي الله.',
    },
  ],
  character: [
    {
      en: 'In the quiet last third of the night, Allah Himself asks: "Who is calling upon Me so I may answer him?"',
      ur: 'رات کے آخری پہر کی خاموشی میں ربِ کائنات خود پکارتا ہے: ہے کوئی مانگنے والا کہ میں اسے عطا کروں؟',
      ar: 'في هدأة الثلث الأخير من الليل ينادي ربك: من يدعوني فأستجيب له؟',
    },
    {
      en: 'Allah loves small deeds done consistently—never underestimate a steady daily habit of Salah and Dhikr.',
      ur: 'اللہ کو وہ عمل سب سے زیادہ محبوب ہے جو پابندی سے کیا جائے خواہ وہ تھوڑا ہی کیوں نہ ہو۔',
      ar: 'أحب الأعمال إلى الله أدومها وإن قل؛ فالثبات اليومي سر البركة والقبول.',
    },
    {
      en: 'Waking up for Fajr breaks the three knots of laziness and launches your morning with energy and clarity.',
      ur: 'فجر کے لیے بیدار ہونا سستی کی گرہیں کھول دیتا ہے اور آپ کے دن کو توانائی اور خوش دلی سے بھر دیتا ہے۔',
      ar: 'الاستيقاظ لصلاة الفجر يحل عقد الكسل ويمنحك نشاطاً وانشراح صدر طوال يومك.',
    },
    {
      en: 'True Salah transforms how you treat people—nothing weighs heavier on your scale than noble character.',
      ur: 'حقیقی نماز انسان کے اخلاق کو سنوارتی ہے، اور قیامت کے دن اچھے اخلاق سے وزنی کوئی عمل نہ ہوگا۔',
      ar: 'الصلاة الصادقة تثمر خلقاً حسناً، وما من شيء أثقل في الميزان من حسن الخلق.',
    },
  ],
};

export const getHadithReflection = (
  hadith: HadithItem,
  index: number,
  lang: 'en' | 'ur' | 'ar'
): string => {
  if (lang === 'ur' && hadith.reflectionUr) return hadith.reflectionUr;
  if (lang === 'ar' && hadith.reflectionAr) return hadith.reflectionAr;
  if (lang === 'en' && hadith.reflectionEn) return hadith.reflectionEn;
  if (hadith.reflectionEn) return hadith.reflectionEn;

  const catKey: keyof typeof CATEGORY_REFLECTIONS =
    index < 20
      ? 'salah'
      : index < 40
      ? 'wudu'
      : index < 60
      ? 'khushoo'
      : index < 80
      ? 'congregation'
      : 'character';

  const list = CATEGORY_REFLECTIONS[catKey];
  const item = list[index % list.length];
  return item[lang] || item.en;
};
