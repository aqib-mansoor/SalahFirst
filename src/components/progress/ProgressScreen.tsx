import React, { useState, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '@/constants/theme';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';
import { AppContainer } from '@/components/common';
import { HadithToast } from '@/components/hadith/HadithToast';
import { HomeTab } from '@/components/home/HomeBottomNav';
import { PrayerConfirmModal } from '@/components/home/PrayerConfirmModal';
import { ProgressTabsHeader, ProgressSubTab } from './ProgressTabsHeader';
import { TrackerTabView } from './TrackerTabView';
import { StreaksHeroCard } from './StreaksHeroCard';
import { StreaksMetricsRow } from './StreaksMetricsRow';
import { StreaksWeeklyChart } from './StreaksWeeklyChart';
import { StreaksPrayerBreakdown } from './StreaksPrayerBreakdown';
import { StreaksMilestones } from './StreaksMilestones';
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
  initialSubTab = 'tracker',
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>(initialSubTab);
  const [guidanceToast, setGuidanceToast] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ prayerName: string; dateKey?: string } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  const { location } = useDeviceLocation();
  const {
    prayersList,
    completedCount,
    streakCount,
    historyMap,
    togglePrayer,
    toggleHistoricalPrayer,
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
        const localizedPrayer = (t(prayerName.toLowerCase() as any) as string) || prayerName;
        showToast(t('prayerStartsAtNotice', { prayer: localizedPrayer, time }));
        return;
      }
      setConfirmTarget({ prayerName });
    },
    [togglePrayer, showToast, t]
  );

  const handleJumpToday = useCallback(() => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setSelectedDay(today.getDate());
  }, []);

  const { dayOverview, dayBarData } = useMemo(() => getLast7Days(historyMap), [historyMap]);
  const { longestStreak } = useMemo(() => calculateLongestStreak(historyMap), [historyMap]);
  const localizedStreakNote = useMemo(() => {
    if (longestStreak === 0) return t('beginYourStreak');
    if (longestStreak >= 7) return t('personalBest');
    return `${longestStreak} ${t('days')} ${t('completedSuffix')}`;
  }, [longestStreak, t]);

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
            <TrackerTabView
              completedCount={completedCount}
              prayersList={prayersList}
              dayOverview={dayOverview}
              onToggleTrackerPrayer={handleToggleTrackerPrayer}
              onOpenStatistics={() => setActiveSubTab('streaks')}
            />
          )}

          {activeSubTab === 'streaks' && (
            <>
              <StreaksHeroCard streakDays={streakCount} weekData={dayOverview} />
              <StreaksMetricsRow
                longestStreak={longestStreak}
                longestStreakNote={localizedStreakNote}
                totalPrayers={totalPrayers}
              />
              <StreaksWeeklyChart chartData={dayBarData} />
              <StreaksPrayerBreakdown historyMap={historyMap} streakCount={streakCount} />
              <StreaksMilestones currentStreak={streakCount} />
            </>
          )}

          {activeSubTab === 'calendar' && (
            <>
              <CalendarGrid
                monthName={monthData.monthName}
                hijriMonth={monthData.hijriMonth}
                isCurrentMonth={isCurrentMonth}
                leadingEmptyCount={monthData.leadingEmptyCount}
                cells={monthData.cells}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onJumpToday={handleJumpToday}
                onSelectDay={setSelectedDay}
              />
              <CalendarDayInspector
                dateLabel={dateLabel}
                hasRecord={selectedCell?.hasRecord || false}
                isFuture={selectedCell?.isFuture || false}
                isEditable={selectedCell?.isEditable || false}
                prayersCompleted={selectedCell?.completedPrayers || [false, false, false, false, false]}
                onTogglePrayerChip={(prayerName, isDone) => {
                  if (!selectedCell || selectedCell.isFuture) return;
                  if (!selectedCell.isEditable) {
                    showToast(t('editableTodayYesterdayNotice'));
                    return;
                  }
                  if (selectedCell.isToday) {
                    const pItem = prayersList.find((p) => p.name === prayerName);
                    if (pItem) {
                      handleToggleTrackerPrayer(pItem.name, pItem.hasStarted, pItem.completed, pItem.time);
                    }
                  } else if (isDone) {
                    toggleHistoricalPrayer(selectedCell.dateKey, prayerName);
                  } else {
                    setConfirmTarget({ prayerName, dateKey: selectedCell.dateKey });
                  }
                }}
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
          visible={confirmTarget !== null}
          prayerName={confirmTarget?.prayerName || ''}
          onConfirm={() => {
            if (confirmTarget) {
              if (confirmTarget.dateKey) {
                toggleHistoricalPrayer(confirmTarget.dateKey, confirmTarget.prayerName);
              } else {
                togglePrayer(confirmTarget.prayerName);
              }
              setConfirmTarget(null);
            }
          }}
          onCancel={() => setConfirmTarget(null)}
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
  toastFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
