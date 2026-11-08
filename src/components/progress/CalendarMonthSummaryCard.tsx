import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
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
      {/* Month Performance Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            Monthly Overview
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            {monthName} • {hijriMonth}
          </AppText>
        </View>

        <View style={[styles.rateBadge, { backgroundColor: theme.colors.mintTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.rateText}>
            {completionRate}% Logged
          </AppText>
        </View>
      </View>

      {/* 2 Stats Mini Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.statLabel}>
            Total Prayers
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.statValue}>
            {totalLogged}{' '}
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.statSub}>
              / {maxPossible}
            </AppText>
          </AppText>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceElevated }]}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.statLabel}>
            Full 5/5 Days
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.accent} style={styles.statValue}>
            {perfectDays}{' '}
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.statSub}>
              days
            </AppText>
          </AppText>
        </View>
      </View>

      {/* Sunnah White Days (Ayyam al-Beed) Notification Strip */}
      <View
        style={[
          styles.sunnahStrip,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={theme.colors.accent} strokeWidth="2" />
          <Path d="M12 7V12L15 15" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <AppText variant="caption" color={theme.colors.text} style={styles.sunnahText}>
          Sunnah White Days (13, 14, 15 Hijri): Recommended for fasting & extra Salah.
        </AppText>
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
  titleCol: {
    gap: 1,
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 10.5,
  },
  rateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  rateText: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    gap: 2,
  },
  statLabel: {
    fontWeight: '600',
    fontSize: 10,
  },
  statValue: {
    fontWeight: '800',
    fontSize: 15,
  },
  statSub: {
    fontWeight: '500',
    fontSize: 10.5,
  },
  sunnahStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  sunnahText: {
    flex: 1,
    fontSize: 9.5,
    fontWeight: '600',
    lineHeight: 13,
  },
});

