import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface TrackerHeroCardProps {
  completedCount: number;
}

export const TrackerHeroCard: React.FC<TrackerHeroCardProps> = ({ completedCount }) => {
  const theme = useTheme('light');
  const total = 5;
  const percentage = Math.round((completedCount / total) * 100);
  const remaining = total - completedCount;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.borderGold,
        },
      ]}
    >
      {/* Islamic Watermark */}
      <View style={styles.watermarkLayer}>
        <Svg width={110} height={110} viewBox="0 0 110 110">
          <G transform="translate(55, 55)">
            <Rect x="-36" y="-36" width="72" height="72" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
            <Rect x="-36" y="-36" width="72" height="72" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" transform="rotate(45)" />
          </G>
        </Svg>
      </View>

      {/* Left Content Column */}
      <View style={styles.textColumn}>
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={styles.subtitle}>
          Today's Progress
        </AppText>
        <AppText variant="headlineMedium" color={theme.colors.textInverse} style={styles.headline}>
          {completedCount} of 5 Completed
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.accentLight} style={styles.remainingText}>
          {remaining === 0 ? 'All 5 prayers completed! Alhamdulillah' : `${remaining} prayers remaining today`}
        </AppText>
      </View>

      {/* Right Circular Progress Ring */}
      <View style={[styles.progressRingOuter, { borderColor: theme.colors.accent }]}>
        <AppText variant="titleMedium" color={theme.colors.textInverse} style={styles.percentageText}>
          {percentage}%
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  watermarkLayer: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  textColumn: {
    flex: 1,
    gap: 4,
    zIndex: 2,
  },
  subtitle: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headline: {
    fontWeight: '800',
    fontSize: 22,
  },
  remainingText: {
    fontWeight: '600',
    marginTop: 2,
  },
  progressRingOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  percentageText: {
    fontWeight: '800',
    fontSize: 16,
  },
});
