import { useState, useEffect, useCallback, useRef } from 'react';
import { Share } from 'react-native';
import { VERIFIED_HADITHS, HadithItem } from '@/data/hadiths';
import { storage } from '@/utils/storage';

const STORAGE_KEYS = {
  showUrdu: 'hadith_show_urdu',
  savedIds: 'saved_hadith_bookmarks',
};

export const useHadithCollection = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(2); // Default to #3 to match screenshot
  const [showUrdu, setShowUrdu] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const storedUrdu = await storage.get<boolean>(STORAGE_KEYS.showUrdu, false);
      const storedBookmarks = await storage.get<string[]>(STORAGE_KEYS.savedIds, []);
      setShowUrdu(storedUrdu);
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
    }, 3200);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(null);
  }, []);

  const toggleUrdu = useCallback(async () => {
    const nextVal = !showUrdu;
    setShowUrdu(nextVal);
    await storage.set(STORAGE_KEYS.showUrdu, nextVal);
  }, [showUrdu]);

  const currentHadith: HadithItem = VERIFIED_HADITHS[currentIndex];
  const isSaved = savedIds.includes(currentHadith.id);

  const toggleSave = useCallback(async () => {
    let updated: string[];
    if (isSaved) {
      updated = savedIds.filter((id) => id !== currentHadith.id);
      triggerToast('Removed from offline Bookmarks');
    } else {
      updated = [...savedIds, currentHadith.id];
      triggerToast('Saved to offline Bookmarks');
    }
    setSavedIds(updated);
    await storage.set(STORAGE_KEYS.savedIds, updated);
  }, [isSaved, savedIds, currentHadith.id, triggerToast]);

  const showWallpaperAction = useCallback(() => {
    triggerToast('Wallpaper preview ready for customization');
  }, [triggerToast]);

  const shareHadith = useCallback(async () => {
    try {
      let text = `${currentHadith.arabic}\n\n${currentHadith.english}`;
      if (showUrdu) {
        text += `\n\n${currentHadith.urdu}`;
      }
      text += `\n\n— ${currentHadith.source} (${currentHadith.reference})\nShared via SalahFirst`;
      await Share.share({ message: text });
    } catch {}
  }, [currentHadith, showUrdu]);

  const nextHadith = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VERIFIED_HADITHS.length);
  }, []);

  const prevHadith = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + VERIFIED_HADITHS.length) % VERIFIED_HADITHS.length);
  }, []);

  return {
    currentHadith,
    currentIndex,
    totalHadiths: VERIFIED_HADITHS.length,
    showUrdu,
    isSaved,
    toastMessage,
    toggleUrdu,
    toggleSave,
    showWallpaperAction,
    shareHadith,
    dismissToast,
    nextHadith,
    prevHadith,
  };
};
