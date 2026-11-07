/**
 * Bundled Verified Offline Hadith Collection
 */

export interface HadithItem {
  id: string;
  badge: string;
  arabic: string;
  english: string;
  urdu: string;
  source: string;
  reference: string;
}

export const VERIFIED_HADITHS: HadithItem[] = [
  {
    id: 'hadith-1',
    badge: 'VERIFIED HADITH • BUNDLED JSON #1',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ الصَّلاَةُ لِوَقْتِهَا',
    english: '"The most beloved of deeds to Allah is the prayer offered at its stated time."',
    urdu: '"اللہ کے نزدیک سب سے زیادہ پسندیدہ عمل اپنے وقت پر نماز ادا کرنا ہے۔"',
    source: 'Sahih al-Bukhari',
    reference: 'Book 10, Hadith 1',
  },
  {
    id: 'hadith-2',
    badge: 'VERIFIED HADITH • BUNDLED JSON #2',
    arabic: 'مَنْ تَطَهَّرَ فِي بَيْتِهِ ثُمَّ مَشَى إِلَى بَيْتٍ مِنْ بُيُوتِ اللهِ لِيَقْضِيَ فَرِيضَةً مِنْ فَرَائِضِ اللهِ كَانَتْ خَطْوَتَاهُ إِحْدَاهُمَا تَحُطُّ خَطِيئَةً وَالأُخْرَى تَرْفَعُ دَرَجَةً',
    english: '"Whoever purifies himself in his house and then walks to one of the houses of Allah to fulfill an obligation, one step erases a sin and the other raises his status."',
    urdu: '"جو شخص اپنے گھر میں وضو کرے پھر اللہ کے گھروں میں سے کسی گھر کی طرف جائے تاکہ اللہ کا فرض ادا کرے، تو اس کا ایک قدم گناہ مٹاتا ہے اور دوسرا درجہ بلند کرتا ہے۔"',
    source: 'Sahih Muslim',
    reference: 'Book 5, Hadith 666',
  },
  {
    id: 'hadith-3',
    badge: 'VERIFIED HADITH • BUNDLED JSON #3',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    english: '"The most beloved of deeds to Allah are those that are most consistent, even if they are small."',
    urdu: '"اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جس میں ہمیشگی ہو، خواہ وہ تھوڑا ہی کیوں نہ ہو۔"',
    source: 'Sahih al-Bukhari',
    reference: 'Book 81, Hadith 53',
  },
];

