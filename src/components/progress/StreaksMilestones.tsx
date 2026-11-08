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
              backgroundColor: is7Achieved ? theme.colors.accentTint : theme.colors.surfaceSubtle,
              borderColor: is7Achieved ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="8" r="6" stroke={is7Achieved ? theme.colors.accent : theme.colors.textSecondary} strokeWidth="2" />
              <Path d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89" stroke={is7Achieved ? theme.colors.accent : theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          </View>
        </View>

        {/* Milestone 2: 30-Day Istiqamah */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is30Achieved ? theme.colors.accentTint : theme.colors.surfaceSubtle,
              borderColor: is30Achieved ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="8" r="6" stroke={is30Achieved ? theme.colors.accent : theme.colors.textSecondary} strokeWidth="2" />
              <Path d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89" stroke={is30Achieved ? theme.colors.accent : theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    borderWidth: 1.5,
    gap: SPACING.sm,
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  iconCol: {
    width: 32,
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
    fontSize: 12,
  },
  status: {
    fontWeight: '700',
    fontSize: 11,
  },
});
