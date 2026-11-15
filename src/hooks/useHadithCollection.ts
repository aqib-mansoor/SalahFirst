import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Share } from 'react-native';
import {
  VERIFIED_HADITHS,
  HadithItem,
  getDayOfYearHadithIndex,
  HadithCategoryId,
  getHadithIndicesForCategory,
} from '@/data/hadiths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setHadithTranslationMode,
  setHadithBookmarks,
  HadithTranslationMode,
} from '@/store/slices/preferencesSlice';
import { triggerHaptic } from '@/utils/haptics';
import i18n from '@/i18n';

export type { HadithTranslationMode, HadithCategoryId };

export const useHadithCollection = () => {
  const dispatch = useAppDispatch();
  const translationMode = useAppSelector((state) => state.preferences.hadithTranslationMode);
  const savedIds = useAppSelector((state) => state.preferences.hadithBookmarks);

  const [currentIndex, setCurrentIndex] = useState<number>(getDayOfYearHadithIndex());
  const [selectedCategory, setSelectedCategoryState] = useState<HadithCategoryId>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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

  const setTranslationMode = useCallback(
    async (mode: HadithTranslationMode) => {
      dispatch(setHadithTranslationMode(mode));
    },
    [dispatch]
  );

  const currentHadith: HadithItem = VERIFIED_HADITHS[currentIndex] || VERIFIED_HADITHS[0];
  const isSaved = savedIds.includes(currentHadith.id);

  const savedHadiths = useMemo(
    () => VERIFIED_HADITHS.filter((h) => savedIds.includes(h.id)),
    [savedIds]
  );

  const toggleSaveById = useCallback(
    async (targetId?: string) => {
      const idToToggle = targetId || currentHadith.id;
      const currentlySaved = savedIds.includes(idToToggle);
      let updated: string[];
      if (currentlySaved) {
        updated = savedIds.filter((id) => id !== idToToggle);
        triggerToast((i18n.t('removedFromBookmarks') as string) || 'Removed from Bookmarks');
      } else {
        updated = [...savedIds, idToToggle];
        triggerToast((i18n.t('savedToBookmarks') as string) || 'Saved to Bookmarks');
      }
      dispatch(setHadithBookmarks(updated));
      triggerHaptic(currentlySaved ? 'light' : 'medium');
    },
    [savedIds, currentHadith.id, triggerToast, dispatch]
  );

  const toggleSave = useCallback(() => toggleSaveById(), [toggleSaveById]);

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

  const categoryIndices = useMemo(
    () => getHadithIndicesForCategory(selectedCategory),
    [selectedCategory]
  );

  const setSelectedCategory = useCallback((cat: HadithCategoryId) => {
    triggerHaptic('light');
    setSelectedCategoryState(cat);
    const indices = getHadithIndicesForCategory(cat);
    if (cat !== 'all' && indices.length > 0 && !indices.includes(currentIndex)) {
      setCurrentIndex(indices[0]);
    }
  }, [currentIndex]);

  const nextHadith = useCallback(() => {
    triggerHaptic('light');
    if (categoryIndices.length === 0) return;
    const pos = categoryIndices.indexOf(currentIndex);
    const nextPos = pos === -1 ? 0 : (pos + 1) % categoryIndices.length;
    setCurrentIndex(categoryIndices[nextPos]);
  }, [categoryIndices, currentIndex]);

  const prevHadith = useCallback(() => {
    triggerHaptic('light');
    if (categoryIndices.length === 0) return;
    const pos = categoryIndices.indexOf(currentIndex);
    const prevPos = pos === -1 ? 0 : (pos - 1 + categoryIndices.length) % categoryIndices.length;
    setCurrentIndex(categoryIndices[prevPos]);
  }, [categoryIndices, currentIndex]);

  const randomHadith = useCallback(() => {
    triggerHaptic('light');
    const total = categoryIndices.length;
    if (total === 0) return;
    const randPos = Math.floor(Math.random() * total);
    let nextIdx = categoryIndices[randPos];
    if (nextIdx === currentIndex && total > 1) {
      nextIdx = categoryIndices[(randPos + 1) % total];
    }
    setCurrentIndex(nextIdx);
  }, [categoryIndices, currentIndex]);

  const jumpToHadith = useCallback((index: number) => {
    if (index >= 0 && index < VERIFIED_HADITHS.length) {
      triggerHaptic('light');
      setCurrentIndex(index);
    }
  }, []);

  return {
    currentHadith,
    currentIndex,
    totalHadiths: VERIFIED_HADITHS.length,
    selectedCategory,
    setSelectedCategory,
    translationMode,
    setTranslationMode,
    savedHadiths,
    savedIds,
    isSaved,
    toastMessage,
    toggleSave,
    toggleSaveById,
    shareHadith,
    dismissToast,
    nextHadith,
    prevHadith,
    randomHadith,
    jumpToHadith,
  };
};
