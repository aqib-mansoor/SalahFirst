import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Share } from 'react-native';
import { VERIFIED_HADITHS, HadithItem, getDayOfYearHadithIndex } from '@/data/hadiths';
import { storage } from '@/utils/storage';
import i18n from '@/i18n';

export type HadithTranslationMode = 'en' | 'ur' | 'both';

const STORAGE_KEYS = {
  translationMode: 'hadith_translation_mode',
  savedIds: 'saved_hadith_bookmarks',
};

export const useHadithCollection = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(getDayOfYearHadithIndex());
  const [translationMode, setTranslationModeState] = useState<HadithTranslationMode>('both');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const storedMode = await storage.get<HadithTranslationMode>(
        STORAGE_KEYS.translationMode,
        'both'
      );
      const storedBookmarks = await storage.get<string[]>(STORAGE_KEYS.savedIds, []);
      setTranslationModeState(storedMode);
      setSavedIds(storedBookmarks);
    };
    loadPreferences();

    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(null);
  }, []);

  const setTranslationMode = useCallback(async (mode: HadithTranslationMode) => {
    setTranslationModeState(mode);
    await storage.set(STORAGE_KEYS.translationMode, mode);
  }, []);

  const currentHadith: HadithItem = VERIFIED_HADITHS[currentIndex] || VERIFIED_HADITHS[0];
  const isSaved = savedIds.includes(currentHadith.id);

  const savedHadiths = useMemo(
    () => VERIFIED_HADITHS.filter((h) => savedIds.includes(h.id)),
    [savedIds]
  );

  const toggleSave = useCallback(async () => {
    let updated: string[];
    if (isSaved) {
      updated = savedIds.filter((id) => id !== currentHadith.id);
      triggerToast((i18n.t('removedFromBookmarks') as string) || 'Removed from Bookmarks');
    } else {
      updated = [...savedIds, currentHadith.id];
      triggerToast((i18n.t('savedToBookmarks') as string) || 'Saved to Bookmarks');
    }
    setSavedIds(updated);
    await storage.set(STORAGE_KEYS.savedIds, updated);
  }, [isSaved, savedIds, currentHadith.id, triggerToast]);

  const shareHadith = useCallback(async () => {
    try {
      let text = `${currentHadith.arabic}`;
      if (translationMode === 'en' || translationMode === 'both') {
        text += `\n\n${currentHadith.english}`;
      }
      if (translationMode === 'ur' || translationMode === 'both') {
        text += `\n\n${currentHadith.urdu}`;
      }
      text += `\n\n— ${currentHadith.source} (${currentHadith.reference})\nShared via SalahFirst`;
      await Share.share({ message: text });
    } catch {}
  }, [currentHadith, translationMode]);

  const nextHadith = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VERIFIED_HADITHS.length);
  }, []);

  const prevHadith = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + VERIFIED_HADITHS.length) % VERIFIED_HADITHS.length);
  }, []);

  const randomHadith = useCallback(() => {
    const total = VERIFIED_HADITHS.length;
    let nextIdx = Math.floor(Math.random() * total);
    if (nextIdx === currentIndex && total > 1) {
      nextIdx = (nextIdx + 1) % total;
    }
    setCurrentIndex(nextIdx);
  }, [currentIndex]);

  const jumpToHadith = useCallback((index: number) => {
    if (index >= 0 && index < VERIFIED_HADITHS.length) {
      setCurrentIndex(index);
    }
  }, []);

  return {
    currentHadith,
    currentIndex,
    totalHadiths: VERIFIED_HADITHS.length,
    translationMode,
    setTranslationMode,
    savedHadiths,
    savedIds,
    isSaved,
    toastMessage,
    toggleSave,
    shareHadith,
    dismissToast,
    nextHadith,
    prevHadith,
    randomHadith,
    jumpToHadith,
  };
};
