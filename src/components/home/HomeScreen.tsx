import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';
import { AppContainer, BatteryOptimizationBottomSheet } from '@/components/common';
import { HomeHeader } from './HomeHeader';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeSalahTracker } from './HomeSalahTracker';
import { HomeTasbihWidget } from './HomeTasbihWidget';
import { HomeDailyHadith } from './HomeDailyHadith';
import { HomeTab } from './HomeBottomNav';
import { HadithItem } from '@/data/hadiths';
import { useBatteryOptimizationPrompt } from '@/hooks/useBatteryOptimizationPrompt';

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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { location } = useDeviceLocation();

  // One-time prompt for background battery optimization on Android
  const {
    isPromptVisible,
    confirmPrompt,
    dismissPrompt,
  } = useBatteryOptimizationPrompt(Boolean(location?.latitude));

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

  const handleSelectCity = useCallback(() => {
    onNavigateTab?.('prayers');
  }, [onNavigateTab]);

  const handleReadFullHadith = useCallback(() => {
    onNavigateTab?.('hadith');
  }, [onNavigateTab]);

  const handleOpenTracker = useCallback(() => {
    onNavigateTab?.('prayers');
  }, [onNavigateTab]);

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        {/* Stable Flow Header */}
        <HomeHeader
          cityName={location?.city || t('selectCity')}
          countryName={location?.country}
          streakCount={streakCount}
          onOpenSettings={onOpenSettings}
          onOpenStreaks={onOpenStreaks}
          onSelectCity={handleSelectCity}
        />

        {/* Scrollable Dashboard Body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 88 },
          ]}
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
            completedCount={completedCount}
            streakCount={streakCount}
            sunriseTimeFormatted={prayerData.sunrise}
            prayers={prayersList}
            onOpenTracker={handleOpenTracker}
            onStartPrayerFocus={onStartPrayerFocus}
            onOpenFocusSettings={onOpenFocusSettings}
          />

          {/* Salah Tracker with Honesty Confirmation Modal */}
          <HomeSalahTracker
            prayers={prayersList}
            completedCount={completedCount}
            onTogglePrayer={togglePrayer}
            onViewHistory={onOpenStreaks}
          />

          {/* Interactive Post-Salah Tasbih Widget */}
          <HomeTasbihWidget />

          {/* Mature Daily Hadith Section with Arabic, Urdu & English */}
          <HomeDailyHadith
            onReadFull={handleReadFullHadith}
            onOpenWallpaper={onOpenWallpaper}
          />
        </ScrollView>
      </View>

      {/* Custom One-Time Battery Optimization Guidance Sheet */}
      <BatteryOptimizationBottomSheet
        visible={isPromptVisible}
        onConfirm={confirmPrompt}
        onDismiss={dismissPrompt}
      />
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    gap: 12,
  },
});
