import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';

export interface CalendarMonthSummaryCardProps {
  monthName: string;
  hijriMonth: string;
  cells: CalendarDayCell[];
}

export const CalendarMonthSummaryCard: React.FC<CalendarMonthSummaryCardProps> = ({
  monthName,
  hijriMonth,
  cells,
}) => {
  const theme = useTheme();

  const { totalLogged, maxPossible, perfectDays, completionRate } = useMemo(() => {
    let logged = 0;
    let perfect = 0;
    let recordedDaysCount = 0;

    cells.forEach((c) => {
      if (!c.isFuture) {
        recordedDaysCount += 1;
        logged += c.completedCount;
        if (c.completedCount === 5) perfect += 1;
      }
    });

    const max = Math.max(recordedDaysCount * 5, 1);
    const rate = Math.round((logged / max) * 100);

    return {
      totalLogged: logged,
      maxPossible: max,
      perfectDays: perfect,
      completionRate: rate,
    };
  }, [cells]);

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
      <View style={styles.headerRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Monthly Summary
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
          {monthName}
        </AppText>
      </View>

      {/* Sleek 3-Column Metrics Bar */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="titleMedium" color={theme.colors.primary} style={styles.statValue}>
            {completionRate}%
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.statLabel}>
            Consistency
          </AppText>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="titleMedium" color={theme.colors.text} style={styles.statValue}>
            {totalLogged}
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.statSub}>
              /{maxPossible}
            </AppText>
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.statLabel}>
            Prayers Logged
          </AppText>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="titleMedium" color={theme.colors.primary} style={styles.statValue}>
            {perfectDays}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.statLabel}>
            5/5 Perfect Days
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 14,
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 11.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statValue: {
    fontWeight: '800',
    fontSize: 17,
  },
  statSub: {
    fontWeight: '600',
    fontSize: 11,
  },
  statLabel: {
    fontWeight: '600',
    fontSize: 10.5,
  },
});
