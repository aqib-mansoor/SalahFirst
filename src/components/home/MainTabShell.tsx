import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from '@/components/home/HomeScreen';
import { PrayerTimesScreen } from '@/components/prayerTimes';
import { QiblaScreen } from '@/components/qibla';
import { HadithScreen } from '@/components/hadith';
import { ProgressScreen, ProgressSubTab } from '@/components/progress';
import { HomeTab } from '@/components/home/HomeBottomNav';

export interface MainTabShellProps {
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
  progressSubTab: ProgressSubTab;
  setProgressSubTab: (subTab: ProgressSubTab) => void;
  onOpenSettings: () => void;
  onStartPrayerFocus: () => void;
  onOpenWallpaper: () => void;
}

/**
 * Persistent Zero-Unmount Tab Shell.
 * Keeps tab screens mounted to avoid re-renders while toggling visibility.
 */
export const MainTabShell: React.FC<MainTabShellProps> = ({
  activeTab,
  setActiveTab,
  progressSubTab,
  setProgressSubTab,
  onOpenSettings,
  onStartPrayerFocus,
  onOpenWallpaper,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={[styles.tabContent, activeTab !== 'home' && styles.hiddenTab]}>
        <HomeScreen
          onOpenSettings={onOpenSettings}
          onNavigateTab={setActiveTab}
          onStartPrayerFocus={onStartPrayerFocus}
          onOpenStreaks={() => {
            setProgressSubTab('streaks');
            setActiveTab('progress');
          }}
          onOpenWallpaper={onOpenWallpaper}
        />
      </View>

      <View style={[styles.tabContent, activeTab !== 'prayers' && styles.hiddenTab]}>
        <PrayerTimesScreen
          onNavigateHome={() => setActiveTab('home')}
          onNavigateTab={setActiveTab}
        />
      </View>

      <View style={[styles.tabContent, activeTab !== 'qibla' && styles.hiddenTab]}>
        <QiblaScreen onNavigateTab={setActiveTab} />
      </View>

      <View style={[styles.tabContent, activeTab !== 'hadith' && styles.hiddenTab]}>
        <HadithScreen onNavigateTab={setActiveTab} />
      </View>

      <View style={[styles.tabContent, activeTab !== 'progress' && styles.hiddenTab]}>
        <ProgressScreen
          initialSubTab={progressSubTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'progress') setProgressSubTab('tracker');
          }}
        />
      </View>
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

