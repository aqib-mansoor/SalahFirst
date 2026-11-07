import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer, AppText } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { ProgressTabsHeader, ProgressSubTab } from './ProgressTabsHeader';
import { TrackerHeroCard } from './TrackerHeroCard';
import { TrackerPrayerRow } from './TrackerPrayerRow';
import { TrackerWeekOverview } from './TrackerWeekOverview';
import { StreaksHeroCard } from './StreaksHeroCard';
import { StreaksMetricsRow } from './StreaksMetricsRow';
import { StreaksWeeklyChart } from './StreaksWeeklyChart';
import { StreaksMilestones } from './StreaksMilestones';
import { CalendarMonthHeader } from './CalendarMonthHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarDayInspector } from './CalendarDayInspector';

export interface ProgressScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
  initialSubTab?: ProgressSubTab;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  onNavigateTab,
  initialSubTab = 'tracker',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>(initialSubTab);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(7);
  const [dayPrayerMap, setDayPrayerMap] = useState<Record<number, boolean[]>>({
    1: [true, true, true, true, true],
    2: [true, true, true, true, true],
    3: [true, true, false, true, true],
    4: [true, true, true, true, true],
    5: [true, true, true, true, true],
    6: [true, true, true, true, true],
    7: [true, true, true, false, false],
  });

  const { location } = useDeviceLocation();
  const { prayersList, completedCount, streakCount, togglePrayer } = usePrayerTracker(location);

  const handleToggleCalendarPrayer = (prayerIdx: number) => {
    const currentList = dayPrayerMap[selectedCalendarDay] || [false, false, false, false, false];
    const updated = [...currentList];
    updated[prayerIdx] = !updated[prayerIdx];
    setDayPrayerMap((prev) => ({
      ...prev,
      [selectedCalendarDay]: updated,
    }));
  };

  return (
    <AppContainer edges={['top']}>
      <View style={styles.screenWrapper}>
        <ProgressTabsHeader
          activeTab={activeSubTab}
          onTabChange={setActiveSubTab}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {activeSubTab === 'tracker' && (
            <>
              <View style={styles.headerTitles}>
                <AppText variant="titleLarge" style={styles.title}>
                  Your Salah Journey
                </AppText>
                <AppText variant="bodySmall" color="#8B9790" style={styles.subtitle}>
                  Mark each prayer manually after offering Salah
                </AppText>
              </View>

              <TrackerHeroCard completedCount={completedCount} />

              <View style={styles.prayersList}>
                {prayersList.map((prayer) => (
                  <TrackerPrayerRow
                    key={prayer.name}
                    prayer={prayer}
                    onToggle={() => togglePrayer(prayer.name)}
                  />
                ))}
              </View>

              <TrackerWeekOverview
                onOpenStatistics={() => setActiveSubTab('streaks')}
              />
            </>
          )}

          {activeSubTab === 'streaks' && (
            <>
              <StreaksHeroCard streakDays={streakCount} />
              <StreaksMetricsRow />
              <StreaksWeeklyChart />
              <StreaksMilestones currentStreak={streakCount} />
            </>
          )}

          {activeSubTab === 'calendar' && (
            <>
              <CalendarMonthHeader
                monthName="November 2026"
                hijriMonth="Dhu al-Qi'dah 1447 AH"
                onPrevMonth={() => {}}
                onNextMonth={() => {}}
              />
              <CalendarGrid
                selectedDay={selectedCalendarDay}
                todayDay={7}
                onSelectDay={setSelectedCalendarDay}
                dayPrayerMap={dayPrayerMap}
              />
              <CalendarDayInspector
                dateLabel={`${selectedCalendarDay} Nov 2026`}
                prayersCompleted={dayPrayerMap[selectedCalendarDay] || [false, false, false, false, false]}
                onTogglePrayer={handleToggleCalendarPrayer}
              />
            </>
          )}
        </ScrollView>

        <HomeBottomNav
          activeTab="progress"
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
    gap: SPACING.md,
  },
  headerTitles: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    fontWeight: '500',
  },
  prayersList: {
    gap: SPACING.sm,
  },
});
