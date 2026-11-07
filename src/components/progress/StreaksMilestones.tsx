import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface StreaksMilestonesProps {
  currentStreak: number;
}

export const StreaksMilestones: React.FC<StreaksMilestonesProps> = ({ currentStreak }) => {
  const theme = useTheme('light');

  const is7Achieved = currentStreak >= 7;
  const is30Achieved = currentStreak >= 30;

  return (
    <View style={styles.container}>
      <AppText variant="titleSmall" color={theme.colors.text} style={styles.sectionTitle}>
        Consistency Milestones
      </AppText>

      <View style={styles.cardsRow}>
        {/* Milestone 1: 7-Day Steadfast */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is7Achieved ? theme.colors.surface : theme.colors.surfaceElevated,
              borderColor: is7Achieved ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="8" r="6" stroke={theme.colors.accent} strokeWidth="2" />
              <Path d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
              7-Day Steadfast
            </AppText>
            <AppText
              variant="caption"
              color={is7Achieved ? theme.colors.primary : theme.colors.textMuted}
              style={styles.status}
            >
              {is7Achieved ? 'Achieved ✓' : `${currentStreak} / 7 days`}
            </AppText>
          </View>
        </View>

        {/* Milestone 2: 30-Day Istiqamah */}
        <View
          style={[
            styles.milestoneCard,
            {
              backgroundColor: is30Achieved ? theme.colors.surface : theme.colors.surfaceElevated,
              borderColor: is30Achieved ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <View style={styles.iconCol}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="8" r="6" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M15.477 12.89L17 22L12 19L7 22L8.523 12.89" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
              30-Day Istiqamah
            </AppText>
            <AppText
              variant="caption"
              color={is30Achieved ? theme.colors.primary : theme.colors.textMuted}
              style={styles.status}
            >
              {is30Achieved ? 'Achieved ✓' : `${currentStreak} / 30 days`}
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
