package com.salahfirst.app

import java.util.Calendar

data class PrayerNotificationTexts(
    val title: String,
    val shortBody: String,
    val bigBody: String,
    val subText: String,
    val silenceAction: String,
    val prayedAction: String
)

object PrayerNotificationContent {

    fun get(prayer: String, lang: String, isAzanPlaying: Boolean): PrayerNotificationTexts {
        val normalizedPrayer = prayer.trim().replaceFirstChar { it.uppercase() }
        val isFriday = Calendar.getInstance().get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY
        val isJumuah = isFriday && normalizedPrayer.equals("Dhuhr", ignoreCase = true)
        val resolvedLang = when {
            lang.startsWith("ur", ignoreCase = true) -> "ur"
            lang.startsWith("ar", ignoreCase = true) -> "ar"
            else -> "en"
        }

        return when (resolvedLang) {
            "ur" -> getUrdu(normalizedPrayer, isJumuah, isAzanPlaying)
            "ar" -> getArabic(normalizedPrayer, isJumuah, isAzanPlaying)
            else -> getEnglish(normalizedPrayer, isJumuah, isAzanPlaying)
        }
    }

    private fun getEnglish(prayer: String, isJumuah: Boolean, isAzanPlaying: Boolean): PrayerNotificationTexts {
        val title = if (isJumuah) "Jumu'ah • Friday Prayer Call" else "$prayer • Hayya 'alas-Salah"
        val subText = "As'Salah • Prayer Call"
        val silenceAction = if (isAzanPlaying) "Silence Azan" else "Dismiss"
        val prayedAction = "I Have Prayed"

        val (shortBody, bigBody) = when (prayer.lowercase()) {
            "fajr" -> Pair(
                "As-Salatu Khayrun Minan-Nawm — Prayer is better than sleep.",
                "As-Salatu Khayrun Minan-Nawm — Prayer is better than sleep.\nStand before Allah and begin your morning in tranquility, focus, and barakah."
            )
            "dhuhr" -> if (isJumuah) Pair(
                "Jumu'ah Mubarak — Gather for the Friday remembrance and prayer.",
                "Jumu'ah Mubarak — Gather for the Friday remembrance and congregation.\nSend blessings upon the Prophet ﷺ and prepare for the prayer."
            ) else Pair(
                "Hayya 'alal-Falah — Pause worldly affairs and stand before your Creator.",
                "Hayya 'alal-Falah — Hasten to success.\nPause your daily work, purify your heart, and stand before your Lord in gratitude."
            )
            "asr" -> Pair(
                "Safeguard the middle prayer and replenish your spirit before sunset.",
                "Safeguard the middle prayer (Al-Salat Al-Wusta).\nTake a peaceful moment away from the afternoon rush to remember Allah."
            )
            "maghrib" -> Pair(
                "The sun has set — turn your heart in worship and gratitude.",
                "The sun has set and evening has arrived.\nConclude the daylight by bowing before your Lord in sincere worship and peace."
            )
            "isha" -> Pair(
                "Complete your day in devotion, peace, and contemplation.",
                "Complete your day in devotion and tranquility before your Lord.\nRecite your prayers and rest under divine protection."
            )
            else -> Pair(
                "Hayya 'alas-Salah — Turn your attention to $prayer prayer.",
                "Hayya 'alas-Salah — Hasten to prayer.\nStand in devotion and remember your Lord."
            )
        }

        return PrayerNotificationTexts(title, shortBody, bigBody, subText, silenceAction, prayedAction)
    }

