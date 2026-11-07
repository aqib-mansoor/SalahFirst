import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer } from '@/components/common';
import { HomeHeader } from './HomeHeader';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeSalahTracker } from './HomeSalahTracker';
import { HomeDailyHadith } from './HomeDailyHadith';
import { HomeBottomNav, HomeTab } from './HomeBottomNav';

export interface HomeScreenProps {
  onOpenSettings?: () => void;
  onNavigateTab?: (tab: HomeTab) => void;
  onStartPrayerFocus?: () => void;
  onOpenStreaks?: () => void;
  onOpenWallpaper?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenSettings,
  onNavigateTab,
  onStartPrayerFocus,
  onOpenStreaks,
  onOpenWallpaper,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const { location, permissionDenied } = useDeviceLocation();

  const handleTabChange = (tab: HomeTab) => {
    setActiveTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  const {
    prayerData,
    prayersList,
    completedCount,
    countdownText,
    streakCount,
    togglePrayer,
  } = usePrayerTracker(location);

  const currentPrayerItem = prayersList.find(
    (p) => p.name.toUpperCase() === prayerData.currentPrayerName
  );
  const isCurrentCompleted = currentPrayerItem ? currentPrayerItem.completed : false;

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        {/* Top Header */}
        <HomeHeader
          cityName={location?.city || (permissionDenied ? 'Select City' : 'Detecting...')}
          streakCount={streakCount}
          onOpenSettings={onOpenSettings}
          onOpenStreaks={onOpenStreaks}
        />

        {/* Scrollable Dashboard Body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Banner with Countdown & Azan */}
          <HomeHeroCard
            currentPrayerName={prayerData.currentPrayerName}
            currentTimeFormatted={prayerData.currentTimeFormatted}
            nextPrayerName={prayerData.nextPrayerName}
            nextPrayerTimeFormatted={prayerData.nextPrayerTimeFormatted}
            countdownText={countdownText}
            isCurrentCompleted={isCurrentCompleted}
            onStartPrayerFocus={onStartPrayerFocus}
          />

          {/* Salah Tracker & Progress Bar */}
          <HomeSalahTracker
            prayers={prayersList}
            completedCount={completedCount}
            onTogglePrayer={togglePrayer}
          />

          {/* Daily Hadith Section */}
          <HomeDailyHadith
            onReadFull={() => handleTabChange('hadith')}
            onOpenWallpaper={onOpenWallpaper}
          />
        </ScrollView>

        {/* Docked Bottom Navigation Bar */}
        <HomeBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

