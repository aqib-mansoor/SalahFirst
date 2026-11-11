import { InspirationItem } from '@/data/inspiration/types';
import { FocusScripture } from '@/data/focusScriptures';

export interface FormattedNotificationScripture {
  title: string;
  body: string;
}

/**
 * Universal Formatter for scripture-bearing notifications (Quran / Hadith / Daily Inspiration):
 * - If user language is 'en' or 'ur':
 *     Top: Arabic text
 *     Middle: English translation
 *     Bottom: Urdu translation
 *     Footer: Authentic citation reference
 * - If user language is 'ar':
 *     Top: Arabic text
 *     Bottom: English translation
 *     Footer: Authentic citation reference
 */
export const formatScriptureNotification = (
  item: InspirationItem | FocusScripture,
  lang: string = 'en',
  customTitlePrefix?: string
): FormattedNotificationScripture => {
  const isFocusScripture = 'type' in item;

  let arabic = '';
  let english = '';
  let urdu = '';
  let reference = '';
  let defaultTitle = 'Daily Inspiration';

  if (isFocusScripture) {
    arabic = item.arabic;
    english = item.english;
    urdu = item.urdu;
    reference = item.reference;
    defaultTitle = item.type === 'quran' ? 'Noble Quran' : 'Prophetic Hadith';
  } else {
    arabic = item.body.ar || '';
    english = item.body.en || '';
    urdu = item.body.ur || '';
    reference = item.reference || '';
    const localizedTitle = item.title[lang as 'en' | 'ur' | 'ar'] || item.title.en;
    defaultTitle = localizedTitle;
  }

  const title = customTitlePrefix ? `${customTitlePrefix} • ${defaultTitle}` : defaultTitle;

  let body = '';
  if (arabic) {
    body += `${arabic}\n\n`;
  }

  if (lang === 'ar') {
    if (english) body += `${english}\n`;
  } else {
    // English or Urdu selected: show both for deep spiritual understanding
    if (english) body += `${english}\n\n`;
    if (urdu) body += `${urdu}\n`;
  }

  if (reference) {
    body += `— ${reference}`;
  }

  return {
    title,
    body: body.trim(),
  };
};

