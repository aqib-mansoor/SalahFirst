import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { DayBarData } from '@/utils/trackerStatistics';

export interface StreaksWeeklyChartProps {
  chartData?: DayBarData[];
}

export const StreaksWeeklyChart: React.FC<StreaksWeeklyChartProps> = ({ chartData }) => {
  const theme = useTheme();

  const fallbackBars: DayBarData[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (name) => ({
      dayName: name,
      completed: 0,
      total: 5,
      hasRecord: false,
      dateKey: '',
    })
  );

  const bars = chartData && chartData.length > 0 ? chartData : fallbackBars;
  const maxBarHeight = 90;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Weekly Completion (Full vs Partial)
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.timeframe}>
          Last 7 Days
        </AppText>
      </View>

      {/* Vertical Bars Container */}
      <View style={styles.barsContainer}>
        {bars.map((bar, idx) => {
          const isFull = bar.completed === bar.total && bar.completed > 0;
          const barHeight =
            bar.completed > 0
              ? Math.max(12, (bar.completed / bar.total) * maxBarHeight)
              : 4;

          return (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: isFull
                        ? theme.colors.primary
                        : bar.completed > 0
                        ? theme.colors.accentMuted
                        : theme.colors.border,
                      opacity: bar.hasRecord ? 1 : 0.4,
                    },
                  ]}
                />
              </View>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.dayLabel}>
                {bar.dayName}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.md + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  timeframe: {
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingHorizontal: SPACING.xs,
  },
  barColumn: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  barTrack: {
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barFill: {
    width: 26,
    borderRadius: RADIUS.md,
  },
  dayLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
});
