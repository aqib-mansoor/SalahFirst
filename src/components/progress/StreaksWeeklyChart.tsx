import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface DayBarData {
  dayName: string;
  completed: number;
  total: number;
}

export interface StreaksWeeklyChartProps {
  chartData?: DayBarData[];
}

export const StreaksWeeklyChart: React.FC<StreaksWeeklyChartProps> = ({ chartData }) => {
  const theme = useTheme();

  const defaultBars: DayBarData[] = [
    { dayName: 'Mon', completed: 5, total: 5 },
    { dayName: 'Tue', completed: 5, total: 5 },
    { dayName: 'Wed', completed: 4, total: 5 },
    { dayName: 'Thu', completed: 5, total: 5 },
    { dayName: 'Fri', completed: 5, total: 5 },
    { dayName: 'Sat', completed: 5, total: 5 },
    { dayName: 'Sun', completed: 3, total: 5 },
  ];

  const bars = chartData || defaultBars;
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
          const isFull = bar.completed === bar.total;
          const barHeight = Math.max(30, (bar.completed / bar.total) * maxBarHeight);

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
                        : PALETTE.sageMuted,
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
