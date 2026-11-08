import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer, AppText } from '@/components/common';
import { HomeBottomNav, HomeTab } from '@/components/home/HomeBottomNav';
import { ProgressTabsHeader, ProgressSubTab } from './ProgressTabsHeader';
import { TrackerHeroCard } from './TrackerHeroCard';
import { TrackerPrayerRow } from './TrackerPrayerRow';
import { TrackerWeekOverview } from './TrackerWeekOverview';
import { TasbihCounter3D } from './TasbihCounter3D';
import { StreaksHeroCard } from './StreaksHeroCard';
import { StreaksMetricsRow } from './StreaksMetricsRow';
import { StreaksWeeklyChart } from './StreaksWeeklyChart';
import { StreaksMilestones } from './StreaksMilestones';
import { CalendarMonthHeader } from './CalendarMonthHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarDayInspector } from './CalendarDayInspector';
import {
  getLast7Days,
  calculateLongestStreak,
  calculateTotalPrayers,
} from '@/utils/trackerStatistics';
import { generateCalendarMonth } from '@/utils/calendarUtils';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export interface ProgressScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
  initialSubTab?: ProgressSubTab;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  onNavigateTab,
  initialSubTab = 'tracker',
}) => {
  const theme = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>(initialSubTab);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());

  const { location } = useDeviceLocation();
  const {
    prayersList,
    completedCount,
    streakCount,
    historyMap,
    togglePrayer,
    toggleHistoricalPrayer,
  } = usePrayerTracker(location);

  // Dynamic real stats derived from historyMap
  const { dayOverview, dayBarData } = useMemo(
    () => getLast7Days(historyMap),
    [historyMap]
  );
  const { longestStreak, streakNote } = useMemo(
    () => calculateLongestStreak(historyMap),
    [historyMap]
  );
  const totalPrayers = useMemo(
    () => calculateTotalPrayers(historyMap),
    [historyMap]
  );

  // Dynamic month data for the calendar
  const monthData = useMemo(
    () => generateCalendarMonth(selectedYear, selectedMonth, historyMap, selectedDay),
    [selectedYear, selectedMonth, historyMap, selectedDay]
  );

  const handlePrevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      setSelectedYear((y) => y - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth((m) => m - 1);
    }
    setSelectedDay(1);
  }, [selectedMonth]);

  const handleNextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      setSelectedYear((y) => y + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth((m) => m + 1);
    }
    setSelectedDay(1);
  }, [selectedMonth]);

  const selectedCell = useMemo(() => {
    return monthData.cells.find((c) => c.dayNumber === selectedDay);
  }, [monthData.cells, selectedDay]);

  const dateLabel = useMemo(() => {
    const d = new Date(selectedYear, selectedMonth, selectedDay);
    const monthStr = d.toLocaleString('en-US', { month: 'short' });
    return `${selectedDay} ${monthStr} ${selectedYear}`;
  }, [selectedYear, selectedMonth, selectedDay]);

  const handleToggleCalendarPrayer = useCallback(
    (prayerIdx: number) => {
      if (!selectedCell) return;
      const prayerName = PRAYER_NAMES[prayerIdx];
      if (prayerName) {
        toggleHistoricalPrayer(selectedCell.dateKey, prayerName);
      }
    },
    [selectedCell, toggleHistoricalPrayer]
  );

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
                <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
                  Your Salah Journey
                </AppText>
                <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
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
                weekData={dayOverview}
                onOpenStatistics={() => setActiveSubTab('streaks')}
              />

              <TasbihCounter3D />
            </>
          )}

          {activeSubTab === 'streaks' && (
            <>
              <StreaksHeroCard streakDays={streakCount} />
              <StreaksMetricsRow
                longestStreak={longestStreak}
                longestStreakNote={streakNote}
                totalPrayers={totalPrayers}
              />
              <StreaksWeeklyChart chartData={dayBarData} />
              <StreaksMilestones currentStreak={streakCount} />
              <TasbihCounter3D />
            </>
          )}

          {activeSubTab === 'calendar' && (
            <>
              <CalendarMonthHeader
                monthName={monthData.monthName}
                hijriMonth={monthData.hijriMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <CalendarGrid
                leadingEmptyCount={monthData.leadingEmptyCount}
                cells={monthData.cells}
                onSelectDay={setSelectedDay}
              />
              <CalendarDayInspector
                dateLabel={dateLabel}
                hasRecord={selectedCell?.hasRecord || false}
                prayersCompleted={selectedCell?.completedPrayers || [false, false, false, false, false]}
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
    paddingBottom: 100,
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
