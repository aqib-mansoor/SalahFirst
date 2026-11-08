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
  const maxBarHeight = 65;

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
          Weekly Completion (7 Days)
        </AppText>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.accent }]} />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.timeframe}>
            5/5 Peak
          </AppText>
        </View>
      </View>

      {/* Vertical Bars Container */}
      <View style={styles.barsContainer}>
        {bars.map((bar, idx) => {
          const isFull = bar.completed === bar.total && bar.completed > 0;
          const barHeight =
            bar.completed > 0
              ? Math.max(10, (bar.completed / bar.total) * maxBarHeight)
              : 4;

          return (
            <View key={idx} style={styles.barColumn}>
              {/* Score Pill / Star above bar */}
              <View style={styles.topScoreZone}>
                {isFull ? (
                  <View style={[styles.goldStarPill, { backgroundColor: theme.colors.accentTint }]}>
                    <AppText variant="caption" color={theme.colors.accent} style={styles.goldStarText}>
                      ★
                    </AppText>
                  </View>
                ) : (
                  <AppText
                    variant="caption"
                    color={bar.completed > 0 ? theme.colors.textMuted : 'transparent'}
                    style={styles.scoreText}
                  >
                    {bar.completed}
                  </AppText>
                )}
              </View>

              {/* Bar Track & Fill */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: isFull
                        ? theme.colors.accent
                        : bar.completed > 0
                        ? theme.colors.primary
                        : theme.colors.surfaceElevated,
                    },
                  ]}
                />
              </View>

              <AppText
                variant="caption"
                color={isFull ? theme.colors.text : theme.colors.textMuted}
                style={[styles.dayLabel, isFull && styles.dayLabelActive]}
              >
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
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  timeframe: {
    fontWeight: '700',
    fontSize: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 98,
    paddingHorizontal: SPACING.xs,
  },
  barColumn: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  topScoreZone: {
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldStarPill: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldStarText: {
    fontSize: 8.5,
    lineHeight: 10,
    fontWeight: '800',
  },
  scoreText: {
    fontSize: 8.5,
    fontWeight: '600',
  },
  barTrack: {
    height: 65,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barFill: {
    width: 20,
    borderRadius: RADIUS.sm,
  },
  dayLabel: {
    fontWeight: '600',
    fontSize: 10,
  },
  dayLabelActive: {
    fontWeight: '800',
  },
});