    private fun getUrdu(prayer: String, isJumuah: Boolean, isAzanPlaying: Boolean): PrayerNotificationTexts {
        val title = if (isJumuah) "جمعۃ المبارک • نماز کی پکار" else "$prayer • حی علی الصلاۃ"
        val subText = "صلاۃ فرسٹ • وقتِ نماز"
        val silenceAction = if (isAzanPlaying) "اذان بند کریں" else "خاموش کریں"
        val prayedAction = "نماز پڑھ لی"

        val (shortBody, bigBody) = when (prayer.lowercase()) {
            "fajr" -> Pair(
                "الصلاۃ خیر من النوم — نماز نیند سے بہتر ہے۔",
                "الصلاۃ خیر من النوم — نماز نیند سے بہتر ہے۔\nاپنے دن کا آغاز فجر کی نماز، سکون اور برکت کے ساتھ کریں۔"
            )
            "dhuhr" -> if (isJumuah) Pair(
                "جمعہ مبارک — نمازِ جمعہ کی تیاری کریں اور درود شریف پڑھیں۔",
                "جمعۃ المبارک — جمعہ کی نماز کے لیے حاضر ہوں اور نبی کریم ﷺ پر کثرت سے درود بھیجیں۔"
            ) else Pair(
                "حی علی الفلاح — دنیاوی مصروفیات روک کر اپنے رب کے حضور حاضر ہوں۔",
                "حی علی الفلاح — کامیابی کی طرف آؤ۔\nدن کے کاموں کو کچھ دیر روک کر شکرانے کے لیے سجدہ ریز ہوں۔"
            )
            "asr" -> Pair(
                "عصر کی نماز ادا کریں اور اپنے دن کو بابرکت بنائیں۔",
                "نمازوں کی پابندی کرو، بالخصوص درمیانی نماز کی۔\nعصر کے مبارک وقت میں اللہ کی یاد سے اپنے دل کو منور کریں۔"
            )
            "maghrib" -> Pair(
                "سورج غروب ہو چکا ہے — نمازِ مغرب کے لیے تیار ہوں۔",
                "دن کی روشنی اختتام کو پہنچی۔\nاپنے رب کے حضور سجدہ شکر بجا لائیں اور شام کا استقبال عبادت سے کریں۔"
            )
            "isha" -> Pair(
                "اپنے دن کا اختتام نمازِ عشاء اور سکون کے ساتھ کریں۔",
                "اپنے دن کا اختتام نماز اور دعا پر کریں۔\nاللہ کے ذکر کے ساتھ رات کو پرامن اور محفوظ بنائیں۔"
            )
            else -> Pair(
                "حی علی الصلاۃ — $prayer کی نماز کا وقت ہو چکا ہے۔",
                "حی علی الصلاۃ — اپنے رب کے حضور حاضر ہوں۔"
            )
        }

        return PrayerNotificationTexts(title, shortBody, bigBody, subText, silenceAction, prayedAction)
    }

    private fun getArabic(prayer: String, isJumuah: Boolean, isAzanPlaying: Boolean): PrayerNotificationTexts {
        val arabicPrayer = when (prayer.lowercase()) {
            "fajr" -> "صلاة الفجر"
            "dhuhr" -> if (isJumuah) "صلاة الجمعة" else "صلاة الظهر"
            "asr" -> "صلاة العصر"
            "maghrib" -> "صلاة المغرب"
            "isha" -> "صلاة العشاء"
            else -> prayer
        }
        val title = if (isJumuah) "جمعة مباركة • نداء صلاة الجمعة" else "$arabicPrayer • حي على الصلاة"
        val subText = "أول الصلاة • نداء الصلاة"
        val silenceAction = if (isAzanPlaying) "إيقاف الأذان" else "إغلاق"
        val prayedAction = "أديت الصلاة"

        val (shortBody, bigBody) = when (prayer.lowercase()) {
            "fajr" -> Pair(
                "الصلاة خير من النوم • قُم واستفتح يومك بنور الإيمان.",
                "الصلاة خير من النوم.\nاستفتح يومك بنور الفجر والبركة والوقوف خاشعاً بين يدي الله تعالى."
            )
            "dhuhr" -> if (isJumuah) Pair(
                "جمعة مباركة • سارع إلى ذكر الله وأكثر من الصلاة على النبي ﷺ.",
                "جمعة مباركة.\nسارع إلى ذكر الله والاجتماع لصلاة الجمعة وأكثر من الصلاة على الحبيب المصطفى ﷺ."
            ) else Pair(
                "أرحنا بها يا بلال • توقف عن مشاغل الدنيا وأقبل على ربك شاكراً.",
                "حي على الفلاح — أقبل على الفلاح والبركة.\nتوقف عن مشاغل الدنيا وأرح قلبك بالصلاة والذكر الخالص."
            )
            "asr" -> Pair(
                "حافظوا على الصلوات والصلاة الوسطى • صلاة العصر.",
                "حافظوا على الصلوات والصلاة الوسطى.\nجدد نشاط روحك بذكر الله والخشوع في وقت العصر المبارك."
            )
            "maghrib" -> Pair(
                "أقبل الليل وأدبر النهار • حان وقت صلاة المغرب.",
                "أقبل الليل وأدبر النهار.\nارفع يديك بالدعاء واختم يومك بصلاتك لربك شاكراً حامداً."
            )
            "isha" -> Pair(
                "اختم يومك بالسكينة والوقوف بين يدي الرحمن.",
                "اختم يومك بالسكينة ومناجاة أرحم الراحمين.\nاستودع ليلتك في حفظ الله ورعايته ونم على طهارة وسلام."
            )
            else -> Pair(
                "حي على الصلاة • حان وقت $arabicPrayer.",
                "حي على الصلاة • أقبل على ربك بالذكر والدعاء."
            )
        }

        return PrayerNotificationTexts(title, shortBody, bigBody, subText, silenceAction, prayedAction)
    }
}
