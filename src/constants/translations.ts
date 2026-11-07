export type AppLanguage = 'en' | 'ur';

export const TRANSLATIONS = {
  en: {
    // Navigation Tabs
    navHome: 'Home',
    navPrayers: 'Timetable',
    navQibla: 'Qibla',
    navHadith: 'Hadith',
    navProgress: 'Progress',
    navSettings: 'Settings',

    // Prayer Names
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',

    // Status & Actions
    completed: 'Completed',
    pending: 'Pending',
    save: 'Save',
    saved: 'Saved',
    share: 'Share',
    reset: 'Reset',
    close: 'Close',
    back: 'Back',
    enable: 'Enable',

    // Home Screen
    currentPrayer: 'CURRENT',
    nextPrayer: 'Next Prayer',
    azanTime: 'Azan Time',
    startPrayerFocus: 'Start Prayer Focus',
    dailyHadith: 'Daily Hadith',
    readFull: 'Read Full',
    detectingLocation: 'Detecting Location...',
    selectCity: 'Select City',

    // Focus Mode
    prayerFocusMode: 'PRAYER FOCUS MODE',
    timeToReconnect: 'Time to reconnect.',
    focusSub: 'Put distractions aside and dedicate this time purely to Salah.',
    beginFocus: 'Begin Focus',
    focusFinished: 'FOCUS SESSION FINISHED',
    didYouCompletePrayer: 'Did you complete your prayer?',
    yesPrayed: 'Yes, I prayed',
    notYet: 'Not yet',
    exitFocusEarly: 'Exit Focus Early?',
    exitFocusConfirm: 'Are you sure you want to end your Salah Focus session before the timer finishes?',
    stayFocused: 'Stay Focused',
    exit: 'Exit',

    // Notifications & Azan
    azanAndNotifications: 'Azan & Notifications',
    customizeAlerts: 'Customize alerts for each daily prayer',
    notificationsDisabled: 'Notifications Disabled',
    enableNotificationsPrompt: 'Enable notifications in device settings so Azan alerts ring offline at real prayer times.',
    localAlarmsEnabled: 'Local Prayer Alarms Enabled',
    makkahAzanPreview: 'Makkah Haram Azan (Audio Preview)',

    // Progress & Streaks
    salahJourney: 'Your Salah Journey',
    markManualPrompt: 'Mark each prayer manually after offering Salah',
    thisWeekOverview: "This Week's Overview",
    fullStatistics: 'Full Statistics',
    currentStreak: 'CURRENT FULL-DAY STREAK',
    longestStreak: 'Longest Streak',
    totalPrayersLogged: 'Total Prayers Logged',
    consistencyMilestones: 'Consistency Milestones',

    // Tasbih Counter
    afterSalahTasbih: 'AFTER-SALAH TASBIH',
    tapToCount: 'Tap to count Dhikr',
    resetTasbihTitle: 'Reset Tasbih Counter?',
    resetTasbihConfirm: 'Do you want to reset your current Tasbih count?',
    keepCounting: 'Keep Counting',

    // Qibla Compass
    facingKaaba: 'Facing the Holy Kaaba in Makkah',
    rotatePhone: 'Rotate phone until pointer aligns',
    liveHeading: 'Live Heading',
    qiblaAngle: 'Qibla Angle',
    distance: 'Distance',
    magneticInterference: 'Magnetic interference detected. Wave phone in a figure-8 motion.',
    sensorUnavailable: 'Magnetometer sensor unavailable on this device.',
  },
  ur: {
    // Navigation Tabs
    navHome: 'ہوم',
    navPrayers: 'اوقات',
    navQibla: 'قبلہ',
    navHadith: 'حدیث',
    navProgress: 'پیش رفت',
    navSettings: 'ترتیبات',

    // Prayer Names
    fajr: 'فجر',
    sunrise: 'طلوع آفتاب',
    dhuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب',
    isha: 'عشاء',

    // Status & Actions
    completed: 'مکمل',
    pending: 'باقی',
    save: 'محفوظ کریں',
    saved: 'محفوظ شدہ',
    share: 'شیئر',
    reset: 'دوبارہ',
    close: 'بند کریں',
    back: 'واپس',
    enable: 'فعال کریں',

    // Home Screen
    currentPrayer: 'موجودہ نماز',
    nextPrayer: 'اگلی نماز',
    azanTime: 'وقت اذان',
    startPrayerFocus: 'نماز فوکس موڈ',
    dailyHadith: 'آج کی حدیث',
    readFull: 'مکمل پڑھیں',
    detectingLocation: 'مقام تلاش ہو رہا ہے...',
    selectCity: 'شہر منتخب کریں',

    // Focus Mode
    prayerFocusMode: 'نماز فوکس موڈ',
    timeToReconnect: 'نماز کا وقت ہے',
    focusSub: 'تمام خلفشار کو ایک طرف رکھیں اور اپنے دل کو نماز میں لگائیں۔',
    beginFocus: 'فوکس شروع کریں',
    focusFinished: 'فوکس سیشن مکمل ہوا',
    didYouCompletePrayer: 'کیا آپ نے نماز ادا کر لی؟',
    yesPrayed: 'جی ہاں، میں نے نماز پڑھ لی',
    notYet: 'ابھی نہیں',
    exitFocusEarly: 'کیا آپ سیشن ختم کرنا چاہتے ہیں؟',
    exitFocusConfirm: 'کیا آپ واقعی وقت ختم ہونے سے پہلے فوکس موڈ بند کرنا چاہتے ہیں؟',
    stayFocused: 'جاری رکھیں',
    exit: 'بند کریں',

    // Notifications & Azan
    azanAndNotifications: 'اذان اور اطلاعات',
    customizeAlerts: 'ہر نماز کے لیے انتباہات ترتیب دیں',
    notificationsDisabled: 'اطلاعات غیر فعال ہیں',
    enableNotificationsPrompt: 'اذان کے اوقات پر بروقت یاد دہانی کے لیے ترتیبات میں جا کر اطلاعات فعال کریں۔',
    localAlarmsEnabled: 'مقامی نماز الارم فعال ہیں',
    makkahAzanPreview: 'حرم مکی کی اذان (آواز سنیں)',

    // Progress & Streaks
    salahJourney: 'آپ کا نماز کا سفر',
    markManualPrompt: 'نماز ادا کرنے کے بعد یہاں نشان لگائیں',
    thisWeekOverview: 'اس ہفتے کا جائزہ',
    fullStatistics: 'مکمل شماریات',
    currentStreak: 'مسلسل باقاعدگی',
    longestStreak: 'طویل ترین تسلسل',
    totalPrayersLogged: 'کل ادا شدہ نمازیں',
    consistencyMilestones: 'استقامت کے سنگ میل',

    // Tasbih Counter
    afterSalahTasbih: 'بعد نماز تسبیح',
    tapToCount: 'ذکر کے لیے ٹیپ کریں',
    resetTasbihTitle: 'تسبیح دوبارہ شروع کریں؟',
    resetTasbihConfirm: 'کیا آپ تسبیح کی گنتی دوبارہ شروع کرنا چاہتے ہیں؟',
    keepCounting: 'جاری رکھیں',

    // Qibla Compass
    facingKaaba: 'آپ کا رخ خانہ کعبہ کی طرف ہے',
    rotatePhone: 'فون کو تیر کے رخ کے مطابق گھمائیں',
    liveHeading: 'موجودہ رخ',
    qiblaAngle: 'زاویہ قبلہ',
    distance: 'فاصلہ',
    magneticInterference: 'مقناطیسی اثر معلوم ہوا۔ فون کو 8 کے ہندسے کے انداز میں گھمائیں۔',
    sensorUnavailable: 'اس ڈیوائس میں کمپاس سینسر دستیاب نہیں ہے۔',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
