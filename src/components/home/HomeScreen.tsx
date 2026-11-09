import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer } from '@/components/common';
import { HomeHeader } from './HomeHeader';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeSalahTracker } from './HomeSalahTracker';
import { HomeTasbihWidget } from './HomeTasbihWidget';
import { HomeDailyHadith } from './HomeDailyHadith';
import { HomeTab } from './HomeBottomNav';
import { HadithItem } from '@/data/hadiths';

export interface HomeScreenProps {
  onOpenSettings?: () => void;
  onNavigateTab?: (tab: HomeTab) => void;
  onStartPrayerFocus?: () => void;
  onOpenFocusSettings?: () => void;
  onOpenStreaks?: () => void;
  onOpenWallpaper?: (hadith?: HadithItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenSettings,
  onNavigateTab,
  onStartPrayerFocus,
  onOpenFocusSettings,
  onOpenStreaks,
  onOpenWallpaper,
}) => {
  const theme = useTheme();
  const { location, permissionDenied } = useDeviceLocation();

  const {
    prayerData,
    prayersList,
    completedCount,
    countdownText,
    periodProgressRatio,
    streakCount,
    togglePrayer,
  } = usePrayerTracker(location, { enableCountdown: true });

  const currentObligatoryName = prayerData.currentPeriod?.obligatorySalahName;
  const currentPrayerItem = currentObligatoryName
    ? prayersList.find((p) => p.name === currentObligatoryName)
    : null;
  const isCurrentCompleted = currentPrayerItem ? currentPrayerItem.completed : false;
  const allCompleted = completedCount === 5;

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        {/* Stable Flow Header */}
        <HomeHeader
          cityName={location?.city || (permissionDenied ? 'Select City' : 'Detecting...')}
          countryName={location?.country}
          streakCount={streakCount}
          onOpenSettings={onOpenSettings}
          onOpenStreaks={onOpenStreaks}
          onSelectCity={() => onNavigateTab && onNavigateTab('prayers')}
        />

        {/* Scrollable Dashboard Body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Banner with Canvas & Countdown */}
          <HomeHeroCard
            currentPrayerName={prayerData.currentPeriod?.nameKey || prayerData.currentPrayerName}
            currentTimeFormatted={prayerData.currentPeriod?.startTimeFormatted || prayerData.currentTimeFormatted}
            nextPrayerName={prayerData.nextPrayerName}
            nextPrayerTimeFormatted={prayerData.nextPrayerTimeFormatted}
            countdownText={countdownText}
            currentObligatoryName={currentObligatoryName}
            isCurrentCompleted={isCurrentCompleted}
            allCompleted={allCompleted}
            progressRatio={periodProgressRatio}
            periodCategory={prayerData.currentPeriod?.category}
            periodId={prayerData.currentPeriod?.id}
            onStartPrayerFocus={onStartPrayerFocus}
            onOpenFocusSettings={onOpenFocusSettings}
          />

          {/* Salah Tracker with Honesty Confirmation Modal */}
          <HomeSalahTracker
            prayers={prayersList}
            completedCount={completedCount}
            onTogglePrayer={togglePrayer}
          />

          {/* Interactive Post-Salah Tasbih Widget */}
          <HomeTasbihWidget />

          {/* Mature Daily Hadith Section with Arabic, Urdu & English */}
          <HomeDailyHadith
            onReadFull={() => onNavigateTab && onNavigateTab('hadith')}
            onOpenWallpaper={onOpenWallpaper}
          />
        </ScrollView>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: 112,
    gap: SPACING.lg,
  },
});
