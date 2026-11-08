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
import { HadithActionButtons } from './HadithActionButtons';
import { HadithPagination } from './HadithPagination';
import { HadithBookmarksCard } from './HadithBookmarksCard';
import { HadithWallpaperScreen } from '@/components/wallpaper';

export interface HadithScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onNavigateTab }) => {
  const [showWallpaper, setShowWallpaper] = useState(false);
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
            onSelectTranslationMode={setTranslationMode}
          />

          <HadithActionButtons
            isSaved={isSaved}
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
          />
        </ScrollView>

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
