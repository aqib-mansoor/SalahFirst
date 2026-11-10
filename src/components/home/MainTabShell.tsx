import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { PrayerTimesScreen } from '@/components/prayerTimes';
import { QiblaScreen } from '@/components/qibla';
import { HadithScreen } from '@/components/hadith';
import { ProgressScreen, ProgressSubTab } from '@/components/progress';
import { HomeBottomNav, HomeTab } from './HomeBottomNav';
import { useTheme } from '@/hooks/useTheme';
import { HadithItem } from '@/data/hadiths';

export interface MainTabShellProps {
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
  progressSubTab: ProgressSubTab;
  setProgressSubTab: (subTab: ProgressSubTab) => void;
  onOpenSettings: () => void;
  onOpenAzanPrefs?: () => void;
  onStartPrayerFocus: () => void;
  onOpenFocusSettings?: () => void;
  onOpenWallpaper: (hadith?: HadithItem) => void;
}

/**
 * Persistent Zero-Unmount Tab Shell with 60fps Native-Driver Tab Transitions.
 * Keeps tab screens mounted to avoid re-renders while animating active tab entrance.
 */
export const MainTabShell: React.FC<MainTabShellProps> = ({
  activeTab,
  setActiveTab,
  progressSubTab,
  setProgressSubTab,
  onOpenSettings,
  onOpenAzanPrefs,
  onStartPrayerFocus,
  onOpenFocusSettings,
  onOpenWallpaper,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0.86);
    slideAnim.setValue(6);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, fadeAnim, slideAnim]);

  const getTabStyle = (tab: HomeTab) =>
    activeTab === tab
      ? [
          styles.tabContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]
      : [styles.tabContent, styles.hiddenTab];

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={getTabStyle('home')}>
        <HomeScreen
          onOpenSettings={onOpenSettings}
          onNavigateTab={setActiveTab}
          onStartPrayerFocus={onStartPrayerFocus}
          onOpenFocusSettings={onOpenFocusSettings}
          onOpenStreaks={() => {
            setProgressSubTab('streaks');
            setActiveTab('progress');
          }}
          onOpenWallpaper={onOpenWallpaper}
        />
      </Animated.View>

      <Animated.View style={getTabStyle('prayers')}>
        <PrayerTimesScreen
          onNavigateHome={() => setActiveTab('home')}
          onNavigateTab={setActiveTab}
          onOpenAzanPrefs={onOpenAzanPrefs}
        />
      </Animated.View>

      <Animated.View style={getTabStyle('qibla')}>
        <QiblaScreen onNavigateTab={setActiveTab} isActive={activeTab === 'qibla'} />
      </Animated.View>

      <Animated.View style={getTabStyle('hadith')}>
        <HadithScreen
          onNavigateTab={setActiveTab}
          onOpenWallpaper={onOpenWallpaper}
        />
      </Animated.View>

      <Animated.View style={getTabStyle('progress')}>
        <ProgressScreen
          initialSubTab={progressSubTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'progress') setProgressSubTab('tracker');
          }}
        />
      </Animated.View>

      {/* Single Persistent Floating Navigation Bar */}
      <HomeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  hiddenTab: {
    display: 'none',
  },
});
