import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer, CurvedHeaderContainer } from '@/components/common';
import { HomeHeader } from './HomeHeader';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeSalahTracker } from './HomeSalahTracker';
import { HomeTasbihWidget } from './HomeTasbihWidget';
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

  const currentObligatoryName = prayerData.currentPeriod?.obligatorySalahName;
  const currentPrayerItem = currentObligatoryName
    ? prayersList.find((p) => p.name === currentObligatoryName)
    : null;
  const isCurrentCompleted = currentPrayerItem ? currentPrayerItem.completed : false;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(74);

  return (
    <AppContainer
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.container}>
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
          <HomeHeader
            cityName={location?.city || (permissionDenied ? 'Select City' : 'Detecting...')}
            countryName={location?.country}
            streakCount={streakCount}
            onOpenSettings={onOpenSettings}
            onOpenStreaks={onOpenStreaks}
            onSelectCity={() => handleTabChange('prayers')}
          />
        </CurvedHeaderContainer>

        {/* Scrollable Dashboard Body */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + SPACING.xs },
          ]}
        >
          {/* Hero Banner with Canvas & Countdown */}
          <HomeHeroCard
            currentPrayerName={prayerData.currentPeriod?.nameKey || prayerData.currentPrayerName}
            currentTimeFormatted={prayerData.currentPeriod?.startTimeFormatted || prayerData.currentTimeFormatted}
            nextPrayerName={prayerData.nextPrayerName}
            nextPrayerTimeFormatted={prayerData.nextPrayerTimeFormatted}
            countdownText={countdownText}
            isCurrentCompleted={isCurrentCompleted}
            periodCategory={prayerData.currentPeriod?.category}
            periodSubtitleKey={prayerData.currentPeriod?.descriptionKey}
            periodId={prayerData.currentPeriod?.id}
            onStartPrayerFocus={onStartPrayerFocus}
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
            onReadFull={() => handleTabChange('hadith')}
            onOpenWallpaper={onOpenWallpaper}
          />
        </Animated.ScrollView>

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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: 112,
    gap: SPACING.lg,
  },
});
