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
          <AppText variant="caption" color={theme.colors.primary} style={styles.linkText}>
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
              key={item.dateKey || idx}
              style={[
                styles.dayPill,
                item.isToday
                  ? {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.accent,
                      borderWidth: 1.4,
                    }
                  : isFull
                  ? {
                      backgroundColor: theme.colors.secondaryTint,
                      borderColor: theme.colors.primary,
                      borderWidth: 1.2,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                      borderWidth: 1,
                    },
              ]}
            >
              <AppText
                variant="caption"
                color={item.isToday ? theme.colors.textInverse : isFull ? theme.colors.primary : theme.colors.textMuted}
                style={styles.dayLetter}
              >
                {item.dayLabel}
              </AppText>

              {isFull ? (
                <AppText style={styles.flameEmoji}>🔥</AppText>
              ) : (
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
                  {item.hasRecord || item.isToday ? `${item.completed}/${item.total}` : '–'}
                </AppText>
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    gap: SPACING.sm + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 13.5,
  },
  linkText: {
    fontWeight: '700',
    fontSize: 11.5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    gap: 3,
    minHeight: 46,
  },
  dayLetter: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  scoreText: {
    fontWeight: '700',
    fontSize: 10,
  },
  flameEmoji: {
    fontSize: 12.5,
    lineHeight: 16,
  },
});
