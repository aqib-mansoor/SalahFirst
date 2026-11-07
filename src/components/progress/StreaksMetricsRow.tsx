import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface StreaksMetricsRowProps {
  longestStreak?: number;
  longestStreakNote?: string;
  totalPrayers?: number;
}

export const StreaksMetricsRow: React.FC<StreaksMetricsRowProps> = ({
  longestStreak = 24,
  longestStreakNote = 'Ramadan 1447',
  totalPrayers = 345,
}) => {
  const theme = useTheme('light');

  return (
    <View style={styles.container}>
      {/* 1. Longest Streak Card */}
      <View
        style={[
          styles.metricCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
          Longest Streak
        </AppText>
        <AppText variant="headlineSmall" color={theme.colors.text} style={styles.valueText}>
          {longestStreak} Days
        </AppText>
        <AppText variant="caption" color={theme.colors.primary} style={styles.noteText}>
          {longestStreakNote}
        </AppText>
      </View>

      {/* 2. Total Prayers Logged Card */}
      <View
        style={[
          styles.metricCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
          Total Prayers Logged
        </AppText>
        <AppText variant="headlineSmall" color={theme.colors.text} style={styles.valueText}>
          {totalPrayers}
        </AppText>
        <AppText variant="caption" color={theme.colors.accent} style={styles.noteText}>
          Incl. partial days
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  metricCard: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
  valueText: {
    fontWeight: '800',
  },
  noteText: {
    fontWeight: '700',
  },
});
