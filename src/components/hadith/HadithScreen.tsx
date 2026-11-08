import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useHadithCollection } from '@/hooks/useHadithCollection';
import { AppContainer, CurvedHeaderContainer } from '@/components/common';
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(60);

  return (
    <AppContainer edges={['top']}>
      <View style={styles.screenWrapper}>
        <HadithToast message={toastMessage} onDismiss={dismissToast} />

        {/* Dynamic Curved Elevated Header on Scroll */}
        <CurvedHeaderContainer
          scrollY={scrollY}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - headerHeight) > 1) {
              setHeaderHeight(h);
            }
          }}
        >
          <HadithHeader
            showUrdu={showUrdu}
            onToggleUrdu={toggleUrdu}
          />
        </CurvedHeaderContainer>

        <Animated.ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + SPACING.xs },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
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
        </Animated.ScrollView>

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
    paddingBottom: 100,
    gap: SPACING.lg,
  },
});

