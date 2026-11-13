import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useHadithCollection } from '@/hooks/useHadithCollection';
import { AppContainer } from '@/components/common';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { HadithItem } from '@/data/hadiths';
import { HadithHeader } from './HadithHeader';
import { HadithToast } from './HadithToast';
import { HadithCard } from './HadithCard';
import { HadithPagination } from './HadithPagination';
import { HadithBookmarksCard } from './HadithBookmarksCard';
import { HadithBookmarksSheet } from './HadithBookmarksSheet';

export interface HadithScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
  onOpenWallpaper?: (hadith: HadithItem) => void;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onNavigateTab, onOpenWallpaper }) => {
  const [showBookmarksSheet, setShowBookmarksSheet] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    currentHadith,
    currentIndex,
    totalHadiths,
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
  } = useHadithCollection();

  return (
    <AppContainer edges={['top', 'left', 'right']}>
      <View style={styles.screenWrapper}>
        {/* Stable Flow Header */}
        <HadithHeader savedCount={savedIds.length} />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HadithCard
            hadith={currentHadith}
            currentIndex={currentIndex}
            totalHadiths={totalHadiths}
            translationMode={translationMode}
            isSaved={isSaved}
            onSelectTranslationMode={setTranslationMode}
            onWallpaperPress={() => onOpenWallpaper?.(currentHadith)}
            onSavePress={toggleSave}
            onSharePress={shareHadith}
          />

          <HadithPagination
            onPrev={prevHadith}
            onNext={nextHadith}
            onRandom={randomHadith}
          />

          <HadithBookmarksCard
            savedHadiths={savedHadiths}
            currentIndex={currentIndex}
            onSelectHadith={jumpToHadith}
            onOpenAllBookmarks={() => setShowBookmarksSheet(true)}
          />
        </ScrollView>

        {/* 50+ Bookmarks Dedicated Modal Sheet */}
        <HadithBookmarksSheet
          visible={showBookmarksSheet}
          savedHadiths={savedHadiths}
          currentIndex={currentIndex}
          onSelectHadith={jumpToHadith}
          onRemoveBookmark={toggleSaveById}
          onClose={() => setShowBookmarksSheet(false)}
        />

        {toastMessage && (
          <View style={[styles.toastFloating, { bottom: Math.max(insets.bottom, 16) + 65 }]}>
            <HadithToast message={toastMessage} onDismiss={dismissToast} />
          </View>
        )}
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.xs,
    gap: SPACING.lg,
  },
  toastFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
