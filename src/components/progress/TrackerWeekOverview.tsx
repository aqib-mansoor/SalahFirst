import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { DayOverview } from '@/utils/trackerStatistics';
import { useTranslation } from '@/context/LocalizationContext';

export interface TrackerWeekOverviewProps {
  onOpenStatistics: () => void;
  weekData?: DayOverview[];
}

export const TrackerWeekOverview: React.FC<TrackerWeekOverviewProps> = ({
  onOpenStatistics,
  weekData,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

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
          {t('thisWeekOverview')}
        </AppText>
        <Pressable
          onPress={onOpenStatistics}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Open full streaks and statistics"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.linkText}>
            {t('fullStatistics')} ›
          </AppText>
        </Pressable>
      </View>

      {/* 7-Day Pills */}
      <View style={styles.daysRow}>
        {days.map((item, idx) => {
          const isFull = item.completed === item.total && item.completed > 0;

          return (
            <View
              key={idx}
              style={[
                styles.dayPill,
                item.isToday
                  ? {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.accent,
                      borderWidth: 1.2,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: isFull
                        ? 'rgba(243, 196, 64, 0.4)'
                        : 'transparent',
                      borderWidth: 1,
                    },
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
                    : isFull
                    ? theme.colors.primary
                    : item.hasRecord
                    ? theme.colors.text
                    : theme.colors.textMuted
                }
                style={[styles.scoreText, isFull && styles.scoreFullText]}
              >
                {item.hasRecord || item.isToday ? `${item.completed}/${item.total}` : '—'}
              </AppText>

              {/* Gold star indicator for perfect 5/5 day */}
              {isFull && !item.isToday && (
                <View
                  style={[
                    styles.fullGoldDot,
                    { backgroundColor: theme.colors.accent },
                  ]}
                />
              )}
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
    borderWidth: 1.2,
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
    position: 'relative',
  },
  dayLetter: {
    fontWeight: '700',
    fontSize: 10,
  },
  scoreText: {
    fontWeight: '600',
    fontSize: 10,
  },
  scoreFullText: {
    fontWeight: '800',
  },
  fullGoldDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    marginTop: 1,
  },
});
