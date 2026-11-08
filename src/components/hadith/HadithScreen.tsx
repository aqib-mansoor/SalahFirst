import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useHadithCollection } from '@/hooks/useHadithCollection';
import { AppContainer } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { HadithHeader } from './HadithHeader';
import { HadithToast } from './HadithToast';
import { HadithCard } from './HadithCard';
import { HadithPagination } from './HadithPagination';
import { HadithBookmarksCard } from './HadithBookmarksCard';
import { HadithBookmarksSheet } from './HadithBookmarksSheet';
import { HadithWallpaperScreen } from '@/components/wallpaper';

export interface HadithScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onNavigateTab }) => {
  const [showWallpaper, setShowWallpaper] = useState(false);
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

  if (showWallpaper) {
    return (
      <HadithWallpaperScreen
        hadith={currentHadith}
        onClose={() => setShowWallpaper(false)}
      />
    );
  }

  return (
    <AppContainer edges={['top', 'left', 'right']}>
      <View style={styles.screenWrapper}>
        <HadithToast message={toastMessage} onDismiss={dismissToast} />

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
            onWallpaperPress={() => setShowWallpaper(true)}
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

        <HomeBottomNav
          activeTab="hadith"
          onTabChange={onNavigateTab}
        />
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
});
