import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { DayOverview } from '@/utils/trackerStatistics';

export interface TrackerWeekOverviewProps {
  onOpenStatistics: () => void;
  weekData?: DayOverview[];
}

export const TrackerWeekOverview: React.FC<TrackerWeekOverviewProps> = ({
  onOpenStatistics,
  weekData,
}) => {
  const theme = useTheme();

  const fallbackDays: DayOverview[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, idx) => ({
    dayLabel: label,
    completed: 0,
    total: 5,
    isToday: idx === 6,
    hasRecord: false,
    dateKey: '',
  }));

  const days = weekData && weekData.length > 0 ? weekData : fallbackDays;

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
              color={
                item.isToday
                  ? theme.colors.textInverse
                  : item.hasRecord
                  ? theme.colors.text
                  : theme.colors.textMuted
              }
              style={styles.scoreText}
            >
              {item.hasRecord || item.isToday ? `${item.completed}/${item.total}` : '—'}
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

