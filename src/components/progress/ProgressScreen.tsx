import React, { useState, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { AppContainer, AppText } from '@/components/common';
import { HadithToast } from '@/components/hadith/HadithToast';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { PrayerConfirmModal } from '@/components/home/PrayerConfirmModal';
import { ProgressTabsHeader, ProgressSubTab } from './ProgressTabsHeader';
import { TrackerHeroCard } from './TrackerHeroCard';
import { TrackerPrayerRow } from './TrackerPrayerRow';
import { TrackerSunnahCard } from './TrackerSunnahCard';
import { TrackerWeekOverview } from './TrackerWeekOverview';
import { TrackerWisdomBanner } from './TrackerWisdomBanner';
import { StreaksHeroCard } from './StreaksHeroCard';
import { StreaksMetricsRow } from './StreaksMetricsRow';
import { StreaksWeeklyChart } from './StreaksWeeklyChart';
import { StreaksPrayerBreakdown } from './StreaksPrayerBreakdown';
import { StreaksMilestones } from './StreaksMilestones';
import { CalendarMonthHeader } from './CalendarMonthHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarDayInspector } from './CalendarDayInspector';
import { CalendarMonthSummaryCard } from './CalendarMonthSummaryCard';
import {
  getLast7Days,
  calculateLongestStreak,
  calculateTotalPrayers,
} from '@/utils/trackerStatistics';
import { generateCalendarMonth } from '@/utils/calendarUtils';

export interface ProgressScreenProps {
  onNavigateTab: (tab: HomeTab) => void;
  initialSubTab?: ProgressSubTab;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  onNavigateTab,
  initialSubTab = 'tracker',
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>(initialSubTab);
  const [guidanceToast, setGuidanceToast] = useState<string | null>(null);
  const [confirmPrayer, setConfirmPrayer] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  } = usePrayerTracker(location);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setGuidanceToast(msg);
    toastTimerRef.current = setTimeout(() => {
      setGuidanceToast(null);
    }, 3500);
  }, []);

  const handleToggleTrackerPrayer = useCallback(
    (prayerName: string, hasStarted: boolean, completed: boolean, time: string) => {
      if (completed) {
        togglePrayer(prayerName);
        return;
      }
      if (!hasStarted) {
        showToast(`${prayerName} starts at ${time}. You can log it once its time arrives.`);
        return;
      }
      setConfirmPrayer(prayerName);
    },
    [togglePrayer, showToast]
  );

  // Derived statistics
  const { dayOverview, dayBarData } = useMemo(() => getLast7Days(historyMap), [historyMap]);
  const { longestStreak, streakNote } = useMemo(() => calculateLongestStreak(historyMap), [historyMap]);
  const totalPrayers = useMemo(() => calculateTotalPrayers(historyMap), [historyMap]);
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

  return (
    <AppContainer edges={['top', 'left', 'right']}>
      <View style={styles.screenWrapper}>
        <ProgressTabsHeader activeTab={activeSubTab} onTabChange={setActiveSubTab} />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 85 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {activeSubTab === 'tracker' && (
            <>
              <View style={styles.headerTitles}>
                <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
                  Daily Salah Tracker
                </AppText>
                <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
                  Tap any started prayer to log completion
                </AppText>
              </View>

              <TrackerHeroCard completedCount={completedCount} />

              <View style={styles.prayersList}>
                {prayersList.map((prayer) => (
                  <TrackerPrayerRow
                    key={prayer.name}
                    prayer={prayer}
                    onPressStatus={() =>
                      handleToggleTrackerPrayer(
                        prayer.name,
                        prayer.hasStarted,
                        prayer.completed,
                        prayer.time
                      )
                    }
                  />
                ))}
              </View>

              <TrackerSunnahCard />
              <TrackerWeekOverview weekData={dayOverview} onOpenStatistics={() => setActiveSubTab('streaks')} />
              <TrackerWisdomBanner />
            </>
          )}

          {activeSubTab === 'streaks' && (
            <>
              <StreaksHeroCard streakDays={streakCount} />
              <StreaksMetricsRow longestStreak={longestStreak} longestStreakNote={streakNote} totalPrayers={totalPrayers} />
              <StreaksWeeklyChart chartData={dayBarData} />
              <StreaksPrayerBreakdown historyMap={historyMap} streakCount={streakCount} />
              <StreaksMilestones currentStreak={streakCount} />
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
                isFuture={selectedCell?.isFuture || false}
                prayersCompleted={selectedCell?.completedPrayers || [false, false, false, false, false]}
              />
              <CalendarMonthSummaryCard
                monthName={monthData.monthName}
                hijriMonth={monthData.hijriMonth}
                cells={monthData.cells}
              />
            </>
          )}
        </ScrollView>

        <PrayerConfirmModal
          visible={confirmPrayer !== null}
          prayerName={confirmPrayer || ''}
          onConfirm={() => {
            if (confirmPrayer) {
              togglePrayer(confirmPrayer);
              setConfirmPrayer(null);
            }
          }}
          onCancel={() => setConfirmPrayer(null)}
        />

        {guidanceToast && (
          <View style={[styles.toastFloating, { bottom: Math.max(insets.bottom, 16) + 65 }]}>
            <HadithToast message={guidanceToast} onDismiss={() => setGuidanceToast(null)} />
          </View>
        )}
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
    gap: SPACING.md,
  },
  headerTitles: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    gap: 2,
  },
  title: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  prayersList: {
    gap: SPACING.xs + 2,
  },
  toastFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
