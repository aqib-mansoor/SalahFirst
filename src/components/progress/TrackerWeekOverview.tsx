import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface DayOverview {
  dayLabel: string;
  completed: number;
  total: number;
  isToday: boolean;
}

export interface TrackerWeekOverviewProps {
  onOpenStatistics: () => void;
  weekData?: DayOverview[];
}

export const TrackerWeekOverview: React.FC<TrackerWeekOverviewProps> = ({
  onOpenStatistics,
  weekData,
}) => {
  const theme = useTheme('light');

  const defaultDays: DayOverview[] = [
    { dayLabel: 'M', completed: 5, total: 5, isToday: false },
    { dayLabel: 'T', completed: 5, total: 5, isToday: false },
    { dayLabel: 'W', completed: 4, total: 5, isToday: false },
    { dayLabel: 'T', completed: 5, total: 5, isToday: false },
    { dayLabel: 'F', completed: 5, total: 5, isToday: false },
    { dayLabel: 'S', completed: 5, total: 5, isToday: false },
    { dayLabel: 'S', completed: 3, total: 5, isToday: true },
  ];

  const days = weekData || defaultDays;

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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          This Week's Overview
        </AppText>
        <Pressable onPress={onOpenStatistics} hitSlop={10}>
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.linkText}>
            Full Statistics ›
          </AppText>
        </Pressable>
      </View>

      {/* 7-Day Pills */}
      <View style={styles.daysRow}>
        {days.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.dayPill,
              item.isToday
                ? { backgroundColor: theme.colors.primary }
                : { backgroundColor: theme.colors.surfaceElevated },
            ]}
          >
            <AppText
              variant="caption"
              color={item.isToday ? theme.colors.textInverse : theme.colors.textMuted}
              style={styles.dayLetter}
            >
              {item.dayLabel}
            </AppText>
            <AppText
              variant="caption"
              color={item.isToday ? theme.colors.textInverse : theme.colors.text}
              style={styles.scoreText}
            >
              {item.completed}/{item.total}
            </AppText>
          </View>
        ))}
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
    gap: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  linkText: {
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayPill: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    gap: 2,
  },
  dayLetter: {
    fontWeight: '700',
    fontSize: 11,
  },
  scoreText: {
    fontWeight: '800',
    fontSize: 11,
  },
});

