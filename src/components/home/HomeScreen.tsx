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
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenSettings }) => {
  const theme = useTheme('light');
  const [activeTab, setActiveTab] = useState<HomeTab>('home');
  const { location } = useDeviceLocation();

  const {
    prayerData,
    prayersList,
    completedCount,
    countdownText,
    streakCount,
    togglePrayer,
  } = usePrayerTracker(location);

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
        {/* Top Header */}
        <HomeHeader
          cityName={location.city || 'Chakwal'}
          streakCount={streakCount}
          onOpenSettings={onOpenSettings}
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
          />

          {/* Salah Tracker & Progress Bar */}
          <HomeSalahTracker
            prayers={prayersList}
            completedCount={completedCount}
            onTogglePrayer={togglePrayer}
          />

          {/* Daily Hadith Section */}
          <HomeDailyHadith />
        </ScrollView>

        {/* Docked Bottom Navigation Bar */}
        <HomeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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

