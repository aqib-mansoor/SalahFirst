import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface StreaksMilestonesProps {
  currentStreak: number;
}

export const StreaksMilestones: React.FC<StreaksMilestonesProps> = ({ currentStreak }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const is7Achieved = currentStreak >= 7;
  const is30Achieved = currentStreak >= 30;

  const progress7 = Math.min((currentStreak / 7) * 100, 100);
  const progress30 = Math.min((currentStreak / 30) * 100, 100);

  return (
    <View style={styles.container}>
      <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.sectionTitle}>
        {t('consistencyMilestones')}
      </AppText>

      <View style={styles.cardsRow}>
        {/* Milestone 1: 7-Day Steadfast */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is7Achieved ? theme.colors.mintTint : theme.colors.surface,
              borderColor: is7Achieved ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emojiOrb,
              {
                backgroundColor: is7Achieved ? theme.colors.accentTint : theme.colors.surfaceElevated,
                borderColor: is7Achieved ? theme.colors.accent : theme.colors.border,
              },
            ]}
          >
            <AppText style={styles.milestoneEmoji}>🏅</AppText>
          </View>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.title}>
              {t('sevenDaySteadfast')}
            </AppText>
            <AppText
              variant="caption"
              color={is7Achieved ? theme.colors.primary : theme.colors.textSecondary}
              style={styles.status}
            >
              {is7Achieved ? `✓ ${t('achieved')}` : `${currentStreak} / 7 ${t('days')}`}
            </AppText>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceElevated }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress7}%`,
                    backgroundColor: is7Achieved ? theme.colors.accent : theme.colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Milestone 2: 30-Day Istiqamah */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is30Achieved ? theme.colors.mintTint : theme.colors.surface,
              borderColor: is30Achieved ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.emojiOrb,
              {
                backgroundColor: is30Achieved ? theme.colors.accentTint : theme.colors.surfaceElevated,
                borderColor: is30Achieved ? theme.colors.accent : theme.colors.border,
              },
            ]}
          >
            <AppText style={styles.milestoneEmoji}>👑</AppText>
          </View>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.title}>
              {t('thirtyDayIstiqamah')}
            </AppText>
            <AppText
              variant="caption"
              color={is30Achieved ? theme.colors.primary : theme.colors.textSecondary}
              style={styles.status}
            >
              {is30Achieved ? `✓ ${t('achieved')}` : `${currentStreak} / 30 ${t('days')}`}
            </AppText>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceElevated }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress30}%`,
                    backgroundColor: is30Achieved ? theme.colors.accent : theme.colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontWeight: '800',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  milestoneCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    gap: SPACING.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emojiOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneEmoji: {
    fontSize: 17,
    lineHeight: 21,
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '800',
    fontSize: 12,
  },
  status: {
    fontWeight: '700',
    fontSize: 11,
  },
  progressTrack: {
    height: 4,
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
