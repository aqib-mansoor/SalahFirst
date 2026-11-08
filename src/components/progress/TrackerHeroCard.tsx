import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface TrackerHeroCardProps {
  completedCount: number;
}

export const TrackerHeroCard: React.FC<TrackerHeroCardProps> = ({ completedCount }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const total = 5;
  const percentage = Math.round((completedCount / total) * 100);
  const remaining = total - completedCount;

  // Compact Executive SVG Circular Progress Ring metrics
  const ringSize = 54;
  const strokeWidth = 4.5;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primaryHero,
          borderColor: 'rgba(243, 196, 64, 0.35)',
        },
      ]}
    >
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.14} />

      {/* Left Content Column */}
      <View style={styles.textColumn}>
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={styles.subtitle}>
          {t('todaysProgress')}
        </AppText>
        <AppText variant="titleMedium" color={theme.colors.textInverse} style={styles.headline}>
          {completedCount} of 5 completed
        </AppText>
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.remainingText}>
          {remaining === 0
            ? t('allPrayersCompleted')
            : t('prayersRemainingCount', { count: remaining })}
        </AppText>
      </View>

      {/* Right Compact SVG Circular Progress Ring */}
      <View style={styles.ringWrapper}>
        <Svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
          <G rotation="-90" origin={`${ringSize / 2}, ${ringSize / 2}`}>
            {/* Background Track */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Illuminated Gold Progress Arc */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={theme.colors.accent}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>

        {/* Center Percentage Display */}
        <View style={styles.ringCenterText}>
          <AppText variant="caption" color={theme.colors.textInverse} style={styles.percentageText}>
            {percentage}%
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  textColumn: {
    flex: 1,
    gap: 2,
    zIndex: 2,
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  headline: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
  },
  remainingText: {
    fontWeight: '600',
    fontSize: 11,
  },
  ringWrapper: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  ringCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '800',
    fontSize: 12,
  },
});
