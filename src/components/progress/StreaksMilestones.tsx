import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
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
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="8"
                r="6"
                stroke={is7Achieved ? theme.colors.accent : theme.colors.textSecondary}
                strokeWidth="2"
              />
              <Path
                d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89"
                stroke={is7Achieved ? theme.colors.accent : theme.colors.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
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
              {is7Achieved ? t('achieved') : `${currentStreak} / 7 ${t('days')}`}
            </AppText>
            {/* Mini Progress Bar */}
            {!is7Achieved && (
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceElevated }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress7}%`, backgroundColor: theme.colors.primary },
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        {/* Milestone 2: 30-Day Istiqamah */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is30Achieved ? theme.colors.mintTint : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="8"
                r="6"
                stroke={is30Achieved ? theme.colors.accent : theme.colors.textSecondary}
                strokeWidth="2"
              />
              <Path
                d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89"
                stroke={is30Achieved ? theme.colors.accent : theme.colors.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
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
              {is30Achieved ? t('achieved') : `${currentStreak} / 30 ${t('days')}`}
            </AppText>
            {/* Mini Progress Bar */}
            {!is30Achieved && (
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceElevated }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress30}%`, backgroundColor: theme.colors.primary },
                  ]}
                />
              </View>
            )}
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
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCol: {
    width: 28,
    alignItems: 'center',
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
    height: 3,
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
