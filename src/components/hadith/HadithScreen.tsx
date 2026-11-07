import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useHadithCollection } from '@/hooks/useHadithCollection';
import { AppContainer } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { HadithHeader } from './HadithHeader';
import { HadithToast } from './HadithToast';
import { HadithCard } from './HadithCard';
import { HadithActionButtons } from './HadithActionButtons';
import { HadithPagination } from './HadithPagination';
import { QuranReflectionCard3D } from './QuranReflectionCard3D';
import { HadithWallpaperScreen } from '@/components/wallpaper';

export interface HadithScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onNavigateTab }) => {
  const [showWallpaper, setShowWallpaper] = useState(false);
  const {
    currentHadith,
    currentIndex,
    totalHadiths,
    showUrdu,
    isSaved,
    toastMessage,
    toggleUrdu,
    toggleSave,
    shareHadith,
    dismissToast,
    nextHadith,
    prevHadith,
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
    <AppContainer edges={['top']}>
      <View style={styles.screenWrapper}>
        <HadithToast message={toastMessage} onDismiss={dismissToast} />

        <HadithHeader
          showUrdu={showUrdu}
          onToggleUrdu={toggleUrdu}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HadithCard
            hadith={currentHadith}
            currentIndex={currentIndex}
            totalHadiths={totalHadiths}
            showUrdu={showUrdu}
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
          />

          <QuranReflectionCard3D />
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
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
});

