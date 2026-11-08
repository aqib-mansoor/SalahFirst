import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface StreaksMetricsRowProps {
  longestStreak?: number;
  longestStreakNote?: string;
  totalPrayers?: number;
}

export const StreaksMetricsRow: React.FC<StreaksMetricsRowProps> = ({
  longestStreak = 0,
  longestStreakNote,
  totalPrayers = 0,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const note = longestStreakNote || t('beginYourStreak') || 'Keep it going';

  return (
    <View style={styles.container}>
      {/* 1. Longest Streak Card */}
      <View
        style={[
          styles.metricCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: 'rgba(243, 196, 64, 0.25)',
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
          {t('longestStreak')}
        </AppText>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.valueText}>
          {longestStreak}{' '}
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.unitSuffix}>
            {t('daysSuffix')}
          </AppText>
        </AppText>
        <AppText variant="caption" color={theme.colors.primary} style={styles.noteText}>
          {note}
        </AppText>
      </View>

      {/* 2. Total Prayers Logged Card */}
      <View
        style={[
          styles.metricCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: 'rgba(243, 196, 64, 0.25)',
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
          {t('totalPrayersLogged')}
        </AppText>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.valueText}>
          {totalPrayers}{' '}
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.unitSuffix}>
            prayers
          </AppText>
        </AppText>
        <AppText variant="caption" color={theme.colors.accent} style={styles.noteText}>
          {t('inclPartialDays') || 'All-time prayers'}
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
    borderWidth: 1.2,
    gap: 4,
  },
  label: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  valueText: {
    fontWeight: '800',
    fontSize: 20,
  },
  unitSuffix: {
    fontWeight: '600',
    fontSize: 12,
  },
  noteText: {
    fontWeight: '700',
    fontSize: 11,
  },
});
