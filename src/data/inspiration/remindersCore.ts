import { InspirationItem } from './types';

export const REMINDERS_CORE: InspirationItem[] = [
  // 1. Salah & Importance of Prayer
  {
    id: 'insp_salah_01',
    category: 'salah',
    sourceType: 'reminder',
    title: {
      en: 'A Moment with Allah',
      ur: 'اللہ تعالیٰ کے حضور ایک پرسکون لمحہ',
      ar: 'لحظة سكينة بين يدي الله',
    },
    body: {
      en: 'Take a gentle pause from daily tasks to reconnect your heart through prayer.',
      ur: 'دن بھر کی مصروفیات سے چند لمحے نکال کر نماز کے ذریعے اپنے دل کو سکون بخشیے۔',
      ar: 'خذ استراحة هادئة من مشاغل يومك لتجدد صلتك بالله من خلال الصلاة.',
    },
  },
  {
    id: 'insp_salah_02',
    category: 'salah',
    sourceType: 'reminder',
    title: {
      en: 'Light in Your Day',
      ur: 'آپ کے دن کی روشنی',
      ar: 'نور في يومك',
    },
    body: {
      en: 'Each prayer brings renewed clarity and peace to whatever you are carrying.',
      ur: 'ہر نماز آپ کی پریشانیوں کو دور کر کے آپ کے ذہن کو نئی تازگی اور سکون عطا کرتی ہے۔',
      ar: 'كل صلاة تمنحك صفاءً وراحة لما تحمله في قلبك.',
    },
  },
  {
    id: 'insp_salah_03',
    category: 'salah',
    sourceType: 'reminder',
    title: {
      en: 'Your Direct Conversation',
      ur: 'اپنے رب سے سیدھی گفتگو',
      ar: 'مناجاتك المباشرة',
    },
    body: {
      en: 'In Sujood, you whisper to the earth, yet your voice is heard above the heavens.',
      ur: 'سجدے میں آپ زمین پر سر جھکاتے ہیں، مگر آپ کی پکار آسمانوں کے اوپر سنی جاتی ہے۔',
      ar: 'في السجود تهمس للأرض، وصوتك يُسمع فوق سبع سماوات.',
    },
  },
  {
    id: 'insp_salah_04',
    category: 'salah',
    sourceType: 'reminder',
    title: {
      en: 'Guard Your Salah',
      ur: 'اپنی نماز کی حفاظت',
      ar: 'حافظ على صلاتك',
    },
    body: {
      en: 'When we give prayer its rightful priority, Allah places barakah in our hours.',
      ur: 'جب ہم نماز کو اپنی اولین ترجیح بناتے ہیں، تو اللہ ہمارے اوقات میں برکت ڈال دیتا ہے۔',
      ar: 'عندما نجعل الصلاة أولويتنا، يبارك الله لنا في أوقاتنا.',
    },
  },
  {
    id: 'insp_salah_05',
    category: 'salah',
    sourceType: 'reminder',
    title: {
      en: 'Peace in Prostration',
      ur: 'سجدے کا سکون',
      ar: 'راحة في السجود',
    },
    body: {
      en: 'Whenever the world feels overwhelming, place your burdens down in prayer.',
      ur: 'جب بھی دنیا کے معاملات بوجھل محسوس ہوں، نماز میں اپنے بوجھ اللہ کے سپرد کر دیں۔',
      ar: 'كلما ثقلت عليك هموم الدنيا، ألقِ أحمالك بين يدي الله في صلاتك.',
    },
  },

  // 2. Quran Recitation & Reflection
  {
    id: 'insp_quran_01',
    category: 'quran',
    sourceType: 'reminder',
    title: {
      en: 'A Verse for the Heart',
      ur: 'دل کی تسکین کے لیے ایک آیت',
      ar: 'آية لسكينة القلب',
    },
    body: {
      en: 'Make a little time for the Quran today, even if it is only a single page or verse.',
      ur: 'آج قرآن مجید کے لیے تھوڑا وقت نکالیے، چاہے وہ صرف چند آیات یا ایک صفحہ ہی کیوں نہ ہو۔',
      ar: 'اجعل للقرآن نصيباً من يومك، ولو كان تلاوة آيات معدودات.',
    },
  },
  {
    id: 'insp_quran_02',
    category: 'quran',
    sourceType: 'reminder',
    title: {
      en: 'Healing and Guidance',
      ur: 'شفا اور رہنمائی',
      ar: 'شفاء وهداية',
    },
    body: {
      en: 'The words of Allah soften troubled hearts and bring tranquility to weary souls.',
      ur: 'اللہ کا کلام بے چین دلوں کو نرم کرتا ہے اور تھکی ہوئی روح کو سکون بخشتا ہے۔',
      ar: 'كلمات الله ترقق القلوب الحائرة وتنزل السكينة على الأرواح المتعبة.',
    },
  },
  {
    id: 'insp_quran_03',
    category: 'quran',
    sourceType: 'reminder',
    title: {
      en: 'Ponder Its Meanings',
      ur: 'آیات میں تدبر',
      ar: 'تدبر الآيات',
    },
    body: {
      en: 'Read slowly today with reflection. Even one Ayah understood changes your outlook.',
      ur: 'آج غور و فکر کے ساتھ تلاوت کیجیے۔ سمجھ کر پڑھی گئی ایک آیت بھی زندگی کا رخ بدل سکتی ہے۔',
      ar: 'اقرأ اليوم بتأنٍ وتدبر، ففهم آية واحدة قادر على أن ينير بصيرتك.',
    },
  },

  // 3. Sadaqah & Helping Others
  {
    id: 'insp_sadaqah_01',
    category: 'sadaqah',
    sourceType: 'reminder',
    title: {
      en: 'A Simple Act of Charity',
      ur: 'صدقے کا آسان طریقہ',
      ar: 'صدقة يسيرة',
    },
    body: {
      en: 'A warm smile, an encouraging word, or easing someone’s burden is true Sadaqah.',
      ur: 'ایک مسکراہٹ، حوصلہ افزا بات یا کسی کی پریشانی دور کرنا بھی خوبصورت صدقہ ہے۔',
      ar: 'ابتسامة طيبة، أو كلمة تشجيع، أو تيسير أمر مسلم هي صدقة عظيمة.',
    },
  },
  {
    id: 'insp_sadaqah_02',
    category: 'sadaqah',
    sourceType: 'reminder',
    title: {
      en: 'Shade of Your Giving',
      ur: 'سخاوت کا سایہ',
      ar: 'ظل الصدقة',
    },
    body: {
      en: 'Charity never decreases wealth; it purifies the soul and brings unexpected barakah.',
      ur: 'صدقہ کبھی مال میں کمی نہیں کرتا، بلکہ یہ روح کو پاک کرتا ہے اور غیب سے برکت لاتا ہے۔',
      ar: 'ما نقص مال من صدقة، بل تطهر النفس وتفتح أبواب البركة والتيسير.',
    },
  },
  {
    id: 'insp_sadaqah_03',
    category: 'sadaqah',
    sourceType: 'reminder',
    title: {
      en: 'Hidden Blessings',
      ur: 'پوشیدہ بھلائی',
      ar: 'أثر الإحسان',
    },
    body: {
      en: 'Give something discreetly today — a meal, helpful advice, or silent assistance.',
      ur: 'آج کسی کی خاموشی سے مدد کیجیے — چاہے وہ کوئی کھانا ہو یا مخلصانہ مشورہ۔',
      ar: 'قدّم معروفاً في الخفاء اليوم، سواء كان طعاماً أو نصيحة مخلصة.',
    },
  },
];

